export const colors = {
    primary: '#0B3B60',
    primaryHover: '#082D49',
    onPrimary: '#FFFFFF',
    secondary: '#2B7A78',
    secondaryHover: '#225F5D',
    accent: '#C47A18',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#17212B',
    textMuted: '#5D6B78',
    border: '#CBD5DF',
    success: '#1F7A4D',
    warning: '#9A6700',
    error: '#B42318',
} as const;
export const theme = {
    colors,
} as const;
export type AppTheme = typeof theme;