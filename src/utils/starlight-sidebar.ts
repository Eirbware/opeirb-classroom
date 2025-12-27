/** Hacky external handlings of starlight's sitemap
 */
import { getSidebar } from 'node_modules/@astrojs/starlight/utils/navigation';
import type { PaginationLinks, SidebarEntry, SidebarLink } from 'node_modules/@astrojs/starlight/utils/routing/types';
import { parseHref } from './filter_language';

/** Return the first page related to the entry.
 */
export function getFirstLinkEntry(sidebarEntry: SidebarEntry): SidebarLink {
  if (sidebarEntry.type === "link") {
    return sidebarEntry;
  }
  return getFirstLinkEntry(sidebarEntry.entries[0]);
}

/** Return the sidebar's subtree of the provided post.
 */
export function getPostSidebarEntry(
  sidebar: SidebarEntry[], sectionId: string, postId: string
): SidebarEntry | null {
  function getSidebarEntryFirstSlug(sidebarEntry: SidebarEntry): string {
    return parseHref(getFirstLinkEntry(sidebarEntry).href).sectionId;
  }
  function getSidebarEntrySecondSlug(sidebarEntry: SidebarEntry): string {
    return parseHref(getFirstLinkEntry(sidebarEntry).href).postId;
  }
  function findEntry(sidebar: SidebarEntry[], condition: (se: SidebarEntry) => boolean): SidebarEntry | null {
    function aux(sidebar: SidebarEntry[]) {
      if (sidebar.length === 0)
        // not found
        return null;
      const [sidebarEntry, ...remainingSidebar] = sidebar;
      if (condition(sidebarEntry)) {
        // found
        return sidebarEntry;
      }
      // keep searching
      return aux(remainingSidebar);
    }
    return aux(sidebar);
  }
  const sectionEntry = findEntry(sidebar, (se) => getSidebarEntryFirstSlug(se) === sectionId);
  if (sectionEntry === null || sectionEntry.type === "link")
    return null;
  return findEntry(sectionEntry.entries, (se) => getSidebarEntrySecondSlug(se) === postId);
}

export function getFirstDepthChapters(courseSectionName: string, courseId: string, locale: string | undefined): SidebarEntry[] {
  // TODO: the static sidebar must be recomputed at each call
  const sidebar = getSidebar(courseId, locale);
  const group = getPostSidebarEntry(sidebar, courseSectionName, courseId);
  if (group === null || group.type === "link")
    return [];
  return group.entries;
}

/** Remove prev or next page if the related post is not the same
  */
export function cropPagination(pagination: PaginationLinks, currentSectionName: string, currentPostId: string, astroCollectionId: string): PaginationLinks {
  const { prev, next } = pagination
  const isHrefOnTheSamePost = (href: string) => {
    const { sectionId, postId } = parseHref(href);
    return sectionId === currentSectionName && postId === currentPostId;
  };
  function sidebarLinkForHome(): SidebarLink {
    return {
      label: "Home Page", // TODO: internationalize that
      href: "/" + astroCollectionId.split("/").slice(0, -1).join("/"),
      type: "link",
      isCurrent: false,
      badge: undefined,
    } as SidebarLink
  }
  return {
    prev: (prev && isHrefOnTheSamePost(prev.href)) ? prev : sidebarLinkForHome(),
    next: (next && isHrefOnTheSamePost(next.href)) ? next : undefined
  }
}
