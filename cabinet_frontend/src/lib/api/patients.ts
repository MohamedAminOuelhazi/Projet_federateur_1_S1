import { apiCall } from './config';

export interface PatientDTO {
    id?: number;
    username?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    dateNaissance?: string; // Format: YYYY-MM-DD
}

export const patientsApi = {
    // Récupérer un patient par ID
    get: (id: number): Promise<PatientDTO> => {
        return apiCall<PatientDTO>(`/api/patients/get/${id}`);
    },

    // Récupérer tous les patients
    getAll: (): Promise<PatientDTO[]> => {
        return apiCall<PatientDTO[]>(`/api/patients/allPatients`);
    },

    // Récupérer liste simplifiée pour sélecteurs
    getListe: (): Promise<PatientDTO[]> => {
        return apiCall<PatientDTO[]>('/api/patients/liste');
    },

    // Récupérer les patients liés à l'assistant connecté
    getMesPatients: (): Promise<PatientDTO[]> => {
        return apiCall<PatientDTO[]>('/api/patients/mes-patients');
    },

    // Mettre à jour un patient
    update: (id: number, data: PatientDTO): Promise<PatientDTO> => {
        return apiCall<PatientDTO>(`/api/patients/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Supprimer un patient
    delete: (id: number): Promise<void> => {
        return apiCall<void>(`/api/patients/delete/${id}`, {
            method: 'DELETE',
        });
    },
};

