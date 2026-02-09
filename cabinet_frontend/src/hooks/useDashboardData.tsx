"use client";

import { useState, useEffect } from "react";
import { dossiersApi } from "@/lib/api/dossiers";
import { rendezVousApi } from "@/lib/api/rendezvous";
import { patientsApi } from "@/lib/api/patients";

export interface DashboardStats {
    totalDossiers: number;
    trendPercentage: number;
    audiencesMonth: number;
    nextAudienceDate?: string;
    totalDocuments: number;
    storageUsedGB: number;
    activeClients: number;
    newClients: number;
}

export interface RecentDossier {
    id: number;
    numero?: string;
    description?: string;
    patientId?: number;
    dateCreation?: string;
    [key: string]: any;
}

export interface UpcomingAudience {
    id: number;
    date: string;
    dateHeure?: string;
    heure?: string;
    motif?: string;
    statut?: string;
    [key: string]: any;
}

export function useDashboardData(cabinetId: string, userId: string) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentDossiers, setRecentDossiers] = useState<RecentDossier[]>([]);
    const [upcomingAudiences, setUpcomingAudiences] = useState<UpcomingAudience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);

            let upcomingRdvs: any[] = [];
            let allPatients: any[] = [];
            let activeClients = 0;

            // Récupérer les rendez-vous à venir
            try {
                upcomingRdvs = await rendezVousApi.getMyUpcoming(30);
                setUpcomingAudiences(upcomingRdvs.map(rdv => ({
                    id: rdv.id!,
                    date: rdv.dateHeure,
                    dateHeure: rdv.dateHeure,
                    motif: rdv.motif,
                    statut: rdv.statut,
                })));
            } catch (error) {
                console.error("Erreur lors du chargement des rendez-vous:", error);
                setUpcomingAudiences([]);
            }

            // Récupérer tous les patients pour calculer les stats
            try {
                allPatients = await patientsApi.getAll();
                activeClients = allPatients.length;
            } catch (error) {
                console.error("Erreur lors du chargement des patients:", error);
            }

            // Pour les dossiers, on récupère depuis l'API
            const allDossiers: RecentDossier[] = [];

            // Récupérer les dossiers de chaque patient
            for (const patient of allPatients.slice(0, 10)) {
                try {
                    if (patient.id) {
                        const patientDossiers = await dossiersApi.getByPatient(patient.id);
                        allDossiers.push(...patientDossiers.map(d => ({
                            ...d,
                            id: d.id!,
                        })));
                    }
                } catch (error) {
                    // Ignorer les erreurs pour les patients sans dossiers
                }
            }

            // Trier par date de création (plus récent en premier)
            const sortedDossiers = allDossiers
                .sort((a, b) => {
                    const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
                    const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
                    return dateB - dateA;
                })
                .slice(0, 10);

            setRecentDossiers(sortedDossiers);

            // Calculer les statistiques
            const totalDossiers = allDossiers.length;
            const totalDocuments = allDossiers.reduce((sum, dossier) => {
                return sum + (dossier.documents?.length || 0);
            }, 0);

            // Calculer la taille approximative (1 document = ~1MB en moyenne)
            const storageUsedGB = totalDocuments / 1024;

            setStats({
                totalDossiers: totalDossiers || 0,
                trendPercentage: 10,
                audiencesMonth: upcomingRdvs.length,
                nextAudienceDate: upcomingRdvs.length > 0
                    ? new Date(upcomingRdvs[0].dateHeure).toLocaleDateString('fr-FR')
                    : undefined,
                totalDocuments: totalDocuments || 0,
                storageUsedGB: storageUsedGB || 0,
                activeClients: activeClients || 0,
                newClients: 0,
            });

            setLoading(false);
        };

        fetchDashboardData();
    }, [userId, cabinetId]);

    return { stats, recentDossiers, upcomingAudiences, loading };
}
