import { useEffect, useRef, useState } from 'react';
import { useKeyboard } from './useKeyboard';

// State, navigation, keyboard shortcuts and focus handling for a full-screen media viewer.
// ←/→ step through the media, Home/End jump to the ends, Escape closes. Focus moves into the
// viewer when it opens and back to the matching thumbnail when it closes.
export function useLightbox(length: number) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLElement | null)[]>([]);
  const lastViewed = useRef<number | null>(null);
  const isOpen = index !== null;

  const goTo = (target: number) => {
    if (index === null || target < 0 || target >= length || target === index) return;
    setDirection(target > index ? 'left' : 'right');
    setIndex(target);
  };

  const open = (target: number) => {
    // no slide direction on open, so the first item arrives with the viewer instead of sliding in
    setDirection(null);
    setIndex(target);
  };
  const close = () => setIndex(null);
  const prev = () => index !== null && goTo(index - 1);
  const next = () => index !== null && goTo(index + 1);

  if (index !== null) lastViewed.current = index;

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
      return;
    }
    if (lastViewed.current === null) return;
    const thumb = thumbs.current[lastViewed.current];
    thumb?.focus({ preventScroll: true });
    thumb?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    lastViewed.current = null;
  }, [isOpen]);

  useKeyboard(
    {
      ArrowLeft: prev,
      ArrowRight: next,
      Home: () => goTo(0),
      End: () => goTo(length - 1),
      Escape: close,
    },
    isOpen
  );

  // ref callback for the slider thumbnail at position i
  const thumbRef = (i: number) => (el: HTMLElement | null) => {
    thumbs.current[i] = el;
  };

  return { index, direction, open, close, prev, next, dialogRef, thumbRef };
}
