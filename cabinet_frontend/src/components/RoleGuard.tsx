"use client";

import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
    const { user, role, loading } = useAuthContext();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else {
                const normalizedRole = (role || '').toString().toUpperCase();
                const ok = allowedRoles.map(r => r.toUpperCase()).includes(normalizedRole);
                if (!ok) {
                    router.push('/');
                }
            }
        }
    }, [user, role, loading, router, allowedRoles]);

    if (loading) return <div>Chargement...</div>;

    if (!user) return null;

    const normalizedRole = (role || '').toString().toUpperCase();
    const ok = allowedRoles.map(r => r.toUpperCase()).includes(normalizedRole);

    if (!ok) return null;

    return <>{children}</>;
};

export default RoleGuard;
