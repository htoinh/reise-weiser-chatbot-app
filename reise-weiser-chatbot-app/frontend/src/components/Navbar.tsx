import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../auth/authContext';

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

const StatusBadge = styled.span`
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
`;

const ActionButton = styled.button`
    padding: 0.6rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
`;

export interface NavbarProps {
    darkMode: boolean;
    onToggleTheme: () => void;
}

export default function Navbar({ darkMode, onToggleTheme }: NavbarProps) {
    const { isAuthenticated, userName, logout } = useAuth();
    const navigate = useNavigate();

    const statusText = isAuthenticated
        ? userName
            ? `Signed in as ${userName}`
            : 'Signed in'
        : 'Guest';

    return (
        <Header>
            <Brand to={isAuthenticated ? '/chat' : '/about'}>ReiseWeiser</Brand>

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
                <StatusBadge aria-label="User status">{statusText}</StatusBadge>
                {isAuthenticated && (
                    <ActionButton
                        type="button"
                        onClick={() => {
                            logout();
                            navigate('/login', { replace: true });
                        }}
                    >
                        Logout
                    </ActionButton>
                )}
                <ActionButton type="button" onClick={onToggleTheme}>
                    Switch to {darkMode ? 'light' : 'dark'} mode
                </ActionButton>
            </Actions>
        </Header>
    );
}
