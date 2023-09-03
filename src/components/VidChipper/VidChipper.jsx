import SinglePartChipper from "../SinglePartChipper/SinglePartChipper";
import EqualSegmentChipper from "../EqualSegmentChipper/EqualSegmentChipper";
import FormatConverter from "../FormatConvertor/FormatConverter";

import useVidChipper from "./useVidChipper";

export default ({ variant }) => {
  const {
    inputVideoBlobUrl,
    isFFmpegLoaded,
    inputVideoRef,
    videoFileUploaded,
  } = useVidChipper();

  return isFFmpegLoaded ? (
    <>
      <video
        ref={inputVideoRef}
        className={inputVideoBlobUrl ? "" : "hidden"}
        controls
        width="250"
        src={inputVideoBlobUrl}
      ></video>

      <input type="file" onChange={videoFileUploaded} />

      {variant === "singlePart" && <SinglePartChipper />}

      {variant === "equalSegment" && <EqualSegmentChipper />}

      {variant === "formatConverter" && <FormatConverter />}
    </>
  ) : (
    <div>Loading ffmpeg-core</div>
  );
};
