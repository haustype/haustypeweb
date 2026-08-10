import { useCallback, type KeyboardEvent } from 'react';
import { set, unset, type NumberInputProps } from 'sanity';
import { isArrowStepKey, nextArrowSteppedNumber } from '../lib/arrow-step-number';

/**
 * Ensures ↑ / ↓ adjust number fields (Shift for ±10).
 * Used as the Studio-wide number input so every numeric setting gets this behavior.
 */
export function ArrowStepNumberInput(props: NumberInputProps) {
  const { value, onChange, readOnly, elementProps } = props;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!isArrowStepKey(event.key)) {
        elementProps.onKeyDown?.(event);
        return;
      }

      event.preventDefault();
      if (readOnly) return;

      const next = nextArrowSteppedNumber(value, event.key, {
        shiftKey: event.shiftKey,
      });

      onChange(Number.isFinite(next) ? set(next) : unset());
    },
    [elementProps, onChange, readOnly, value],
  );

  return props.renderDefault({
    ...props,
    elementProps: {
      ...elementProps,
      onKeyDown: handleKeyDown,
    },
  });
}
