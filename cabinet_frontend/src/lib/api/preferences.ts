import { apiCall } from './config';

export interface PreferenceNotificationDTO {
    id?: number;
    userId?: number;
    delaiRappelHeures: number; // 24 = 1 jour, 48 = 2 jours, 168 = 1 semaine
    emailActif: boolean;
    notificationInterneActive: boolean;
    emailPersonnalise?: string;
}

export const preferencesApi = {
    // Récupérer mes préférences
    getMyPreferences: async (): Promise<PreferenceNotificationDTO> => {
        return apiCall<PreferenceNotificationDTO>('/api/preferences/me');
    },

    // Mettre à jour mes préférences
    updateMyPreferences: async (dto: PreferenceNotificationDTO): Promise<PreferenceNotificationDTO> => {
        return apiCall<PreferenceNotificationDTO>('/api/preferences/me', {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
    },
};
