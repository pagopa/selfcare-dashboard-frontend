// TODO: remove these custom colors after the @pagopa/mui-italia update and use the theme palette instead.
// mui-italia 2.5.0 does not expose the new design tokens; the 2.6+ versions break the legacy theme
// (EnvironmentBanner, Tag and Banner read `theme.colors`, available only in `themeNext`).
export const contractUpdateWizardColors = {
  primary: '#0B3EE3', // blue[500]
  primaryHover: '#0932B6', // blue[600]
  textPrimary: '#0E0F13', // neutral.black
  textSecondary: '#555C70', // neutral.grey[700]
  divider: '#E8EBF1', // neutral.grey[100]
  infoBorder: '#89D9FC', // info[400]
} as const;
