import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCurrentFirstDepthSidebarEntry } from './utils/starlight-sidebar';
import { parseId } from './utils/filter_language';

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar, id } = context.locals.starlightRoute;
  const { firstSection }  = parseId(id);
  const currentFirstDepthSidebarEntry = getCurrentFirstDepthSidebarEntry(
    sidebar, firstSection
  );
  if (currentFirstDepthSidebarEntry !== null && currentFirstDepthSidebarEntry.type==="group") {
    const newSidebar = currentFirstDepthSidebarEntry.entries;
    context.locals.starlightRoute.sidebar = newSidebar;
  }
  // WARN: Here, we may have an issue
});
