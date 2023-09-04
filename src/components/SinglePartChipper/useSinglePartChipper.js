import { useState, useCallback, useEffect } from "react";

import { getFromCommonStore, getNewProcessId } from "../../utils/commonStore";

import {
  calculateEncodingProgress,
  validateSplitDuration,
  validateTimestamp,
} from "./singleChipperUtils";

import { pubSub, pubSubEvents } from "../../utils/pubSub";
import { generateParamsForSingleSplit } from "../../utils/ffmpegParamUtils";

export default () => {
  const [isVideoFileUploaded, setIsVideoFileUploaded] = useState(false);

  const [startTimestamp, setStartTimestamp] = useState("00:00:00");
  const [endTimestamp, setEndTimestamp] = useState("00:00:00");
  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);

  const [clipProgress, setSplitProgress] = useState(null);

  const [isVideoClipping, setIsVideoClipping] = useState(false);
  const [clippedVideoDownloadUrl, setClippedVideoDownloadUrl] = useState(null);

  const updateTimeStamp = useCallback((isStartingTimestamp, value) => {
    if (isStartingTimestamp) {
      setStartTimestamp(value);
      setStartError(validateTimestamp(value));
    } else {
      setEndTimestamp(value);
      setEndError(validateTimestamp(value));
    }
  }, []);

  const clipVideo = useCallback(async (startTimeStamp, endTimeStamp) => {
    const requestedDurationError = validateSplitDuration(
      startTimeStamp,
      endTimeStamp
    );

    if (requestedDurationError) {
      setEndError(requestedDurationError);
      return;
    }

    const ffmpegRef = getFromCommonStore("ffmpegRef");
    const fileExtension = getFromCommonStore("videoFileExtension");

    setIsVideoClipping(true);
    setSplitProgress("Clipping Video");
    setClippedVideoDownloadUrl(null);

    const processId = getNewProcessId();

    const params = generateParamsForSingleSplit(
      fileExtension,
      startTimeStamp,
      endTimeStamp,
      processId
    );

    console.log(params);

    try {
      const processingResponse = await ffmpegRef.current.exec(params);

      if (processingResponse === 0) {
        const data = await ffmpegRef.current.readFile(
          `${processId}.${fileExtension}`
        );

        const resultUrl = URL.createObjectURL(
          new Blob([data.buffer], {
            type: getFromCommonStore("videoFileMimeType"),
          })
        );

        setClippedVideoDownloadUrl(resultUrl);

        setSplitProgress(null);
      } else {
        throw processingResponse;
      }
    } catch (e) {
      setSplitProgress("An Unexpected Error Occurred, Please try Again.");
    } finally {
      setIsVideoClipping(false);
    }
  }, []);

  const downloadClippedPart = useCallback(() => {
    window.open(clippedVideoDownloadUrl, "_blank");
  }, [clippedVideoDownloadUrl]);

  const updateSplitProgress = useCallback(
    ({ message }) => {
      console.log(message);

      const progress = calculateEncodingProgress(
        message,
        startTimestamp,
        endTimestamp
      );

      if (progress && progress < 100) {
        setSplitProgress(`Clipping: ${progress.toFixed(2)} %`);
      }
    },
    [endTimestamp, startTimestamp]
  );

  useEffect(() => {
    if (getFromCommonStore("videoBlob") !== undefined) {
      setIsVideoFileUploaded(true);
    }

    pubSub.subscribe(pubSubEvents.videoFileUploaded, () => {
      setIsVideoFileUploaded(true);
      setClippedVideoDownloadUrl(null);
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
    startTimestamp,
    endTimestamp,
    startError,
    endError,
    updateTimeStamp,
    clipVideo,
    downloadClippedPart,
    isVideoClipping,
    clipProgress,
    clippedVideoDownloadUrl,
  };
};
