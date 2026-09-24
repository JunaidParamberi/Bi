import { useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

type KeyMap = Partial<Record<string, () => void>>;

// Typing in a field must never trigger page shortcuts
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) return !['range', 'checkbox', 'radio', 'button'].includes(target.type);
  return target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

// Page-level shortcuts, keyed by KeyboardEvent.key. Keys already handled by a focused widget
// (e.g. the video player seeking on arrows) arrive prevented and are left alone.
export function useKeyboard(keys: KeyMap, enabled = true) {
  // latest handlers without re-subscribing on every render
  const keysRef = useRef(keys);
  keysRef.current = keys;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isEditable(e.target)) return;
      const handler = keysRef.current[e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}

// Roving focus for a horizontal row of buttons (the media sliders): arrows move between items,
// Home/End jump to the ends, and the focused item is scrolled into view
export function handleRowKeys(e: ReactKeyboardEvent<HTMLElement>) {
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[data-row-item]'));
  const current = items.indexOf(document.activeElement as HTMLElement);
  if (current === -1) return;
  const next = {
    ArrowRight: Math.min(current + 1, items.length - 1),
    ArrowLeft: Math.max(current - 1, 0),
    Home: 0,
    End: items.length - 1,
  }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  items[next].focus();
  items[next].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
}
