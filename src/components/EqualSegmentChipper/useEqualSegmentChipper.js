import { useState, useCallback, useEffect } from "react";

import { getFromCommonStore, getNewProcessId } from "../../utils/commonStore";
import { pubSub, pubSubEvents } from "../../utils/pubSub";
import { generateParamsForEqualSplit } from "../../utils/ffmpegParamUtils";
import {
  calculateEqualSplitProgress,
  validateSegmentDuration,
} from "./equalChipperUtils";

export default () => {
  const [isVideoFileUploaded, setIsVideoFileUploaded] = useState(false);

  const [segmentDuration, setSegmentDuration] = useState(1);
  const [segmenDurationError, setSegmenDurationError] = useState(null);

  const [splitProgress, setSplitProgress] = useState(null);

  const [isVideoSplitting, setIsVideoSplitting] = useState(false);
  const [splitVideoResults, setSplitVideoResults] = useState([]);

  const updateSegmentDuration = useCallback(({ target: { value } }) => {
    setSegmentDuration(value);
    setSegmenDurationError(validateSegmentDuration(value));
  }, []);

  const splitVideoInEqualParts = useCallback(async (duration) => {
    const isDurationErrored = validateSegmentDuration(duration);

    if (isDurationErrored) {
      setSegmenDurationError(isDurationErrored);

      return;
    }

    setSplitProgress(null);

    const ffmpegRef = getFromCommonStore("ffmpegRef");

    const fileExtension = getFromCommonStore("videoFileExtension");

    setIsVideoSplitting(true);
    setSplitProgress("Splitting Video");

    const processId = getNewProcessId();

    const params = generateParamsForEqualSplit(
      fileExtension,
      duration,
      processId
    );

    try {
      const processingResponse = await ffmpegRef.current.exec(params);

      if (processingResponse === 0) {
        const directoryContents = await ffmpegRef.current.listDir("/");

        console.log(directoryContents);

        setSplitVideoResults(
          directoryContents
            ?.filter?.((dirContent) =>
              dirContent.name.startsWith(`output-${processId}-`)
            )
            ?.map((x) => x.name)
        );

        setSplitProgress(null);
      } else {
        throw processingResponse;
      }
    } catch (e) {
      setSplitProgress("Splitting Failed. Please try again");
    } finally {
      setIsVideoSplitting(false);
    }
  }, []);

  const downloadSplitPart = useCallback(async (segmentName) => {
    const ffmpegRef = getFromCommonStore("ffmpegRef");

    const data = await ffmpegRef.current.readFile(`${segmentName}`);

    const resultUrl = URL.createObjectURL(
      new Blob([data.buffer], {
        type: getFromCommonStore("videoFileMimeType"),
      })
    );

    window.open(resultUrl, "_blank");
  }, []);

  const updateSplitProgress = useCallback(({ message }) => {
    const progress = calculateEqualSplitProgress(message);

    console.log(message, progress);

    if (progress && progress < 100) {
      setSplitProgress(`Splitting: ${progress.toFixed(2)} %`);
    }
  }, []);

  useEffect(() => {
    pubSub.subscribe(pubSubEvents.videoFileUploaded, () => {
      setIsVideoFileUploaded(true);
      setSplitVideoResults([]);
    });
  }, []);

  useEffect(() => {
    const ffmpegRef = getFromCommonStore("ffmpegRef");

    ffmpegRef.current.on("log", updateSplitProgress);

    return () => {
      ffmpegRef.current.off("log", updateSplitProgress);
    };
  }, [updateSplitProgress]);

  return {
    isVideoFileUploaded,
    segmentDuration,
    updateSegmentDuration,
    segmenDurationError,
    splitVideoInEqualParts,
    isVideoSplitting,
    splitProgress,
    splitVideoResults,
    downloadSplitPart,
  };
};
