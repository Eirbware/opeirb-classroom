import { assert, expect, test } from 'vitest';
import { translateStarlightRouteId } from '@/utils/filter_language';

// Edit an assertion and save to see HMR in action

test("translate post ids", async () => {
  const route1 = "courses/post1";
  const route2 = "en/courses/post2";
  const route3 = "tips/post1";
  const route4 = "en/tips/post2";
  expect(translateStarlightRouteId(route1, "fr")).toBe("fr/courses/post1");
  expect(translateStarlightRouteId(route2, "fr")).toBe("fr/courses/post2");
  expect(translateStarlightRouteId(route3, "fr")).toBe("fr/tips/post1");
  expect(translateStarlightRouteId(route4, "fr")).toBe("fr/tips/post2");
});
