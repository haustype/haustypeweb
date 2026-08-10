export type ArrowStepOptions = {
  min?: number;
  max?: number;
  step?: number;
  shiftStep?: number;
  shiftKey?: boolean;
};

export function isArrowStepKey(key: string): key is 'ArrowUp' | 'ArrowDown' {
  return key === 'ArrowUp' || key === 'ArrowDown';
}

/** Next value when stepping a number with ↑ / ↓ (Shift = larger step). */
export function nextArrowSteppedNumber(
  current: number | null | undefined,
  key: 'ArrowUp' | 'ArrowDown',
  options: ArrowStepOptions = {},
): number {
  const stepSize = options.shiftKey
    ? (options.shiftStep ?? 10)
    : (options.step ?? 1);
  const delta = key === 'ArrowUp' ? stepSize : -stepSize;
  const base = typeof current === 'number' && Number.isFinite(current) ? current : 0;
  let next = base + delta;

  if (options.min != null) next = Math.max(options.min, next);
  if (options.max != null) next = Math.min(options.max, next);

  return next;
}
