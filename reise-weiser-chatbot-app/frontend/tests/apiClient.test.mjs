import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { loginUser, registerUser } from '../src/api/auth.ts';
import {
    ApiError,
    TOKEN_STORAGE_KEY,
    apiClient,
    clearToken,
    extractEmailFromToken,
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
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        setToken(jwt);

        let capturedUrl = '';
        let capturedHeaders = null;
        globalThis.fetch = async (url, init) => {
            capturedUrl = String(url);
            capturedHeaders = new Headers(init?.headers);
            return new Response(JSON.stringify([]), { status: 200 });
        };

        const data = await apiClient.get('/chat-history');
        assert.deepEqual(data, []);
        assert.equal(capturedUrl, '/api/chat-history');
        assert.equal(capturedHeaders.get('Authorization'), `Bearer ${jwt}`);
        assert.equal(extractEmailFromToken(getToken()), 'alice@example.com');
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
});
