import { apiCall, apiUpload, apiDownload } from './config';

export interface DocumentDTO {
    id?: number;
    filename: string;
    contentType?: string;
    size?: number;
    path?: string;
    uploadedAt?: string;
}

export interface TraitementDTO {
    medicament: string;
    dosage: string;
    duree: string;
    instructions: string;
}

export interface DossierPatientDTO {
    id?: number;
    dateCreation?: string; // Format: YYYY-MM-DD
    description?: string;
    motifConsultation?: string;
    symptomes?: string;
    diagnostic?: string;
    traitement?: string; // JSON string contenant TraitementDTO[]
    observations?: string;
    recommandations?: string;
    patientId?: number;
    rendezVousId?: number;
    documents?: DocumentDTO[];
}

export const dossiersApi = {
    // Récupérer un dossier par ID
    get: (id: number): Promise<DossierPatientDTO> => {
        return apiCall<DossierPatientDTO>(`/api/dossiers/${id}`);
    },

    // Récupérer les dossiers du patient connecté (pour les patients)
    getMyDossiers: (): Promise<DossierPatientDTO[]> => {
        return apiCall<DossierPatientDTO[]>(`/api/dossiers/me`);
    },

    // Récupérer les dossiers d'un patient
    getByPatient: (patientId: number): Promise<DossierPatientDTO[]> => {
        return apiCall<DossierPatientDTO[]>(`/api/dossiers/patient/${patientId}`);
    },

    // Récupérer un dossier par rendez-vous
    getByRdv: (rdvId: number): Promise<DossierPatientDTO | null> => {
        return apiCall<DossierPatientDTO | null>(`/api/dossiers/rdv/${rdvId}`);
    },

    // Créer un dossier
    create: (data: DossierPatientDTO): Promise<DossierPatientDTO> => {
        return apiCall<DossierPatientDTO>(`/api/dossiers`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Mettre à jour un dossier
    update: (id: number, data: DossierPatientDTO): Promise<DossierPatientDTO> => {
        return apiCall<DossierPatientDTO>(`/api/dossiers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Uploader un document
    uploadDocument: (dossierId: number, file: File): Promise<DocumentDTO> => {
        return apiUpload<DocumentDTO>(`/api/dossiers/${dossierId}/files`, file);
    },

    // Lister les documents d'un dossier
    listDocuments: (dossierId: number): Promise<DocumentDTO[]> => {
        return apiCall<DocumentDTO[]>(`/api/dossiers/${dossierId}/files`);
    },

    // Télécharger un document
    downloadDocument: async (dossierId: number, docId: number): Promise<void> => {
        const blob = await apiDownload(`/api/dossiers/${dossierId}/files/${docId}`);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${docId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },
};

