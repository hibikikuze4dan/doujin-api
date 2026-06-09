import { AddOrRemove } from "../../types/general";

export const parseAddOrRemove = (addOrRemove?: string | string[]) => {
  const returnValue = {
    add: false,
    remove: false,
  };

  if (Array.isArray(addOrRemove) || !addOrRemove) {
    return returnValue;
  }

  if (["add", "remove"].includes(addOrRemove)) {
    returnValue[addOrRemove as AddOrRemove] = true;
  }

  return returnValue;
};
