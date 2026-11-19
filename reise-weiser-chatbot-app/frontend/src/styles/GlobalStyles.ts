import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    @property --rw-border-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
    }

    @keyframes rwClickBorderSpin {
        0% {
            --rw-border-angle: 0deg;
            opacity: 0.2;
        }
        14% {
            opacity: 1;
        }
        82% {
            opacity: 1;
        }
        100% {
            --rw-border-angle: 360deg;
            opacity: 0;
        }
    }

    @keyframes rwBorderLoop {
        0% {
            --rw-border-angle: 0deg;
        }
        100% {
            --rw-border-angle: 360deg;
        }
    }

    @keyframes rwDotWave {
        0%,
        60%,
        100% {
            opacity: 0.3;
            transform: translateY(0);
        }
        30% {
            opacity: 1;
            transform: translateY(-2px);
        }
    }

    * {
        box-sizing: border-box;
    }

    body {
        position: relative;
        margin: 0;
        min-height: 100dvh;
        overflow-x: hidden;
        color-scheme: light;
        background-color: ${({ theme }) => theme.colors.canvas};
        color: ${({ theme }) => theme.colors.text};
        font-family: ${({ theme }) => theme.fontFamily};
        -webkit-font-smoothing: antialiased;
    }

    body.dark {
        color-scheme: dark;
    }

    body::before {
        content: '';
        position: fixed;
        inset: 0;
        background: ${({ theme }) => theme.glass.pageBackground};
        pointer-events: none;
        z-index: 0;
    }

    #root {
        position: relative;
        z-index: 1;
    }

    button,
    input,
    textarea {
        font: inherit;
    }

    button {
        cursor: pointer;
        touch-action: manipulation;
    }

    a {
        color: inherit;
    }

    :focus-visible {
        outline: 3px solid ${({ theme }) => theme.colors.primary};
        outline-offset: 3px;
    }
`;
