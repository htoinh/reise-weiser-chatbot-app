import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { renderWithProviders } from './testUtils';

describe('Form submission & Chat flow', () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('submits Login form credentials and displays error banner on failure', async () => {
        const user = userEvent.setup();
        const login = vi
            .fn()
            .mockRejectedValueOnce(new Error('Invalid email or password.'))
            .mockResolvedValueOnce(undefined);

        renderWithProviders(<Login />, { route: '/login', auth: { login } });

        await user.type(screen.getByLabelText('Email'), '  alice@example.com ');
        await user.type(screen.getByLabelText('Password'), 'Password123!');
        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.');
        expect(login).toHaveBeenCalledWith({
            email: 'alice@example.com',
            password: 'Password123!',
        });

        await user.click(screen.getByRole('button', { name: 'Sign in' }));
        await waitFor(() => expect(login).toHaveBeenCalledTimes(2));
    });

    it('submits Register form fields with trimmed name and email', async () => {
        const user = userEvent.setup();
        const register = vi.fn().mockResolvedValue(undefined);

        renderWithProviders(<Register />, { route: '/register', auth: { register } });

        await user.type(screen.getByLabelText('Name'), '  Alice  ');
        await user.type(screen.getByLabelText('Email'), ' alice@example.com ');
        await user.type(screen.getByLabelText('Password'), 'Password123!');
        await user.click(screen.getByRole('button', { name: 'Create account' }));

        await waitFor(() =>
            expect(register).toHaveBeenCalledWith({
                name: 'Alice',
                email: 'alice@example.com',
                password: 'Password123!',
            }),
        );
    });

    it('loads chat history, rolls back unsaved bubble on error, and renders user & ReiseWeiser replies on success', async () => {
        const user = userEvent.setup();
        let sendAttempts = 0;

        globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
            const url = String(input);
            if (url.endsWith('/chat-history')) {
                return new Response(JSON.stringify([]), { status: 200 });
            }
            if (url.endsWith('/chatbot/conversation')) {
                return new Response(
                    JSON.stringify({ conversationId: 21, title: 'New conversation' }),
                    { status: 201 },
                );
            }
            sendAttempts += 1;
            if (sendAttempts === 1) {
                return new Response(JSON.stringify({ message: 'AI quota exceeded.' }), {
                    status: 429,
                });
            }
            return new Response(
                JSON.stringify({
                    messageId: 55,
                    conversationId: 21,
                    content: 'Explore Kyoto temples in spring.',
                }),
                { status: 200 },
            );
        });

        renderWithProviders(<Chat />, {
            route: '/chat',
            auth: { isAuthenticated: true, userName: 'Alice', token: 'jwt' },
        });

        expect(
            await screen.findByText('No messages yet. Ask ReiseWeiser where to travel next!'),
        ).toBeInTheDocument();

        await user.type(screen.getByLabelText('Chat prompt'), 'Failed prompt');
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('AI quota exceeded.');
        expect(screen.queryByText('Failed prompt')).not.toBeInTheDocument();

        await user.type(screen.getByLabelText('Chat prompt'), 'Where in Japan?');
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect(await screen.findByText('Where in Japan?')).toBeInTheDocument();
        expect(await screen.findByText('Explore Kyoto temples in spring.')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('ReiseWeiser')).toBeInTheDocument();
    });
});
