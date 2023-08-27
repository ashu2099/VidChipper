import { useState, useCallback, useEffect } from "react";

import { getFromCommonStore } from "../../utils/commonStore";

import {
  calculateEncodingProgress,
  validateSplitDuration,
  validateTimestamp,
} from "./singleChipperUtils";

import { pubSub, pubSubEvents } from "../../utils/pubSub";

export default () => {
  const [isVideoFileUploaded, setIsVideoFileUploaded] = useState(false);

  const [startTimestamp, setStartTimestamp] = useState("00:00:00");
  const [endTimestamp, setEndTimestamp] = useState("00:00:00");
  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);

  const [splitProgress, setSplitProgress] = useState("Split Video");

  const [isVideoSplitting, setIsVideoSplitting] = useState(false);
  const [splitVideoDownloadUrl, setSplitVideoDownloadUrl] = useState(null);

  const updateTimeStamp = useCallback((isStartingTimestamp, value) => {
    if (isStartingTimestamp) {
      setStartTimestamp(value);
      setStartError(validateTimestamp(value));
    } else {
      setEndTimestamp(value);
      setEndError(validateTimestamp(value));
    }
  }, []);

  const splitVideoIntoPart = useCallback(
    async (startTimeStamp, endTimeStamp, outputFileName) => {
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

      setIsVideoSplitting(true);
      setSplitProgress("Splitting Video");

      const params = [
        "-i",
        `input.${fileExtension}`,
        "-ss",
        startTimeStamp,
        "-to",
        endTimeStamp,
        "-map",
        "0",
        `${outputFileName}.${fileExtension}`,
      ];

      console.log(params);

      const processingResponse = await ffmpegRef.current.exec(params);

      if (processingResponse === 0) {
        const data = await ffmpegRef.current.readFile(
          `${outputFileName}.${fileExtension}`
        );

        const resultUrl = URL.createObjectURL(
          new Blob([data.buffer], {
            type: getFromCommonStore("videoFileMimeType"),
          })
        );

        setSplitVideoDownloadUrl(resultUrl);
      }

      setSplitProgress("Split Video");
      setIsVideoSplitting(false);
    },
    []
  );

  const downloadSplitPart = useCallback(() => {
    window.open(splitVideoDownloadUrl, "_blank");
  }, [splitVideoDownloadUrl]);

  const updateSplitProgress = useCallback(
    ({ message }) => {
      console.log(message);

      const progress = calculateEncodingProgress(
        message,
        startTimestamp,
        endTimestamp
      );

      if (progress && progress < 100) {
        setSplitProgress(`Splitting: ${progress.toFixed(2)} %`);
      }
    },
    [endTimestamp, startTimestamp]
  );

  useEffect(() => {
    pubSub.subscribe(pubSubEvents.videoFileUploaded, () => {
      setIsVideoFileUploaded(true);
      setSplitVideoDownloadUrl(null);
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
    splitVideoIntoPart,
    downloadSplitPart,
    isVideoSplitting,
    splitProgress,
    splitVideoDownloadUrl,
  };
};
