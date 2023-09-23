import { Tab } from "@headlessui/react";

import SinglePartChipper from "../SinglePartChipper/SinglePartChipper";
import EqualSegmentChipper from "../EqualSegmentChipper/EqualSegmentChipper";
import FormatConverter from "../FormatConvertor/FormatConverter";

import useVidChipper from "./useVidChipper";
import { Button } from "../UI";

const tabClassName =
  "py-2 flex-1 ui-selected:bg-white ui-selected:text-pink-600 ui-selected:font-[700]";

export default () => {
  const {
    inputVideoBlobUrl,
    isFFmpegLoaded,
    inputVideoRef,
    videoFileUploaded,
    ffmpegLoadProgressMsg,
    openFileBrowser,
    processLog,
  } = useVidChipper();

  return (
    <>
      {!isFFmpegLoaded && <div>{ffmpegLoadProgressMsg}</div>}

      {isFFmpegLoaded && (
        <div id="vidChipper" className="flex flex-col mt-5 md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center">
            <video
              ref={inputVideoRef}
              className={inputVideoBlobUrl ? "" : "hidden"}
              controls
              width="w-full"
              src={inputVideoBlobUrl}
            ></video>

            <input
              id="fileUploadInputElement"
              className="hidden"
              type="file"
              onChange={videoFileUploaded}
            />

            <div
              className={[
                "border border-pink-300 hover:border-white border-dashed",
                "flex flex-1 w-full items-center justify-center",
                "py-8 select-none cursor-pointer",
                "text-pink-300 hover:text-white",
                `${inputVideoBlobUrl ? "hidden" : ""}`,
              ].join(" ")}
              onClick={openFileBrowser}
            >
              <div className="text-xl">Click Here To Select Video !</div>
            </div>

            <Button
              label="Upload New Video"
              extendClass={[
                "mt-2 ml-auto",
                `${inputVideoBlobUrl ? "" : "hidden"}`,
              ].join(" ")}
              onClick={() => {
                openFileBrowser;
              }}
            />
          </div>

          <div
            className={[
              "flex bg-white w-full md:w-[1px] h-[1px]",
              "md:h-auto mx-0 md:mx-4 my-4 md:my-0",
            ].join(" ")}
          ></div>

          <div className="flex flex-1">
            <Tab.Group manual as="div" className="flex flex-col flex-1">
              <Tab.List className="flex bg-black/[0.2]">
                <Tab className={tabClassName}>Clip</Tab>
                <Tab className={tabClassName}>Split</Tab>
                <Tab className={tabClassName}>Convert</Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <SinglePartChipper />
                </Tab.Panel>

                <Tab.Panel>
                  <EqualSegmentChipper />
                </Tab.Panel>

                <Tab.Panel>
                  <FormatConverter />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      )}

      {processLog && (
        <div className="text-center text-pink-200 mt-5 italic">
          <span>Process Log:</span>
          <br />
          <span>{processLog}</span>
        </div>
      )}
    </>
  );
};
