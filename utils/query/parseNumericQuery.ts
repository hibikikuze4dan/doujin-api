export const parseNumericQuery = (queryValue?: string | number) => {
  if (!queryValue) {
    return undefined;
  }

  const numberConversion = Number(queryValue);

  if (Number.isNaN(numberConversion)) {
    return undefined;
  }

  return numberConversion;
};
