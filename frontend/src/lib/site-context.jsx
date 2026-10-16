import { createContext, useContext } from "react";

export const SiteContext = createContext(null);

// Site-wide company details and editable page content (loaded once in App.jsx).
export function useSite() {
  const data = useContext(SiteContext);
  const c = (key) => data.content[key] ?? "";
  const img = (key, fallback) =>
    data.content[key] && data.content[key] !== "" && !data.content[key].startsWith("__")
      ? data.content[key]
      : fallback;
  return { company: data.company, c, img };
}
