"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { notificationsApi, type NotificationDTO } from "@/lib/api/notifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function NotificationsPopover() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getMyNotifications();
            setNotifications(data);
        } catch (error: any) {
            console.error("Erreur lors du chargement des notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const data = await notificationsApi.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error("Erreur lors du comptage des notifications:", error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        // Mise à jour optimiste (immédiate dans l'UI)
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, lu: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Puis appel API en arrière-plan (ne pas bloquer)
        notificationsApi.markAsRead(id).catch(error => {
            console.error("Erreur lors du marquage comme lu:", error);
            // Ne pas annuler la mise à jour UI pour éviter la confusion
        });
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
            setUnreadCount(0);
            toast.success("Toutes les notifications ont été marquées comme lues");
        } catch (error: any) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await notificationsApi.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            fetchUnreadCount();
            toast.success("Notification supprimée");
        } catch (error: any) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleNotificationClick = (notification: NotificationDTO) => {
        // Marquer comme lue immédiatement (sans attendre)
        if (!notification.lu && notification.id) {
            handleMarkAsRead(notification.id);
        }

        // Naviguer vers la ressource liée
        if (notification.rendezVousId) {
            router.push(`/dashboard/rendezvous/${notification.rendezVousId}`);
            setOpen(false);
        } else if (notification.dossierId) {
            router.push(`/dashboard/dossiers/${notification.dossierId}`);
            setOpen(false);
        } else if (notification.patientId) {
            router.push(`/dashboard/patients/${notification.patientId}`);
            setOpen(false);
        }
    };

    const getNotificationIcon = (type?: string) => {
        switch (type) {
            case "RENDEZ_VOUS":
                return "📅";
            case "DOSSIER":
                return "📁";
            case "SUCCESS":
                return "✅";
            case "WARNING":
                return "⚠️";
            case "ERROR":
                return "❌";
            default:
                return "ℹ️";
        }
    };

    const getNotificationColor = (type?: string) => {
        switch (type) {
            case "SUCCESS":
                return "bg-green-50 border-green-200";
            case "WARNING":
                return "bg-yellow-50 border-yellow-200";
            case "ERROR":
                return "bg-red-50 border-red-200";
            case "RENDEZ_VOUS":
                return "bg-blue-50 border-blue-200";
            case "DOSSIER":
                return "bg-purple-50 border-purple-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return "À l'instant";
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        if (days < 7) return `Il y a ${days}j`;
        return date.toLocaleDateString("fr-FR");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-blue-50/50">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-medium shadow-lg shadow-red-500/30 animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700"
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500 text-sm">Chargement...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Bell className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm font-medium">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group",
                                        !notification.lu && "bg-blue-50/30"
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg border",
                                            getNotificationColor(notification.type)
                                        )}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-sm">
                                                    {notification.titre}
                                                </p>
                                                {!notification.lu && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatDate(notification.dateEnvoi)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (notification.id) handleDelete(notification.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
