export const generateParamsForEqualSplit = (
  fileExtension,
  segmentDuration,
  processName
) => {
  const generatedEqualSegmentParams = [
    "-i",
    `input.${fileExtension}`,
    "-f",
    "segment",
    "-segment_time",
    `${segmentDuration}`,
    "-g",
    `${segmentDuration * 3}`,
    "-sc_threshold",
    "0",
    "-force_key_frames",
    `expr:gte(t,n_forced*${segmentDuration * 3})`,
    "-reset_timestamps",
    "1",
    "-map",
    "0",
    `output-${processName}-%03d.mp4`,
  ];

  console.log(generatedEqualSegmentParams);

  return generatedEqualSegmentParams;
};

export const generateParamsForSingleSplit = (
  fileExtension,
  startTimeStamp,
  endTimeStamp,
  processIdentifier
) => {
  const generatedSinglePartParams = [
    "-i",
    `input.${fileExtension}`,
    "-ss",
    startTimeStamp,
    "-to",
    endTimeStamp,
    "-map",
    "0",
    `${processIdentifier}.${fileExtension}`,
  ];

  console.log(generatedSinglePartParams);

  return generatedSinglePartParams;
};

export const generateParamsForFormatConversion = (
  inputFileExtension,
  outputFilename,
  processIdentifier
) => {
  const generatedFormatConversionParams = [
    "-i",
    `input.${inputFileExtension}`,
    `${processIdentifier}_${outputFilename}`,
  ];

  console.log(generatedFormatConversionParams);

  return generatedFormatConversionParams;
};
