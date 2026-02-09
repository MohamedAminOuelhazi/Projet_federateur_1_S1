import { apiCall } from './config';

export interface MedecinDTO {
    id?: number;
    username?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    specialite?: string;
}

export const medecinsApi = {
    // Récupérer un médecin par ID
    get: (id: number): Promise<MedecinDTO> => {
        return apiCall<MedecinDTO>(`/api/medcins/${id}`);
    },

    // Récupérer tous les médecins
    getAll: (): Promise<MedecinDTO[]> => {
        return apiCall<MedecinDTO[]>(`/api/medcins/allMedcins`);
    },

    // Mettre à jour un médecin
    update: (id: number, data: MedecinDTO): Promise<MedecinDTO> => {
        return apiCall<MedecinDTO>(`/api/medcins/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Supprimer un médecin
    delete: (id: number): Promise<void> => {
        return apiCall<void>(`/api/medcins/${id}`, {
            method: 'DELETE',
        });
    },
};

