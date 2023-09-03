import { Button } from "../UI";

import useFormatConverter from "./useFormatConverter";

export default () => {
  const {
    outputFilename,
    updateOutputFilename,
    isVideoConverting,
    outputFilenameError,
    convertVideoToRequiredFormat,
    isVideoFileUploaded,
    convertProgress,
    convertedVideoDownloadUrl,
    downloadConvertedOutput,
  } = useFormatConverter();

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-600 my-1">
          <span> Enter output filename, with desired format extension</span>
          <br />
          <span>(Eg: output.mp4/output.m4a)</span>
        </label>
        <input
          type="text"
          value={outputFilename}
          onChange={updateOutputFilename}
          className="border border-gray-300 px-2 py-1 rounded-md w-32"
          disabled={isVideoConverting}
        />
        {outputFilenameError && (
          <p className="text-red-600 mt-1">{outputFilenameError}</p>
        )}
      </div>

      <Button
        extendClass="mt-1"
        onClick={() => {
          convertVideoToRequiredFormat(outputFilename);
        }}
        isLoading={isVideoConverting}
        isDisabled={!isVideoFileUploaded || outputFilenameError}
        label={convertProgress}
      />

      <br />

      {convertedVideoDownloadUrl && (
        <Button
          label={"Download Split Video"}
          extendClass="mt-1"
          onClick={() => {
            downloadConvertedOutput();
          }}
          isLoading={isVideoConverting}
          isDisabled={isVideoConverting}
        />
      )}
    </>
  );
};
