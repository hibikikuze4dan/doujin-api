export const splitByComma = (
  str = "",
  { trim = true, removeEmpty = true } = {},
) => {
  if (!str) {
    return [];
  }

  let arr = str.split(",");

  if (trim) {
    arr = arr.map((s) => s.trim());
  }

  if (removeEmpty) {
    arr = arr.filter(Boolean);
  }

  return arr;
};
