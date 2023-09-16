export const DEFAULT_WASM_LOAD_MSG = "Loading ffmpeg-core";

const WASM_FILE_SIZE = 31598677;

export const generateWasmProgressMessage = (progressData) => {
  console.log(progressData);

  if (
    progressData?.total !== undefined &&
    progressData?.received !== undefined
  ) {
    /**
     * Here, we statically define wasm file size instead of using
     * progressData.total, because the library fn doent not give
     * proper total size in case of gzip/brotli compressed files.
     */

    const progress = Math.floor(
      (progressData?.received / WASM_FILE_SIZE) * 100
    );

    return `${DEFAULT_WASM_LOAD_MSG}: ${progress}%`;
  }

  return DEFAULT_WASM_LOAD_MSG;
};
