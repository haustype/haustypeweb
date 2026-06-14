/** Swap broken opt-in images for the global .media-placeholder box. */
export function initMediaPlaceholders() {
  const swap = (img: HTMLImageElement) => {
    if (img.dataset.mediaPlaceholderApplied) return;
    img.dataset.mediaPlaceholderApplied = 'true';

    const placeholder = document.createElement('div');
    placeholder.className = img.dataset.mediaPlaceholderClass ?? 'media-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', img.alt || 'Image unavailable');

    const width = Number(img.getAttribute('width'));
    const height = Number(img.getAttribute('height'));
    if (width > 0 && height > 0) {
      placeholder.style.aspectRatio = `${width} / ${height}`;
    }

    img.replaceWith(placeholder);
  };

  document.querySelectorAll<HTMLImageElement>('img[data-media-placeholder]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      swap(img);
      return;
    }
    img.addEventListener('error', () => swap(img), { once: true });
  });
}
