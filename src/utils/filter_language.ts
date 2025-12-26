const defaultLocale = "en";

/** Given the language, filter an entry according to its id, if it match with
 * the current language.
 */
export const filterPerLanguage = (lang?: string) => ({id}: {id: string}) =>
  id.startsWith(lang ?? defaultLocale) || (
  (lang ?? defaultLocale) === defaultLocale && id.split("/").length === 2
);
