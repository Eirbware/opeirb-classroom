import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { SidebarEntry } from 'node_modules/@astrojs/starlight/utils/routing/types';

function getCurrentFirstDepthSidebarEntry(
  sidebar: SidebarEntry[], currentFirstSlug: string
): SidebarEntry | null {
  function getSidebarEntryFirstSlug(sidebarEntry: SidebarEntry): string {
    // TODO: check if we want to get the first slug
    if (sidebarEntry.type === "link")
      return sidebarEntry.href.split("/")[1];
    else
      return getSidebarEntryFirstSlug(sidebarEntry.entries[0]);
  }
  return sidebar.reduce(
    (found: SidebarEntry | null, sidebarEntry: SidebarEntry) => {
      if (found !== null) return found;
      const firstSlug = getSidebarEntryFirstSlug(sidebarEntry);
      return firstSlug === currentFirstSlug ? sidebarEntry : null
    }, null
  );
}

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar, id } = context.locals.starlightRoute;
  const currentFirstDepthSidebarEntry = getCurrentFirstDepthSidebarEntry(
    sidebar, id.split("/")[0]
  );
  if (currentFirstDepthSidebarEntry !== null && currentFirstDepthSidebarEntry.type==="group") {
    const newSidebar = currentFirstDepthSidebarEntry.entries.map(
      (entry) => entry as SidebarEntry
    );
    context.locals.starlightRoute.sidebar = newSidebar;
  }
});
