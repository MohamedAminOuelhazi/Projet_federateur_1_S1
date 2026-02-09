import { apiCall } from './config';

export interface RendezVousDTO {
    id?: number;
    dateHeure: string; // Format ISO: YYYY-MM-DDTHH:mm:ss
    statut?: string;
    motif?: string;
    assistantId: number;
    patientId?: number;
    medecinId?: number;
    // Noms pour l'affichage
    nomPatient?: string;
    prenomPatient?: string;
    nomMedecin?: string;
    prenomMedecin?: string;
    medecinNom?: string;
    nomAssistant?: string;
    prenomAssistant?: string;
}

export interface TimeSlotDTO {
    startTime: string; // Format ISO: YYYY-MM-DDTHH:mm:ss
    endTime: string;
    available: boolean;
    label: string; // ex: "09:00 - 09:30"
}

export interface RendezVousSimpleDTO {
    id: number;
    dateHeure: string;
    motif: string;
    statut: string;
    patientId?: number;
    patientNom?: string;
    patientPrenom?: string;
}

export const rendezVousApi = {
    // Créer un rendez-vous
    create: (assistantId: number, patientId: number, data: RendezVousDTO): Promise<RendezVousDTO> => {
        return apiCall<RendezVousDTO>(
            `/api/rendezvous/assistants/${assistantId}/patients/${patientId}/rdv`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    // Mettre à jour un rendez-vous
    update: (id: number, data: Partial<RendezVousDTO>): Promise<RendezVousDTO> => {
        return apiCall<RendezVousDTO>(`/api/rendezvous/assistants/rdv/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // Récupérer les rendez-vous d'un patient
    getByPatient: (patientId: number): Promise<RendezVousDTO[]> => {
        return apiCall<RendezVousDTO[]>(`/api/rendezvous/patient/${patientId}`);
    },

    // Récupérer les rendez-vous d'un patient (version simplifiée pour sélecteurs)
    getByPatientSimple: (patientId: number): Promise<RendezVousSimpleDTO[]> => {
        return apiCall<RendezVousSimpleDTO[]>(`/api/rendezvous/patient/${patientId}/simple`);
    },

    // Récupérer les rendez-vous d'un assistant
    getByAssistant: (assistantId: number): Promise<RendezVousDTO[]> => {
        return apiCall<RendezVousDTO[]>(`/api/rendezvous/assistants/${assistantId}`);
    },

    // Récupérer les rendez-vous d'un médecin
    getByMedecin: (
        medecinId: number,
        from?: string,
        to?: string
    ): Promise<RendezVousDTO[]> => {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        const query = params.toString();
        return apiCall<RendezVousDTO[]>(
            `/api/rendezvous/medecin/${medecinId}${query ? `?${query}` : ''}`
        );
    },

    // Récupérer mes rendez-vous (utilisateur connecté)
    getMyRdvs: (): Promise<RendezVousDTO[]> => {
        return apiCall<RendezVousDTO[]>(`/api/rendezvous/me`);
    },

    // Récupérer mes rendez-vous à venir
    getMyUpcoming: (daysAhead: number = 30): Promise<RendezVousDTO[]> => {
        return apiCall<RendezVousDTO[]>(
            `/api/rendezvous/me/upcoming?daysAhead=${daysAhead}`
        );
    },

    // Annuler un rendez-vous
    cancel: (id: number): Promise<void> => {
        return apiCall<void>(`/api/rendezvous/assistants/rdv/${id}`, {
            method: 'DELETE',
        });
    },

    // Récupérer les créneaux disponibles pour un médecin à une date donnée
    getAvailableSlots: (medecinId: number, date: string): Promise<TimeSlotDTO[]> => {
        return apiCall<TimeSlotDTO[]>(
            `/api/rendezvous/medecin/${medecinId}/slots-disponibles?date=${date}`
        );
    },
};

