import styled from 'styled-components';

const Page = styled.main`
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
`;

const Card = styled.section`
    width: min(100%, 42rem);
    padding: 2rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 1rem;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 16px 48px rgba(23, 33, 43, 0.08);
`;

const Title = styled.h1`
    margin: 0 0 1rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: clamp(2rem, 4vw, 3rem);
`;

const Description = styled.p`
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export default function App() {
    return (
        <Page>
            <Card>
                <Title>Reise Weiser Chatbot</Title>
                <Description>
                    The frontend is now wired to Vite correctly and ready for the chatbot UI.
                </Description>
            </Card>
        </Page>
    );
}