import { getEntry as _getEntry, type CollectionKey, type CollectionEntry } from "astro:content";
import type { BaseFrontmatterProps } from "./content";
import pathlib from "path";

type CollectionFrontmatterOrNot<C extends CollectionKey | null> = C extends CollectionKey ? CollectionEntry<C>["data"] : BaseFrontmatterProps;

export interface BaseMarkdownProps<C extends CollectionKey | null> {
  frontmatter: CollectionFrontmatterOrNot<C>,
  file: string,
  url: string
  previous ?: BaseMarkdownProps<C>,
  next?: BaseMarkdownProps<C>,
};

function filePathToRelUrl(filePath: string): string {
  const relPath = pathlib.relative("src/content", filePath);
  const pathWithoutExtension = relPath.split(".").slice(0, -1).join(".");
  if (pathWithoutExtension.endsWith("/index"))
     return pathlib.dirname(relPath);
  return pathWithoutExtension;
}

export function convertEntry<C extends CollectionKey>(collectionEntry: CollectionEntry<C>): BaseMarkdownProps<C> {
  const filePath = collectionEntry.filePath;
  if (!filePath)
    throw new Error("The filePath not figured out.")
  const relUrl = filePathToRelUrl(filePath);
  return { frontmatter: collectionEntry.data as CollectionFrontmatterOrNot<C>, file: filePath, url: relUrl };
}

export function convertCollection<C extends CollectionKey>(collection: CollectionEntry<C>[]): BaseMarkdownProps<C>[] {
  return collection.map(convertEntry).reduce((acc, elt) => ([
    ...acc,
    {
      ...elt, previous: acc.length ? acc[acc.length-1] : undefined,
    }
  ]), [] as BaseMarkdownProps<C>[])
    .reverse().reduce((acc, elt) => ([
    ...acc,
    {
      ...elt, next: acc.length ? acc[acc.length-1] : undefined,
    }
    ]), [] as BaseMarkdownProps<C>[]).reverse();
}
