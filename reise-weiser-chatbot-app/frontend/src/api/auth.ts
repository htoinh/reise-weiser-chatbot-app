import { apiClient } from './client.ts';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

// shortcut: OpenAPI serves /login and /register at root, proxied via /api/login and /api/register
export function loginUser(payload: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/login', payload, { skipAuth: true });
}

export function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/register', payload, { skipAuth: true });
}
