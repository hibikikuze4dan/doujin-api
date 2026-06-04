import { JSONValue } from "../../types/general";
import { readFile } from "./readFile";

export const readJSONFile = async (filepath = ""): Promise<JSONValue> => {
  if (!filepath) {
    return {};
  }

  try {
    const data = JSON.parse(await readFile(filepath));
    return data;
  } catch (error) {
    console.error(
      `Error occurred while trying to read the content of ${filepath}:\n${error}`,
    );
    return {};
  }
};
