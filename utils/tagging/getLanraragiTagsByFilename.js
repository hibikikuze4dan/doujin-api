exports.getLanraragiTagsByFilename = ({ archives, filename }) => {
  if (!archives?.length || !filename) {
    return "";
  }

  const archive = archives.find((arc) => arc?.filename === filename);

  return archive?.tags ?? "";
};
