const { getValueAtPath } = require("./getValueAtPath");

exports.createTagsString = (jsonObject = {}, pathArray = []) => {
  const tags =
    pathArray
      ?.map((path) => {
        return getValueAtPath(jsonObject, Array.isArray(path) ? path : [path]);
      })
      ?.flat(Infinity) ?? [];

  return tags?.join(",") ?? "";
};
