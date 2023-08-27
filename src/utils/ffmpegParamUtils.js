export const generateParamsForEqualSplit = (fileExtension, segmentDuration) => {
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
    "output-%03d.mp4",
  ];

  console.log(generatedEqualSegmentParams);

  return generatedEqualSegmentParams;
};

export const generateParamsForSingleSplit = (
  fileExtension,
  startTimeStamp,
  endTimeStamp,
  outputFileName
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
    `${outputFileName}.${fileExtension}`,
  ];

  console.log(generatedSinglePartParams);

  return generatedSinglePartParams;
};
