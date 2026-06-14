export type SiteBgMode = 'grey' | 'yellow' | 'dark';

const STORAGE_KEY = 'site-bg';
const CYCLE: SiteBgMode[] = ['grey', 'dark', 'yellow'];

const NEXT_LABEL: Record<SiteBgMode, string> = {
  grey: 'Switch to black background',
  dark: 'Switch to yellow background',
  yellow: 'Switch to grey background',
};

export function normalizeStoredBg(value: string | null): SiteBgMode {
  if (value === 'alt' || value === 'yellow') return 'yellow';
  if (value === 'dark') return 'dark';
  return 'grey';
}

export function getSiteBgMode(): SiteBgMode {
  const root = document.documentElement;
  if (root.classList.contains('site-bg-dark')) return 'dark';
  if (root.classList.contains('site-bg-yellow') || root.classList.contains('site-bg-alt')) {
    return 'yellow';
  }
  return 'grey';
}

export function applySiteBg(mode: SiteBgMode) {
  const root = document.documentElement;
  root.classList.remove('site-bg-yellow', 'site-bg-dark', 'site-bg-alt');
  if (mode === 'yellow') root.classList.add('site-bg-yellow');
  if (mode === 'dark') root.classList.add('site-bg-dark');
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (_) {}
  root.dispatchEvent(new CustomEvent('site-bg-change', { detail: { mode } }));
}

export function cycleSiteBg(mode: SiteBgMode): SiteBgMode {
  const index = CYCLE.indexOf(mode);
  return CYCLE[(index + 1) % CYCLE.length];
}

export function nextBgAriaLabel(mode: SiteBgMode) {
  return NEXT_LABEL[mode];
}

export function getSiteBgToggleRotation(mode: SiteBgMode): number {
  const steps: Record<SiteBgMode, number> = {
    grey: 0,
    dark: 120,
    yellow: 240,
  };
  return steps[mode];
}

function setToggleRotation(degrees: number, animate = true) {
  const swatch = document.querySelector<HTMLElement>('.site-bg-toggle__swatch');
  if (!swatch) return;

  document.documentElement.style.setProperty('--site-bg-toggle-rotation', `${degrees}deg`);

  if (!animate) {
    swatch.style.transition = 'none';
  }

  swatch.style.transform = `rotate(${degrees}deg)`;

  if (!animate) {
    void swatch.offsetHeight;
    swatch.style.transition = '';
  }
}

/** Apply saved theme before first paint (inline in <head>). */
export function applyStoredSiteBgInline() {
  try {
    const mode = normalizeStoredBg(localStorage.getItem(STORAGE_KEY));
    applySiteBg(mode);
  } catch (_) {}
}

export function initSiteBgToggle() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-bg-toggle]');
  if (!toggle || toggle.dataset.bound === 'true') return;
  toggle.dataset.bound = 'true';

  let rotation = getSiteBgToggleRotation(getSiteBgMode());
  setToggleRotation(rotation, false);

  const sync = () => {
    const mode = getSiteBgMode();
    toggle.setAttribute('aria-label', nextBgAriaLabel(mode));
    toggle.dataset.siteBg = mode;
  };

  toggle.addEventListener('click', () => {
    applySiteBg(cycleSiteBg(getSiteBgMode()));
    rotation += 120;
    setToggleRotation(rotation, true);
    sync();
  });

  sync();
}
