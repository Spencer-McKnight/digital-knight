const SCROLL_BUFFER = 16;

function getNavOffset(): number {
  const nav = document.querySelector('nav[aria-label="Primary"]');
  return nav ? nav.getBoundingClientRect().height + SCROLL_BUFFER : SCROLL_BUFFER;
}

export function scrollToElement(
  el: Element,
  behavior: ScrollBehavior = 'smooth',
  durationMs?: number,
) {
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - getNavOffset());

  if (!durationMs) {
    window.scrollTo({ top: target, behavior });
    return;
  }

  const start = window.scrollY;
  const delta = target - start;
  const t0 = performance.now();

  function step(now: number) {
    const elapsed = Math.min((now - t0) / durationMs!, 1);
    const ease = elapsed < 0.5
      ? 4 * elapsed * elapsed * elapsed
      : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
    window.scrollTo(0, start + delta * ease);
    if (elapsed < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
