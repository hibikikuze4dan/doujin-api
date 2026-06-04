import { cosmiconfig } from "cosmiconfig";

import { ConfigData } from "../../types/configuration";
import { APP_NAME, CONFIG_FILEPATH } from "../../constants";

export const getUserConfigs = async () => {
  try {
    const explorer = cosmiconfig(APP_NAME);

    const data = await explorer.load(CONFIG_FILEPATH);

    const configData = (data?.config ?? {}) as Partial<ConfigData>;

    return configData;
  } catch (error) {
    console.error(
      `Something went wrong while trying the get the user configs:\n${error}`,
    );
    return {} as Partial<ConfigData>;
  }
};
