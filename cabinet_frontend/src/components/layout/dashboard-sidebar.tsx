"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    FolderOpen,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Stethoscope,
    UserCog,
    Receipt,
    CreditCard,
    BarChart3,
    UserCircle,
    Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthContext } from '@/context/AuthContext';
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
    isOpen: boolean;
    unreadMessages: number;
    onNavigate?: (path: string) => void;
    onLogout?: () => void;
    isDark?: boolean;
}

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "dossiers", label: "Dossiers", icon: FolderOpen, path: "/dashboard/dossiers" },
    { id: "patients", label: "Patients", icon: Users, path: "/dashboard/patients" },
    { id: "assistants", label: "Assistants", icon: UserCog, path: "/dashboard/assistants" },
    { id: "rendezvous", label: "Rendez-vous", icon: Calendar, path: "/dashboard/rendezvous" },
    { id: "factures", label: "Factures", icon: Receipt, path: "/dashboard/factures" },
    { id: "rapports", label: "Rapports", icon: BarChart3, path: "/dashboard/rapports" },
    { id: "chatbot", label: "Assistant Médical", icon: Bot, path: "/dashboard/chatbot", patientOnly: true },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, path: "/dashboard/messagerie" },
    { id: "profil", label: "Mon Profil", icon: UserCircle, path: "/dashboard/profil" },
    { id: "parametres", label: "Paramètres", icon: Settings, path: "/dashboard/parametres" },
];

export default function DashboardSidebar({
    isOpen,
    unreadMessages,
    onNavigate,
    onLogout,
    isDark = false,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthContext();

    const handleNavClick = (path: string) => {
        onNavigate?.(path);
    };

    // Déterminer les éléments visibles selon le rôle
    const userType = user?.usertype?.toUpperCase();
    let allowedIds: string[] = [];

    if (userType === 'MEDECIN') {
        // Médecin : accès complet
        allowedIds = ["dashboard", "dossiers", "patients", "assistants", "rendezvous", "factures", "rapports", "messagerie", "profil", "parametres"];
    } else if (userType === 'ASSISTANT') {
        // Assistant : gestion patients, RDV et factures
        allowedIds = ["dashboard", "patients", "rendezvous", "factures", "messagerie", "profil", "parametres"];
    } else if (userType === 'PATIENT') {
        // Patient : consultation de ses données uniquement
        allowedIds = ["dashboard", "rendezvous", "dossiers", "messagerie", "profil", "parametres"];
    } else {
        // Rôle inconnu ou non connecté
        allowedIds = ["dashboard", "profil", "parametres"];
    }

    const visibleItems = navigationItems.filter((i) => {
        // Filtrer par rôle autorisé
        if (!allowedIds.includes(i.id)) return false;
        // Filtrer les items patientOnly si l'utilisateur n'est pas patient
        if ((i as any).patientOnly && user?.usertype !== "PATIENT") return false;
        return true;
    });

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 backdrop-blur-xl border-r transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static shadow-xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "top-16 lg:top-0",
                isDark
                    ? "bg-gray-800/80 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
            )}
        >
            <nav className="flex flex-col h-full p-4 space-y-1">
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    const badge = item.id === "messagerie" ? unreadMessages : 0;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.path)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                                isActive
                                    ? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30"
                                    : isDark
                                        ? "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400"
                                        : "text-gray-700 hover:bg-cyan-50/50 hover:text-cyan-600"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                    isActive && "drop-shadow-sm"
                                )}
                            />
                            <span className="flex-1 text-left">{item.label}</span>
                            {badge > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs px-2 py-0.5 h-5 min-w-5 shadow-md"
                                >
                                    {badge}
                                </Badge>
                            )}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                            )}
                        </button>
                    );
                })}

                <div className={cn(
                    "border-t my-2",
                    isDark ? "border-gray-700/50" : "border-gray-200/50"
                )} />

                <button
                    onClick={onLogout}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                        isDark
                            ? "text-red-400 hover:bg-red-900/20"
                            : "text-red-600 hover:bg-red-50/50"
                    )}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                    <span className="flex-1 text-left">Déconnexion</span>
                </button>
            </nav>
        </aside>
    );
}
