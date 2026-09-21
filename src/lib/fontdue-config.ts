export const FONTDUE_STORE_URL =
  import.meta.env.PUBLIC_FONTDUE_STORE_URL ?? 'https://store.haustype.com';

/** Site UI typeface — served from Fontdue’s webfont CDN. */
export const FONTDUE_UI_FONT_CSS =
  import.meta.env.PUBLIC_FONTDUE_UI_FONT_CSS ??
  'https://fonts.fontdue.com/bech-type/css/aros-gothic.css';

export const FONTDUE_UI_FONT_FAMILY = 'Aros Gothic';

export const FONTDUE_UI_FONT_PRELOAD =
  import.meta.env.PUBLIC_FONTDUE_UI_FONT_PRELOAD ??
  'https://fonts.fontdue.com/bech-type/fonts/6c2da023c0ff219326b4c41ea2453702fc4bce41.woff2';

export const FONTDUE_INIT_CONFIG = {
  storeModal: {
    indexLayout: 'styled-font-names' as const,
  },
  form: {
    checkboxStyle: 'cross' as const,
  },
  typeTester: {
    selectable: true,
    textInput: true,
    groupEdit: false,
    initialMode: 'local' as const,
    shy: true,
    autofitOnChange: true,
    selectButton: true,
    selectButtonLabel: 'Buy →',
    selectButtonStyle: 'inline' as const,
    priceText: false,
    alignmentButtons: false,
    initialAlignment: 'left' as const,
    bulletStyle: 'round' as const,
    variableAxesPosition: 'features-panel' as const,
    openTypeFeatures: {
      interactionStyle: 'panel' as const,
    },
    columns: false,
    size: {
      min: 12,
      max: 512,
      label: false,
    },
  },
};
