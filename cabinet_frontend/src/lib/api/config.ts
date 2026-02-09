// Configuration de l'API backend Spring Boot
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Fonction helper pour les appels API
export async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${apiConfig.baseURL}${endpoint}`;

    // Récupérer le token JWT depuis le localStorage ou les cookies si disponible
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers: HeadersInit = {
        ...apiConfig.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            // Si la réponse n'est pas du JSON, utiliser le texte de statut
            errorMessage = `${response.statusText || 'Erreur serveur'} (${response.status})`;
        }

        // Ne pas logger les erreurs 401 (token expiré) pour éviter le spam
        if (response.status !== 401) {
            console.error(`API Error [${endpoint}]:`, errorMessage);
        }

        throw new Error(errorMessage);
    }

    // Si la réponse est vide (204 No Content), retourner null
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// Fonction pour les uploads de fichiers
export async function apiUpload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
): Promise<T> {
    const url = `${apiConfig.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });
    }

    const headers: HeadersInit = {
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(error.message || `Erreur HTTP: ${response.status}`);
    }

    return response.json();
}

// Fonction pour télécharger des fichiers
export async function apiDownload(endpoint: string): Promise<Blob> {
    const url = `${apiConfig.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers: HeadersInit = {
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
        headers,
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response.blob();
}

