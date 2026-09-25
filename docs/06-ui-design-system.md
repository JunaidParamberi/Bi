# 6. UI & design system

## Brand tokens

| Token | Value | Tailwind class | CSS variable |
|---|---|---|---|
| Accent green | `#00e47c` | `text-accent-green`, `bg-accent-green`, `border-accent-green` | `var(--Accent-Green)` |
| Dark green (background) | `#08312a` | `bg-dark-green`, `text-dark-green` | `var(--Dark-Green)` |
| Warm grey | `#e5e3de` | `…-warm-gray` | `var(--Warm-Gray)` |
| Light grey | `#f6f5f3` | `…-light-gray` | `var(--Light_Gray)` |

Colours are defined twice and must be changed in both places: `tailwind.config.js` (`theme.extend.colors`) and `src/App.css` (`:root` variables). A few literal hex values (e.g. `#00cc66` glows, `#00e47d82` particles) are in `App.css` and component files — search the hex code to find them.

**Fonts:** *Boehringer Forward Head* (default for all text) and *Boehringer Forward Text*, regular/medium/bold/italic, in `src/fonts/` and declared in `src/App.css` (`@font-face`). These are Boehringer Ingelheim brand fonts — licensed to the client.

**Imagery:** background `src/assets/images/main-bg.webp`, map `map-1920.webp` / `map-3826.webp` (same artwork, 1× and 2×), pin `Pin.svg`, globe texture `globe-bg.webp`, logo `src/assets/icons/Logo_Accent Green.svg`.

## Screen scaling (the 16:9 stage)

The screen is designed as one **16:9 canvas** (reference width 1920 px). To make it look identical on every display:

1. `App.tsx` renders all pages inside **`<div className="app-stage">`**.
2. `.app-stage` (in `App.css`) is the largest 16:9 box that fits the window and is a CSS **size container**:
   ```css
   width:  min(100vw, calc(100vh * 16 / 9));
   height: min(100vh, calc(100vw * 9 / 16));
   container-type: size;
   ```
3. All sizes inside use **container units**: `cqw` = 1 % of the stage width, `cqh` = 1 % of the stage height. For example `text-[1cqw]` is 19.2 px on a 1920-wide stage and 38.4 px on 4K.
4. Wider screens (ultra-wide, browser with toolbars) or taller ones (16:10, 5:4) simply show the background around the stage. Nothing is cropped or overlapped.

**Rule for new code:** size things with `cqw`/`cqh` (e.g. `w-[20cqw]`, `text-[0.9cqw]`, `h-[57cqh]`), never `vw`/`vh`. Percentages of a parent are fine. Only the page shell (`body`, `.app`), native full-screen video and the startup screen use real `vw/vh`.

### Line widths scale too
Borders and outlines use width tokens defined on the stage, so they keep their visual weight on 4K:

| Token | 1920-wide | 3840-wide | Use |
|---|---|---|---|
| `--line-hair` | 1 px | 2 px | thin card/box borders — class `border-(length:--line-hair)` |
| `--line-1` | 1 px | 2 px | standard borders — `border-(length:--line-1)` |
| `--line-2` | 2 px | 4 px | navbar outline & active ring, lightbox frame — `border-(length:--line-2)` |
| `--line-3` | 3 px | 6 px | focus outline on thumbnails |

Use these instead of `border`, `border-2`, `border-[0.5px]` in new code.

### Big-screen (`xl`) variants
`tailwind.config.js` sets custom breakpoints: `md` 901 px, `lg` 1024 px, **`xl` 3040 px** (4K). Some older components use `xl:` for larger fixed sizes on 4K screens (e.g. `xl:text-[100px]`). Prefer `cqw` sizing for new work — it scales automatically.

## Layout frame

`src/components/GenerelLeyout.tsx` wraps every page: the page area (`h-[90cqh]`), the **navbar** centred at the bottom, and the **BI logo** bottom-right (hidden on the globe page).

## Animation catalogue

All animations use Framer Motion unless noted. The shared "smooth" easing is `[0.22, 1, 0.36, 1]`.

| Where | What | File |
|---|---|---|
| Page change | fade/slide in per page | each page's root `motion.div` |
| Navbar | active ring glides between icons (`layoutId="navActiveRing"`); spinning gradient outline (CSS `animate-border-spin`) | `Navbar.tsx`, `App.css` |
| Map pins | drop in west→east with spring; individual float; soft radial pulse wave; selected pin grows & glows, others dim | `Map.tsx` (`PIN_START`, `PIN_STAGGER`, `PING_EVERY`) |
| Country card (map) | scale + blur in from the pin corner, lines stagger; reverse on close | `Map.tsx` (`cardVariants`) |
| IMETA modal | backdrop blur-in, panel rises from blur, heading/line/text stagger, close button spins in | `MapPage.tsx` (`modalPanel`…) |
| Country tabs | sliding highlight (`layoutId="activeArticleTab"`), size easing, dividers between inactive tabs | `CountryPage.tsx` |
| Country content | cover crossfade, text fade/slide, media thumbnails stagger in, text box height animates | `CountryPage.tsx` |
| Lightbox | backdrop blur-in, media rises from blur, slide between items, close button spins | `CountryPage.tsx`, `StoryPage.tsx` |
| Team pop-up | scale + blur in, lines stagger | `TeamPage.tsx` |
| Read More links | underline draws in + glow on hover (CSS `.read-more`) | `App.css` |
| Background | floating green particles (tsParticles) | `ParticlesBackground.tsx` |
| Globe | auto-rotate + radar waves (CSS `.pulse`) | `GlobePage.tsx`, `RadarWave.tsx` |
| Loading | BI mark fills with light + ring; photos shimmer then fade in | `BrandLoader.tsx`, `index.html`, `SmartImage.tsx` |

Tuning: durations/delays are the `transition` values next to each animation. Hover sizes for pins are `whileHover` in `Map.tsx`.

## Pop-ups stay on screen

`src/hooks/useFitInViewport.ts` measures a pop-up before it is painted and:
- **flips** it to the left/above its anchor when there is no room on the right/below (map card), then
- **nudges** it so it stays inside the stage (or a given panel, e.g. the team panel) and above the navbar.

Use it for any new pop-up: put the hook's ref on an **un-animated** wrapper and animate a child.

## Native-app behaviour

- No text selection (`user-select: none` on `html`; inputs excepted), no image/link dragging, no long-press callout, no tap highlight — `App.css` (`@layer base`).
- Right-click menu and drag-start blocked — `src/main.tsx`.

To allow selecting some text (e.g. an email), add the class `select-text` to that element.

## Keyboard & accessibility

- Lightbox: ←/→, Home/End, Esc; focus moves into the viewer and back to the thumbnail on close (`useLightbox.ts`).
- Media rows: ←/→/Home/End between thumbnails (`handleRowKeys` in `useKeyboard.ts`).
- Esc closes the IMETA modal and team pop-ups.
- Buttons have `aria-label`s; reduced-motion users get a calmer startup animation.

## Media display rules

- Rows use `thumb.webp`; the lightbox uses `full.webp`.
- The lightbox frame always matches the media's aspect ratio (height ≤ 95 % of the area and ≤ 90 % of stage width) — nothing is cropped. Videos use `object-contain`.
- Video player (`BrandVideoPlayer.tsx`): HLS via hls.js (native on Safari), branded controls, quality menu (when a 720p level exists), full screen, keyboard seeking.
