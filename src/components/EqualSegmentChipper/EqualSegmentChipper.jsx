import { Button } from "../UI";

import useEqualSegmentChipper from "./useEqualSegmentChipper";

export default () => {
  const {
    isVideoFileUploaded,
    segmentDuration,
    updateSegmentDuration,
    segmenDurationError,
    splitVideoInEqualParts,
    isVideoSplitting,
    splitProgress,
    splitVideoResults,
    downloadSplitPart,
  } = useEqualSegmentChipper();
  return (
    <div
      id="equalSegmentChipper"
      className="flex flex-col pt-2 text-center md:text-left"
    >
      <div className="mb-2">
        <label className="flex flex-col text-white mb-1">
          Enter Interval Duration, in Seconds:
        </label>

        <input
          type="text"
          value={segmentDuration}
          onChange={updateSegmentDuration}
          className="px-2 py-1 w-32 text-gray-600 rounded-md"
          disabled={isVideoSplitting}
        />

        {segmenDurationError && (
          <p className="text-pink-200 mt-1 italic">{segmenDurationError}</p>
        )}
      </div>

      <div className="mt-2">
        {splitProgress && (
          <div className="text-pink-200 mb-1 italic">{splitProgress}</div>
        )}

        <Button
          onClick={() => {
            splitVideoInEqualParts(segmentDuration);
          }}
          isLoading={isVideoSplitting}
          isDisabled={!isVideoFileUploaded || segmenDurationError}
          label="Split Video"
        />
      </div>

      {splitVideoResults?.length > 0 &&
        splitVideoResults.map((segmentName, index) => (
          <Button
            key={segmentName}
            label={`Download part ${index}`}
            extendClass="mt-1 mr-1"
            onClick={() => {
              downloadSplitPart(segmentName);
            }}
          />
        ))}
    </div>
  );
};
