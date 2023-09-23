import { useState, useCallback, useEffect } from "react";

import {
  getFromCommonStore,
  getNewProcessId,
  setInCommonStore,
  triggerDownloadDialogue,
} from "../../utils/commonStore";
import { pubSub, pubSubEvents } from "../../utils/pubSub";
import { generateParamsForFormatConversion } from "../../utils/ffmpegParamUtils";
import {
  calculateConvertProgress,
  validateOutputFilename,
} from "./formatConverterUtils";

export default () => {
  const [isVideoFileUploaded, setIsVideoFileUploaded] = useState(false);

  const [outputFilename, setOutputFilename] = useState("output.mp4");
  const [outputFilenameError, setOutputFilenameError] = useState(null);

  const [convertProgress, setConvertProgress] = useState(null);

  const [isVideoConverting, setIsVideoConverting] = useState(false);

  const [convertedVideoDownloadUrl, setConvertedVideoDownloadUrl] =
    useState(null);

  const updateOutputFilename = useCallback(({ target: { value } }) => {
    setOutputFilename(value);
    setOutputFilenameError(validateOutputFilename(value));
  }, []);

  const convertVideoToRequiredFormat = useCallback(async (outputName) => {
    const ffmpegRef = getFromCommonStore("ffmpegRef");
    const inputFileExtension = getFromCommonStore("videoFileExtension");
    setInCommonStore("nameOfLatestConvert", outputName);

    setIsVideoConverting(true);
    setConvertProgress("Splitting Video");
    setConvertedVideoDownloadUrl(null);

    const processId = getNewProcessId();

    const params = generateParamsForFormatConversion(
      inputFileExtension,
      outputName,
      processId
    );

    console.log(params);

    try {
      const processingResponse = await ffmpegRef.current.exec(params);

      if (processingResponse === 0) {
        const data = await ffmpegRef.current.readFile(params[2]);

        const resultUrl = URL.createObjectURL(new Blob([data.buffer]));

        setConvertedVideoDownloadUrl(resultUrl);

        setConvertProgress(null);
      } else {
        throw processingResponse;
      }
    } catch (e) {
      setConvertProgress("Converting Failed. Please try again.");
      throw e;
    } finally {
      setIsVideoConverting(false);
    }
  }, []);

  const downloadConvertedOutput = useCallback(() => {
    triggerDownloadDialogue(
      convertedVideoDownloadUrl,
      getFromCommonStore("nameOfLatestConvert")
    );
  }, [convertedVideoDownloadUrl]);

  const updateConvertProgress = useCallback(({ message }) => {
    pubSub.publish(pubSubEvents.processLogUpdated, message);

    const progress = calculateConvertProgress(message);

    if (progress && progress < 100) {
      setConvertProgress(`Converting: ${progress.toFixed(2)} %`);
    }
  }, []);

  useEffect(() => {
    if (getFromCommonStore("videoBlob") !== undefined) {
      setIsVideoFileUploaded(true);
    }

    pubSub.subscribe(pubSubEvents.videoFileUploaded, () => {
      setIsVideoFileUploaded(true);
      setConvertedVideoDownloadUrl(null);
    });
  }, []);

  useEffect(() => {
    const ffmpegRef = getFromCommonStore("ffmpegRef");

    ffmpegRef.current.on("log", updateConvertProgress);

    return () => {
      ffmpegRef.current.off("log", updateConvertProgress);
    };
  }, [updateConvertProgress]);

  return {
    outputFilename,
    updateOutputFilename,
    isVideoConverting,
    outputFilenameError,
    convertVideoToRequiredFormat,
    isVideoFileUploaded,
    convertProgress,
    convertedVideoDownloadUrl,
    downloadConvertedOutput,
  };
};
