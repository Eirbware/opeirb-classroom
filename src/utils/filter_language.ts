import { defaultLanguage, getSupportedLanguages } from "./ui";

/** Given the language, filter an entry according to its id, if it match with
 * the current language.
 */
export const filterPerLanguage = (lang?: string) => ({id}: {id: string}) =>
  id.startsWith(lang ?? defaultLanguage) || (
  (lang ?? defaultLanguage) === defaultLanguage && id.split("/").length === 2
);

export type ParsedPage = {
  lang: string,
  firstSection: string,
  remainingSlug: string
};

export function parseId(id: string): ParsedPage {
  // if id starts with /, then no language prefix is used
  const splits = id.split("/");
  return {
    lang: id.startsWith("/") ? defaultLanguage : splits[0],
    firstSection: splits[1],
    remainingSlug: splits.slice(2).join("/")
  };
}

export function parseHref(href: string): ParsedPage {
  // check if the first element is a lang prefix, after infer
  const [first, second, ...remaining] = href.slice(1).split("/");
  if (getSupportedLanguages().includes(first))
    return { lang: first, firstSection: second, remainingSlug: remaining.join("/") };
  return {
    lang: defaultLanguage,
    firstSection: first,
    remainingSlug: [second, ...remaining].join("/")
  };
}
