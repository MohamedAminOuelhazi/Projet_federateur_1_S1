"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();
    const { user, loading: loadingAuth } = useAuth();
    const { profile, loading: loadingProfile } = useUserProfile();
    const { logout } = useAuthContext();

    // Charger le thème depuis localStorage au montage
    useEffect(() => {
        const savedTheme = localStorage.getItem('dashboardTheme');
        setIsDark(savedTheme === 'dark');
    }, []);

    // Sauvegarder le thème dans localStorage quand il change
    const handleThemeToggle = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('dashboardTheme', newTheme ? 'dark' : 'light');
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    // Redirection dans useEffect pour éviter l'erreur de mise à jour pendant le rendu
    useEffect(() => {
        if (!loadingAuth && !loadingProfile && !user) {
            router.replace("/login");
        }
    }, [loadingAuth, loadingProfile, user, router]);

    if (loadingAuth || loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Redirection vers la connexion...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Chargement du profil...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-50'
            }`}>
            <DashboardHeader
                user={{
                    displayName: profile.displayName || profile.nom || "Utilisateur",
                    avatar: profile.avatar,
                }}
                unreadNotifications={0}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                onNavigate={handleNavigate}
                isDark={isDark}
                onThemeToggle={handleThemeToggle}
            />

            <div className="flex">
                <DashboardSidebar
                    isOpen={sidebarOpen}
                    unreadMessages={0}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    isDark={isDark}
                />

                {/* Overlay mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden top-16"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className={isDark ? 'dark-theme' : ''}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
