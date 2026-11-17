import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginUser, registerUser } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../api/auth';
import {
    TOKEN_STORAGE_KEY,
    clearToken,
    extractEmailFromToken,
    getToken,
    setToken,
    setUnauthorizedHandler,
} from '../api/client';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getToken());
    const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);

    const logout = useCallback(() => {
        clearToken();
        setTokenState(null);
        setFallbackEmail(null);
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        const { token: nextToken } = await loginUser(credentials);
        setToken(nextToken);
        setTokenState(nextToken);
        setFallbackEmail(credentials.email.trim().toLowerCase());
    }, []);

    const register = useCallback(async (data: RegisterRequest) => {
        const { token: nextToken } = await registerUser(data);
        setToken(nextToken);
        setTokenState(nextToken);
        setFallbackEmail(data.email.trim().toLowerCase());
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
        const handleStorage = (event: StorageEvent) => {
            if (event.key === TOKEN_STORAGE_KEY || event.key === null) {
                setTokenState(getToken());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => {
            setUnauthorizedHandler(null);
            window.removeEventListener('storage', handleStorage);
        };
    }, [logout]);

    const userEmail = extractEmailFromToken(token) ?? (token ? fallbackEmail : null);

    const value = useMemo(
        () => ({
            token,
            userEmail,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
        }),
        [token, userEmail, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
