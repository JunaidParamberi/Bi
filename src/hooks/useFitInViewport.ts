import { RefObject, useLayoutEffect, useState } from 'react';

const MARGIN = 16;

// x/y: translate that keeps the popup on screen. flipX/flipY: moved to the left of / above its anchor,
// so it should grow out of that corner.
export type Fit = { x: number; y: number; flipX: boolean; flipY: boolean };

type Options = {
  // Popup sits `gap` px right of and below its anchor; without room there it opens to the left and/or
  // above instead, at the same distance, so a corner always stays on the anchor.
  flipGap?: number;
  // Keep the popup inside this element (e.g. a panel with overflow hidden) instead of the viewport
  within?: RefObject<HTMLElement | null>;
};

// Popups must stay above the bottom of the viewport or the floating navbar, whichever is higher
function viewportBounds() {
  const nav = document.querySelector('[data-app-navbar]');
  const navTop = nav ? nav.getBoundingClientRect().top : Infinity;
  return { top: MARGIN, left: MARGIN, right: window.innerWidth - MARGIN, bottom: Math.min(window.innerHeight, navTop) - MARGIN };
}

// Measures an absolutely positioned popup at its preferred spot and returns how to shift it to stay
// fully visible. Runs before paint, so it never flashes off screen. The measured element must not be
// the one being scaled/animated, or its rect is off mid-animation.
export function useFitInViewport(ref: RefObject<HTMLElement | null>, { flipGap, within }: Options = {}): Fit {
  const [fit, setFit] = useState<Fit>({ x: 0, y: 0, flipX: false, flipY: false });

  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      // Measure the preferred position with no offset applied; the DOM, not React state, is the
      // source of truth here (effects can run twice before a re-render lands)
      const prev = el.style.transform;
      el.style.transform = 'none';
      const r = el.getBoundingClientRect();
      el.style.transform = prev;

      const b = within?.current
        ? (() => {
            const w = within.current.getBoundingClientRect();
            return { top: w.top + MARGIN, left: w.left + MARGIN, right: w.right - MARGIN, bottom: w.bottom - MARGIN };
          })()
        : viewportBounds();

      let x = 0;
      let y = 0;
      let flipX = false;
      let flipY = false;
      if (flipGap !== undefined && r.right > b.right) {
        flipX = true;
        x = -(r.width + 2 * flipGap);
      }
      if (flipGap !== undefined && r.bottom > b.bottom) {
        flipY = true;
        y = -(r.height + 2 * flipGap);
      }
      // Nudge whatever still sticks out back inside
      if (r.right + x > b.right) x = b.right - r.right;
      if (r.left + x < b.left) x = b.left - r.left;
      if (r.bottom + y > b.bottom) y = b.bottom - r.bottom;
      if (r.top + y < b.top) y = b.top - r.top;

      setFit({ x, y, flipX, flipY });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref, flipGap, within]);

  return fit;
}
