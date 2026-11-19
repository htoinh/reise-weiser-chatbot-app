import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../auth/authContext';
import { InteractiveButton, pageContainerWidth } from '../styles/glass';

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    margin: clamp(0.65rem, 2vw, 1rem) auto 0;
    padding: clamp(0.75rem, 2vw, 0.95rem) clamp(1rem, 3vw, 1.5rem);
    ${pageContainerWidth}
`;

const Brand = styled(NavLink)`
    color: ${({ theme }) => theme.colors.primary};
    font-size: clamp(1.2rem, 2.5vw, 1.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-decoration: none;
`;

const Navigation = styled.nav`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.35rem;

    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.5rem;
        text-decoration: none;
        padding: 0.45rem 0.95rem;
        font-weight: 500;
        font-size: 0.95rem;
    }

    a.active {
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
    }

    @media (max-width: 44rem) {
        order: 3;
        flex: 1 1 100%;
        padding-top: 0.35rem;

        a {
            flex: 1 1 auto;
        }
    }
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.55rem;
`;

const StatusBadge = styled.span`
    max-width: 13rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.88rem;
    font-weight: 500;

    @media (max-width: 30rem) {
        display: none;
    }
`;

const ActionButton = styled(InteractiveButton)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.55rem;
    gap: 0.45rem;
    padding: 0.45rem 0.95rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.88rem;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.glass.pillBackground};
    backdrop-filter: blur(14px) saturate(175%);
    -webkit-backdrop-filter: blur(14px) saturate(175%);
    border: 1px solid ${({ theme }) => theme.glass.border};
    box-shadow: ${({ theme }) => theme.glass.pillShadow};

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.glass.pillHoverBackground};
        transform: translateY(-1px);
    }
`;

const ThemeToggleGroup = styled.div`
    display: inline-flex;
    align-items: center;
    min-height: 2.55rem;
    gap: 0.3rem;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.glass.pillBackground};
    backdrop-filter: blur(14px) saturate(175%);
    -webkit-backdrop-filter: blur(14px) saturate(175%);
    border: 1px solid ${({ theme }) => theme.glass.border};
    box-shadow: ${({ theme }) => theme.glass.pillShadow};

    @media (max-width: 24rem) {
        gap: 0.2rem;
        padding: 0.22rem 0.38rem;
    }
`;

const ThemeModeLabel = styled.button<{ $active: boolean; $variant: 'light' | 'dark' }>`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.42rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: ${({ $active, theme }) => ($active ? theme.colors.text : theme.colors.muted)};
    font-size: 0.82rem;
    font-weight: ${({ $active }) => ($active ? 600 : 500)};
    line-height: 1;
    opacity: ${({ $active }) => ($active ? 1 : 0.58)};
    user-select: none;
    transition:
        color 0.25s ease,
        opacity 0.25s ease;

    svg {
        color: ${({ $active, $variant, theme }) =>
            !$active ? 'currentColor' : $variant === 'light' ? '#d97706' : theme.colors.primary};
        transform: ${({ $active }) => ($active ? 'scale(1)' : 'scale(0.92)')};
        transition:
            color 0.25s ease,
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover {
        opacity: ${({ $active }) => ($active ? 1 : 0.9)};
    }

    @media (max-width: 24rem) {
        padding: 0.2rem 0.28rem;
        font-size: 0.76rem;
    }
`;

const SwitchTrack = styled.button<{ $darkMode: boolean }>`
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 2.6rem;
    height: 1.4rem;
    padding: 0.125rem;
    border-radius: 999px;
    border: 1px solid
        ${({ $darkMode }) => ($darkMode ? 'rgba(124, 224, 179, 0.42)' : 'rgba(72, 92, 84, 0.24)')};
    background: ${({ $darkMode, theme }) =>
        $darkMode ? theme.glass.primaryGradient : 'rgba(72, 92, 84, 0.16)'};
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.16);
    flex-shrink: 0;
    transition:
        background 0.32s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.32s ease;
`;

const SwitchThumb = styled.span<{ $darkMode: boolean }>`
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 50%;
    background: ${({ $darkMode }) => ($darkMode ? '#ecfdf5' : '#ffffff')};
    box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateX(
        ${({ $darkMode }) => ($darkMode ? 'calc(2.6rem - 2px - 0.25rem - 1.05rem)' : '0')}
    );
    transition:
        transform 0.34s cubic-bezier(0.34, 1.45, 0.64, 1),
        background-color 0.28s ease;

    ${SwitchTrack}:active & {
        transform: translateX(
                ${({ $darkMode }) => ($darkMode ? 'calc(2.6rem - 2px - 0.25rem - 1.05rem)' : '0')}
            )
            scaleX(1.08);
    }

    @media (prefers-reduced-motion: reduce) {
        transition-duration: 0.01ms;
    }
`;

const IconSvg = styled.svg`
    width: 0.88rem;
    height: 0.88rem;
    flex-shrink: 0;
`;

function SunIcon() {
    return (
        <IconSvg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            data-icon="sun"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </IconSvg>
    );
}

function MoonIcon() {
    return (
        <IconSvg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            data-icon="moon"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </IconSvg>
    );
}

export interface NavbarProps {
    darkMode: boolean;
    onChangeTheme: (darkMode: boolean) => void;
}

export default function Navbar({ darkMode, onChangeTheme }: NavbarProps) {
    const { isAuthenticated, userName, logout } = useAuth();
    const navigate = useNavigate();

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
                {isAuthenticated && (
                    <>
                        <StatusBadge aria-label="User status">
                            {userName ? `Signed in as ${userName}` : 'Signed in'}
                        </StatusBadge>
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
                <ThemeToggleGroup role="group" aria-label="Color theme">
                    <ThemeModeLabel
                        type="button"
                        $variant="light"
                        $active={!darkMode}
                        aria-pressed={!darkMode}
                        onClick={() => onChangeTheme(false)}
                    >
                        <SunIcon />
                        <span>Light</span>
                    </ThemeModeLabel>

                    <SwitchTrack
                        type="button"
                        role="switch"
                        aria-label="Dark mode"
                        aria-checked={darkMode}
                        $darkMode={darkMode}
                        onClick={() => onChangeTheme(!darkMode)}
                    >
                        <SwitchThumb $darkMode={darkMode} />
                    </SwitchTrack>

                    <ThemeModeLabel
                        type="button"
                        $variant="dark"
                        $active={darkMode}
                        aria-pressed={darkMode}
                        onClick={() => onChangeTheme(true)}
                    >
                        <MoonIcon />
                        <span>Dark</span>
                    </ThemeModeLabel>
                </ThemeToggleGroup>
            </Actions>
        </Header>
    );
}
