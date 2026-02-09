"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    Calendar,
    User,
    FileText,
    Receipt,
    Clock,
    MapPin,
    Stethoscope,
    CalendarDays,
    Activity,
} from "lucide-react";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { rendezVousApi, type RendezVousDTO } from "@/lib/api/rendezvous";
import { dossiersApi, type DossierPatientDTO } from "@/lib/api/dossiers";
import { facturesApi, type FactureDTO } from "@/lib/api/factures";
import { useAuthContext } from '@/context/AuthContext';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = Number(params.id);

    const [patient, setPatient] = useState<PatientDTO | null>(null);
    const [rendezVous, setRendezVous] = useState<RendezVousDTO[]>([]);
    const [dossiers, setDossiers] = useState<DossierPatientDTO[]>([]);
    const [factures, setFactures] = useState<FactureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const { user, role, loading: authLoading } = useAuthContext();

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }
    }, [patientId]);

    useEffect(() => {
        if (!authLoading && user && patient) {
            const normalizedRole = (role || '').toString().toUpperCase();
            const isAllowed = normalizedRole === 'MEDECIN' || normalizedRole === 'ASSISTANT' || (normalizedRole === 'PATIENT' && user.id === patient.id);
            if (!isAllowed) {
                router.push('/dashboard');
            }
        }
    }, [authLoading, user, role, patient, router]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const [patientData, rdvData, dossierData, factureData] = await Promise.all([
                patientsApi.get(patientId),
                rendezVousApi.getByPatient(patientId).catch(() => []),
                dossiersApi.getByPatient(patientId).catch(() => []),
                facturesApi.getByPatient(patientId).catch(() => []),
            ]);

            setPatient(patientData);
            setRendezVous(rdvData);
            setDossiers(dossierData);
            setFactures(factureData);
        } catch (error: any) {
            console.error("Erreur lors du chargement des données:", error);
            toast.error("Erreur lors du chargement du patient: " + (error.message || error));
            router.push("/dashboard/patients");
        } finally {
            setLoading(false);
        }
    };

    const getStatutBadgeColor = (statut: string) => {
        switch (statut?.toUpperCase()) {
            case "PLANIFIE":
                return "bg-cyan-100 text-cyan-800 border-cyan-300";
            case "CONFIRME":
                return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "EN_COURS":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "TERMINE":
                return "bg-teal-100 text-teal-800 border-teal-300";
            case "ANNULE":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatutFactureBadgeColor = (statut: string) => {
        switch (statut?.toUpperCase()) {
            case "PAYEE":
                return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "EN_ATTENTE":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "IMPAYEE":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("fr-FR");
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Patient non trouvé</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalFactures = factures.reduce((sum, f) => sum + (f.montantTotal || 0), 0);
    const facturesPayees = factures.filter(f => f.statut?.toUpperCase() === "PAYEE").length;
    const prochainRdv = rendezVous
        .filter(r => r.statut?.toUpperCase() !== "ANNULE" && new Date(r.dateHeure) > new Date())
        .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime())[0];

    return (
        <div className="p-8 space-y-6">
            {/* Header avec retour et actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/dashboard/patients")}
                        className="hover:bg-cyan-100 border-cyan-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            {patient.nom} {patient.prenom}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Patient #{patient.id}
                        </p>
                    </div>
                </div>
                <Button onClick={() => router.push(`/dashboard/patients/${patientId}/modifier`)} className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11">
                    <Edit className="h-5 w-5 mr-2" />
                    Modifier
                </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-lg bg-gradient-to-br from-white to-cyan-50/30 border-l-4 border-l-cyan-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-cyan-600" />
                            Rendez-vous
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{rendezVous.length}</div>
                        <p className="text-xs text-gray-600 mt-1">
                            {rendezVous.filter(r => r.statut?.toUpperCase() === "PLANIFIE").length} planifiés
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-white to-teal-50/30 border-l-4 border-l-teal-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600" />
                            Dossiers médicaux
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{dossiers.length}</div>
                        <p className="text-xs text-gray-600 mt-1">
                            Consultations enregistrées
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-white to-emerald-50/30 border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-emerald-600" />
                            Factures
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{totalFactures.toFixed(2)} €</div>
                        <p className="text-xs text-gray-600 mt-1">
                            {facturesPayees}/{factures.length} payées
                        </p>
                    </CardContent>
                </Card>
            </div>
            {/* Onglets de détails */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-cyan-50 to-teal-50">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="rendezvous" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Rendez-vous ({rendezVous.length})</TabsTrigger>
                    <TabsTrigger value="dossiers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Dossiers ({dossiers.length})</TabsTrigger>
                    <TabsTrigger value="factures" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Factures ({factures.length})</TabsTrigger>
                </TabsList>

                {/* Vue d'ensemble */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informations personnelles */}
                        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                    <User className="h-5 w-5" />
                                    Informations personnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 mt-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-1 text-cyan-600" />
                                    <div>
                                        <p className="text-sm font-medium">Nom complet</p>
                                        <p className="text-sm text-muted-foreground">
                                            {patient.nom} {patient.prenom}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-1 text-cyan-600" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 mt-1 text-cyan-600" />
                                    <div>
                                        <p className="text-sm font-medium">Téléphone</p>
                                        <p className="text-sm text-muted-foreground">
                                            {patient.telephone || "Non renseigné"}
                                        </p>
                                    </div>
                                </div>
                                {patient.dateNaissance && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 mt-1 text-cyan-600" />
                                        <div>
                                            <p className="text-sm font-medium">Date de naissance</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(patient.dateNaissance)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Prochain rendez-vous */}
                        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                    <Activity className="h-5 w-5" />
                                    Activité récente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 mt-4">
                                {prochainRdv ? (
                                    <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-cyan-600" />
                                            <p className="text-sm font-medium text-cyan-900">Prochain rendez-vous</p>
                                        </div>
                                        <p className="text-sm text-cyan-700">
                                            {new Date(prochainRdv.dateHeure).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {prochainRdv.motif && (
                                            <p className="text-xs text-cyan-600 mt-1">{prochainRdv.motif}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Aucun rendez-vous prévu</p>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Statistiques</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 rounded border border-cyan-100">
                                            <p className="text-xs text-gray-600">Total consultations</p>
                                            <p className="text-lg font-semibold text-cyan-900">
                                                {rendezVous.filter(r => r.statut?.toUpperCase() === "TERMINE").length}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 rounded border border-cyan-100">
                                            <p className="text-xs text-gray-600">Dossiers actifs</p>
                                            <p className="text-lg font-semibold text-cyan-900">{dossiers.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Rendez-vous */}
                <TabsContent value="rendezvous">
                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des rendez-vous</CardTitle>
                            <CardDescription>Historique complet des rendez-vous du patient</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {rendezVous.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucun rendez-vous enregistré
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date et heure</TableHead>
                                            <TableHead>Motif</TableHead>
                                            <TableHead>Médecin</TableHead>
                                            <TableHead>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rendezVous
                                            .sort((a, b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime())
                                            .map((rdv) => (
                                                <TableRow key={rdv.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            {new Date(rdv.dateHeure).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{rdv.motif || "-"}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                            {rdv.medecinNom || "Non assigné"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={getStatutBadgeColor(rdv.statut || "")}
                                                        >
                                                            {rdv.statut}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Dossiers médicaux */}
                <TabsContent value="dossiers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dossiers médicaux</CardTitle>
                            <CardDescription>Historique des consultations et diagnostics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dossiers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucun dossier médical enregistré
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {dossiers
                                        .sort((a, b) => new Date(b.dateCreation || 0).getTime() - new Date(a.dateCreation || 0).getTime())
                                        .map((dossier) => (
                                            <div
                                                key={dossier.id}
                                                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText className="h-4 w-4 text-blue-600" />
                                                            <h4 className="font-semibold text-sm">
                                                                Dossier #{dossier.id}
                                                            </h4>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDate(dossier.dateCreation)}
                                                            </span>
                                                        </div>
                                                        {dossier.diagnostic && (
                                                            <p className="text-sm mb-2">
                                                                <strong>Diagnostic:</strong> {dossier.diagnostic}
                                                            </p>
                                                        )}
                                                        {dossier.traitement && (
                                                            <p className="text-sm text-muted-foreground">
                                                                <strong>Traitement:</strong> {dossier.traitement}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Factures */}
                <TabsContent value="factures">
                    <Card>
                        <CardHeader>
                            <CardTitle>Factures</CardTitle>
                            <CardDescription>Historique de facturation du patient</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {factures.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucune facture enregistrée
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-emerald-900">Total facturé</p>
                                                <p className="text-2xl font-bold text-emerald-700">
                                                    {totalFactures.toFixed(2)} €
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-emerald-700">
                                                    {facturesPayees} facture{facturesPayees > 1 ? 's' : ''} payée{facturesPayees > 1 ? 's' : ''}
                                                </p>
                                                <p className="text-xs text-emerald-600">
                                                    {factures.length - facturesPayees} en attente
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>N° Facture</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Montant</TableHead>
                                                <TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {factures
                                                .sort((a, b) => new Date(b.dateEmission).getTime() - new Date(a.dateEmission).getTime())
                                                .map((facture) => (
                                                    <TableRow key={facture.id}>
                                                        <TableCell className="font-medium">
                                                            #{facture.numeroFacture}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(facture.dateEmission)}
                                                        </TableCell>
                                                        <TableCell className="font-semibold">
                                                            {facture.montantTotal?.toFixed(2)} €
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={getStatutFactureBadgeColor(facture.statut)}
                                                            >
                                                                {facture.statut}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

