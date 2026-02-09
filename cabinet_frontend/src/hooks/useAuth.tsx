"use client";

import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
    const { user, loading } = useAuthContext();
    return { user, loading };
}

export default useAuth;
