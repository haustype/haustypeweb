export type TesterColumnsMode = '2' | '3' | string;

export type TypeTesterColumnConfig = {
  columns?: TesterColumnsMode | null;
  gap?: string | null;
};

const DEFAULT_GAP = '1em';

export function resolveTesterColumnGap(gap?: string | null) {
  const trimmed = gap?.trim();
  return trimmed || DEFAULT_GAP;
}

/**
 * Apply CSS multi-column layout so N columns share the full container width.
 * Avoids Fontdue’s default ~40ch column-width, which leaves empty space.
 */
export function applyTypeTesterColumns(
  el: HTMLElement,
  config: TypeTesterColumnConfig,
) {
  const columns = (config.columns ?? '').trim();
  if (columns !== '2' && columns !== '3') return;

  const gap = resolveTesterColumnGap(config.gap);

  el.style.setProperty('width', '100%', 'important');
  el.style.setProperty('max-width', '100%', 'important');
  el.style.setProperty('box-sizing', 'border-box', 'important');
  el.style.setProperty('column-count', columns, 'important');
  el.style.setProperty('column-width', 'auto', 'important');
  el.style.setProperty('column-gap', gap, 'important');
  el.style.setProperty('column-fill', 'balance', 'important');

  // Match Fontdue’s own vars, but force full-width content box
  el.style.setProperty('--type-tester--column-count', columns, 'important');
  el.style.setProperty('--type-tester--column-width', 'auto', 'important');
  el.style.setProperty('--type-tester--column-gap', gap, 'important');
  el.style.setProperty('--type-tester--content-width', '100%', 'important');
}
