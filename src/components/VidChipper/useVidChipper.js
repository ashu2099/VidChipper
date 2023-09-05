import { useState, useEffect, useRef, useCallback } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { getFromCommonStore, setInCommonStore } from "../../utils/commonStore";
import { pubSub, pubSubEvents } from "../../utils/pubSub";

export default () => {
  const ffmpegRef = useRef(new FFmpeg());
  const inputVideoRef = useRef(null);

  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [inputVideoBlobUrl, setInputVideoBlobUrl] = useState(null);

  const loadFFmpegFiles = async () => {
    const baseURL = `${window.location.href}`;

    setInCommonStore("ffmpegRef", ffmpegRef);

    await ffmpegRef.current.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    setIsFFmpegLoaded(true);
  };

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

  useEffect(() => {
    const localffmpefRef = ffmpegRef.current;

    loadFFmpegFiles();

    return () => {
      localffmpefRef?.current?.terminate();
    };
  }, []);

  return {
    inputVideoBlobUrl,
    isFFmpegLoaded,
    inputVideoRef,
    videoFileUploaded,
  };
};
