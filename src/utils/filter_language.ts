import { defaultLanguage, getSupportedLanguages } from "./ui";

/** Given the language, filter an entry according to its id, if it match with
 * the current language.
 *
 * Expected id format (Astro collection id):
 *  - courses/postId/*
 *  - courses/postId
 *  - en/courses/postId/*
 *  - en/courses/postId
 */
export const filterPerLanguage = (lang?: string) => ({id}: {id: string}) => {
  return parseAstroCollectionPageId(id).lang === (lang ?? defaultLanguage)
};

export type ParsedPage = {
  lang: string,
  sectionId: string,
  postId: string,
  remainingSlug: string
};

/** The id must be like that :
 *  - /courses/postId/*
 *  - /courses/postId
 *  - en/courses/postId/*
 *  - en/courses/postId
 */
export function parseStarlightRouteId(id: string): ParsedPage {
  // if id starts with /, then no language prefix is used
  const splits = id.split("/");
  return {
    lang: id.startsWith("/") ? defaultLanguage : splits[0],
    sectionId: splits[1],
    postId: splits[2],
    remainingSlug: splits.slice(3).join("/")
  };
}

/** Expected id format (Astro collection id):
 *  - courses/postId/*
 *  - courses/postId
 *  - en/courses/postId/*
 *  - en/courses/postId
 */
export function parseAstroCollectionPageId(id: string): ParsedPage {
  return parseHref("/" + id);
}

/** Href format:
 *  - /courses/postId/*
 *  - /courses/postId
 *  - /en/courses/postId/*
 *  - /en/courses/postId
 */
export function parseHref(href: string): ParsedPage {
  // check if the first element is a lang prefix, after infer
  const [first, second, third, ...remaining] = href.slice(1).split("/");
  if (getSupportedLanguages().includes(first))
    return { lang: first, sectionId: second, postId: third, remainingSlug: remaining.join("/") };
  return {
    lang: defaultLanguage,
    sectionId: first,
    postId: second,
    remainingSlug: [third, ...remaining].join("/")
  };
}
