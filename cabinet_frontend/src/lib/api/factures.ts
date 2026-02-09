import { apiCall } from './config';

export interface PaiementDTO {
    id?: number;
    datePaiement?: string;
    montant: number;
    methode: string;
    factureId?: number;
}

export interface FactureDTO {
    id?: number;
    numero: string;
    numeroFacture?: string;
    dateEmission: string;
    montantTotal: number;
    statut: string;
    patientId: number;
    patientNom?: string;
    patientPrenom?: string;
    patientEmail?: string;
    rendezVousId?: number;
    rendezVousMotif?: string;
    rendezVousDate?: string;
    paiements?: PaiementDTO[];
}

export interface CreateFactureDTO {
    patientId: number;
    rendezVousId?: number;
    montantTotal: number;
    description?: string;
}

export interface RapportFinancierDTO {
    totalFactures: number;
    totalPaye: number;
    totalEnAttente: number;
    nombreFactures: number;
    nombreFacturesPayees: number;
    nombreFacturesEnAttente: number;
    periodeDebut?: string;
    periodeFin?: string;
}

export const facturesApi = {
    // Créer une facture
    create: async (dto: CreateFactureDTO): Promise<FactureDTO> => {
        return apiCall<FactureDTO>('/api/factures', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    },

    // Récupérer toutes les factures
    getAll: (): Promise<FactureDTO[]> => {
        return apiCall<FactureDTO[]>('/api/factures');
    },

    // Récupérer une facture par ID
    getById: (id: number): Promise<FactureDTO> => {
        return apiCall<FactureDTO>(`/api/factures/${id}`);
    },

    // Récupérer les factures d'un patient
    getByPatient: (patientId: number): Promise<FactureDTO[]> => {
        return apiCall<FactureDTO[]>(`/api/factures/patient/${patientId}`);
    },

    // Marquer comme payée
    marquerPaye: async (id: number, paiement: PaiementDTO): Promise<FactureDTO> => {
        return apiCall<FactureDTO>(`/api/factures/${id}/payer`, {
            method: 'PATCH',
            body: JSON.stringify(paiement),
        });
    },

    // Supprimer une facture
    delete: (id: number): Promise<void> => {
        return apiCall<void>(`/api/factures/${id}`, {
            method: 'DELETE',
        });
    },

    // Obtenir le rapport financier
    getRapport: (debut?: string, fin?: string): Promise<RapportFinancierDTO> => {
        const params = new URLSearchParams();
        if (debut) params.append('debut', debut);
        if (fin) params.append('fin', fin);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiCall<RapportFinancierDTO>(`/api/factures/rapports${query}`);
    },
};
