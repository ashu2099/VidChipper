import VideoPart from "../VideoPart/VideoPart";
import useVidChipper from "./useVidChipper";

export default () => {
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

      <VideoPart />
    </>
  ) : (
    <div>Loading ffmpeg-core</div>
  );
};
