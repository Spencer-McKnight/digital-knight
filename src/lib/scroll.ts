const SCROLL_BUFFER = 16;

function getNavOffset(): number {
  const nav = document.querySelector('nav[aria-label="Primary"]');
  return nav ? nav.getBoundingClientRect().height + SCROLL_BUFFER : SCROLL_BUFFER;
}

export function scrollToElement(
  el: Element,
  behavior: ScrollBehavior = 'smooth',
) {
  const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
}
