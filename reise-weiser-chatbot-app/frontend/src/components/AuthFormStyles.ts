import styled from 'styled-components';
import { InteractiveButton, liquidGlassInput, liquidGlassPanel } from '../styles/glass';

export const AuthCard = styled.section`
    width: 100%;
    max-width: 28rem;
    margin: auto;
    padding: clamp(1.35rem, 4vw, 2.25rem);
    border-radius: clamp(1.15rem, 2.5vw, 1.5rem);
    ${liquidGlassPanel}

    h1 {
        margin: 0 0 0.5rem;
        font-size: clamp(1.45rem, 3vw, 1.8rem);
        letter-spacing: -0.02em;
    }

    p {
        margin: 0 0 1.5rem;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    label {
        font-weight: 600;
        font-size: 0.95rem;
    }
`;

export const Input = styled.input`
    width: 100%;
    min-height: 2.8rem;
    padding: 0.7rem 0.95rem;
    border-radius: 0.85rem;
    ${liquidGlassInput}
`;

export const SubmitButton = styled(InteractiveButton)`
    margin-top: 0.5rem;
    min-height: 2.9rem;
    padding: 0.8rem 1.1rem;
    border-radius: 0.85rem;
    font-weight: 600;
    background: ${({ theme }) => theme.glass.submitBackground};
    backdrop-filter: blur(14px) saturate(165%);
    -webkit-backdrop-filter: blur(14px) saturate(165%);
    border: 1px solid ${({ theme }) => theme.glass.submitBorder};
    color: ${({ theme }) => theme.glass.submitText};
    box-shadow: ${({ theme }) => theme.glass.submitShadow};

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.glass.submitHoverBackground};
        transform: translateY(-1px);
    }
`;

export const ErrorBanner = styled.div`
    padding: 0.75rem 1rem;
    background: ${({ theme }) => theme.glass.errorBackground};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${({ theme }) => theme.colors.error};
    border-radius: 0.85rem;
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.95rem;
`;

export const SwitchText = styled.p`
    margin: 1.25rem 0 0 !important;
    font-size: 0.95rem;
    text-align: center;

    a {
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
    }
`;
