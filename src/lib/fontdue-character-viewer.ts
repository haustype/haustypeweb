const SITE_BORDER = 'rgb(0 0 0 / 0.2)';

function patchStyle(viewer: Element) {
  const root = viewer.shadowRoot;
  if (!root) return;

  const id = 'haus-character-viewer-patch';
  let style = root.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    root.appendChild(style);
  }

  const border = SITE_BORDER;
  style.textContent = `
    .character-viewer__block__character-list > div {
      color: #000000;
      border-color: ${border};
    }
    .character-viewer__block__character-list > div[data-selected="true"],
    .character-viewer__block__character-list > div:hover {
      color: #ffffff;
      border-color: ${border};
    }
    .character-viewer__monitor__character {
      color: #ffffff;
    }
  `;
}

export function initCharacterViewerStyles() {
  const patchAll = () => {
    document.querySelectorAll('fontdue-character-viewer').forEach(patchStyle);
  };

  patchAll();
  for (const delay of [100, 500, 1500, 3000]) {
    setTimeout(patchAll, delay);
  }

  const observer = new MutationObserver(patchAll);
  observer.observe(document.body, { childList: true, subtree: true });

}
