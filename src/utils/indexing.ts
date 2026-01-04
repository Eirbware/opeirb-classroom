/** Utils function to index posts
 */
import type { PaginateFunction } from "astro";
import { getCollection, type CollectionEntry, type ReferenceDataEntry } from "astro:content";
import { filterPerLanguage } from "./filter_language";

const DEFAULT_POSTS_PER_PAGE = 12;
const DEFAULT_FIRST_POSTS_NB = 5;

type Post = CollectionEntry<"courses" | "tips">
type MayBePromise<T> = T | Promise<T>;
type PostFilter = (post: Post) => MayBePromise<boolean>;
type PostSortCompareFn = (postA: Post, postB: Post) => number

function composeCompareFns<T extends PostSortCompareFn | null>(
  newPrioritizedCompareFn: PostSortCompareFn | undefined,
  baseCompareFn: T
): T {
  if (!newPrioritizedCompareFn) return baseCompareFn;
  if (baseCompareFn === null) return baseCompareFn;
  return ((postA, postB) => {
    const firstCompareResult = newPrioritizedCompareFn(postA, postB);
    return (firstCompareResult !== 0) ? firstCompareResult : baseCompareFn(postA, postB);
  }) as typeof baseCompareFn;
}

function composeFilters<T extends PostFilter | null>(
  filterToBeAdded: PostFilter | undefined,
  baseFilter: T,
): T {
  if (!filterToBeAdded) return baseFilter;
  if (baseFilter === null) return baseFilter;
  return (async (post) =>
    (await baseFilter(post)) &&
    (await filterToBeAdded(post))) as typeof baseFilter;
}

const mostRecentSort: PostSortCompareFn = (postA, postB) => (
  postB.data.pubDate.valueOf() - postA.data.pubDate.valueOf()
);

async function getSortedAndFilteredCollection<RessourceType extends "courses" | "tips">(
  ressourceType: RessourceType,
  lang?: string,
  filter?: PostFilter,
  sortCompareFn?: PostSortCompareFn,
) {
  return (await getCollection(
    ressourceType,
    composeFilters(filter, filterPerLanguage(ressourceType, lang) as PostFilter)
  )).sort(composeCompareFns(sortCompareFn, mostRecentSort));
}

export async function getPaginatedPostCollection<RessourceType extends "courses" | "tips">(
  ressourceType: RessourceType,
  paginate: PaginateFunction,
  lang?: string,
  filter?: PostFilter,
  sortCompareFn?: PostSortCompareFn,
  postsPerPage?: number,
) {
  const posts = await getSortedAndFilteredCollection(ressourceType, lang, filter, sortCompareFn);
  const p = paginate(posts, { pageSize: postsPerPage ?? DEFAULT_POSTS_PER_PAGE, params: { lang: lang } });
  return p;
}

export async function getFirstPostsInCollection<RessourceType extends "courses" | "tips">(
  ressourceType: RessourceType,
  lang?: string,
  filter?: PostFilter,
  sortCompareFn?: PostSortCompareFn,
  postNumber?: number,
) {
  const posts = await getSortedAndFilteredCollection(ressourceType, lang, filter, sortCompareFn);
  return posts.slice(0, postNumber ?? DEFAULT_FIRST_POSTS_NB);
}

export function getPaginatedPostCollectionWithTag(tag: string) {
  return (
    ressourceType: "courses" | "tips",
    paginate: PaginateFunction,
    lang?: string,
    filter?: PostFilter,
    sortCompareFn?: PostSortCompareFn,
    postsPerPage?: number,
  ) => getPaginatedPostCollection(
      ressourceType, paginate, lang,
      composeFilters(filter, (post) => !!(post.data.tags) && post.data.tags.includes(tag)),
      sortCompareFn,
      postsPerPage
    )
}

export function getPaginatedPostCollectionOfAuthor(author_id: ReferenceDataEntry<"contributors">) {
  return (
    ressourceType: "courses" | "tips",
    paginate: PaginateFunction,
    lang?: string,
    filter?: PostFilter,
    sortCompareFn?: PostSortCompareFn,
    postsPerPage?: number,
  ) => getPaginatedPostCollection(
      ressourceType, paginate, lang,
      composeFilters(filter, (post) => post.data.mainAuthor === author_id),
      sortCompareFn,
      postsPerPage
    )
}
