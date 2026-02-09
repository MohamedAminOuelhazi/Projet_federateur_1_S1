import { apiCall } from './config';

export interface LoginDto {
    username: string;
    mot_de_passe: string;
}

export interface RegisterDto {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    active?: boolean;
    specialite?: string;
    dateNaissance?: string; // Format: YYYY-MM-DD
}

export interface AuthResponseDTO {
    accessToken: string;
    tokenType?: string;
    role: string;
}

export interface UserDTO {
    id: number;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    usertype: string;
    dateNaissance?: string;
    dateCreation?: string;
}

export const authApi = {
    // Connexion
    login: async (credentials: LoginDto): Promise<AuthResponseDTO> => {
        const response = await apiCall<AuthResponseDTO>(`/api/users/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        console.log("Login response:", response);

        // Stocker le token dans localStorage
        // Le backend retourne 'accessToken' et non 'token'
        const token = response.accessToken || (response as any).token;
        if (typeof window !== 'undefined' && token) {
            localStorage.setItem('authToken', token);
            console.log("Token stocké dans localStorage");
            // Déclencher un événement personnalisé pour notifier les hooks
            window.dispatchEvent(new Event('authTokenChanged'));
        } else {
            console.error("Aucun token dans la réponse:", response);
        }

        return response;
    },

    // Inscription Assistant
    registerAssistant: (data: RegisterDto): Promise<any> => {
        return apiCall<any>(`/api/users/Assistant/register`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Inscription Médecin
    registerMedecin: (data: RegisterDto): Promise<any> => {
        return apiCall<any>(`/api/users/Medecin/register`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Inscription Patient
    registerPatient: (data: RegisterDto): Promise<any> => {
        return apiCall<any>(`/api/users/Patient/register`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Récupérer l'utilisateur actuel
    getCurrentUser: async (): Promise<UserDTO> => {
        return apiCall<UserDTO>(`/api/users/me`);
    },

    // Déconnexion (supprimer le token)
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },
};
