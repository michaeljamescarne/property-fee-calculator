// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getRequestConfig } = require("next-intl/server");

// eslint-disable-next-line @typescript-eslint/no-require-imports
module.exports = getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
