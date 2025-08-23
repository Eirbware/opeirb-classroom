import lodash from "lodash";

export function getCourseIdFromURL(url: string) {
  const paths = url.split("/");
  const url_slug_idx = paths.findIndex((v) => v === "courses") + 1;
  return paths[url_slug_idx];
}

/** Returns whether an object is isEmpty
  */
export function isNotEmpty<T>(obj: {} | T): obj is T {
  return !lodash.isEmpty(obj);
}
type NullToUndefined<T> = {
    [P in keyof T]: Exclude<T[P], null> | undefined;
};
export function nullablePropertiesToOptional<T extends { [key: string]: any }>(obj: T): NullToUndefined<T> {
    const result = {} as NullToUndefined<T>;
    for (const key in obj) {
        if (obj[key] === null) {
            result[key] = undefined;
        } else {
            result[key] = obj[key] as any;
        }
    }
    return result;
}
