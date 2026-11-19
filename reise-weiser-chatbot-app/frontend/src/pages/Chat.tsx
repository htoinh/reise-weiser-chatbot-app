import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    createConversation,
    expandHistoryToMessages,
    getChatHistory,
    sendChatMessage,
} from '../api/chat';
import type { ChatItem } from '../api/chat';
import { useAuth } from '../auth/authContext';
import { ErrorBanner } from '../components/AuthFormStyles';
import ChatInput from '../components/ChatInput';
import Message from '../components/Message';
import { animatedPrismBorder, liquidGlassPanel, WaveDots } from '../styles/glass';

const ChatShell = styled.section`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: clamp(0.85rem, 2vw, 1.15rem);
    padding: clamp(1rem, 3vw, 1.75rem);
    border-radius: clamp(1.15rem, 2.5vw, 1.5rem);
    ${liquidGlassPanel}
`;

const TitleBlock = styled.header`
    h1 {
        margin: 0 0 0.25rem;
        font-size: clamp(1.25rem, 2.6vw, 1.55rem);
        letter-spacing: -0.02em;
    }

    p {
        margin: 0;
        font-size: clamp(0.92rem, 1.8vw, 1rem);
    }
`;

const MessageViewport = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    min-height: clamp(14rem, 42dvh, 22rem);
    max-height: calc(100dvh - 18.5rem);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.4rem 0.25rem;

    @media (max-width: 44rem) {
        max-height: calc(100dvh - 22rem);
    }
`;

const StatusNotice = styled.p`
    margin: auto;
    text-align: center;
    color: ${({ theme }) => theme.colors.muted};
`;

const ThinkingBubble = styled.div`
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    max-width: min(82%, 24rem);
    padding: 0.7rem 1.05rem;
    border-radius: 1.2rem 1.2rem 1.2rem 0.3rem;
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: ${({ theme }) => theme.glass.primaryGradient};
    color: ${({ theme }) => theme.colors.onPrimary};
    box-shadow: ${({ theme }) => theme.glass.primaryShadow};
    font-size: 0.92rem;
    font-weight: 500;
    ${animatedPrismBorder}

    &::after {
        opacity: 1;
        animation: rwBorderLoop 1.5s linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
        &::after {
            animation: none;
        }
    }
`;

function nextClientId(prefix: string): string {
    const uid =
        typeof globalThis.crypto?.randomUUID === 'function'
            ? globalThis.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return `${prefix}-${uid}`;
}

export default function Chat() {
    const { userName } = useAuth();
    const [messages, setMessages] = useState<ChatItem[]>([]);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;

        getChatHistory(controller.signal)
            .then((history) => {
                if (cancelled) {
                    return;
                }
                setMessages(expandHistoryToMessages(history));
                setConversationId(
                    history.length > 0 ? history[history.length - 1].conversationId : null,
                );
            })
            .catch((err: unknown) => {
                if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) {
                    return;
                }
                setError(
                    err instanceof Error ? err.message : 'Unable to load previous chat messages.',
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoadingHistory(false);
                }
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
    }, [messages, isSending]);

    const handleSend = async (promptMessage: string) => {
        setError(null);
        setIsSending(true);

        const userItem: ChatItem = {
            id: nextClientId('user'),
            role: 'user',
            content: promptMessage,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userItem]);

        try {
            let activeConversationId = conversationId;
            if (activeConversationId === null) {
                const created = await createConversation();
                activeConversationId = created.conversationId;
                setConversationId(activeConversationId);
            }

            const reply = await sendChatMessage({
                conversationId: activeConversationId,
                promptMessage,
            });

            const assistantItem: ChatItem = {
                id: reply.messageId ? `ai-${reply.messageId}` : nextClientId('ai'),
                role: 'assistant',
                content: reply.content,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantItem]);
        } catch (err) {
            setMessages((prev) => prev.filter((item) => item.id !== userItem.id));
            setError(
                err instanceof Error ? err.message : 'Unable to send message. Please try again.',
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ChatShell>
            <TitleBlock>
                <h1>Your travel companion</h1>
                <p>Plan itineraries, discover destinations, and get tailored travel advice.</p>
            </TitleBlock>

            <MessageViewport role="log" aria-live="polite" aria-label="Chat messages">
                {isLoadingHistory ? (
                    <StatusNotice>Loading your previous conversations...</StatusNotice>
                ) : messages.length === 0 ? (
                    <StatusNotice>
                        No messages yet. Ask ReiseWeiser where to travel next!
                    </StatusNotice>
                ) : (
                    messages.map((item) => (
                        <Message
                            key={item.id}
                            role={item.role}
                            content={item.content}
                            senderName={item.role === 'user' ? (userName ?? 'User') : 'ReiseWeiser'}
                            createdAt={item.createdAt}
                        />
                    ))
                )}
                {isSending && (
                    <ThinkingBubble role="status" data-testid="thinking-indicator">
                        <span>ReiseWeiser is thinking</span>
                        <WaveDots />
                    </ThinkingBubble>
                )}
                <div ref={messagesEndRef} />
            </MessageViewport>

            {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

            <ChatInput onSend={handleSend} disabled={isSending} />
        </ChatShell>
    );
}
