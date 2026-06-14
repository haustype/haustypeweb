import { siteFgColor } from './fontdue-theme';

function sliderHandleCss() {
  const fg = siteFgColor();
  return `
  .type-tester__slider__handle,
  .type-tester__slider__handle:hover,
  .type-tester__slider__handle:active,
  .type-tester__slider__handle:focus {
    background-color: ${fg} !important;
    border-color: ${fg} !important;
    transition: none !important;
  }
`;
}

function patchShadowRoot(root: ShadowRoot) {
  const id = 'haus-slider-handle-patch';
  let style = root.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    root.appendChild(style);
  }
  style.textContent = sliderHandleCss();
}

function walkShadowRoots(node: Element | ShadowRoot) {
  if (node instanceof Element && node.shadowRoot) {
    patchShadowRoot(node.shadowRoot);
    walkShadowRoots(node.shadowRoot);
  }

  const children =
    node instanceof ShadowRoot
      ? node.children
      : node instanceof Element
        ? node.children
        : [];

  for (const child of children) {
    walkShadowRoots(child as Element);
  }

  if (node instanceof Element) {
    node.querySelectorAll('*').forEach((child) => {
      if (child.shadowRoot) walkShadowRoots(child);
    });
  }
}

let observerStarted = false;

export function initTypeTesterStyles() {
  const patchAll = () => {
    document.querySelectorAll('fontdue-type-testers').forEach((host) => walkShadowRoots(host));
  };

  patchAll();
  for (const delay of [100, 500, 1500, 3000]) {
    setTimeout(patchAll, delay);
  }

  document.documentElement.addEventListener('site-bg-change', patchAll);

  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(patchAll);
  observer.observe(document.body, { childList: true, subtree: true });
}
