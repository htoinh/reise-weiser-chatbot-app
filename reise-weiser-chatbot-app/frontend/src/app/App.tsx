import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../auth/AuthProvider';
import { useAuth } from '../auth/authContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { GlobalStyle } from '../styles/GlobalStyles';
import { darkTheme, lightTheme } from '../styles/theme';
import About from '../pages/About';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';

const Shell = styled.div`
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const Content = styled.main`
    flex: 1;
    width: 100%;
    max-width: 70rem;
    margin: 2rem auto;
    padding: 0 1.5rem;

    p {
        color: ${({ theme }) => theme.colors.muted};
        line-height: 1.6;
    }
`;

function AppShell({ darkMode, onToggleTheme }: { darkMode: boolean; onToggleTheme: () => void }) {
    const { isAuthenticated } = useAuth();

    return (
        <Shell>
            <Navbar darkMode={darkMode} onToggleTheme={onToggleTheme} />

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
    const [darkMode, setDarkMode] = useState(
        () =>
            typeof window !== 'undefined' &&
            (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false),
    );
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <AuthProvider>
                <AppShell
                    darkMode={darkMode}
                    onToggleTheme={() => setDarkMode((current) => !current)}
                />
            </AuthProvider>
        </ThemeProvider>
    );
}
