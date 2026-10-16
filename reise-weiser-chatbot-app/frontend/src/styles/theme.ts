export const lightTheme = {
    colors: {
        background: '#f3f6ef',
        surface: '#ffffff',
        text: '#1d3328',
        muted: '#52665a',
        primary: '#237a57',
        onPrimary: '#ffffff',
        border: '#d5dfd2',
    },
    fontFamily: "Arial, sans-serif",
};

export type AppTheme = typeof lightTheme;

export const darkTheme : AppTheme = {
    colors: {
        background: '#101d18',
        surface: '#1b2d24',
        text: '#eef5ed',
        muted: '#b2c5b8',
        primary: '#78d4a7',
        onPrimary: '#10251b',
        border: '#354d3e'
    },
    fontFamily: "Arial, sans-serif",
};
