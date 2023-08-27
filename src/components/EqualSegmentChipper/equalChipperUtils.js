import { getFromCommonStore } from "../../utils/commonStore";
import { timestampToSeconds } from "../SinglePartChipper/singleChipperUtils";

export const validateSegmentDuration = (segment) => {
  const segmentErrors = [
    "Segment duration should be a non-zero, non-decimal number",
    `Segment duration should be lesser than Video duration`,
    "Number of equal segments should be less than 20",
  ];

  const segmentRegex = /^[0-9]+$/;

  if (!segmentRegex.test(segment) || segment === "0") {
    return segmentErrors[0];
  }

  const videoDuration = getFromCommonStore("videoFileDuration");

  const segmentInSeconds = parseInt(segment);

  if (videoDuration) {
    if (videoDuration <= segmentInSeconds) {
      return segmentErrors[1];
    }

    if (segmentInSeconds && videoDuration / segmentInSeconds > 20) {
      return segmentErrors[2];
    }
  }

  return null;
};

export const calculateEqualSplitProgress = (logMsg) => {
  const encodedTs = logMsg?.split("time=")?.[1]?.slice(0, 8);

  const videoDuration = getFromCommonStore("videoFileDuration");

  if (encodedTs && videoDuration) {
    const encodedSecs = timestampToSeconds(encodedTs);

    return (encodedSecs / videoDuration) * 100;
  }

  return null;
};
