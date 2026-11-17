import styled from 'styled-components';

export const AuthCard = styled.section`
    max-width: 28rem;
    margin: 0 auto;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 1rem;

    h1 {
        margin: 0 0 0.5rem;
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
    padding: 0.65rem 0.85rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
`;

export const SubmitButton = styled.button`
    margin-top: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

export const ErrorBanner = styled.div`
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.error};
    border-radius: 0.5rem;
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
