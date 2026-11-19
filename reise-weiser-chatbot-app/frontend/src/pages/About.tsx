import styled from 'styled-components';
import { liquidGlassPanel } from '../styles/glass';

const AboutCard = styled.section`
    width: 100%;
    max-width: 44rem;
    margin: auto;
    padding: clamp(1.35rem, 4vw, 2.25rem);
    border-radius: clamp(1.15rem, 2.5vw, 1.5rem);
    ${liquidGlassPanel}

    h1 {
        margin: 0 0 0.75rem;
        font-size: clamp(1.45rem, 3vw, 1.85rem);
        letter-spacing: -0.02em;
    }

    p {
        margin: 0;
        font-size: clamp(0.98rem, 2vw, 1.05rem);
    }
`;

export default function About() {
    return (
        <AboutCard>
            <h1>About ReiseWeiser</h1>
            <p>A chatbot app focused on everything related to traveling.</p>
        </AboutCard>
    );
}
