import { type JSONValue } from "../../types/general";
import { getValueAtPath } from "./getValueAtPath";

export const createTagsString = (
  jsonObject = {} as JSONValue,
  pathArray = [] as string[],
) => {
  if (!pathArray?.length || !jsonObject) {
    return "";
  }

  const tags =
    // @ts-ignore
    (pathArray
      ?.map((path) => {
        return getValueAtPath(jsonObject, Array.isArray(path) ? path : [path]);
      })
      ?.flat(Infinity) ?? []) as string[];

  return tags?.join(",") ?? "";
};
