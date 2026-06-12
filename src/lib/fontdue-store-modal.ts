const MODAL_MAX_WIDTH = '800px';

const STORE_MODAL_LAYOUT_CSS = `
  .store-modal__container__container {
    max-width: ${MODAL_MAX_WIDTH} !important;
    transition: max-width 0s !important;
  }
`;

function lockContainer(container: Element) {
  const el = container as HTMLElement;
  el.style.setProperty('max-width', MODAL_MAX_WIDTH, 'important');
  el.style.setProperty('transition', 'max-width', '0s', 'important');
}

function ensureDocumentStyle() {
  const id = 'haus-store-modal-layout-patch-global';
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = STORE_MODAL_LAYOUT_CSS;
}

function patchShadowRoot(root: ShadowRoot) {
  const id = 'haus-store-modal-layout-patch';
  let style = root.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    root.appendChild(style);
  }
  style.textContent = STORE_MODAL_LAYOUT_CSS;
  root.querySelectorAll('.store-modal__container__container').forEach(lockContainer);
}

function walkShadowRoots(node: ParentNode) {
  if (node instanceof Element && node.shadowRoot) {
    patchShadowRoot(node.shadowRoot);
    walkShadowRoots(node.shadowRoot);
  }

  if (node instanceof Element || node instanceof DocumentFragment || node instanceof ShadowRoot) {
    node.querySelectorAll('*').forEach((child) => {
      if (child instanceof Element && child.shadowRoot) {
        walkShadowRoots(child);
      }
    });
  }
}

function patchAll() {
  ensureDocumentStyle();
  document.querySelectorAll('.store-modal__container__container').forEach(lockContainer);
  document.querySelectorAll('fontdue-store-modal').forEach((host) => {
    if (host.shadowRoot) patchShadowRoot(host.shadowRoot);
  });
  walkShadowRoots(document.body);
}

let observerStarted = false;

export function initStoreModalStyles() {
  patchAll();

  for (const delay of [0, 16, 32, 64, 100, 200, 500, 1000, 2000]) {
    setTimeout(patchAll, delay);
  }

  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(patchAll);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-fontdue-store-modal', 'data-route', 'class', 'style'],
  });
}
