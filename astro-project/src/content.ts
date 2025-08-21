import type { MarkdownLayoutProps } from "astro";
import pathlib from "path";
import SortedSet from "collections/sorted-set";
import type { SortedSet as SortedSetType } from "collections/sorted-set";

// page with weight in the frontmatter, as in Hugo
type PageProps = MarkdownLayoutProps<{
  weight?: number;
}>

const modules = () => import.meta.glob('./pages/**/*.md', { eager: true }) as Record<string, PageProps>;

interface Section {
  sorted: SortedSetType<PageProps>,
  unsorted: PageProps[],
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
}, {} as Record<string, Section>)).reduce((acc, [uri, {sorted, unsorted}]) => ({...acc, [uri]: [...(sorted.toArray() as PageProps[]), ...unsorted]}), {} as Record<string, PageProps[]>);

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
