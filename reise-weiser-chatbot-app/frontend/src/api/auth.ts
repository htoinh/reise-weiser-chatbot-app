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
    name?: string;
}

export interface UserProfileResponse {
    email: string;
    name?: string;
}

// shortcut: OpenAPI serves /login and /register at root, proxied via /api/login and /api/register
export function loginUser(payload: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/login', payload, { skipAuth: true });
}

export function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/register', payload, { skipAuth: true });
}

export function fetchCurrentUser(signal?: AbortSignal): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/current-user', { signal });
}
