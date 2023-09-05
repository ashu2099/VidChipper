import { getFromCommonStore } from "../../utils/commonStore";
import { timestampToSeconds } from "../SinglePartChipper/singleChipperUtils";

export const validateOutputFilename = (outputname) => {
  const converSionErrors = ["Output File Name is not proper"];

  const outputPattern = /^[^.]+\.[A-z0-9]+$/;

  if (!outputPattern.test(outputname)) {
    return converSionErrors[0];
  }

  return null;
};

export const calculateConvertProgress = (logMsg) => {
  const encodedTs = logMsg?.split("time=")?.[1]?.slice(0, 8);

  const videoDuration = getFromCommonStore("videoFileDuration");

  if (encodedTs && videoDuration) {
    const encodedSecs = timestampToSeconds(encodedTs);

    return (encodedSecs / videoDuration) * 100;
  }

  return null;
};
