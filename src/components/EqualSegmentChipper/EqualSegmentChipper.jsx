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
    <>
      <div className="mb-4">
        <label className="block text-gray-600">
          Enter Interval Duration, in Seconds:
        </label>
        <input
          type="text"
          value={segmentDuration}
          onChange={updateSegmentDuration}
          className="border border-gray-300 px-2 py-1 rounded-md w-32"
          disabled={isVideoSplitting}
        />
        {segmenDurationError && (
          <p className="text-red-600 mt-1">{segmenDurationError}</p>
        )}
      </div>

      <Button
        extendClass="mt-1"
        onClick={() => {
          splitVideoInEqualParts(segmentDuration);
        }}
        isLoading={isVideoSplitting}
        isDisabled={!isVideoFileUploaded || segmenDurationError}
        label={splitProgress}
      />

      <br />

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
    </>
  );
};
