<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all application data access behind `src/services` interfaces — they call the Laravel API in `../backend` through `src/lib/api.ts` (base URL from `VITE_API_URL`). Supabase has been removed.
- Routing uses react-router-dom (see `src/App.jsx`); each page lives in `src/pages`.

- Public page text/images are DB-driven: field definitions in src/content/fields.ts (defaults) with overrides in site_content; read through src/services/contentService.ts and the root loader (useSite). Why: admin edits must reflect on the site without code changes.
- Images are uploaded to the Laravel API (`POST /api/admin/media`) and served from `GET /api/media/*`.
