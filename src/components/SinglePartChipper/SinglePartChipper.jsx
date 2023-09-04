import { Button } from "../UI";

import useVideoPart from "./useSinglePartChipper";

export default () => {
  const {
    isVideoFileUploaded,
    startTimestamp,
    endTimestamp,
    startError,
    endError,
    updateTimeStamp,
    clipVideo,
    downloadClippedPart,
    isVideoClipping,
    clipProgress,
    clippedVideoDownloadUrl,
  } = useVideoPart();
  return (
    <div id="singlePartChipper" className="flex flex-col py-2">
      <div className="mb-2">
        <label className="flex text-white mb-1">
          Enter Starting Timestamp (hh:mm:ss):
        </label>

        <input
          type="text"
          value={startTimestamp}
          onChange={(e) => updateTimeStamp(true, e.target.value)}
          className="px-2 py-1 w-32 text-gray-600 rounded-md"
          disabled={isVideoClipping}
        />
        {startError && (
          <p className="text-pink-200 mt-1 italic">{startError}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="flex text-white mb-1">
          Enter Ending Timestamp (hh:mm:ss):
        </label>

        <input
          type="text"
          value={endTimestamp}
          onChange={(e) => updateTimeStamp(false, e.target.value)}
          className="px-2 py-1 w-32 text-gray-600 rounded-md"
          disabled={isVideoClipping}
        />
        {endError && <p className="text-pink-200 mt-1 italic">{endError}</p>}
      </div>

      <div className="mt-2 mb-2">
        {clipProgress && (
          <div className="text-pink-200 mb-1 italic">{clipProgress}</div>
        )}

        <Button
          onClick={() => {
            clipVideo(startTimestamp, endTimestamp, "outputee");
          }}
          isLoading={isVideoClipping}
          isDisabled={!isVideoFileUploaded || startError || endError}
          label="Clip Video"
        />
      </div>

      {clippedVideoDownloadUrl && (
        <div className="">
          <Button
            label={"Download Clipped Video"}
            extendClass="mt-1"
            onClick={() => {
              downloadClippedPart("outputee");
            }}
            isLoading={isVideoClipping}
            isDisabled={startError || endError}
          />
        </div>
      )}
    </div>
  );
};
