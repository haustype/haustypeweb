import { useCallback, type KeyboardEvent } from 'react';
import { Box, Flex, Text, TextInput } from '@sanity/ui';
import { set, setIfMissing, unset } from 'sanity';
import type { ObjectInputProps } from 'sanity';
import {
  defaultBoxPaddingSide,
  type BoxPaddingPreset,
  type BoxPaddingValue,
} from '../../lib/box-padding';
import { isArrowStepKey, nextArrowSteppedNumber } from '../lib/arrow-step-number';

type Side = keyof BoxPaddingValue;

const ALL_SIDES: Array<{ side: Side; label: string; position: 'top' | 'right' | 'bottom' | 'left' }> = [
  { side: 'top', label: 'Top', position: 'top' },
  { side: 'right', label: 'Right', position: 'right' },
  { side: 'bottom', label: 'Bottom', position: 'bottom' },
  { side: 'left', label: 'Left', position: 'left' },
];

function formatSideForInput(value: BoxPaddingValue | undefined, side: Side) {
  const raw = value?.[side];
  return typeof raw === 'number' && Number.isFinite(raw) ? String(raw) : '';
}

function defaultValueForSide(side: Side, preset: BoxPaddingPreset) {
  return defaultBoxPaddingSide(side, preset);
}

function SideIcon({ position }: { position: 'top' | 'right' | 'bottom' | 'left' }) {
  const frame = { x: 3, y: 3, width: 18, height: 18 };
  const content = { x: 8, y: 8, width: 8, height: 8 };
  const band = 5;

  const highlights: Record<'top' | 'right' | 'bottom' | 'left', JSX.Element> = {
    top: <rect x={frame.x} y={frame.y} width={frame.width} height={band} rx="1.5" />,
    right: (
      <rect
        x={frame.x + frame.width - band}
        y={frame.y}
        width={band}
        height={frame.height}
        rx="1.5"
      />
    ),
    bottom: (
      <rect
        x={frame.x}
        y={frame.y + frame.height - band}
        width={frame.width}
        height={band}
        rx="1.5"
      />
    ),
    left: <rect x={frame.x} y={frame.y} width={band} height={frame.height} rx="1.5" />,
  };

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        rx="2"
        fill="var(--card-bg-color)"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.25"
      />
      <g fill="currentColor" opacity="0.95">
        {highlights[position]}
      </g>
      <rect
        x={content.x}
        y={content.y}
        width={content.width}
        height={content.height}
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function createBoxPaddingInput(
  sides: Side[] = ['top', 'right', 'bottom', 'left'],
  options?: { title?: string; preset?: BoxPaddingPreset },
) {
  const visibleSides = ALL_SIDES.filter(({ side }) => sides.includes(side));
  const title = options?.title ?? 'Padding';
  const preset = options?.preset ?? 'homepage';
  const missingDefaults = Object.fromEntries(
    sides.map((side) => [side, defaultValueForSide(side, preset)]),
  ) as BoxPaddingValue;

  return function ConfiguredBoxPaddingInput(props: ObjectInputProps) {
    const { value, onChange, readOnly } = props;
    const padding = (value ?? {}) as BoxPaddingValue;

    const setSideValue = useCallback(
      (side: Side, next: number) => {
        if (readOnly) return;
        onChange([setIfMissing(missingDefaults), set(next, [side])]);
      },
      [onChange, readOnly],
    );

    const updateSide = useCallback(
      (side: Side, nextValue: string) => {
        if (readOnly) return;

        const parsed = Number.parseInt(nextValue, 10);
        if (!Number.isFinite(parsed) || parsed < 0) {
          onChange(unset([side]));
          return;
        }

        setSideValue(side, parsed);
      },
      [onChange, readOnly, setSideValue],
    );

    const handleSideKeyDown = useCallback(
      (side: Side, event: KeyboardEvent<HTMLInputElement>) => {
        if (!isArrowStepKey(event.key)) return;

        event.preventDefault();
        if (readOnly) return;

        const fallback = defaultValueForSide(side, preset);
        const current = padding[side];
        const next = nextArrowSteppedNumber(
          typeof current === 'number' ? current : fallback,
          event.key,
          { min: 0, shiftKey: event.shiftKey },
        );
        setSideValue(side, next);
      },
      [padding, preset, readOnly, setSideValue],
    );

    return (
      <Box>
        <Flex align="center" justify="space-between" marginBottom={3}>
          <Text size={1} weight="semibold">
            {title}
          </Text>
        </Flex>

        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: visibleSides.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          {visibleSides.map(({ side, label, position }) => (
            <Flex
              key={side}
              align="center"
              gap={2}
              padding={2}
              style={{
                borderRadius: 6,
                backgroundColor: 'var(--card-muted-bg-color)',
              }}
            >
              <Box style={{ color: 'var(--card-fg-color)', minWidth: 28 }}>
                <SideIcon position={position} />
              </Box>
              <Text size={0} muted style={{ minWidth: '2.25rem' }}>
                {label}
              </Text>
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                aria-label={`${label} padding`}
                value={formatSideForInput(padding, side)}
                placeholder={String(defaultValueForSide(side, preset))}
                readOnly={readOnly}
                onChange={(event) => updateSide(side, event.currentTarget.value)}
                onKeyDown={(event) => handleSideKeyDown(side, event)}
                style={{ flex: 1 }}
              />
              <Text size={1} muted>
                px
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
    );
  };
}

export const BoxPaddingInput = createBoxPaddingInput();
export const AboutBoxPaddingInput = createBoxPaddingInput(undefined, { preset: 'about' });
