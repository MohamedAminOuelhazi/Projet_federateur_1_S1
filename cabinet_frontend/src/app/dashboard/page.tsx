"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Calendar,
    Users,
    UserCog,
    Receipt,
    FileText,
    Clock,
    BarChart3,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { rendezVousApi } from "@/lib/api/rendezvous";
import { facturesApi } from "@/lib/api/factures";
import { patientsApi } from "@/lib/api/patients";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const userType = user?.usertype?.toUpperCase();

    if (userType === 'MEDECIN') {
        return <MedecinDashboard user={user} router={router} />;
    } else if (userType === 'ASSISTANT') {
        return <AssistantDashboard user={user} router={router} />;
    } else if (userType === 'PATIENT') {
        return <PatientDashboard user={user} router={router} />;
    }

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">Chargement...</p>
        </div>
    );
}

// Dashboard Médecin
function MedecinDashboard({ user, router }: any) {
    const [stats, setStats] = useState({
        totalPatients: 0,
        rdvMois: 0,
        facturesEnAttente: 0,
    });
    const [rdvProchains, setRdvProchains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [patients, rdvs, factures] = await Promise.all([
                patientsApi.getAll().catch(() => []),
                rendezVousApi.getMyRdvs().catch(() => []),
                facturesApi.getAll().catch(() => []),
            ]);

            const facturesEnAttente = factures.filter((f: any) => f.statut === "EN_ATTENTE").length;
            const rdvMois = rdvs.filter((r: any) => {
                const rdvDate = new Date(r.dateHeure);
                const now = new Date();
                return rdvDate.getMonth() === now.getMonth() && rdvDate.getFullYear() === now.getFullYear();
            }).length;

            setStats({
                totalPatients: patients.length,
                rdvMois,
                facturesEnAttente,
            });

            const futurs = rdvs.filter((r: any) => new Date(r.dateHeure) > new Date());
            setRdvProchains(futurs.slice(0, 5));
        } catch (error) {
            console.error("Erreur chargement dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Hero Card */}
            <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>
                <CardContent className="relative p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-white/90 font-medium">En ligne</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                                Bienvenue, Dr. {user?.prenom} {user?.nom}
                            </h1>
                            <p className="text-cyan-50 font-medium">
                                {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                            </p>
                        </div>
                        <Avatar className="h-24 w-24 ring-4 ring-white/40 shadow-xl">
                            <AvatarFallback className="bg-gradient-to-br from-white to-cyan-50 text-cyan-600 text-3xl font-bold">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    {stats.totalPatients}
                                </p>
                                <p className="text-xs text-gray-500">Actifs</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">RDV ce mois</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                    {stats.rdvMois}
                                </p>
                                <p className="text-xs text-gray-500">Planifiés</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-lg shadow-teal-500/50 group-hover:scale-110 transition-transform">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Factures en attente</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                    {stats.facturesEnAttente}
                                </p>
                                <p className="text-xs text-gray-500">À traiter</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                                <Receipt className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    onClick={() => router.push("/dashboard/patients")}
                    className="group h-24 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 border-0 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Gérer les patients</span>
                    </div>
                </Button>
                <Button
                    onClick={() => router.push("/dashboard/rendezvous")}
                    className="group h-24 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 border-0 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Calendrier RDV</span>
                    </div>
                </Button>
                <Button
                    onClick={() => router.push("/dashboard/rapports")}
                    className="group h-24 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 border-0 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <BarChart3 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Rapports financiers</span>
                    </div>
                </Button>
            </div>

            {/* Upcoming Appointments */}
            <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-teal-50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Prochains rendez-vous</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {rdvProchains.length > 0 ? (
                        <div className="space-y-3">
                            {rdvProchains.map((rdv) => (
                                <div key={rdv.id} className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-cyan-50/30 rounded-xl hover:from-cyan-50 hover:to-teal-50 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-cyan-200 hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">{rdv.prenomPatient} {rdv.nomPatient}</p>
                                            <p className="text-sm text-gray-600">{rdv.motif}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {format(new Date(rdv.dateHeure), "dd/MM/yyyy")}
                                        </p>
                                        <p className="text-sm text-cyan-600 font-semibold">
                                            {format(new Date(rdv.dateHeure), "HH:mm")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Aucun rendez-vous à venir</p>
                            <p className="text-sm text-gray-400 mt-1">Les prochains rendez-vous apparaîtront ici</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Dashboard Assistant
function AssistantDashboard({ user, router }: any) {
    const [stats, setStats] = useState({
        rdvCrees: 0,
        facturesMois: 0,
        patientsGeres: 0,
    });
    const [rdvAujourdhui, setRdvAujourdhui] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [rdvs, factures, patients] = await Promise.all([
                rendezVousApi.getMyRdvs().catch(() => []),
                facturesApi.getAll().catch(() => []),
                patientsApi.getMesPatients().catch(() => []),
            ]);

            const today = new Date();
            const rdvToday = rdvs.filter((r: any) => {
                const rdvDate = new Date(r.dateHeure);
                return rdvDate.toDateString() === today.toDateString();
            });

            const facturesMois = factures.filter((f: any) => {
                const factureDate = new Date(f.dateEmission);
                return factureDate.getMonth() === today.getMonth() && factureDate.getFullYear() === today.getFullYear();
            }).length;

            setStats({
                rdvCrees: rdvs.length,
                facturesMois,
                patientsGeres: patients.length,
            });

            setRdvAujourdhui(rdvToday);
        } catch (error) {
            console.error("Erreur chargement dashboard:", error);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Bonjour, {user?.prenom} {user?.nom}
                            </h1>
                            <p className="text-green-100">
                                {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                            </p>
                        </div>
                        <Avatar className="h-20 w-20 ring-4 ring-white/30">
                            <AvatarFallback className="bg-white text-green-600 text-2xl font-bold">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mes patients</p>
                                <p className="text-3xl font-bold">{stats.patientsGeres}</p>
                            </div>
                            <div className="p-3 bg-cyan-100 rounded-xl">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">RDV créés</p>
                                <p className="text-3xl font-bold">{stats.rdvCrees}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Calendar className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Factures ce mois</p>
                                <p className="text-3xl font-bold">{stats.facturesMois}</p>
                            </div>
                            <div className="p-3 bg-teal-100 rounded-xl">
                                <Receipt className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => router.push("/dashboard/patients")} className="h-16 bg-cyan-600 hover:bg-cyan-700">
                    <Users className="mr-2 h-5 w-5" />
                    Gérer les patients
                </Button>
                <Button onClick={() => router.push("/dashboard/factures")} className="h-16 bg-green-600 hover:bg-green-700">
                    <Receipt className="mr-2 h-5 w-5" />
                    Créer une facture
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Rendez-vous aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                    {rdvAujourdhui.length > 0 ? (
                        <div className="space-y-3">
                            {rdvAujourdhui.map((rdv) => (
                                <div key={rdv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{rdv.prenomPatient} {rdv.nomPatient}</p>
                                            <p className="text-sm text-gray-600">{rdv.motif}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {format(new Date(rdv.dateHeure), "HH:mm")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Aucun rendez-vous aujourd'hui</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Dashboard Patient
function PatientDashboard({ user, router }: any) {
    const [rdvProchains, setRdvProchains] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const rdvs = await rendezVousApi.getMyRdvs().catch(() => []);
            setRdvProchains(rdvs.filter((r: any) => new Date(r.dateHeure) > new Date()).slice(0, 3));
        } catch (error) {
            console.error("Erreur chargement dashboard:", error);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 text-white">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Bienvenue, {user?.prenom} {user?.nom}
                            </h1>
                            <p className="text-purple-100">
                                {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                            </p>
                        </div>
                        <Avatar className="h-20 w-20 ring-4 ring-white/30">
                            <AvatarFallback className="bg-white text-purple-600 text-2xl font-bold">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => router.push("/dashboard/rendezvous")} className="h-16 bg-cyan-600 hover:bg-cyan-700">
                    <Calendar className="mr-2 h-5 w-5" />
                    Mes rendez-vous
                </Button>
                <Button onClick={() => router.push("/dashboard/dossiers")} className="h-16 bg-green-600 hover:bg-green-700">
                    <FileText className="mr-2 h-5 w-5" />
                    Mes dossiers médicaux
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Mes prochains rendez-vous
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {rdvProchains.length > 0 ? (
                        <div className="space-y-4">
                            {rdvProchains.map((rdv) => (
                                <Card key={rdv.id} className="bg-cyan-50 border-cyan-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-lg">
                                                    {format(new Date(rdv.dateHeure), "EEEE d MMMM yyyy", { locale: fr })}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {format(new Date(rdv.dateHeure), "HH:mm")} - {rdv.motif}
                                                </p>
                                                {rdv.prenomMedecin && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Dr. {rdv.prenomMedecin} {rdv.nomMedecin}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge className="bg-cyan-600">
                                                {rdv.statut || "Planifié"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Aucun rendez-vous à venir</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => router.push("/dashboard/rendezvous")}
                            >
                                Voir tous mes rendez-vous
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

