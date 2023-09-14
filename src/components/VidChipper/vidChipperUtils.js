export const DEFAULT_WASM_LOAD_MSG = "Loading ffmpeg-core";

export const generateWasmProgressMessage = (progressData) => {
  console.log(progressData);

  if (
    progressData?.total !== undefined &&
    progressData?.received !== undefined
  ) {
    const progress = Math.floor(
      (progressData?.received / progressData.total) * 100
    );

    return `${DEFAULT_WASM_LOAD_MSG}: ${progress}%`;
  }

  return DEFAULT_WASM_LOAD_MSG;
};
