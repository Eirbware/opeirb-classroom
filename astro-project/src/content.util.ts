import { type BaseFrontmatterProps } from "./content";
import { getEntry as _getEntry, type CollectionKey, type CollectionEntry } from "astro:content";
import pathlib from "path";

export interface BaseMarkdownProps<FrontmatterProps extends BaseFrontmatterProps> {
  frontmatter: FrontmatterProps,
  file: string,
  url: string
  previous ?: BaseMarkdownProps<FrontmatterProps>,
  next?: BaseMarkdownProps<FrontmatterProps>,
}

function filePathToRelUrl(filePath: string): string {
  const pathWithoutExtension = filePath.split(".").slice(0, -1).join(".");
  if (pathWithoutExtension.endsWith("/index"))
     return pathlib.dirname(filePath);
  return pathWithoutExtension;
}

export function convertEntry<C extends CollectionKey>(collectionEntry: CollectionEntry<C>): BaseMarkdownProps<CollectionEntry<C>["data"]> {
  const filePath = collectionEntry.filePath;
  if (!filePath)
    throw new Error("The filePath not figured out.")
  const relUrl = filePathToRelUrl(filePath);
  return { frontmatter: collectionEntry.data, file: filePath, url: relUrl };
}

export function convertCollection<C extends CollectionKey>(collection: CollectionEntry<C>[]): BaseMarkdownProps<CollectionEntry<C>["data"]>[] {
  return collection.map(convertEntry).reduce((acc, elt) => ([
    ...acc,
    {
      ...elt, previous: acc.length ? acc[acc.length-1] : undefined,
    }
  ]), [] as BaseMarkdownProps<CollectionEntry<C>["data"]>[])
    .reverse().reduce((acc, elt) => ([
    ...acc,
    {
      ...elt, next: acc.length ? acc[acc.length-1] : undefined,
    }
    ]), [] as BaseMarkdownProps<CollectionEntry<C>["data"]>[]).reverse();
}
