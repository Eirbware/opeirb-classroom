import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { cropPagination, getPostSidebarEntry } from './utils/starlight-sidebar';
import { parseAstroCollectionPageId } from './utils/filter_language';

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar, id } = context.locals.starlightRoute;
  const { sectionId, postId }  = parseAstroCollectionPageId(id);
  const currentFirstDepthSidebarEntry = getPostSidebarEntry(
    sidebar, sectionId, postId
  );
  if (currentFirstDepthSidebarEntry !== null && currentFirstDepthSidebarEntry.type==="group") {
    // change the sidebar
    const newSidebar = currentFirstDepthSidebarEntry.entries;
    context.locals.starlightRoute.sidebar = newSidebar;
    // change the pagination (remove unliked prev / next pages)
    context.locals.starlightRoute.pagination = cropPagination(
      context.locals.starlightRoute.pagination, sectionId, postId, id
    );
  } 
  // WARN: Here, we may have an issue
});
