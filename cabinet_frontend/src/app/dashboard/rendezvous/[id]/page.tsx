"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Clock, Calendar } from "lucide-react";
import { rendezVousApi, type RendezVousDTO } from "@/lib/api/rendezvous";
import { toast } from "sonner";

export default function RendezVousDetailPage() {
    const router = useRouter();
    const params = useParams();
    const rdvId = Number(params.id);
    const [rdv, setRdv] = useState<RendezVousDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (rdvId) {
            fetchRdv();
        }
    }, [rdvId]);

    const fetchRdv = async () => {
        try {
            setLoading(true);
            // Note: Le backend ne semble pas avoir d'endpoint GET par ID
            // On récupère tous les RDV et on filtre
            const allRdvs = await rendezVousApi.getMyRdvs();
            const foundRdv = allRdvs.find((r) => r.id === rdvId);
            if (foundRdv) {
                setRdv(foundRdv);
            } else {
                toast.error("Rendez-vous non trouvé");
                router.push("/dashboard/rendezvous");
            }
        } catch (error: any) {
            toast.error("Erreur lors du chargement: " + (error.message || error));
            router.push("/dashboard/rendezvous");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    const getStatutColor = (statut?: string) => {
        switch (statut?.toLowerCase()) {
            case "confirmé":
            case "confirme":
                return "bg-green-100 text-green-700 border-green-200";
            case "terminé":
            case "termine":
                return "bg-green-100 text-green-700 border-green-200";
            case "annulé":
            case "annule":
                return "bg-red-100 text-red-700 border-red-200";
            case "en_attente":
            case "en attente":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement...</div>
                </div>
            </div>
        );
    }

    if (!rdv) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Rendez-vous non trouvé</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-cyan-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            Rendez-vous
                        </h1>
                        <p className="text-gray-600 mt-1">Détails de la consultation</p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push(`/dashboard/rendezvous/${rdvId}/modifier`)}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11"
                >
                    <Edit className="mr-2 h-5 w-5" />
                    Modifier
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Informations du rendez-vous
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Date & Heure</p>
                            <p className="font-medium flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                {formatDateTime(rdv.dateHeure)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Statut</p>
                            <Badge
                                variant="outline"
                                className={`capitalize font-medium shadow-sm mt-1 ${getStatutColor(rdv.statut)}`}
                            >
                                {rdv.statut || "N/A"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Motif</p>
                            <p className="font-medium mt-1">{rdv.motif || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Patient</p>
                            <p className="font-medium">
                                {rdv.nomPatient && rdv.prenomPatient
                                    ? `${rdv.prenomPatient} ${rdv.nomPatient}`
                                    : `Patient #${rdv.patientId || "N/A"}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Médecin</p>
                            <p className="font-medium">
                                {rdv.nomMedecin && rdv.prenomMedecin
                                    ? `Dr. ${rdv.prenomMedecin} ${rdv.nomMedecin}`
                                    : `Médecin #${rdv.medecinId || "N/A"}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Créé par</p>
                            <p className="font-medium">
                                {rdv.nomAssistant && rdv.prenomAssistant
                                    ? `${rdv.prenomAssistant} ${rdv.nomAssistant} (Assistant)`
                                    : `Assistant #${rdv.assistantId || "N/A"}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

