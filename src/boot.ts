// Controls the startup screen from index.html: it stays until the first screen is fully ready
// (fonts, background image, first page incl. the globe), then fades out.
type BootPart = 'fonts' | 'background' | 'page';

// Keeps the screen up long enough not to flash on fast connections
const MIN_VISIBLE_MS = 600;
// Never leave people stuck on the startup screen, whatever fails to load
const MAX_WAIT_MS = 15000;

const pending = new Set<BootPart>(['fonts', 'background', 'page']);
let hidden = false;

function hide() {
  if (hidden) return;
  hidden = true;
  const el = document.getElementById('boot-loader');
  if (!el) return;
  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  setTimeout(() => {
    el.classList.add('boot-loader--done');
    const remove = () => el.remove();
    el.addEventListener('transitionend', remove, { once: true });
    // fallback in case transitionend never fires (reduced motion, hidden tab)
    setTimeout(remove, 1000);
  }, wait);
}

export function bootReady(part: BootPart) {
  pending.delete(part);
  if (pending.size === 0) hide();
}

export function startBoot() {
  // Request the brand weights up front: fonts.ready alone resolves early when nothing has asked for them yet
  const fonts = ['400 1em BoehringerForwardHead', '700 1em BoehringerForwardHead'].map((f) => document.fonts.load(f));
  Promise.all(fonts).then(() => bootReady('fonts'), () => bootReady('fonts'));
  setTimeout(hide, MAX_WAIT_MS);
}
