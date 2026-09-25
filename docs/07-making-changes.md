# 7. Making code changes — recipes

## Setup

```bash
git clone <repo-url> && cd <repo>
nvm install && nvm use       # Node 24 (.nvmrc)
npm install
npm run dev                  # http://localhost:5173 — edits reload instantly
```

Recommended editor: **VS Code** with the *Tailwind CSS IntelliSense* extension.

Before every commit: **`npm run build`** (type-check + build). There are no automated tests and no lint script; check changes visually in the browser, ideally at 1920×1080 **and** 3840×2160 (Chrome DevTools → device toolbar → Responsive, zoom **100 %** — "Fit to window" shrinks lines/text and misleads).

---

## Recipes

### Change text that is not in content.json
See the table in the [content guide](03-content-guide.md#other-text-that-is-in-code-not-in-contentjson). Search for the sentence, edit, build.

### Update the disclaimer date
`src/pages/MapPage.tsx` → search `updated as of`.

### Move a map pin
`src/components/Map.tsx` → `markers` → change `top`/`left` (% of the map image). The pin's *center* sits at that point.

### Add a country
[Content guide → Add a new country](03-content-guide.md#add-a-new-country) (JSON entry + pin).

### Change colours
Update both `tailwind.config.js` → `colors` and `src/App.css` → `:root` variables. Search for the old hex value to catch literals.

### Change the particle background
`src/components/ParticlesBackground.tsx`: `number.value` (count), `move.speed`, `size.value`, `opacity.value`, colour in `paint.fill.color.value` (tsParticles v4 — the older `particles.color` key is ignored).

### Tune an animation
Find it in the [animation catalogue](06-ui-design-system.md#animation-catalogue) and change `duration`, `delay`, `ease`, or spring `stiffness`/`damping`.
Examples:
- Pin hover size: `whileHover` in `Map.tsx`.
- Pin entrance speed: `PIN_STAGGER` in `Map.tsx`.
- Tab highlight springiness: `transition` on the `activeArticleTab` span in `CountryPage.tsx`.

### Change the map country card width
`Map.tsx` → the card's class `min-w-[13cqw] max-w-[19cqw]`.

### Add a new page
1. Create `src/pages/MyPage.tsx` (copy `MoreStories.tsx` as a template; size with `cqw/cqh`).
2. In `src/App.tsx`:
   - add `const loadMyPage = () => import('./pages/MyPage');` and `const MyPage = lazy(loadMyPage);`
   - add `loadMyPage` to the **prefetch** array in the `useEffect`
   - add `<Route path='my-page' element={<MyPage />} />` inside the layout route
3. The layout reports the page as ready automatically (startup screen). Only a page that must wait for something heavy (like the globe) calls `bootReady('page')` itself.
4. Link to it with `<Link to="/my-page">` or add a navbar item in `Navbar.tsx` (`<NavItem to="/my-page" icon={…} alt="…" />`).

### Add a pop-up / card that must stay on screen
Use `useFitInViewport` ([details](06-ui-design-system.md#pop-ups-stay-on-screen)); animate with `AnimatePresence` so it also animates out.

### Make the site visible to search engines
Remove the `X-Robots-Tag` line in `public/_headers`.

### Change the media host
Update `VITE_MEDIA_BASE_URL` in `.env`, rebuild, deploy. All keys stay the same as long as the new host serves the same bucket.

### Upgrade dependencies
```bash
npm outdated
npm install <pkg>@latest
npm run build   # then test every page
```
Watch for breaking changes in major versions — e.g. tsParticles 4 renamed particle colour (`paint.fill`), React 19 changed `useRef` typing, Tailwind 4 moved config to CSS.

---

## Code conventions

- **Content never in components** — text and media belong in `content.json` unless it's UI chrome.
- **Sizing:** `cqw`/`cqh` and `--line-*` tokens (see [UI & design system](06-ui-design-system.md)).
- **Pages are lazy-loaded**; keep heavy libraries (globe, map) inside their page.
- `GenerelLeyout` is misspelled on purpose — don't rename imports.
- Comments explain *why* (non-obvious decisions), not what.
- Commit messages: `content: …`, `feat: …`, `fix: …`, `style: …`, `chore: …`.

## Pre-merge checklist

- [ ] `npm run build` passes
- [ ] Checked the changed pages at 1920×1080 and 3840×2160 (and one odd shape, e.g. 1600×740)
- [ ] Map card, tabs, lightbox, team pop-ups still work
- [ ] No `vw`/`vh` introduced (search the diff)
- [ ] PR `dev → main` merged; Cloudflare deployment *Success*; live site hard-refreshed
