import { useState } from 'react';
import styled from 'styled-components';

const FormBar = styled.form`
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PromptArea = styled.textarea`
    flex: 1;
    resize: vertical;
    min-height: 3rem;
    max-height: 9rem;
    padding: 0.7rem 0.9rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.45;
`;

const SendButton = styled.button`
    padding: 0.75rem 1.35rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

export interface ChatInputProps {
    onSend: (prompt: string) => Promise<void> | void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
    const [prompt, setPrompt] = useState('');

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
                        void submitPrompt();
                    }
                }}
            />
            <SendButton type="submit" disabled={disabled} aria-busy={disabled}>
                {disabled ? 'Sending...' : 'Send'}
            </SendButton>
        </FormBar>
    );
}
