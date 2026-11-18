import styled from 'styled-components';

const FooterBar = styled.footer`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: ${({ theme }) => theme.colors.surface};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.875rem;
    text-align: center;
`;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <FooterBar>
            <span>&copy; {year} ReiseWeiser &middot; Studiosus. All rights reserved.</span>
        </FooterBar>
    );
}
