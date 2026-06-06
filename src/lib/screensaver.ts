const DEFAULT_IDLE_MS = 10_000;
const DEFAULT_SLIDE_MS = 5_000;
const DEFAULT_FADE_MS = 1_000;

function readMs(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function isTabVisible() {
  return document.visibilityState === 'visible';
}

function isBlogPage() {
  return window.location.pathname === '/blog' || window.location.pathname.startsWith('/blog/');
}

function isCartOpen() {
  return document.body.dataset.fontdueStoreModal === 'open';
}

export function clearScreensaverState() {
  document.documentElement.classList.remove('is-screensaver-active', 'is-tab-hidden');
}

let teardownCurrent: (() => void) | null = null;

export function initScreensaver(root: HTMLElement) {
  const slides = root.querySelectorAll<HTMLElement>('[data-screensaver-slide]');
  if (!slides.length) return () => {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const idleMs = readMs(root.dataset.idleMs, DEFAULT_IDLE_MS);
  const slideMs = readMs(root.dataset.slideMs, DEFAULT_SLIDE_MS);
  const fadeMs = readMs(root.dataset.fadeMs, DEFAULT_FADE_MS);
  root.style.setProperty('--screensaver-fade-ms', `${fadeMs}ms`);

  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let slideTimer: ReturnType<typeof setInterval> | null = null;
  let current = 0;
  let active = false;
  let suspended = false;

  function stopSlideshow() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function showSlide(index: number) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    current = index;
  }

  function startSlideshow() {
    stopSlideshow();
    if (slides.length <= 1) return;
    slideTimer = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, slideMs);
  }

  function clearIdle() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function canRun() {
    return !isBlogPage() && !isCartOpen() && isTabVisible();
  }

  function scheduleIdle() {
    clearIdle();
    if (active || suspended || !canRun()) return;
    idleTimer = setTimeout(() => {
      if (canRun()) activate();
    }, idleMs);
  }

  function deactivate(scheduleNext = true) {
    suspended = false;
    document.documentElement.classList.remove('is-tab-hidden');

    if (!active) {
      if (scheduleNext) scheduleIdle();
      return;
    }

    active = false;
    root.classList.remove('is-active', 'is-resuming');
    root.setAttribute('aria-hidden', 'true');
    clearScreensaverState();
    stopSlideshow();

    if (scheduleNext) scheduleIdle();
  }

  function activate() {
    if (active || !canRun()) return;

    active = true;
    suspended = false;
    clearIdle();
    root.classList.add('is-active');
    root.classList.remove('is-resuming');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-screensaver-active');
    document.documentElement.classList.remove('is-tab-hidden');
    showSlide(0);
    startSlideshow();
  }

  function suspendForHiddenTab() {
    if (!active) return;
    suspended = true;
    stopSlideshow();
    document.documentElement.classList.add('is-tab-hidden');
  }

  function resumeFromVisibleTab() {
    document.documentElement.classList.remove('is-tab-hidden');

    if (!suspended || !active) {
      suspended = false;
      return;
    }

    suspended = false;
    root.classList.add('is-resuming');
    startSlideshow();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('is-resuming');
      });
    });
  }

  function onActivity() {
    if (!isTabVisible()) return;
    if (active) {
      deactivate();
      return;
    }
    scheduleIdle();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      clearIdle();
      suspendForHiddenTab();
      return;
    }

    resumeFromVisibleTab();
    if (!active) scheduleIdle();
  }

  function onCartChange() {
    if (isCartOpen()) {
      clearIdle();
      deactivate(false);
      return;
    }
    if (!active) scheduleIdle();
  }

  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'] as const;
  events.forEach((event) => {
    document.addEventListener(event, onActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', onVisibilityChange);

  const cartObserver = new MutationObserver(onCartChange);
  cartObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-fontdue-store-modal'],
  });

  if (document.hidden) {
    document.documentElement.classList.add('is-tab-hidden');
  }

  if (isCartOpen()) {
    onCartChange();
  } else {
    scheduleIdle();
  }

  return () => {
    clearIdle();
    stopSlideshow();
    events.forEach((event) => {
      document.removeEventListener(event, onActivity);
    });
    document.removeEventListener('visibilitychange', onVisibilityChange);
    cartObserver.disconnect();
    deactivate(false);
    root.classList.remove('is-active', 'is-resuming');
    root.setAttribute('aria-hidden', 'true');
  };
}

export function initSiteScreensaver() {
  if (teardownCurrent) {
    teardownCurrent();
    teardownCurrent = null;
  }

  if (isBlogPage()) {
    clearScreensaverState();
    return;
  }

  const root = document.querySelector<HTMLElement>('[data-screensaver]');
  if (!root) {
    clearScreensaverState();
    return;
  }

  teardownCurrent = initScreensaver(root);
}

/** @deprecated Use initSiteScreensaver */
export function initHomepageScreensaver() {
  initSiteScreensaver();
}
