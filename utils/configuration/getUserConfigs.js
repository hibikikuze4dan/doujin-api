const { cosmiconfig } = require("cosmiconfig");
const { CONFIG_FILEPATH, APP_NAME } = require("../../constants");

exports.getUserConfigs = async () => {
  try {
    const explorer = cosmiconfig(APP_NAME);

    const data = await explorer.load(CONFIG_FILEPATH);

    const configData = data?.config ?? {};

    return configData;
  } catch (error) {
    console.error(
      `Something went wrong while trying the get the user configs:\n${error}`,
    );
    return {};
  }
};
