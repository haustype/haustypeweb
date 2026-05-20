/**
 * Hero + typeface card slideshow: desktop hover scrub, mobile autoplay fade-in.
 */
export function initSlideshow(container: Element) {
  const slideEls = container.querySelectorAll('[data-slide]');
  if (slideEls.length <= 1) return;

  const FADE_MS_MOBILE = 500;
  const HOLD_MS = 4000;
  const DESKTOP_BREAKPOINT = 1024;
  const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

  let current = 0;
  let autoplayTimer: ReturnType<typeof setTimeout> | null = null;
  let fadeTimer: ReturnType<typeof setTimeout> | null = null;
  let ready = false;

  function getMedia(el: Element) {
    return el.querySelector('.slideshow__media, video');
  }

  function isDesktop() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function hideMedia(media: Element | null) {
    if (!media) return;
    (media as HTMLElement).style.transition = 'none';
    (media as HTMLElement).style.opacity = '0';
  }

  function showMedia(media: Element | null) {
    if (!media) return;
    (media as HTMLElement).style.transition = 'none';
    (media as HTMLElement).style.opacity = '1';
  }

  function setSlideInstant(target: number) {
    const targetEl = slideEls[target];
    const targetMedia = getMedia(targetEl);

    (targetEl as HTMLElement).style.transition = 'none';
    (targetEl as HTMLElement).style.zIndex = '2';
    targetEl.classList.add('is-active');
    showMedia(targetMedia);

    slideEls.forEach((el, i) => {
      if (i === target) return;
      (el as HTMLElement).style.transition = 'none';
      (el as HTMLElement).style.zIndex = '0';
      el.classList.remove('is-active');
      hideMedia(getMedia(el));
    });

    (targetEl as HTMLElement).style.zIndex = '1';
    current = target;
  }

  function showSlide(index: number) {
    if (!ready) return;
    const target = Math.max(0, Math.min(index, slideEls.length - 1));
    if (target === current) return;

    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = null;
    }

    if (isDesktop()) {
      setSlideInstant(target);
      return;
    }

    const prev = current;
    current = target;
    const prevEl = slideEls[prev];
    const nextEl = slideEls[target];
    const prevMedia = getMedia(prevEl);
    const nextMedia = getMedia(nextEl);

    (prevEl as HTMLElement).style.zIndex = '1';
    prevEl.classList.add('is-active');
    showMedia(prevMedia);

    (nextEl as HTMLElement).style.zIndex = '2';
    nextEl.classList.add('is-active');
    hideMedia(nextMedia);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!nextMedia) return;
        (nextMedia as HTMLElement).style.transition = `opacity ${FADE_MS_MOBILE}ms ${EASE}`;
        (nextMedia as HTMLElement).style.opacity = '1';
      });
    });

    fadeTimer = setTimeout(() => {
      slideEls.forEach((el, i) => {
        if (i === current) return;
        (el as HTMLElement).style.zIndex = '0';
        el.classList.remove('is-active');
        hideMedia(getMedia(el));
      });
      fadeTimer = null;
    }, FADE_MS_MOBILE);
  }

  function advance() {
    if (isDesktop()) return;
    showSlide((current + 1) % slideEls.length);
    autoplayTimer = setTimeout(advance, HOLD_MS + FADE_MS_MOBILE);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setTimeout(advance, HOLD_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.floor(pct * slideEls.length);
    const target = index >= slideEls.length ? slideEls.length - 1 : index;
    showSlide(target);
  }

  function decodeImage(img: HTMLImageElement) {
    return new Promise<void>((resolve) => {
      const finish = () => resolve();
      if (img.complete) {
        if (img.decode) img.decode().then(finish).catch(finish);
        else finish();
        return;
      }
      img.addEventListener(
        'load',
        () => {
          if (img.decode) img.decode().then(finish).catch(finish);
          else finish();
        },
        { once: true }
      );
      img.addEventListener('error', finish, { once: true });
    });
  }

  async function prepareSlides() {
    const images = Array.from(slideEls)
      .map((el) => el.querySelector('img'))
      .filter((img): img is HTMLImageElement => img instanceof HTMLImageElement);

    await Promise.all(images.map(decodeImage));

    ready = true;
    setSlideInstant(0);
  }

  container.addEventListener('mousemove', handleMouseMove);

  prepareSlides().then(() => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) startAutoplay();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      if (!autoplayTimer) startAutoplay();
    } else {
      stopAutoplay();
    }
  });
}

export function initAllSlideshows(root: ParentNode = document) {
  root.querySelectorAll('[data-slideshow]:not([data-slideshow-inited])').forEach((el) => {
    el.setAttribute('data-slideshow-inited', '');
    initSlideshow(el);
  });
}
