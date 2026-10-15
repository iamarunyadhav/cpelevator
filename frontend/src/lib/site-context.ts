import { getRouteApi } from "@tanstack/react-router";
const root = getRouteApi("__root__");

export function useSite() {
  const data = root.useLoaderData() as import("@/services/contentService").SiteBundle;
  const c = (key: string) => data.content[key] ?? "";
  const img = (key: string, fallback: string) => data.content[key] && data.content[key] !== "" && !data.content[key].startsWith("__") && data.content[key] !== fieldImageDefault(key) ? data.content[key] : fallback;
  return { company: data.company, c, img };
}
const fieldImageDefault = (_k: string) => "";
