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
    splitVideoIntoPart,
    downloadSplitPart,
    isVideoSplitting,
    splitProgress,
    splitVideoDownloadUrl,
  } = useVideoPart();
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-600">
          Enter Starting Timestamp (hh:mm:ss):
        </label>
        <input
          type="text"
          value={startTimestamp}
          onChange={(e) => updateTimeStamp(true, e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-32"
          disabled={isVideoSplitting}
        />
        {startError && <p className="text-red-600 mt-1">{startError}</p>}
      </div>

      <div>
        <label className="block text-gray-600">
          Enter Ending Timestamp (hh:mm:ss):
        </label>
        <input
          type="text"
          value={endTimestamp}
          onChange={(e) => updateTimeStamp(false, e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-32"
          disabled={isVideoSplitting}
        />
        {endError && <p className="text-red-600 mt-1">{endError}</p>}
      </div>

      <Button
        extendClass="mt-1"
        onClick={() => {
          splitVideoIntoPart(startTimestamp, endTimestamp, "outputee");
        }}
        isLoading={isVideoSplitting}
        isDisabled={!isVideoFileUploaded || startError || endError}
        label={splitProgress}
      />

      <br />

      {splitVideoDownloadUrl && (
        <Button
          label={"Download Split Video"}
          extendClass="mt-1"
          onClick={() => {
            downloadSplitPart("outputee");
          }}
          isLoading={isVideoSplitting}
          isDisabled={startError || endError}
        />
      )}
    </>
  );
};
