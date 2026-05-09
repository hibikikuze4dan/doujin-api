exports.parseTag = (tag = "") => {
  const colonIndex = tag.indexOf(":");

  if (colonIndex === -1) {
    return {
      namespace: null,
      name: tag,
    };
  }

  const namespace = tag.slice(0, colonIndex).trim();
  const name = tag.slice(colonIndex + 1).trim();

  return {
    namespace,
    name,
  };
};
