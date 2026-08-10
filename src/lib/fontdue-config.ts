export const FONTDUE_STORE_URL =
  import.meta.env.PUBLIC_FONTDUE_STORE_URL ?? 'https://store.haustype.com';

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
