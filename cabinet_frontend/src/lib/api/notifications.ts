import { apiCall } from './config';

export interface NotificationDTO {
    id?: number;
    titre: string;
    message: string;
    type?: string; // INFO, SUCCESS, WARNING, ERROR, RENDEZ_VOUS, DOSSIER
    lu?: boolean;
    dateEnvoi?: string;
    rendezVousId?: number;
    dossierId?: number;
    patientId?: number;
    userId?: number;
}

export const notificationsApi = {
    // Récupérer toutes mes notifications
    getMyNotifications: (): Promise<NotificationDTO[]> => {
        return apiCall<NotificationDTO[]>('/api/notifications/me');
    },

    // Récupérer mes notifications non lues
    getUnreadNotifications: (): Promise<NotificationDTO[]> => {
        return apiCall<NotificationDTO[]>('/api/notifications/me/unread');
    },

    // Compter les notifications non lues
    getUnreadCount: (): Promise<{ count: number }> => {
        return apiCall<{ count: number }>('/api/notifications/me/unread/count');
    },

    // Marquer une notification comme lue
    markAsRead: (id: number): Promise<NotificationDTO> => {
        return apiCall<NotificationDTO>(`/api/notifications/${id}/read`, {
            method: 'PATCH',
        });
    },

    // Marquer toutes les notifications comme lues
    markAllAsRead: (): Promise<void> => {
        return apiCall<void>('/api/notifications/me/read-all', {
            method: 'POST',
        });
    },

    // Supprimer une notification
    delete: (id: number): Promise<void> => {
        return apiCall<void>(`/api/notifications/${id}`, {
            method: 'DELETE',
        });
    },

    // Créer une notification
    create: (data: NotificationDTO): Promise<NotificationDTO> => {
        return apiCall<NotificationDTO>('/api/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
