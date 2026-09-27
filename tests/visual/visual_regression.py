"""Visual regression checks for the English, Hebrew and Arabic pages.

Usage:
  python3 tests/visual/visual_regression.py            # compare against baseline
  python3 tests/visual/visual_regression.py --update   # record a new baseline

Checks per locale: document direction/lang, component order, element geometry
(position/size within tolerance), text alignment/direction, and a pixel diff of
the first viewport. Also checks cross-locale invariants: identical section order
and correct mirroring of the header for RTL locales.
"""
import asyncio, json, sys
from pathlib import Path
from PIL import Image, ImageChops
from playwright.async_api import async_playwright

URL = "http://localhost:8080/"
HERE = Path(__file__).parent
BASE = HERE / "baseline"
OUT = HERE / "output"
LOCALES = {"en": "ltr", "ar": "rtl", "he": "rtl"}
VIEWPORTS = {"desktop": (1280, 1800), "mobile": (390, 844)}
TOL_PX = 4
MAX_PIXEL_DIFF = 0.01  # 1% of pixels

PROBE = """() => {
  const pick = (sel) => [...document.querySelectorAll(sel)];
  const box = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height),
             align: cs.textAlign, dir: cs.direction }; };
  const els = {};
  const add = (key, el) => { if (el) els[key] = box(el); };
  add("header.logo", document.querySelector('header button[aria-label="Simply Well Executed home"]'));
  add("header.lang", document.querySelector('header [aria-label="Language"]'));
  add("h1", document.querySelector("h1"));
  pick("main > section").forEach((s) => { add("section#" + s.id, s); add("h2#" + s.id, s.querySelector("h2")); });
  return {
    dir: document.documentElement.dir, lang: document.documentElement.lang,
    sections: pick("main > section").map((s) => s.id),
    headerOrder: pick("header > div > *").map((e) => e.tagName + (e.getAttribute("aria-label") ? ":" + e.getAttribute("aria-label") : "")),
    scrollWidth: document.documentElement.scrollWidth, innerWidth,
    els,
  };
}"""

async def capture(page, locale, vp):
    await page.goto(URL, wait_until="networkidle")
    await page.evaluate(f"localStorage.setItem('swe-locale','{locale}')")
    await page.goto(URL, wait_until="networkidle")
    await page.wait_for_function(f"document.documentElement.lang === '{locale}'")
    await page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important}")
    await page.evaluate("document.fonts.ready")
    await page.wait_for_timeout(300)
    OUT.mkdir(parents=True, exist_ok=True)
    shot = OUT / f"{locale}-{vp}.png"
    await page.screenshot(path=str(shot))
    return await page.evaluate(PROBE), shot

def compare(name, cur, base, errors):
    for k in ("dir", "lang", "sections", "headerOrder"):
        if cur[k] != base[k]:
            errors.append(f"{name}: {k} changed {base[k]} -> {cur[k]}")
    for key, b in base["els"].items():
        c = cur["els"].get(key)
        if not c:
            errors.append(f"{name}: {key} missing"); continue
        for d in ("x", "y", "w", "h"):
            if abs(c[d] - b[d]) > TOL_PX:
                errors.append(f"{name}: {key}.{d} {b[d]} -> {c[d]}")
        for d in ("align", "dir"):
            if c[d] != b[d]:
                errors.append(f"{name}: {key}.{d} {b[d]} -> {c[d]}")

def pixel_diff(a, b):
    ia, ib = Image.open(a).convert("RGB"), Image.open(b).convert("RGB")
    if ia.size != ib.size: return 1.0
    diff = ImageChops.difference(ia, ib).convert("L").point(lambda p: 255 if p > 24 else 0)
    return sum(1 for p in diff.getdata() if p) / (ia.size[0] * ia.size[1])

async def main():
    update = "--update" in sys.argv
    errors, results = [], {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for vp, (w, h) in VIEWPORTS.items():
            for loc, expected_dir in LOCALES.items():
                ctx = await browser.new_context(viewport={"width": w, "height": h})
                page = await ctx.new_page()
                data, shot = await capture(page, loc, vp)
                await ctx.close()
                name = f"{loc}-{vp}"
                results[name] = data
                # invariants
                if data["dir"] != expected_dir: errors.append(f"{name}: dir is {data['dir']}, expected {expected_dir}")
                if data["scrollWidth"] > data["innerWidth"]: errors.append(f"{name}: horizontal overflow")
                logo = data["els"].get("header.logo")
                if logo:
                    right_side = logo["x"] > w / 2
                    if right_side != (expected_dir == "rtl"): errors.append(f"{name}: logo on wrong side for {expected_dir}")
                bfile = BASE / f"{name}.json"
                if update:
                    BASE.mkdir(parents=True, exist_ok=True)
                    bfile.write_text(json.dumps(data, indent=1))
                    (BASE / f"{name}.png").write_bytes(shot.read_bytes())
                elif bfile.exists():
                    compare(name, data, json.loads(bfile.read_text()), errors)
                    ratio = pixel_diff(shot, BASE / f"{name}.png")
                    if ratio > MAX_PIXEL_DIFF: errors.append(f"{name}: {ratio:.2%} of first-viewport pixels changed")
                else:
                    errors.append(f"{name}: no baseline — run with --update")
            order = {results[f"{l}-{vp}"]["sections"].__str__() for l in LOCALES}
            if len(order) != 1: errors.append(f"{vp}: section order differs between locales")
        await browser.close()
    if update: print("Baseline updated for", ", ".join(results)); return
    if errors:
        print("VISUAL REGRESSION FAILED"); [print(" -", e) for e in errors]; sys.exit(1)
    print(f"Visual regression passed: {len(results)} snapshots")

asyncio.run(main())
