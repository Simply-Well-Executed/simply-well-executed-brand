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

- The brand website is a single-page, searchable standards library with anchored topic sections; this keeps marketing and operating guidance in one public reference surface.
- Brand downloads are generated static files served from `public/downloads`; this keeps user-facing resources reliable without a backend.

- English `/`, Arabic `/ar`, Hebrew `/he`, and Russian `/ru` share one standards-page component and locale dictionary; dedicated URLs keep localization crawlable while logical CSS and isolated mixed-direction fragments preserve natural RTL.
- Russian uses a FreeSerif-led editorial reading treatment within the shared brand system; this creates a formal typographic cadence without copying another site's identity.
- Release gate: `bun run gate:release` runs one wording gate per language in parallel (`tests/i18n/wording-gate.ts <locale>`) and must pass before any publish; per-language gates keep runtime short and failures isolated.
