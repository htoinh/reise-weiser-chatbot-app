import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: ${({theme}) => theme.colors.background};
        color: ${({theme}) => theme.colors.text};
        font-family: ${({theme}) => theme.fontFamily};
    }

    button,
    input,
    textarea {
        font: inherit;
    }
   
    button {
        cursor: pointer;
    }

    a {
        color: inherit;
    }

    :focus-visible {
        outline: 3px solid ${({theme}) => theme.colors.primary};
        outline-offset: 4px;
    }
`;