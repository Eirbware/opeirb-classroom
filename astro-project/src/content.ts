import type { MarkdownLayoutProps } from "astro";
import pathlib from "path";
import SortedSet from "collections/sorted-set";
import type { SortedSet as SortedSetType } from "collections/sorted-set";

interface MenuProps {
  weight: number;
  name?: string;
}

// page with weight in the frontmatter, as in Hugo
type PageProps = MarkdownLayoutProps<{
  title: string;
  description?: string;
  weight?: number;
  menu?: Record<string, MenuProps>
}>

const modules = () => import.meta.glob('./pages/**/*.md', { eager: true }) as Record<string, PageProps>;

interface Section {
  sorted: SortedSetType<PageProps>,
  unsorted: PageProps[],
}

function sortedSetToArray<T>(sortedSet: SortedSetType<T>) {
  return sortedSet.toArray() as T[];
}

const pagesPerSection = () => Object.entries(Object.values(modules()).reduce((acc, mod) => {
  const uri = mod.url;
  if (uri === undefined) return acc;
  const sectionUri = pathlib.dirname(uri);
  const { 
    [sectionUri]: newDB = {
        sorted: new SortedSet<PageProps>(
          [],
          (a, b) => a.frontmatter.weight! === b.frontmatter.weight!,
          (a, b) => a.frontmatter.weight! - b.frontmatter.weight!
        ),
        unsorted: []
    },
    ...remaining
  } = acc;
  const newSection: Section = (
    (mod.frontmatter.weight !== undefined) ?
    {
      sorted: ((db) => { db.sorted.add(mod); return db.sorted; })(newDB),
      unsorted: newDB.unsorted,
    } : {
      sorted: newDB.sorted,
      unsorted: [...newDB.unsorted, mod]
    }
  );
     
  return { ...remaining, [sectionUri]: newSection };
}, {} as Record<string, Section>)).reduce((acc, [uri, {sorted, unsorted}]) => ({...acc, [uri]: [...sortedSetToArray(sorted), ...unsorted]}), {} as Record<string, PageProps[]>);

export function getPageIndexInSection(pageUri: string) {
  const sectionUri = pathlib.dirname(pageUri);
  const gotPagesPerSection = pagesPerSection();
  const section = gotPagesPerSection[sectionUri]
  const index = section.findIndex((page => page.url === pageUri));
  if (index < 0)
    throw new Error(`Page with uri ${pageUri} is not found in section: ${sectionUri}`);
  return { section, index };
}

export function nextPageInSection<P extends MarkdownLayoutProps<any>>(page: P): P | null {
  const pageUri = page.url;
  if (pageUri === undefined)
    return null;
  const { section, index } = getPageIndexInSection(pageUri);
  if (section.length <= index + 1)
    return null;
  return section[index + 1] as P;
}

export function previousPageInSection<P extends MarkdownLayoutProps<any>>(page: P): P | null {
  const pageUri = page.url;
  if (pageUri === undefined)
    return null;
  const { section, index } = getPageIndexInSection(pageUri);
  if (index === 0)
    return null;
  return section[index - 1] as P;
}

/** Create a json file with metadata for each content page.
 *
 *  Call it for generating the json for fullsearch
 */
export function indexAllPagesForSearch() {
  const gotPagesPerSection = pagesPerSection();
  // TODO:
}

export const siteMenu = () => Object.entries(
  Object.values(modules()).reduce((acc, mod): Record<string, SortedSetType<[MenuProps, PageProps]>> => {
  const menus = mod.frontmatter.menu;
  if (menus === undefined)
    return acc;
  const newAcc = { ...acc };
  Object.entries(menus).forEach(([part, menuProps]) => {
    const getWeight = (a: [MenuProps, PageProps]) => a[1].frontmatter.menu![part]!.weight;
    const currentlySortedMenuPages = newAcc[part] ?? new SortedSet<[MenuProps, PageProps]>(
      [],
      (a, b) => getWeight(a) === getWeight(b),
      (a, b) => getWeight(a) - getWeight(b)
    );
    const addAndReturn = (w: SortedSetType<[MenuProps, PageProps]>, page: PageProps, menu: MenuProps) => {
      w.add([menu, page]);
      return w;
    };
    newAcc[part] = addAndReturn(currentlySortedMenuPages, mod, menuProps);
  });
  return newAcc;
}, {} as Record<string, SortedSetType<[MenuProps, PageProps]>>)
).reduce((acc, [part, sortedMenuPages]) => ({ ...acc, [part]: sortedSetToArray(sortedMenuPages)}), {} as Record<string, [MenuProps, PageProps][]>);

export async function getPageProps(url: string): Promise<PageProps> {
  return await import(`./pages/${url}.md`) as PageProps;
}
