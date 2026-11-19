import styled, { css } from 'styled-components';

const Bubble = styled.article<{ $isUser: boolean }>`
    align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
    max-width: min(82%, 38rem);
    padding: 0.85rem 1.1rem;
    border-radius: ${({ $isUser }) =>
        $isUser ? '1.2rem 1.2rem 0.3rem 1.2rem' : '1.2rem 1.2rem 1.2rem 0.3rem'};

    @media (max-width: 38rem) {
        max-width: 90%;
    }

    ${({ $isUser, theme }) =>
        $isUser
            ? css`
                  background: ${theme.glass.primaryGradient};
                  color: ${theme.colors.onPrimary};
                  border: 1px solid rgba(255, 255, 255, 0.28);
                  box-shadow: ${theme.glass.primaryShadow};
              `
            : css`
                  background: ${theme.glass.pillBackground};
                  color: ${theme.colors.text};
                  border: 1px solid ${theme.glass.border};
                  box-shadow: ${theme.glass.pillShadow};
              `}
`;

const Meta = styled.div<{ $isUser: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: ${({ $isUser }) => ($isUser ? 0.95 : 0.85)};
`;

const SenderInfo = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
`;

const IconSvg = styled.svg`
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
`;

const BodyText = styled.p<{ $isUser: boolean }>`
    && {
        margin: 0;
        color: ${({ theme, $isUser }) => ($isUser ? theme.colors.onPrimary : theme.colors.text)};
        line-height: 1.55;
        word-break: break-word;
    }
`;

function AdminIcon() {
    return (
        <IconSvg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="10" cy="7" r="4" />
            <path d="M3 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 2 .42" />
            <path d="M18.5 13.5 21 14.5v2.7c0 1.8-1.1 3.4-2.5 4-1.4-.6-2.5-2.2-2.5-4v-2.7l2.5-1z" />
        </IconSvg>
    );
}

function RobotIcon() {
    return (
        <IconSvg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </IconSvg>
    );
}

function formatTime(iso?: string): string | null {
    if (!iso) {
        return null;
    }
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export interface MessageProps {
    role: 'user' | 'assistant';
    content: string;
    senderName?: string;
    createdAt?: string;
}

export default function Message({ role, content, senderName, createdAt }: MessageProps) {
    const isUser = role === 'user';
    const timeLabel = formatTime(createdAt);
    const displayName = isUser ? senderName?.trim() || 'User' : 'ReiseWeiser';

    return (
        <Bubble $isUser={isUser} data-role={role}>
            <Meta $isUser={isUser}>
                <SenderInfo>
                    {isUser ? <AdminIcon /> : <RobotIcon />}
                    <span>{displayName}</span>
                </SenderInfo>
                {timeLabel && <time dateTime={createdAt}>{timeLabel}</time>}
            </Meta>
            <BodyText $isUser={isUser}>{content}</BodyText>
        </Bubble>
    );
}
