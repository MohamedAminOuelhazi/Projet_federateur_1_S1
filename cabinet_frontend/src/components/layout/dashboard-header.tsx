"use client";

import { useState } from "react";
import { Search, Menu, X, Sun, Moon, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { NotificationsPopover } from "@/components/NotificationsPopover";

interface DashboardHeaderProps {
    user: {
        displayName: string;
        avatar?: string;
    };
    unreadNotifications: number;
    onMenuClick: () => void;
    onNavigate?: (path: string) => void;
    isDark?: boolean;
    onThemeToggle?: () => void;
}

export default function DashboardHeader({
    user,
    unreadNotifications,
    onMenuClick,
    onNavigate,
    isDark = false,
    onThemeToggle,
}: DashboardHeaderProps) {
    const getInitials = (name: string | undefined): string => {
        if (!name || name.trim() === "") return "?";
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-sm transition-colors ${isDark
            ? 'bg-gray-900/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            }`}>
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left: Logo + Menu */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-sky-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <span className={`hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                            Dashboard
                        </span>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                        <Input
                            type="search"
                            placeholder="Rechercher un dossier, client..."
                            className={`pl-10 w-full transition-colors ${isDark
                                ? 'border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 focus:bg-gray-800'
                                : 'border-gray-200 bg-white/50 focus:bg-white'
                                }`}
                        />
                    </div>
                </div>

                {/* Right: Theme Toggle + Notifications + User */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle Button */}
                    {onThemeToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onThemeToggle}
                            className={`rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </Button>
                    )}

                    <NotificationsPopover />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`flex items-center gap-2 h-auto py-2 px-3 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-cyan-50/50'
                                    }`}
                            >
                                <Avatar className="h-8 w-8 ring-2 ring-cyan-100">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName || "User"} />
                                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
                                        {getInitials(user.displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={`hidden sm:inline-block text-sm font-medium ${isDark ? 'text-gray-200' : ''}`}>
                                    {user.displayName || "Utilisateur"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onNavigate?.("/dashboard/parametres")}>
                                <Settings className="mr-2 h-4 w-4" />
                                Paramètres
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
