import { apiCall } from './config';

export interface ChangePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

export interface VerifyEmailDTO {
    email: string;
    code: string;
}

export const accountApi = {
    // Envoyer un code de vérification par email
    sendVerificationCode: async (email: string): Promise<{ message: string }> => {
        return apiCall<{ message: string }>('/api/users/send-verification-code', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // Vérifier le code email
    verifyEmail: async (dto: VerifyEmailDTO): Promise<{ verified: boolean }> => {
        return apiCall<{ verified: boolean }>('/api/users/verify-email', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    },

    // Changer le mot de passe
    changePassword: async (dto: ChangePasswordDTO): Promise<{ message: string }> => {
        return apiCall<{ message: string }>('/api/users/me/change-password', {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
    },

    // Supprimer mon compte (patient uniquement)
    deleteAccount: async (): Promise<{ message: string }> => {
        return apiCall<{ message: string }>('/api/users/me', {
            method: 'DELETE',
        });
    },
};
