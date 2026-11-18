import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthContext } from '../auth/authContext';
import type { AuthContextValue } from '../auth/authContext';
import { darkTheme, lightTheme } from '../styles/theme';

export interface RenderOptions {
    route?: string;
    dark?: boolean;
    auth?: Partial<AuthContextValue>;
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}): RenderResult {
    const { route = '/', dark = false, auth = {} } = options;

    const authValue: AuthContextValue = {
        token: null,
        userEmail: null,
        userName: null,
        isAuthenticated: false,
        login: async () => {},
        register: async () => {},
        logout: () => {},
        ...auth,
    };

    return render(ui, {
        wrapper: ({ children }: { children: ReactNode }) =>
            createElement(
                ThemeProvider,
                { theme: dark ? darkTheme : lightTheme },
                createElement(
                    AuthContext.Provider,
                    { value: authValue },
                    createElement(MemoryRouter, { initialEntries: [route] }, children),
                ),
            ),
    });
}
