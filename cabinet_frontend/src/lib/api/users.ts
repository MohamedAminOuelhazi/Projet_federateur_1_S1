import { apiCall } from './config';

export interface UpdateProfileDTO {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    dateNaissance?: string;
    specialite?: string;
    description?: string;
    photoUrl?: string;
}

export interface MedecinDTO {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    specialite?: string;
    description?: string;
    photoUrl?: string;
}

export const usersApi = {
    // Mettre à jour le profil de l'utilisateur connecté
    updateProfile: (data: UpdateProfileDTO): Promise<void> => {
        return apiCall<void>(`/api/users/me/profile`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Récupérer tous les médecins (pour landing page)
    getMedecins: (): Promise<MedecinDTO[]> => {
        return apiCall<MedecinDTO[]>('/api/users/medecins', {
            method: 'GET',
        });
    },
};
