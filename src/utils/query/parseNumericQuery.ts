import { type ParsedQs } from "qs";

export const parseNumericQuery = (
  queryValue?: ParsedQs | (ParsedQs | string)[] | string | number,
) => {
  if (!queryValue || Array.isArray(queryValue)) {
    return undefined;
  }

  const numberConversion = Number(queryValue);

  if (Number.isNaN(numberConversion)) {
    return undefined;
  }

  return numberConversion;
};
