import flexsearch from "flexsearch";
import { OrderedMap } from "immutable";

type PageData = {
  author: string;
  date: number;
  description: string;
  dir: string;
  fuzzywordcount: number;
  keywords: any;
  kind: string;
  lang: string;
  lastmod: number;
  objectID: string;
  permalink: string;
  publishdate: string;
  readingtime: number;
  relpermalink: string;
  section: string;
  summary: string;
  tags: string[];
  title: string;
  type: string;
  url: string;
  weight: number;
  wordcount: number;
};

export type FoundPageData = Pick<
  PageData,
  "objectID" | "title" | "type" | "relpermalink" | "summary"
>;

const STORED_FIELDS: Array<keyof FoundPageData> = [
  "title",
  "type",
  "relpermalink",
  "summary",
];

export type Store = ["title", "type", "relpermalink", "summary"];

export type Document = flexsearch.Document<PageData, Store>;

const fetchIndexFile = async () => {
  try {
    const response = await fetch("/algolia.json");
    if (!response.ok) throw new Error(response.statusText);
    return response;
  } catch (error: any) {
    throw new Error(
      "A problem happens while loading the search engine's json index:",
      error,
    );
  }
};

const OBJECT_ID: keyof FoundPageData = "objectID";

const initIndexFile = async () => {
  const response = await fetchIndexFile();
  const data: PageData[] = await response.json();
  const newFlexSearchIndex: Document = new flexsearch.Document({
    language: "en",
    document: {
      id: OBJECT_ID,
      index: [
        "description",
        "summary",
        "title",
        "keywoards",
        "tags",
        "section",
        "author",
      ],
      store: STORED_FIELDS,
    },
  });
  return data.reduce(
    (newFlexSearchIndex: Document, item) => newFlexSearchIndex.add(item),
    newFlexSearchIndex,
  );
};

function flattenResults(
  r: flexsearch.EnrichedDocumentSearchResultSetUnit<FoundPageData>[],
) {
  return r
    .reduce(
      (resultMap, { result: resultsForField }) =>
        resultsForField.reduce(
          (resultMap, result) =>
            resultMap.set(
              result.id as unknown as flexsearch.Id, // fix issue from flexsearch's type declaration
              result.doc,
            ),
          resultMap,
        ),
      OrderedMap<flexsearch.Id, FoundPageData>(),
    )
    .toOrderedSet()
    .toArray();
}

export async function flexSearch(q: string, limit: number) {
  const index = await getFlexIndex();
  const results = await index.searchAsync<true>(q, { limit, enrich: true });
  return flattenResults(results);
}

export function initFlexSearchIndex() {
  getFlexIndex();
}

let index: Document | null = null;

async function getFlexIndex() {
  if (index !== null) return index;
  index = await initIndexFile();
  return index;
}
