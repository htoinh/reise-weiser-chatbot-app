import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Message from '../components/Message';
import { renderWithProviders } from './testUtils';

describe('Message.tsx', () => {
    it('renders user prompt with admin icon, database sender name, and timestamp', () => {
        const { container } = renderWithProviders(
            <Message
                role="user"
                senderName="Alice"
                content="Plan 3 days in Rome"
                createdAt="2026-11-18T10:30:00Z"
            />,
        );

        const article = container.querySelector('article[data-role="user"]');
        expect(article).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Plan 3 days in Rome')).toBeInTheDocument();
        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-11-18T10:30:00Z');
    });

    it('falls back to "User" when senderName is omitted and omits invalid timestamps', () => {
        const { container } = renderWithProviders(
            <Message role="user" content="Hello!" createdAt="not-a-date" />,
        );

        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Hello!')).toBeInTheDocument();
        expect(container.querySelector('time')).toBeNull();
    });

    it('renders AI response with robot icon and "ReiseWeiser" label in both light and dark themes', () => {
        const { container, unmount } = renderWithProviders(
            <Message role="assistant" content="Visit the Colosseum and Trastevere." />,
        );

        expect(container.querySelector('article[data-role="assistant"]')).toBeInTheDocument();
        expect(screen.getByText('ReiseWeiser')).toBeInTheDocument();
        expect(screen.queryByText('Gemini')).toBeNull();
        expect(screen.getByText('Visit the Colosseum and Trastevere.')).toBeInTheDocument();
        expect(container.querySelector('svg')).toBeInTheDocument();

        unmount();

        renderWithProviders(<Message role="assistant" content="Dark mode response." />, {
            dark: true,
        });
        expect(screen.getByText('Dark mode response.')).toBeInTheDocument();
    });
});
