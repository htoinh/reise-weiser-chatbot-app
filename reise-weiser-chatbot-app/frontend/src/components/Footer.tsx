import styled from 'styled-components';
import { pageContainerWidth } from '../styles/glass';

const FooterBar = styled.footer`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto clamp(0.65rem, 2vw, 1rem);
    padding: clamp(0.75rem, 2vw, 0.95rem) clamp(1rem, 3vw, 1.5rem);
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.875rem;
    text-align: center;
    ${pageContainerWidth}
`;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <FooterBar>
            <span>&copy; {year} ReiseWeiser. Studiosus Reisen München GmbH</span>
        </FooterBar>
    );
}
