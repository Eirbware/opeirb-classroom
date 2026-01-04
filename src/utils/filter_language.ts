import { getEntry } from "astro:content";
import { defaultLanguage, getSupportedLanguages } from "./ui";
import path from "node:path";

export function translateStarlightRouteId(id: string, lang: string): string {
  const { sectionId, postId = "", remainingSlug = "" } = parseAstroCollectionPageId(id);
  return path.join(lang, sectionId, postId, remainingSlug);
}

/** Given the language, filter an entry according to its id, if it match with
 * the current language.
 *
 * Expected id format (Astro collection id):
 *  - courses/postId/*
 *  - courses/postId
 *  - en/courses/postId/*
 *  - en/courses/postId
 */
export const filterPerLanguage =
  <RessourceType extends "courses" | "tips">(
    postType: RessourceType,
    lang?: string,
  ) =>
  async ({ id }: { id: string }) => {
    const pageLang = parseAstroCollectionPageId(id).lang;
    if (lang === undefined)
      // the given language is the default language
      return defaultLanguage === pageLang;
    if (lang === pageLang)
      // the page is in the given language
      return true;
    if (defaultLanguage === pageLang) {
      // posts in default language are kept if the page does not exist in the
      // given language
      try {
        const post = await getEntry(postType, translateStarlightRouteId(id, lang));
        return post === undefined;
      } catch {
        return true;
      }
    }
    return false;
  };

export type ParsedPage = {
  lang: string,
  sectionId: string,
  postId?: string,
  remainingSlug?: string
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
