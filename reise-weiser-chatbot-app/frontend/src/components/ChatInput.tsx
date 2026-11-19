import { useRef, useState } from 'react';
import styled from 'styled-components';
import {
    InteractiveButton,
    liquidGlassInput,
    triggerClickBorderAnimation,
    WaveDots,
} from '../styles/glass';

const FormBar = styled.form`
    display: flex;
    align-items: flex-end;
    gap: 0.65rem;
    padding-top: 0.9rem;
    border-top: 1px solid ${({ theme }) => theme.glass.border};

    @media (max-width: 28rem) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const PromptArea = styled.textarea`
    flex: 1;
    width: 100%;
    resize: vertical;
    min-height: 2.9rem;
    max-height: 9rem;
    padding: 0.7rem 0.95rem;
    border-radius: 0.95rem;
    line-height: 1.45;
    ${liquidGlassInput}
`;

const SendButton = styled(InteractiveButton)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.9rem;
    padding: 0.75rem 1.4rem;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    background: ${({ theme }) => theme.glass.primaryGradient};
    color: ${({ theme }) => theme.colors.onPrimary};
    box-shadow: ${({ theme }) => theme.glass.primaryShadow};

    &:hover:not(:disabled) {
        filter: brightness(1.05);
        transform: translateY(-1px);
    }
`;

export interface ChatInputProps {
    onSend: (prompt: string) => Promise<void> | void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
    const [prompt, setPrompt] = useState('');
    const sendButtonRef = useRef<HTMLButtonElement | null>(null);

    const submitPrompt = async () => {
        const trimmed = prompt.trim();
        if (!trimmed || disabled) {
            return;
        }
        setPrompt('');
        await onSend(trimmed);
    };

    return (
        <FormBar
            onSubmit={(event) => {
                event.preventDefault();
                void submitPrompt();
            }}
        >
            <PromptArea
                rows={2}
                aria-label="Chat prompt"
                placeholder="Ask about destinations, itineraries, or travel tips..."
                maxLength={2000}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        if (prompt.trim() && !disabled) {
                            triggerClickBorderAnimation(sendButtonRef.current);
                        }
                        void submitPrompt();
                    }
                }}
            />
            <SendButton ref={sendButtonRef} type="submit" disabled={disabled} aria-busy={disabled}>
                {disabled ? (
                    <>
                        <span>Sending</span>
                        <WaveDots />
                    </>
                ) : (
                    'Send'
                )}
            </SendButton>
        </FormBar>
    );
}
