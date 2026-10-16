import { useEffect } from "react";

// Sets the document title and meta description for the current page.
export function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    const set = (name, content) => {
      let el = document.head.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    if (description) set("description", description);
    set("robots", noindex ? "noindex,nofollow" : "index,follow");
  }, [title, description, noindex]);
}
