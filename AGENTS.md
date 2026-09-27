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
- Minzazaazazaminzazazaza delivery (16 pieces a111…b222, sixteen ROTn rolls; falls back to MINZAZAZAMINZAZAZA under 16 chars) now wraps MINZAZAZAMINZAZAZA delivery (eighths a11…b22, eight ROTn rolls; falls back to MINZAZAMINZAZA under 8 chars) now wraps MINZAZAMINZAZA delivery (quarters a1/a2/b1/b2, four ROTn rolls; falls back to MINZAMINZA under 4 chars) now wraps MINZAMINZA delivery (plaintext split A/B, each ROTnA/ROTnB with nA,nB rolled 1–13 from a Date.now()-seeded PRNG; supersedes MINAMINA/MINMIN on the site) lives in `src/server.ts` (not request middleware, whose `next()` isn't a Response): known crawler user-agents get plain SSR HTML, everyone else gets `<main>` as a ROT13+CRC13 packet decoded inline; always send `Vary: User-Agent` so caches keep the versions apart.
- App email sending is removed (owner request); project emails are disabled — do not re-scaffold email templates unless asked.
