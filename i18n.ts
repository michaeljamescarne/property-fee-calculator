import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to 'en'
  const validLocale = locale && ["en", "zh"].includes(locale) ? locale : "en";

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default,
    locale: validLocale,
  };
});
