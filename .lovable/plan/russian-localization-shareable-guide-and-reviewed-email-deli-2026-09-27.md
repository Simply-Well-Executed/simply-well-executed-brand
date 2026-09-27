# Russian localization, shareable guide, and reviewed email delivery

## Build
- Add a dedicated Russian page at `/ru` using the same shared standards library, with natural Russian copy for every visible section, search/filter state, demo form, and sample-sequence control.
- Extend the language switcher to English, Arabic, Hebrew, and Russian. Keep Arabic and Hebrew genuinely RTL; Russian remains LTR.
- Give the Russian page a restrained editorial treatment inspired by the public, formal typographic hierarchy of kremlin.ru—serif-led headings, compact utility text, disciplined rules and spacing—while preserving the Simply Well Executed identity, palette, and original layout.
- Add Russian to AI sequence generation so both interface labels and generated email headings, subjects, and bodies are written natively in Russian.
- Keep mixed-direction identifiers isolated and preserve the existing locale behavior for Arabic and Hebrew.

## Email delivery
- Keep generation and sending as two explicit actions: generate and review the three-email sample, enter a recipient inbox, then confirm one delivery containing the complete reviewed sample.
- Add localized recipient, confirmation, progress, success, suppression, and rate-limit states.
- Use the managed email service with idempotent server-side sending; do not create a queue, email database, or automated drip campaign.
- Sending remains unavailable until a real sender domain owned by the user is configured. Once configured, scaffold the branded template and finish the send action without changing the review-first flow.

## Brand guide
- Confirm and, if needed, regenerate the downloadable three-page guide to match the site’s paper-grid layout and use FreeSerif, FreeSans, and FreeMono throughout.
- Verify the PDF file, download link, page count, embedded font usage, and rendered appearance.

## Verification
- Extend automated visual checks to `/ru` on desktop and mobile while retaining English, Arabic, and Hebrew checks.
- Verify language switching, page direction, translated controls, Russian sequence generation, no overflow, the guide download, and a clean build.
- After sender-domain setup, send one test sample and confirm the recorded delivery outcome.
