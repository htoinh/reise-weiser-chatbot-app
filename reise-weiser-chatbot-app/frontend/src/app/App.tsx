import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../auth/AuthProvider';
import { useAuth } from '../auth/authContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { GlobalStyle } from '../styles/GlobalStyles';
import { pageContainerWidth } from '../styles/glass';
import { darkTheme, lightTheme } from '../styles/theme';
import {
    applyThemePreference,
    isOsDarkMode,
    resolveInitialDarkMode,
    subscribeToOsColorScheme,
    syncFaviconWithOs,
} from '../styles/themePreference';
import About from '../pages/About';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';

const Shell = styled.div`
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: clamp(1rem, 2.5vw, 1.75rem);
`;

const Content = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    ${pageContainerWidth}

    p {
        color: ${({ theme }) => theme.colors.muted};
        line-height: 1.6;
    }
`;

function AppShell({
    darkMode,
    onChangeTheme,
}: {
    darkMode: boolean;
    onChangeTheme: (darkMode: boolean) => void;
}) {
    const { isAuthenticated } = useAuth();

    return (
        <Shell>
            <Navbar darkMode={darkMode} onChangeTheme={onChangeTheme} />

            <Content>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />}
                    />
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/chat" replace /> : <Register />}
                    />
                    <Route
                        path="/chat"
                        element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="*"
                        element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />}
                    />
                </Routes>
            </Content>

            <Footer />
        </Shell>
    );
}

export default function App() {
    const [darkMode, setDarkMode] = useState(resolveInitialDarkMode);

    useEffect(() => {
        applyThemePreference(darkMode);
    }, [darkMode]);

    useEffect(() => {
        syncFaviconWithOs(isOsDarkMode());
        return subscribeToOsColorScheme((osDark) => {
            syncFaviconWithOs(osDark);
            setDarkMode(osDark);
        });
    }, []);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <AuthProvider>
                <AppShell darkMode={darkMode} onChangeTheme={setDarkMode} />
            </AuthProvider>
        </ThemeProvider>
    );
}
