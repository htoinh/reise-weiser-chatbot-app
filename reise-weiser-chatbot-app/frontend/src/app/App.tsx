import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../auth/AuthProvider';
import { useAuth } from '../auth/authContext';
import { GlobalStyle } from '../styles/GlobalStyles';
import { darkTheme, lightTheme } from '../styles/theme';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import About from '../pages/About';

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.25rem 2rem;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Brand = styled(NavLink)`
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.4rem;
    font-weight: 700;
    text-decoration: none;
`;

const Navigation = styled.nav`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;

    a {
        text-decoration: none;
        padding: 0.4rem 0;
        border-bottom: 2px solid transparent;
    }

    a.active {
        color: ${({ theme }) => theme.colors.primary};
        border-bottom-color: ${({ theme }) => theme.colors.primary};
    }
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const UserBadge = styled.span`
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
`;

const Content = styled.main`
    max-width: 70rem;
    margin: 3rem auto;
    padding: 0 1.5rem;

    p {
        color: ${({ theme }) => theme.colors.muted};
        line-height: 1.6;
    }
`;

const ActionButton = styled.button`
    padding: 0.6rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
`;

function AppShell({ darkMode, onToggleTheme }: { darkMode: boolean; onToggleTheme: () => void }) {
    const { isAuthenticated, userEmail, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Header>
                <Brand to="/about">ReiseWeiser</Brand>
                <Navigation aria-label="Main navigation">
                    {isAuthenticated ? (
                        <NavLink to="/chat">Chat</NavLink>
                    ) : (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink>
                        </>
                    )}
                    <NavLink to="/about">About</NavLink>
                </Navigation>

                <Actions>
                    {isAuthenticated && (
                        <>
                            {userEmail && <UserBadge>{userEmail}</UserBadge>}
                            <ActionButton
                                type="button"
                                onClick={() => {
                                    logout();
                                    navigate('/login', { replace: true });
                                }}
                            >
                                Logout
                            </ActionButton>
                        </>
                    )}
                    <ActionButton type="button" onClick={onToggleTheme}>
                        Switch to {darkMode ? 'light' : 'dark'} mode
                    </ActionButton>
                </Actions>
            </Header>

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
        </>
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
