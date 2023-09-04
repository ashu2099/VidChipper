import { Tab } from "@headlessui/react";

import SinglePartChipper from "../SinglePartChipper/SinglePartChipper";
import EqualSegmentChipper from "../EqualSegmentChipper/EqualSegmentChipper";
import FormatConverter from "../FormatConvertor/FormatConverter";

import useVidChipper from "./useVidChipper";

const tabClassName =
  "py-2 flex-1 ui-selected:bg-white ui-selected:text-pink-600 ui-selected:font-[700]";

export default () => {
  const {
    inputVideoBlobUrl,
    isFFmpegLoaded,
    inputVideoRef,
    videoFileUploaded,
  } = useVidChipper();

  return (
    <>
      {!isFFmpegLoaded && <div>Loading ffmpeg-core</div>}

      {isFFmpegLoaded && (
        <div id="vidChipper" className="flex flex-col mt-8 md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center">
            <video
              ref={inputVideoRef}
              className={inputVideoBlobUrl ? "" : "hidden"}
              controls
              width="w-full"
              src={inputVideoBlobUrl}
            ></video>

            <input className="mt-2" type="file" onChange={videoFileUploaded} />
          </div>

          <div className="flex bg-white w-full md:w-[1px] h-[1px] md:h-auto mx-0 md:mx-3 my-3 md:my-0"></div>

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
    </>
  );
};
