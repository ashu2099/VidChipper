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
    <div
      id="formatConverter"
      className="flex flex-col pt-2 text-center md:text-left"
    >
      <div className="mb-2">
        <label className="flex flex-col text-white mb-2">
          <div>Enter output filename, with desired format extension</div>
          <div className="text-sm">(Eg: output.mp4 / vid.mov / meme.gif)</div>
        </label>

        <input
          type="text"
          value={outputFilename}
          onChange={updateOutputFilename}
          className="px-2 py-1 w-32 text-gray-600 rounded-md"
          disabled={isVideoConverting}
        />

        {outputFilenameError && (
          <p className="text-pink-200 mt-2 italic">{outputFilenameError}</p>
        )}
      </div>

      <div className="">
        {convertProgress && (
          <div className="text-pink-200 mb-2 italic">{convertProgress}</div>
        )}

        <Button
          onClick={() => {
            convertVideoToRequiredFormat(outputFilename);
          }}
          isLoading={isVideoConverting}
          isDisabled={!isVideoFileUploaded || outputFilenameError}
          label="Convert Video"
        />
      </div>

      {convertedVideoDownloadUrl && (
        <div className="">
          <Button
            label={"Download Converted Video"}
            extendClass="mt-2"
            onClick={() => {
              downloadConvertedOutput();
            }}
            isLoading={isVideoConverting}
            isDisabled={isVideoConverting}
          />
        </div>
      )}
    </div>
  );
};
