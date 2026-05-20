exports.parseNumericQuery = (queryValue) => {
  if (!queryValue) {
    return undefined;
  }

  const numberConversion = Number(queryValue);

  if (Number.isNaN(numberConversion)) {
    return undefined;
  }

  return numberConversion;
};
