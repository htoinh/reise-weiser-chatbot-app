import { apiClient } from './client.ts';

export interface ChatHistoryItem {
    messageId: number;
    conversationId: number;
    title: string;
    createdAt: string;
    userPrompt?: string;
    aiResponse: string;
}

export interface ConversationResponse {
    conversationId: number;
    title: string;
}

export interface ChatMessageRequest {
    conversationId: number;
    promptMessage: string;
}

export interface ChatMessageResponse {
    messageId?: number;
    conversationId?: number;
    content: string;
}

export interface ChatItem {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: string;
}

export function getChatHistory(signal?: AbortSignal): Promise<ChatHistoryItem[]> {
    return apiClient.get<ChatHistoryItem[]>('/chat-history', { signal });
}

export function createConversation(): Promise<ConversationResponse> {
    return apiClient.post<ConversationResponse>('/chatbot/conversation');
}

export function sendChatMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    return apiClient.post<ChatMessageResponse>('/chatbot/message', payload);
}

export function expandHistoryToMessages(history: ChatHistoryItem[]): ChatItem[] {
    const items: ChatItem[] = [];
    for (const entry of history) {
        if (entry.userPrompt && entry.userPrompt.trim().length > 0) {
            items.push({
                id: `user-${entry.messageId}`,
                role: 'user',
                content: entry.userPrompt,
                createdAt: entry.createdAt,
            });
        }
        items.push({
            id: `ai-${entry.messageId}`,
            role: 'assistant',
            content: entry.aiResponse,
            createdAt: entry.createdAt,
        });
    }
    return items;
}
