import flexsearch from "flexsearch";
import { OrderedMap } from "immutable";
import { sum } from "lodash";

const FLEXSEARCH_INDEX_PATH = "/flexsearch.json";

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
    const response = await fetch(FLEXSEARCH_INDEX_PATH);
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

/** Extract snippets from a content
  */
function highlightTermsInSummary(summary: string, term: string) {
  const matchIndices: number[] = [];
  for (const r of summary.matchAll(new RegExp(term, "gi")))
    matchIndices.push(r.index);
  const mergedSnippets: string[] = [];
  let cursor: number = 0;
  const PADDING = 30;
  const MAX_SNIPPET_NUMBER = 5;
  let snippet_number = 0;
  for (let i = 0; i < matchIndices.length; ++i) {
    const matchIndex = matchIndices[i];
    const nextMatchIndex = i < matchIndices.length - 1 ? matchIndices[i+1] : summary.length;
    const left_start = Math.max(matchIndex - PADDING, cursor);
    const left_end = matchIndex;
    const right_start = matchIndex + term.length;
    const right_end = Math.min(right_start + PADDING, nextMatchIndex);
    if (cursor !== left_start) ++snippet_number;
    mergedSnippets.push(cursor === left_start ? "" : " <i>(...)</i> ", summary.slice(left_start, left_end), `<mark class="high">${term}</mark>`, summary.slice(right_start, right_end));
    cursor = right_end;
    if (snippet_number >= MAX_SNIPPET_NUMBER) break;
  }
  if (cursor < summary.length) mergedSnippets.push(" <i>(...)</i>");
  return mergedSnippets.join("");
}

function transformDoc(doc: FoundPageData, term: string): FoundPageData {
  const { summary, ...leftData } = doc;
  return ({ summary: highlightTermsInSummary(summary, term), ...leftData });
}

function flattenResults(
  r: flexsearch.EnrichedDocumentSearchResultSetUnit<FoundPageData>[],
  term: string,
) {
  return r
    .reduce(
      (resultMap, { result: resultsForField }) =>
        resultsForField.reduce(
          (resultMap, result) =>
            resultMap.set(
              result.id as unknown as flexsearch.Id, // fix issue from flexsearch's type declaration
              transformDoc(result.doc, term),
            ),
          resultMap,
        ),
      OrderedMap<flexsearch.Id, FoundPageData>(),
    )
    .toOrderedSet()
    .toArray().slice(0, 7);
}

export async function flexSearch(q: string, limit: number) {
  const index = await getFlexIndex();
  const results = await index.searchAsync<true>(q, { limit, enrich: true });
  return flattenResults(results, q);
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
