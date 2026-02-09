import { apiCall } from './config';

export interface AssistantDTO {
    id?: number;
    username?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    active?: boolean;
}

export interface CreateAssistantDTO {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

export const assistantsApi = {
    // Récupérer un assistant par ID
    get: (id: number): Promise<AssistantDTO> => {
        return apiCall<AssistantDTO>(`/api/assistants/get/${id}`);
    },

    // Récupérer tous les assistants
    getAll: (): Promise<AssistantDTO[]> => {
        return apiCall<AssistantDTO[]>(`/api/assistants/allAssistants`);
    },

    // Créer un assistant (médecin uniquement)
    create: async (dto: CreateAssistantDTO): Promise<AssistantDTO> => {
        return apiCall<AssistantDTO>('/api/assistants', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    },

    // Modifier un assistant
    update: (id: number, data: AssistantDTO): Promise<AssistantDTO> => {
        return apiCall<AssistantDTO>(`/api/assistants/modifier/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Activer/Désactiver un assistant (nouvelle version)
    toggleActivation: async (id: number): Promise<{ active: boolean; message: string }> => {
        return apiCall<{ active: boolean; message: string }>(`/api/assistants/${id}/toggle-activation`, {
            method: 'PATCH',
        });
    },

    // Activer/Désactiver un assistant (ancienne version - gardée pour compatibilité)
    toggleActive: (id: number, active: boolean): Promise<void> => {
        return apiCall<void>(`/api/assistants/activer/${id}?active=${active}`, {
            method: 'PATCH',
        });
    },

    // Supprimer un assistant
    delete: (id: number): Promise<void> => {
        return apiCall<void>(`/api/assistants/supprimer/${id}`, {
            method: 'DELETE',
        });
    },
};
