import imageUrlBuilder from '@sanity/image-url';
import { Box } from '@sanity/ui';
import { useMemo } from 'react';
import { useClient, type Image } from 'sanity';

type PreviewMediaProps = {
  dimensions?: {
    width?: number;
    height?: number;
    fit?: 'crop' | 'max' | 'min' | 'fill';
    dpr?: number;
  };
  layout?: string;
};

export function createWhiteBgPreviewMedia(image: Image) {
  return function WhiteBgPreviewMedia({ dimensions }: PreviewMediaProps) {
    const client = useClient({ apiVersion: '2024-01-01' });
    const builder = useMemo(() => imageUrlBuilder(client), [client]);
    const width = dimensions?.width ?? 33;
    const height = dimensions?.height ?? 33;
    const dpr = dimensions?.dpr ?? 1;
    const fit = dimensions?.fit ?? 'crop';

    const url = builder
      .image(image)
      .width(Math.round(width * dpr))
      .height(Math.round(height * dpr))
      .fit(fit)
      .url();

    return (
      <Box
        style={{
          width,
          height,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
    );
  };
}
