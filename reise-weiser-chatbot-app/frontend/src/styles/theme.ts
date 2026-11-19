export const lightTheme = {
    colors: {
        canvas: '#dff0e9',
        text: 'rgb(72, 92, 84)',
        muted: 'rgba(72, 92, 84, 0.84)',
        primary: '#2c7a5b',
        onPrimary: '#ffffff',
        error: '#b42318',
    },
    glass: {
        pageBackground:
            'radial-gradient(circle at 10% 14%, rgba(52, 211, 153, 0.44), transparent 44%), ' +
            'radial-gradient(circle at 88% 14%, rgba(56, 189, 248, 0.38), transparent 42%), ' +
            'radial-gradient(circle at 82% 86%, rgba(250, 204, 21, 0.28), transparent 46%), ' +
            'radial-gradient(circle at 18% 84%, rgba(45, 212, 191, 0.32), transparent 44%), ' +
            'linear-gradient(135deg, #dcf0e8 0%, #e2eefb 52%, #e3f2e7 100%)',
        panelBackground:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 255, 255, 0.46) 52%, rgba(236, 252, 246, 0.66) 100%)',
        pillBackground:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(240, 250, 246, 0.54) 100%)',
        pillHoverBackground:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(232, 248, 241, 0.72) 100%)',
        inputBackground: 'rgba(255, 255, 255, 0.6)',
        inputBorder: 'rgba(72, 92, 84, 0.26)',
        border: 'rgba(255, 255, 255, 0.8)',
        shadow:
            '0 16px 40px rgba(18, 52, 38, 0.1), ' +
            'inset 0 1.5px 1px rgba(255, 255, 255, 0.9), ' +
            'inset 0 -1px 2px rgba(31, 122, 86, 0.12)',
        pillShadow:
            '0 6px 18px rgba(18, 52, 38, 0.08), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.92)',
        inputShadow:
            'inset 0 2px 5px rgba(18, 52, 38, 0.06), ' + '0 1px 0 rgba(255, 255, 255, 0.8)',
        focusRing: '0 0 0 3px rgba(44, 122, 91, 0.45)',
        primaryGradient: 'linear-gradient(135deg, rgb(47, 61, 55) 0%, rgb(27, 104, 73) 100%)',
        primaryShadow:
            '0 8px 22px rgba(27, 104, 73, 0.26), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.32)',
        submitBackground:
            'linear-gradient(135deg, rgba(84, 128, 108, 0.22) 0%, rgba(62, 106, 88, 0.32) 100%)',
        submitHoverBackground:
            'linear-gradient(135deg, rgba(84, 128, 108, 0.32) 0%, rgba(62, 106, 88, 0.42) 100%)',
        submitBorder: 'rgba(62, 106, 88, 0.32)',
        submitText: 'rgb(52, 78, 68)',
        submitShadow:
            '0 6px 16px rgba(52, 78, 68, 0.1), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.72)',
        errorBackground: 'rgba(254, 226, 226, 0.72)',
    },
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export type AppTheme = typeof lightTheme;

export const darkTheme: AppTheme = {
    colors: {
        canvas: '#06110e',
        text: '#eef7f2',
        muted: '#b8d0c3',
        primary: '#7ce0b3',
        onPrimary: '#ffffff',
        error: '#fda29b',
    },
    glass: {
        pageBackground:
            'radial-gradient(circle at 12% 16%, rgba(16, 185, 129, 0.4), transparent 44%), ' +
            'radial-gradient(circle at 88% 16%, rgba(14, 165, 233, 0.32), transparent 42%), ' +
            'radial-gradient(circle at 78% 86%, rgba(52, 211, 153, 0.24), transparent 46%), ' +
            'radial-gradient(circle at 16% 84%, rgba(14, 116, 144, 0.3), transparent 44%), ' +
            'linear-gradient(135deg, #06110e 0%, #081821 52%, #07140f 100%)',
        panelBackground:
            'linear-gradient(135deg, rgba(30, 60, 49, 0.66) 0%, rgba(12, 26, 22, 0.48) 54%, rgba(20, 46, 40, 0.58) 100%)',
        pillBackground:
            'linear-gradient(135deg, rgba(34, 68, 55, 0.7) 0%, rgba(15, 32, 26, 0.54) 100%)',
        pillHoverBackground:
            'linear-gradient(135deg, rgba(44, 86, 70, 0.82) 0%, rgba(20, 44, 36, 0.66) 100%)',
        inputBackground: 'rgba(9, 22, 18, 0.58)',
        inputBorder: 'rgba(124, 224, 179, 0.28)',
        border: 'rgba(180, 245, 214, 0.24)',
        shadow:
            '0 20px 48px rgba(0, 0, 0, 0.42), ' +
            'inset 0 1px 1px rgba(255, 255, 255, 0.22), ' +
            'inset 0 -1px 2px rgba(124, 224, 179, 0.12)',
        pillShadow: '0 8px 20px rgba(0, 0, 0, 0.3), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        inputShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.34), ' + '0 1px 0 rgba(255, 255, 255, 0.08)',
        focusRing: '0 0 0 3px rgba(124, 224, 179, 0.45)',
        primaryGradient: 'linear-gradient(135deg, rgb(47, 61, 55) 0%, rgb(27, 104, 73) 100%)',
        primaryShadow:
            '0 8px 24px rgba(0, 0, 0, 0.34), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.24)',
        submitBackground:
            'linear-gradient(135deg, rgba(124, 224, 179, 0.18) 0%, rgba(76, 168, 128, 0.28) 100%)',
        submitHoverBackground:
            'linear-gradient(135deg, rgba(124, 224, 179, 0.26) 0%, rgba(76, 168, 128, 0.38) 100%)',
        submitBorder: 'rgba(124, 224, 179, 0.32)',
        submitText: '#e2f5ec',
        submitShadow:
            '0 8px 20px rgba(0, 0, 0, 0.26), ' + 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        errorBackground: 'rgba(127, 29, 29, 0.45)',
    },
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
