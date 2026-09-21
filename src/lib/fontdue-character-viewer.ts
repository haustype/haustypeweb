import { isSiteBgDark, siteBorderColor, siteFgColor } from './fontdue-theme';

/** Sticky offset for the glyph monitor — fixed from the top of the viewport. */
const STICKY_TOP = '9em';

function updateStickyTop(viewer: HTMLElement) {
  viewer.style.setProperty('--character_viewer_sticky_top', STICKY_TOP);
}

function patchShadowColors(viewer: Element) {
  const root = viewer.shadowRoot;
  if (!root) return;

  const id = 'haus-character-viewer-patch';
  let style = root.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    root.appendChild(style);
  }

  const dark = isSiteBgDark();
  const border = siteBorderColor();
  const fg = siteFgColor();

  style.textContent = `
    .character-viewer__block__character-list > div {
      color: ${fg};
      border-color: ${border};
    }
    .character-viewer__block__character-list > div[data-selected="true"],
    .character-viewer__block__character-list > div:hover {
      color: ${dark ? '#000000' : '#ffffff'};
      border-color: ${border};
    }
    .character-viewer__monitor__character {
      color: ${fg};
    }
  `;
}

function patchViewer(viewer: Element) {
  updateStickyTop(viewer as HTMLElement);
  patchShadowColors(viewer);
}

let observerStarted = false;

export function initCharacterViewerStyles() {
  const patchAll = () => {
    document.querySelectorAll('fontdue-character-viewer').forEach((viewer) => {
      patchViewer(viewer);
    });
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
