export const parseNumericQuery = (queryValue: string) => {
  if (!queryValue) {
    return undefined;
  }

  const numberConversion = Number(queryValue);

  if (Number.isNaN(numberConversion)) {
    return undefined;
  }

  return numberConversion;
};
