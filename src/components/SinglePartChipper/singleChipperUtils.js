import { getFromCommonStore } from "../../utils/commonStore";

export const timestampToSeconds = (timestamp) => {
  const [hours, minutes, seconds] = timestamp.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const validateTimestamp = (timestamp) => {
  const timestampRegex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

  const tsFormatError = [
    `Please add timestamp in "hh:mm:ss" format.`,
    "Timestamp cannot be greater than video duration",
  ];

  if (!timestampRegex.test(timestamp)) {
    return tsFormatError[0];
  }

  const videoDuration = getFromCommonStore("videoFileDuration");

  if (videoDuration && videoDuration < timestampToSeconds(timestamp)) {
    return tsFormatError[1];
  }

  return null;
};

export const validateSplitDuration = (startTs, endTs) => {
  return timestampToSeconds(endTs) - timestampToSeconds(startTs) <= 0
    ? "End Time must be later than start time"
    : null;
};

export const calculateEncodingProgress = (logMsg, startTs, endTs) => {
  const encodedTs = logMsg?.split("time=")?.[1]?.slice(0, 8);

  if (encodedTs) {
    let encodedSecs = timestampToSeconds(encodedTs);

    let totalSecs = timestampToSeconds(endTs) - timestampToSeconds(startTs);

    return (encodedSecs / totalSecs) * 100;
  }

  return null;
};
