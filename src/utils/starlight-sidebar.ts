/** Hacky external handlings of starlight's sitemap
 */
import { getSidebar } from 'node_modules/@astrojs/starlight/utils/navigation';
import type { SidebarEntry, SidebarLink } from 'node_modules/@astrojs/starlight/utils/routing/types';
import { parseHref } from './filter_language';

/** Return the first page related to the entry.
 */
export function getFirstLinkEntry(sidebarEntry: SidebarEntry): SidebarLink {
  if (sidebarEntry.type === "link") {
    return sidebarEntry;
  }
  return getFirstLinkEntry(sidebarEntry.entries[0]);
}

/** Return the sidebar's subtree of the provided first slug.
 */
export function getCurrentFirstDepthSidebarEntry(
  sidebar: SidebarEntry[], currentFirstSlug: string
): SidebarEntry | null {
  function getSidebarEntryFirstSlug(sidebarEntry: SidebarEntry): string {
    return parseHref(getFirstLinkEntry(sidebarEntry).href).firstSection;
  }
  function aux(sidebar: SidebarEntry[]): SidebarEntry | null {
    if (sidebar.length === 0)
      // not found
      return null;
    const [sidebarEntry, ...remainingSidebar] = sidebar;
    const firstSlug = getSidebarEntryFirstSlug(sidebarEntry);
    if (firstSlug === currentFirstSlug) {
      // found
      return sidebarEntry;
    }
    // keep searching
    return aux(remainingSidebar);
  }
  return aux(sidebar);
}

export function getFirstDepthChapters(courseId: string, locale: string | undefined): SidebarEntry[] {
  // TODO: the static sidebar must be recomputed at each call
  const sidebar = getSidebar(courseId, locale);
  const group = getCurrentFirstDepthSidebarEntry(sidebar, courseId);
  if (group === null || group.type === "link")
    return [];
  return group.entries;
}
