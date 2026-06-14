export function isSiteBgDark() {
  return document.documentElement.classList.contains('site-bg-dark');
}

export function siteBorderColor() {
  return isSiteBgDark() ? 'rgb(255 255 255 / 0.2)' : 'rgb(0 0 0 / 0.2)';
}

export function siteFgColor() {
  return isSiteBgDark() ? '#ffffff' : '#000000';
}
