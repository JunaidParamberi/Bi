# 1. Project overview

The SD4G IMETA Interactive Screen is a presentation app for large screens. Visitors explore Boehringer Ingelheim's sustainability projects by country, read stories, watch videos and meet the team. It behaves like a native app: no text selection, no image dragging, no right-click menu, smooth animations throughout.

## Screens

The bottom **navbar** is on every screen: ‹ back · **More Stories** · **Globe** (home) · **Map** · forward ›. The glowing ring marks the current section and glides between icons.

### Globe (home) — `/`
A rotating 3D globe with radar waves and a "Click to Explore" hint. Clicking anywhere opens the map.
*File:* `src/pages/GlobePage.tsx`

### Map — `/world`
The IMETA map with a pin per country.
- Pins drop in one by one (west → east), float, and pulse softly.
- Clicking a pin opens a **country card** listing that country's articles with a **Read More** link. The card always stays on screen (opens upward/left when needed) and closes when clicking elsewhere.
- Left column: the **IMETA** intro card (Read More opens a larger modal), a disclaimer with the data date, and buttons to **More Stories** and the **SD4G IMETA Team**.

*Files:* `src/pages/MapPage.tsx`, `src/components/Map.tsx`

### Country page — `/world/<Country>` (e.g. `/world/South%20Africa`)
- Large cover photo on the left.
- **Tabs**, one per article. Switching tabs animates the highlight, cover, text and media.
- Article text (plus optional bullet lists and sub-sections).
- A horizontal **media row** of videos and photos. Clicking one opens the **lightbox** (full-screen viewer) with previous/next arrows, keyboard control and a close button; clicking the dark background also closes it.

*File:* `src/pages/CountryPage.tsx`

### More Stories — `/more`
Cards for region-wide stories (e.g. *Volunteering Activities*, *Making More Health*), each with cover, summary and Read More.
*Files:* `src/pages/MoreStories.tsx`, `src/components/StoryCard.tsx`

### Story page — `/more/<Story title>`
Same idea as a country page for one story: cover, text/lists, media row and lightbox.
*File:* `src/pages/StoryPage.tsx`

### Team — `/team`
Leadership at the top, then the **IMETA Core Team** and **OPU Champions**. Clicking a person shows a pop-up with their full title (always kept inside the panel).
*File:* `src/pages/TeamPage.tsx`

## Interaction reference

| Action | Result |
|---|---|
| Click pin | Open country card · click elsewhere or another pin to close/switch |
| Click Read More | Country page / IMETA modal / story page |
| Click photo or video | Lightbox opens |
| Lightbox: ← / → | Previous / next item |
| Lightbox: Home / End | First / last item |
| Esc | Close lightbox, IMETA modal or team pop-up |
| Media row: ← / → when focused | Move between thumbnails |
| Video: click / double-click | Play-pause / full screen |

## Screen sizes

The layout is designed for 16:9 and scales as one piece to any screen (1080p, 1440p, 4K, ultra-wide, 16:10, 5:4). On screens that are wider or taller than 16:9 the background fills the extra space; nothing is cropped or overlapped. Details: [UI & design system](06-ui-design-system.md#screen-scaling-the-169-stage).

## Loading behaviour

A branded startup screen (the BI mark filling with light) shows until fonts, the background and the first page are ready (max 15 s). Pages are loaded on demand and the rest are pre-fetched in the background so navigation is instant. Photos show a shimmer until loaded; videos stream adaptively (HLS).
