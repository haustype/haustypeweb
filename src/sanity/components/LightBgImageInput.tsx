import type { CSSProperties } from 'react';
import type { InputProps } from 'sanity';

export function createLightBgImageInput(previewBg = '#eeeeee') {
  return function LightBgImageInput(props: InputProps) {
    return (
      <div
        className="light-bg-image-input"
        style={{ '--light-bg-image-preview': previewBg } as CSSProperties}
      >
        {props.renderDefault(props)}
      </div>
    );
  };
}
