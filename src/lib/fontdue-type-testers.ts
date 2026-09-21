import { siteFgColor } from './fontdue-theme';
import { resolveTesterColumnGap } from './fontdue-type-tester-columns';

const TESTER_HOST_SELECTOR = 'fontdue-type-testers, fontdue-type-tester';
const CUSTOM_TESTER_SELECTOR = 'fontdue-type-tester[data-tester-columns]';

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

/**
 * Scope to the host only — a bare [data-contents] selector would leak into
 * every Fontdue tester on the page (and blank the large display ones).
 *
 * column-fill:balance so text spreads across columns when height is auto.
 */
function columnsCss(columns: string, gap: string) {
  return `
  fontdue-type-tester[data-tester-columns] .type-tester__text,
  fontdue-type-tester[data-tester-columns] .type-tester__text__container {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  fontdue-type-tester[data-tester-columns] .type-tester__text__container [data-contents="true"] {
    width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    column-count: ${columns} !important;
    column-width: auto !important;
    column-gap: ${gap} !important;
    column-fill: balance !important;
  }
`;
}

function ensureDocumentStyle(id: string, css: string) {
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

function ensureHostSliderStyle(host: Element) {
  let style = host.querySelector(
    ':scope > style#haus-slider-handle-patch',
  ) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'haus-slider-handle-patch';
    host.prepend(style);
  }
  const css = sliderHandleCss();
  if (style.textContent !== css) style.textContent = css;
}

function applyColumnsInline(host: HTMLElement, columns: string, gap: string) {
  host.style.setProperty('--type-tester--column-count', columns);
  host.style.setProperty('--type-tester--column-width', 'auto');
  host.style.setProperty('--type-tester--column-gap', gap);
  host.style.setProperty('--type-tester--content-width', '100%');

  host
    .querySelectorAll('.type-tester__text, .type-tester__text__container')
    .forEach((el) => {
      const node = el as HTMLElement;
      node.style.setProperty('width', '100%', 'important');
      node.style.setProperty('max-width', '100%', 'important');
      node.style.setProperty('box-sizing', 'border-box', 'important');
    });

  host
    .querySelectorAll('.type-tester__text__container [data-contents="true"]')
    .forEach((el) => {
      const node = el as HTMLElement;
      node.style.setProperty('width', '100%', 'important');
      node.style.setProperty('max-width', '100%', 'important');
      node.style.setProperty('margin-left', '0', 'important');
      node.style.setProperty('margin-right', '0', 'important');
      node.style.setProperty('column-count', columns, 'important');
      node.style.setProperty('column-width', 'auto', 'important');
      node.style.setProperty('column-gap', gap, 'important');
      node.style.setProperty('column-fill', 'balance', 'important');
    });
}

function clearLeakedHostStyles(host: Element) {
  // Remove old globally-leaking style tags left from earlier patches
  host
    .querySelectorAll(
      ':scope > style#haus-type-tester-columns-patch, :scope > style#haus-slider-handle-patch',
    )
    .forEach((el) => {
      if (el.id === 'haus-type-tester-columns-patch') el.remove();
    });
}

function patchAll() {
  document.querySelectorAll(TESTER_HOST_SELECTOR).forEach((host) => {
    clearLeakedHostStyles(host);
    ensureHostSliderStyle(host);
  });

  const customHosts = [
    ...document.querySelectorAll(CUSTOM_TESTER_SELECTOR),
  ] as HTMLElement[];

  if (customHosts.length === 0) {
    document.getElementById('haus-type-tester-columns-patch')?.remove();
    return;
  }

  // One document-scoped stylesheet (selectors already limited to custom hosts)
  const first = customHosts[0];
  const columns = first.dataset.testerColumns?.trim();
  if (columns !== '2' && columns !== '3') return;

  const gap = resolveTesterColumnGap(first.dataset.testerColumnGap);
  ensureDocumentStyle(
    'haus-type-tester-columns-patch',
    columnsCss(columns, gap),
  );

  customHosts.forEach((host) => {
    const cols = host.dataset.testerColumns?.trim();
    if (cols !== '2' && cols !== '3') return;
    applyColumnsInline(
      host,
      cols,
      resolveTesterColumnGap(host.dataset.testerColumnGap),
    );
  });
}

let observerStarted = false;
let patchQueued = false;

function schedulePatch() {
  if (patchQueued) return;
  patchQueued = true;
  requestAnimationFrame(() => {
    patchQueued = false;
    patchAll();
  });
}

export function initTypeTesterStyles() {
  patchAll();
  for (const delay of [100, 500, 1500, 3000]) {
    setTimeout(patchAll, delay);
  }

  document.documentElement.addEventListener('site-bg-change', schedulePatch);

  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver((mutations) => {
    // Ignore our own style-tag / style-attr churn
    const relevant = mutations.some((m) => {
      if (m.type !== 'childList') return false;
      for (const node of [...m.addedNodes, ...m.removedNodes]) {
        if (!(node instanceof Element)) continue;
        if (node.id === 'haus-slider-handle-patch') continue;
        if (node.id === 'haus-type-tester-columns-patch') continue;
        if (
          node.matches?.(TESTER_HOST_SELECTOR) ||
          node.querySelector?.(TESTER_HOST_SELECTOR) ||
          node.classList?.contains('type-tester') ||
          node.classList?.contains('type-tester__text') ||
          node.classList?.contains('type-tester__text__container') ||
          node.hasAttribute?.('data-contents')
        ) {
          return true;
        }
      }
      return false;
    });
    if (relevant) schedulePatch();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
