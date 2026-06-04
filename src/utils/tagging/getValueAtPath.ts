import { type JSONValue } from "../../types/general";

export const getValueAtPath = (
  jsonObject = {} as JSONValue,
  pathArray = [] as string[],
) => {
  const keys = pathArray?.flatMap((part) => {
    return part.split(".");
  });

  return (
    keys?.reduce((accumulator, key) => {
      // @ts-ignore
      return accumulator?.[key];
    }, jsonObject) ?? null
  );
};
