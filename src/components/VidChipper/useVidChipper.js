import { useState, useEffect, useRef, useCallback } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import { getFromCommonStore, setInCommonStore } from "../../utils/commonStore";
import { pubSub, pubSubEvents } from "../../utils/pubSub";
import {
  aquireWakeLock,
  reaquireWakeLock,
  releaseWakeLock,
} from "../../utils/wakeLockUtils";
import {
  DEFAULT_WASM_LOAD_MSG,
  generateWasmProgressMessage,
} from "./vidChipperUtils";
import { toBlobURLOverridden } from "../../utils/ffmpegUtilOverrides";

export default () => {
  const ffmpegRef = useRef(new FFmpeg());
  const inputVideoRef = useRef(null);

  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

  const [ffmpegLoadProgressMsg, setFFmpegLoadProgressMsg] = useState(
    DEFAULT_WASM_LOAD_MSG
  );

  const [processLog, setProcessLog] = useState("");

  const [inputVideoBlobUrl, setInputVideoBlobUrl] = useState(null);

  const updateWasmLoadProgress = useCallback((progressEvent) => {
    setFFmpegLoadProgressMsg(() => generateWasmProgressMessage(progressEvent));
  }, []);

  const loadFFmpegFiles = useCallback(async () => {
    try {
      const baseURL = `${window.location.href}`;

      setInCommonStore("ffmpegRef", ffmpegRef);

      await aquireWakeLock();

      const ffmpegLoadResult = await ffmpegRef.current.load({
        coreURL: await toBlobURL(`${baseURL}ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURLOverridden(
          `${baseURL}ffmpeg-core.wasm`,
          "application/wasm",
          true,
          updateWasmLoadProgress
        ),
      });

      await releaseWakeLock();

      setIsFFmpegLoaded(ffmpegLoadResult);
    } catch (e) {
      console.log(e);
    }
  }, [updateWasmLoadProgress]);

  const writeFileToFFmpegStore = useCallback(async () => {
    await ffmpegRef.current.writeFile(
      `input.${getFromCommonStore("videoFileExtension")}`,
      await fetchFile(getFromCommonStore("videoBlob"))
    );

    pubSub.publish(pubSubEvents.videoFileUploaded);

    console.log("File Written!");
  }, []);

  const videoFileUploaded = useCallback(
    (domEvent) => {
      const fileDetails = domEvent.target.files[0];

      if (fileDetails) {
        setInCommonStore("videoBlob", fileDetails);

        setInCommonStore("videoFileMimeType", fileDetails?.type);

        const extensionformat = fileDetails?.name
          ?.split?.(".")
          ?.pop?.()
          ?.toLowerCase();

        setInCommonStore("videoFileExtension", extensionformat);
        4;

        setInputVideoBlobUrl(URL.createObjectURL(fileDetails));

        inputVideoRef.current.onloadedmetadata = () => {
          setInCommonStore("videoFileDuration", inputVideoRef.current.duration);
        };

        writeFileToFFmpegStore();
      }
    },
    [writeFileToFFmpegStore]
  );

  const openFileBrowser = useCallback(() => {
    const inputElement = document.getElementById("fileUploadInputElement");

    inputElement?.click?.();
  }, []);

  useEffect(() => {
    const localffmpefRef = ffmpegRef.current;

    document.addEventListener("visibilitychange", reaquireWakeLock);

    loadFFmpegFiles();

    return () => {
      document.removeEventListener("visibilitychange", reaquireWakeLock);

      localffmpefRef?.current?.terminate();
    };
  }, [loadFFmpegFiles]);

  useEffect(() => {
    pubSub.subscribe(pubSubEvents.processLogUpdated, (logmsg) => {
      setProcessLog(logmsg === "Aborted()" ? "" : logmsg);
    });

    () => {
      // lol this will unsubscribe all other listeners too.
      pubSub.unsubscribe(pubSubEvents.processLogUpdated, () => {});
    };
  }, []);

  return {
    inputVideoBlobUrl,
    isFFmpegLoaded,
    inputVideoRef,
    videoFileUploaded,
    ffmpegLoadProgressMsg,
    openFileBrowser,
    processLog,
  };
};
