import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentUser, loginUser, registerUser } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../api/auth';
import {
    TOKEN_STORAGE_KEY,
    clearToken,
    extractEmailFromToken,
    extractNameFromToken,
    getToken,
    setToken,
    setUnauthorizedHandler,
} from '../api/client';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getToken());
    const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);
    const [profileName, setProfileName] = useState<string | null>(null);

    const logout = useCallback(() => {
        clearToken();
        setTokenState(null);
        setFallbackEmail(null);
        setProfileName(null);
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        const { token: nextToken, name } = await loginUser(credentials);
        setToken(nextToken);
        setTokenState(nextToken);
        setFallbackEmail(credentials.email.trim().toLowerCase());
        setProfileName(name?.trim() || null);
    }, []);

    const register = useCallback(async (data: RegisterRequest) => {
        const { token: nextToken, name } = await registerUser(data);
        setToken(nextToken);
        setTokenState(nextToken);
        setFallbackEmail(data.email.trim().toLowerCase());
        setProfileName(name?.trim() || data.name.trim() || null);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
        const handleStorage = (event: StorageEvent) => {
            if (event.key === TOKEN_STORAGE_KEY || event.key === null) {
                setTokenState(getToken());
                setProfileName(null);
                setFallbackEmail(null);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => {
            setUnauthorizedHandler(null);
            window.removeEventListener('storage', handleStorage);
        };
    }, [logout]);

    const tokenName = extractNameFromToken(token);

    useEffect(() => {
        if (!token || tokenName) {
            return;
        }
        const controller = new AbortController();
        let cancelled = false;

        fetchCurrentUser(controller.signal)
            .then((profile) => {
                if (!cancelled && profile.name && profile.name.trim().length > 0) {
                    setProfileName(profile.name.trim());
                }
            })
            .catch(() => {
                // Ignore profile lookup errors; fallback email/label still renders
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [token, tokenName]);

    const userEmail = extractEmailFromToken(token) ?? (token ? fallbackEmail : null);
    const userName = token ? (tokenName ?? profileName) : null;

    const value = useMemo(
        () => ({
            token,
            userEmail,
            userName,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
        }),
        [token, userEmail, userName, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
