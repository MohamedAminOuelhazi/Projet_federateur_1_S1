"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, AuthResponseDTO, UserDTO } from '@/lib/api/auth';
import { toast } from 'sonner';

export type Role = 'MEDECIN' | 'ASSISTANT' | 'PATIENT' | string | null;

interface AuthContextValue {
    user: UserDTO | null;
    role: Role;
    loading: boolean;
    login: (username: string, mot_de_passe: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const current = await authApi.getCurrentUser();
            setUser(current);
        } catch (err: any) {
            // Si erreur 401, le token est expiré ou invalide
            if (err.message && err.message.includes('401')) {
                console.warn('Token expiré ou invalide, déconnexion...');
                localStorage.removeItem('authToken');
                setUser(null);
                setLoading(false);
                // Notifier l'utilisateur seulement s'il était connecté
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    toast.error('Votre session a expiré. Veuillez vous reconnecter.');
                }
                return;
            }

            // fallback: try decode token pour les autres erreurs
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const u: any = {
                    id: payload.sub ? parseInt(payload.sub) : payload.id,
                    username: payload.username || payload.sub,
                    nom: payload.nom || payload.firstname || payload.lastname,
                    prenom: payload.prenom,
                    email: payload.email,
                    usertype: payload.usertype || payload.role || payload.roles || null,
                };
                setUser(u as UserDTO);
            } catch (e) {
                console.error('Impossible de récupérer l\'utilisateur depuis le token', e);
                localStorage.removeItem('authToken');
                setUser(null);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        loadUser();

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'authToken') loadUser();
        };
        const handleCustom = () => loadUser();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('authTokenChanged', handleCustom as EventListener);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('authTokenChanged', handleCustom as EventListener);
        };
    }, []);

    const login = async (username: string, mot_de_passe: string) => {
        const resp: AuthResponseDTO = await authApi.login({ username, mot_de_passe } as any);
        const token = resp.accessToken || (resp as any).token;
        if (token) {
            localStorage.setItem('authToken', token);
            window.dispatchEvent(new Event('authTokenChanged'));
            await loadUser();
        }
    };

    const logout = () => {
        // Supprimer le token et nettoyer l'état
        authApi.logout();
        setUser(null);
        window.dispatchEvent(new Event('authTokenChanged'));

        // Forcer la redirection immédiate
        if (typeof window !== 'undefined') {
            // Utiliser replace au lieu de href pour éviter l'historique
            window.location.replace('/');
        }
    };

    const role: Role = (user && (user.usertype as Role)) || null;

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout, refreshUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
