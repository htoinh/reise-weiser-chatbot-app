const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? '/api';

export const TOKEN_STORAGE_KEY = 'reiseweiser_token';

interface JwtClaims {
    sub?: string;
    exp?: number;
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
    unauthorizedHandler = handler;
}

function getStorage(): Storage | null {
    try {
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
        return null;
    }
}

function parseJwtClaims(token: string): JwtClaims | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        return JSON.parse(atob(padded)) as JwtClaims;
    } catch {
        return null;
    }
}

export function extractEmailFromToken(token: string | null): string | null {
    if (!token) {
        return null;
    }
    const claims = parseJwtClaims(token);
    return typeof claims?.sub === 'string' && claims.sub.length > 0 ? claims.sub : null;
}

export function setToken(token: string): void {
    getStorage()?.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
    getStorage()?.removeItem(TOKEN_STORAGE_KEY);
}

export function getToken(): string | null {
    const token = getStorage()?.getItem(TOKEN_STORAGE_KEY) ?? null;
    if (!token) {
        return null;
    }
    const claims = parseJwtClaims(token);
    if (typeof claims?.exp === 'number' && claims.exp * 1000 <= Date.now()) {
        clearToken();
        return null;
    }
    return token;
}

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    skipAuth?: boolean;
}

function resolveErrorMessage(status: number, parsed: unknown, skipAuth?: boolean): string {
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
        const serverMessage = (parsed as { message?: unknown }).message;
        if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
            return serverMessage;
        }
    }
    if (status === 401 || (status === 403 && skipAuth)) {
        return skipAuth
            ? 'Invalid email or password.'
            : 'Your session has expired. Please sign in again.';
    }
    if (status === 409) {
        return 'An account with this email already exists.';
    }
    if (status === 400) {
        return 'Please check your input and try again.';
    }
    return 'Request failed. Please try again.';
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { body, headers: initHeaders, skipAuth = false, ...rest } = options;
    const headers = new Headers(initHeaders);

    let serializedBody: BodyInit | undefined;
    if (body !== undefined) {
        if (
            typeof body === 'string' ||
            body instanceof FormData ||
            body instanceof URLSearchParams
        ) {
            serializedBody = body;
        } else {
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
            serializedBody = JSON.stringify(body);
        }
    }

    // Request interceptor: automatically attach Bearer JWT when present
    if (!skipAuth) {
        const token = getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers,
        body: serializedBody,
    });

    const rawText = await response.text();
    let parsed: unknown = undefined;
    if (rawText.length > 0) {
        try {
            parsed = JSON.parse(rawText);
        } catch {
            parsed = rawText;
        }
    }

    // Response interceptor: clear session on 401 from protected endpoints and normalize errors
    if (!response.ok) {
        if (response.status === 401 && !skipAuth) {
            clearToken();
            unauthorizedHandler?.();
        }
        throw new ApiError(response.status, resolveErrorMessage(response.status, parsed, skipAuth));
    }

    return parsed as T;
}

export const apiClient = {
    request,
    get<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(path, { ...options, method: 'GET' });
    },
    post<T>(
        path: string,
        body?: unknown,
        options?: Omit<ApiRequestOptions, 'method' | 'body'>,
    ): Promise<T> {
        return request<T>(path, { ...options, method: 'POST', body });
    },
};
