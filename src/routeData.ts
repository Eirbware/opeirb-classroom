import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { cropPagination, getPostSidebarEntry, returnToIndex } from './utils/starlight-sidebar';
import { parseAstroCollectionPageId } from './utils/filter_language';
import { defaultLanguage } from './utils/ui';

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar, id } = context.locals.starlightRoute;
  const { lang, sectionId, postId }  = parseAstroCollectionPageId(id);
  if (sectionId === "courses") {
    const currentFirstDepthSidebarEntry = getPostSidebarEntry(
      sidebar, sectionId, postId
    );
    if (currentFirstDepthSidebarEntry !== null && currentFirstDepthSidebarEntry.type==="group") {
      // change the sidebar
      const newSidebar = currentFirstDepthSidebarEntry.entries;
      context.locals.starlightRoute.sidebar = newSidebar;
      // change the pagination (remove unliked prev / next pages)
      context.locals.starlightRoute.pagination = cropPagination(
        context.locals.starlightRoute.pagination, sectionId, lang === defaultLanguage ? undefined : lang, postId
      );
    }
  }
  else if (sectionId === "tips") {
    context.locals.starlightRoute.hasSidebar = false;
    context.locals.starlightRoute.pagination = returnToIndex(sectionId, lang === defaultLanguage ? undefined : lang);
  }
  // WARN: Here, we may have an issue
});
