import {Navigate, NavLink, Route, Routes} from 'react-router-dom';
import {useState} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyles.ts';
import {darkTheme, lightTheme} from "../styles/theme";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import About from "../pages/About";

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.25rem 2rem;
    background: ${({theme}) => theme.colors.surface};
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

const Brand = styled(NavLink)`
    color: ${({theme}) => theme.colors.primary};
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
        color: ${({theme}) => theme.colors.primary};
        border-bottom-color: ${({theme}) => theme.colors.primary};
    }
`;

const Content = styled.main`
    max-width: 70rem;
    margin: 3rem auto;
    padding: 0 1.5rem;

    p {
        color: ${({theme}) => theme.colors.muted};
        line-height: 1.6;
    }
`;

const ThemeButton = styled.button`
 padding: 0.6rem 1rem;
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: 999px;
 background: ${({ theme }) => theme.colors.background};
 color: ${({ theme }) => theme.colors.text};
 cursor: pointer;
`;

export default function App() {
    const [darkMode, setDarkMode] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Header>
                <Brand to="/about"> ReiseWeiser</Brand>
                <Navigation aria-label="Main navigation">
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                    <NavLink to="/chat">Chat</NavLink>
                    <NavLink to="/about">About</NavLink>
                </Navigation>

                <ThemeButton onClick={() => setDarkMode((current) => !current)}>
                    Switch to {darkMode ? 'dark' : 'light'} mode
                </ThemeButton>
            </Header>

            <Content>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/about" element={<About/>}/>
                </Routes>
            </Content>

        </ThemeProvider>
    );
}