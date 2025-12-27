import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getPostSidebarEntry } from './utils/starlight-sidebar';
import { parseAstroCollectionPageId } from './utils/filter_language';

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar, id } = context.locals.starlightRoute;
  const { sectionId, postId }  = parseAstroCollectionPageId(id);
  const currentFirstDepthSidebarEntry = getPostSidebarEntry(
    sidebar, sectionId, postId
  );
  if (currentFirstDepthSidebarEntry !== null && currentFirstDepthSidebarEntry.type==="group") {
    const newSidebar = currentFirstDepthSidebarEntry.entries;
    context.locals.starlightRoute.sidebar = newSidebar;
  }
  // WARN: Here, we may have an issue
});
