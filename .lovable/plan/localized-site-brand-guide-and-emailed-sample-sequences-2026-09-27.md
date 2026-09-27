# Localized site, brand guide, and emailed sample sequences

## Build
- Replace the locale switcher’s single-page mutation with dedicated English (`/`), Arabic (`/ar`), and Hebrew (`/he`) pages sharing one page system and the GNU FreeFont family.
- Translate every visible section, library entry, standard, form state, validation message, resource label, and sequence control into natural Arabic and Hebrew.
- Use native RTL document direction on Arabic and Hebrew pages, logical layout properties, and Unicode isolation for mixed-direction fragments such as email addresses, revision numbers, product names, and generated output. Preserve the intended component order instead of reversing content arrays.
- Update visual regression coverage to visit all three URLs on desktop and mobile and check direction, component order, geometry, alignment, overflow, and screenshots.
- Rebuild the downloadable PDF brand guide to match the current paper-grid visual system and embed/use FreeSerif, FreeSans, and FreeMono throughout; inspect every rendered page.

## Email delivery
- Keep generation and sending as separate explicit actions: prospects review the generated three-email sample, enter their inbox, and confirm before one app email containing the full sample is sent. The app will not silently send three outreach messages or schedule a drip campaign.
- Scaffold the project’s managed app-email templates and wire the fixed sample-sequence template to server-side sending with idempotency and clear suppression/rate-limit handling.
- Sending remains blocked until a sender domain you own is configured and verified. All page, template, and trigger work can proceed before DNS verification.

## Verification
- Check the current AI request after the direction/localization changes, run the six visual checks, verify each localized form and route, render every PDF page to images for inspection, and confirm the app compiles cleanly.
