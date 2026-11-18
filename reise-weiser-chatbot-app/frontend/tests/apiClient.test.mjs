import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { fetchCurrentUser, loginUser, registerUser } from '../src/api/auth.ts';
import {
    createConversation,
    expandHistoryToMessages,
    getChatHistory,
    sendChatMessage,
} from '../src/api/chat.ts';
import {
    ApiError,
    TOKEN_STORAGE_KEY,
    apiClient,
    clearToken,
    extractEmailFromToken,
    extractNameFromToken,
    getToken,
    setToken,
    setUnauthorizedHandler,
} from '../src/api/client.ts';

function createMemoryStorage() {
    const store = new Map();
    return {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear(),
    };
}

function makeJwt(payload) {
    const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
}

describe('apiClient & JWT interceptor (test-09)', () => {
    const originalFetch = globalThis.fetch;
    const originalWindow = globalThis.window;
    let storage;

    beforeEach(() => {
        storage = createMemoryStorage();
        globalThis.window = { localStorage: storage };
        globalThis.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');
    });

    afterEach(() => {
        setUnauthorizedHandler(null);
        globalThis.fetch = originalFetch;
        globalThis.window = originalWindow;
    });

    it('attaches Authorization: Bearer <token> automatically when token is stored', async () => {
        const jwt = makeJwt({
            sub: 'alice@example.com',
            name: 'Jürgen Müller',
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        setToken(jwt);

        let capturedUrl = '';
        let capturedHeaders = null;
        globalThis.fetch = async (url, init) => {
            capturedUrl = String(url);
            capturedHeaders = new Headers(init?.headers);
            if (String(url).endsWith('/current-user')) {
                return new Response(
                    JSON.stringify({ email: 'alice@example.com', name: 'Jürgen Müller' }),
                    { status: 200 },
                );
            }
            return new Response(JSON.stringify([]), { status: 200 });
        };

        const data = await apiClient.get('/chat-history');
        const profile = await fetchCurrentUser();
        assert.deepEqual(data, []);
        assert.equal(profile.name, 'Jürgen Müller');
        assert.equal(capturedUrl, '/api/current-user');
        assert.equal(capturedHeaders.get('Authorization'), `Bearer ${jwt}`);
        assert.equal(extractEmailFromToken(getToken()), 'alice@example.com');
        assert.equal(extractNameFromToken(getToken()), 'Jürgen Müller');
    });

    it('omits Authorization header on loginUser and registerUser (skipAuth: true)', async () => {
        setToken('stale-token-in-storage');
        const calls = [];

        globalThis.fetch = async (url, init) => {
            calls.push({
                url: String(url),
                method: init?.method,
                headers: new Headers(init?.headers),
                body: init?.body,
            });
            return new Response(JSON.stringify({ token: 'fresh-jwt' }), { status: 200 });
        };

        const loginRes = await loginUser({ email: 'alice@example.com', password: 'Password123!' });
        const regRes = await registerUser({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'Password123!',
        });

        assert.equal(loginRes.token, 'fresh-jwt');
        assert.equal(regRes.token, 'fresh-jwt');
        assert.equal(calls[0].url, '/api/login');
        assert.equal(calls[0].method, 'POST');
        assert.equal(calls[0].headers.get('Authorization'), null);
        assert.equal(calls[1].url, '/api/register');
        assert.equal(calls[1].headers.get('Authorization'), null);
    });

    it('purges expired JWT tokens before sending requests', async () => {
        const expiredJwt = makeJwt({
            sub: 'alice@example.com',
            exp: Math.floor(Date.now() / 1000) - 60,
        });
        storage.setItem(TOKEN_STORAGE_KEY, expiredJwt);

        let capturedAuth = null;
        globalThis.fetch = async (_url, init) => {
            capturedAuth = new Headers(init?.headers).get('Authorization');
            return new Response(JSON.stringify([]), { status: 200 });
        };

        await apiClient.get('/chat-history');
        assert.equal(capturedAuth, null);
        assert.equal(storage.getItem(TOKEN_STORAGE_KEY), null);
    });

    it('clears token and invokes unauthorizedHandler on 401 from protected endpoints, but not on login 401', async () => {
        setToken('valid-token');
        let logoutTriggered = 0;
        setUnauthorizedHandler(() => {
            logoutTriggered += 1;
        });

        globalThis.fetch = async () => new Response('', { status: 401 });

        await assert.rejects(
            () => loginUser({ email: 'alice@example.com', password: 'wrong' }),
            (err) => err instanceof ApiError && err.status === 401,
        );
        assert.equal(logoutTriggered, 0);
        assert.equal(getToken(), 'valid-token');

        await assert.rejects(
            () => apiClient.get('/chat-history'),
            (err) => err instanceof ApiError && err.status === 401,
        );
        assert.equal(logoutTriggered, 1);
        assert.equal(getToken(), null);

        clearToken();
    });

    it('expands chat history entries into chronological user and assistant messages', () => {
        const expanded = expandHistoryToMessages([
            {
                messageId: 10,
                conversationId: 3,
                title: 'Rome itinerary',
                createdAt: '2026-11-18T10:00:00Z',
                userPrompt: 'Best places in Rome?',
                aiResponse: 'Visit the Colosseum and Trastevere.',
            },
            {
                messageId: 11,
                conversationId: 3,
                title: 'Rome itinerary',
                createdAt: '2026-11-18T10:01:00Z',
                userPrompt: '   ',
                aiResponse: 'Follow-up tip.',
            },
        ]);

        assert.deepEqual(expanded, [
            {
                id: 'user-10',
                role: 'user',
                content: 'Best places in Rome?',
                createdAt: '2026-11-18T10:00:00Z',
            },
            {
                id: 'ai-10',
                role: 'assistant',
                content: 'Visit the Colosseum and Trastevere.',
                createdAt: '2026-11-18T10:00:00Z',
            },
            {
                id: 'ai-11',
                role: 'assistant',
                content: 'Follow-up tip.',
                createdAt: '2026-11-18T10:01:00Z',
            },
        ]);
    });

    it('calls chat endpoints with Bearer JWT and normalizes 429/502/504 errors', async () => {
        const jwt = makeJwt({
            sub: 'bob@example.com',
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        setToken(jwt);

        const seen = [];
        globalThis.fetch = async (url, init) => {
            seen.push({
                url: String(url),
                method: init?.method,
                auth: new Headers(init?.headers).get('Authorization'),
                body: init?.body ? JSON.parse(String(init.body)) : undefined,
            });
            if (String(url).endsWith('/chatbot/conversation')) {
                return new Response(
                    JSON.stringify({ conversationId: 42, title: 'New conversation' }),
                    { status: 201 },
                );
            }
            if (String(url).endsWith('/chatbot/message')) {
                return new Response(
                    JSON.stringify({ messageId: 99, conversationId: 42, content: 'Pack light!' }),
                    { status: 200 },
                );
            }
            return new Response(JSON.stringify([]), { status: 200 });
        };

        const history = await getChatHistory();
        const conv = await createConversation();
        const msg = await sendChatMessage({
            conversationId: conv.conversationId,
            promptMessage: 'Tips?',
        });

        assert.deepEqual(history, []);
        assert.equal(conv.conversationId, 42);
        assert.equal(msg.content, 'Pack light!');
        assert.equal(seen[0].url, '/api/chat-history');
        assert.equal(seen[1].url, '/api/chatbot/conversation');
        assert.equal(seen[2].url, '/api/chatbot/message');
        assert.deepEqual(seen[2].body, { conversationId: 42, promptMessage: 'Tips?' });
        assert.ok(seen.every((call) => call.auth === `Bearer ${jwt}`));

        globalThis.fetch = async () => new Response('', { status: 429 });
        await assert.rejects(
            () => sendChatMessage({ conversationId: 42, promptMessage: 'Again' }),
            (err) => err instanceof ApiError && err.status === 429 && /quota/i.test(err.message),
        );

        globalThis.fetch = async () => new Response('', { status: 504 });
        await assert.rejects(
            () => sendChatMessage({ conversationId: 42, promptMessage: 'Again' }),
            (err) =>
                err instanceof ApiError && err.status === 504 && /timed out/i.test(err.message),
        );

        globalThis.fetch = async () =>
            new Response(JSON.stringify({ detail: 'Custom upstream detail' }), { status: 502 });
        await assert.rejects(
            () => sendChatMessage({ conversationId: 42, promptMessage: 'Again' }),
            (err) =>
                err instanceof ApiError &&
                err.status === 502 &&
                err.message === 'Custom upstream detail',
        );
    });
});
