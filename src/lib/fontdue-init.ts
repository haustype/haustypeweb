import { FONTDUE_INIT_CONFIG, FONTDUE_STORE_URL } from './fontdue-config';

const FONTDUE_MODULE_URL = 'https://js.fontdue.com/fontdue.esm.js';
const WIDGET_SELECTOR =
  'fontdue-type-testers, fontdue-type-tester, fontdue-character-viewer, fontdue-customer-login-form, fontdue-test-fonts-form';

const HEALTH_CHECK_MS = 2500;
const MAX_INIT_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [1500, 3500];

type FontdueModule = {
  default: {
    initialize: (options: { url: string; config: typeof FONTDUE_INIT_CONFIG }) => void;
  };
};

let initPromise: Promise<void> | null = null;
let initAttempts = 0;

function hasFontdueWidgets() {
  return document.querySelector(WIDGET_SELECTOR) !== null;
}

function fontdueWidgetsHealthy() {
  const widgets = document.querySelectorAll(WIDGET_SELECTOR);
  if (!widgets.length) return true;

  return Array.from(widgets).every((widget) => {
    const root = widget.shadowRoot;
    return Boolean(root && root.childElementCount > 0);
  });
}

async function loadFontdueModule() {
  return import(/* @vite-ignore */ FONTDUE_MODULE_URL) as Promise<FontdueModule>;
}

function runInitialize(fontdue: FontdueModule['default']) {
  fontdue.initialize({
    url: FONTDUE_STORE_URL,
    config: FONTDUE_INIT_CONFIG,
  });
}

function notifyFontdueResize() {
  window.dispatchEvent(new Event('resize'));
}

function watchFontdueVisibility() {
  const widgets = document.querySelectorAll(WIDGET_SELECTOR);
  if (!widgets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        notifyFontdueResize();
      }
    },
    { threshold: 0.01 },
  );

  widgets.forEach((widget) => observer.observe(widget));
}

async function scheduleHealthCheck() {
  await new Promise((resolve) => window.setTimeout(resolve, HEALTH_CHECK_MS));

  if (fontdueWidgetsHealthy()) {
    document.documentElement.dataset.fontdueReady = 'true';
    notifyFontdueResize();
    return;
  }

  if (initAttempts >= MAX_INIT_ATTEMPTS) {
    console.warn('[fontdue] widgets did not finish loading after multiple attempts');
    return;
  }

  const retryDelay = RETRY_DELAYS_MS[initAttempts - 1] ?? RETRY_DELAYS_MS.at(-1)!;
  console.warn(`[fontdue] retrying initialization in ${retryDelay}ms`);
  await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
  await initFontdueApp(true);
}

export async function initFontdueApp(isRetry = false) {
  if (initPromise && !isRetry) return initPromise;

  initPromise = (async () => {
    initAttempts += 1;

    try {
      const fontdue = (await loadFontdueModule()).default;
      runInitialize(fontdue);
      watchFontdueVisibility();
      void scheduleHealthCheck();
    } catch (error) {
      console.error('[fontdue] failed to load module', error);

      if (initAttempts < MAX_INIT_ATTEMPTS) {
        const retryDelay = RETRY_DELAYS_MS[initAttempts - 1] ?? RETRY_DELAYS_MS.at(-1)!;
        await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
        initPromise = null;
        await initFontdueApp(true);
      }
    }
  })();

  return initPromise;
}

/** Eager when widgets are on the page; otherwise idle / first store interaction. */
export function scheduleFontdueInit() {
  if (hasFontdueWidgets()) {
    void initFontdueApp();
    return;
  }

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    void initFontdueApp();
  };

  const idle = window.requestIdleCallback?.bind(window);
  if (idle) {
    idle(start, { timeout: 2500 });
  } else {
    window.setTimeout(start, 1200);
  }

  document.addEventListener(
    'pointerdown',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest(
          '[fontdue-click], .haus-buy-button, fontdue-store-modal',
        )
      ) {
        start();
      }
    },
    { capture: true, passive: true },
  );
}

function handlePersistedPageShow() {
  if (!hasFontdueWidgets()) return;
  initPromise = null;
  initAttempts = 0;
  delete document.documentElement.dataset.fontdueReady;
  void initFontdueApp(true);
  notifyFontdueResize();
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) handlePersistedPageShow();
});

document.addEventListener(
  'transitionend',
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('[data-reveal].is-revealed')) return;
    if (!target.querySelector(WIDGET_SELECTOR)) return;
    notifyFontdueResize();
  },
  true,
);
