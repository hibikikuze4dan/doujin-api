exports.getValueAtPath = (jsonObject = {}, pathArray = []) => {
  const keys = pathArray?.flatMap((part) => {
    return part.split(".");
  });

  return (
    keys?.reduce((accumulator, key) => {
      return accumulator?.[key];
    }, jsonObject) ?? null
  );
};
