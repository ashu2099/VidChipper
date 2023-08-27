export const generateArgsForEqualSplit = (fileExtension, segmentDuration) => {
  const generatedParams = [
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

  console.log(generatedParams);

  return generatedParams;
};

export const argsForAccurateSplit = [
  "-i",
  `input.${"fileExtension"}`,
  "-ss",
  "startTimeStamp",
  "-to",
  "endTimeStamp",
  "-g",
  "9",
  "-sc_threshold",
  "0",
  "-force_key_frames",
  "expr:gte(t,n_forced*9)",
  "-map",
  "0",
  `${"outputFileName"}.${"fileExtension"}`,
];
