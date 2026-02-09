"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { authApi } from "@/lib/api/auth";
import { patientsApi } from "@/lib/api/patients";
import { medecinsApi } from "@/lib/api/medecins";
import { assistantsApi } from "@/lib/api/assistants";

export interface UserProfile {
    displayName?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    phone?: string;
    telephone?: string;
    role?: string;
    usertype?: string;
    cabinet?: string;
    cabinetId?: string;
    avatar?: string;
    specialite?: string;
    active?: boolean;
    [key: string]: any;
}

export function useUserProfile() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user || !user.id) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                
                // Essayer de récupérer le profil selon le rôle
                // Note: Vous devriez avoir un endpoint /api/users/me dans le backend
                // Pour l'instant, on essaie de récupérer selon le type d'utilisateur
                
                if (user.role === 'PATIENT' || user.role === 'Patient') {
                    // Si c'est un patient, récupérer depuis l'API patients
                    const patientData = await patientsApi.getAll();
                    const currentPatient = patientData.find(p => p.id === user.id);
                    if (currentPatient) {
                        setProfile({
                            ...currentPatient,
                            role: 'PATIENT',
                            displayName: `${currentPatient.prenom} ${currentPatient.nom}`,
                        });
                    }
                } else if (user.role === 'MEDECIN' || user.role === 'Medecin') {
                    // Si c'est un médecin
                    const medecinData = await medecinsApi.getAll();
                    const currentMedecin = medecinData.find(m => m.id === user.id);
                    if (currentMedecin) {
                        setProfile({
                            ...currentMedecin,
                            role: 'MEDECIN',
                            displayName: `Dr. ${currentMedecin.prenom} ${currentMedecin.nom}`,
                        });
                    }
                } else if (user.role === 'ASSISTANT' || user.role === 'Assistant') {
                    // Si c'est un assistant
                    const assistantData = await assistantsApi.getAll();
                    const currentAssistant = assistantData.find(a => a.id === user.id);
                    if (currentAssistant) {
                        setProfile({
                            ...currentAssistant,
                            role: 'ASSISTANT',
                            displayName: `${currentAssistant.prenom} ${currentAssistant.nom}`,
                        });
                    }
                } else {
                    // Profil de base depuis le token
                    setProfile({
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        displayName: user.username,
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // En cas d'erreur, utiliser les données de base du token
                setProfile({
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    displayName: user.username,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, authLoading]);

    return { profile, loading };
}
