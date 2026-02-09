"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { facturesApi, RapportFinancierDTO } from "@/lib/api/factures";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2, TrendingUp, DollarSign, FileText, Clock, CheckCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RapportsPage() {
    const router = useRouter();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [rapport, setRapport] = useState<RapportFinancierDTO | null>(null);
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");

    // Vérifier que l'utilisateur est médecin
    useEffect(() => {
        if (user && user.usertype !== "MEDECIN") {
            toast.error("Accès réservé aux médecins");
            router.push("/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        // Par défaut: 30 derniers jours
        const finDate = new Date();
        const debutDate = new Date();
        debutDate.setDate(debutDate.getDate() - 30);

        setFin(finDate.toISOString().split('T')[0]);
        setDebut(debutDate.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (debut && fin) {
            loadRapport();
        }
    }, [debut, fin]);

    const loadRapport = async () => {
        try {
            setLoading(true);
            const data = await facturesApi.getRapport(debut, fin);
            setRapport(data);
        } catch (error: any) {
            console.error("Erreur chargement rapport:", error);
            toast.error("Impossible de charger le rapport");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !rapport) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement du rapport...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                    <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Rapports Financiers</h1>
                    <p className="text-gray-600 mt-1">Tableau de bord des factures et paiements</p>
                </div>
            </div>

            {/* Filtres de date */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm">
                <CardHeader className="border-b border-cyan-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        Période
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="debut" className="font-semibold text-gray-700">Date de début</Label>
                            <Input
                                id="debut"
                                type="date"
                                value={debut}
                                onChange={(e) => setDebut(e.target.value)}
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fin" className="font-semibold text-gray-700">Date de fin</Label>
                            <Input
                                id="fin"
                                type="date"
                                value={fin}
                                onChange={(e) => setFin(e.target.value)}
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={loadRapport}
                        disabled={loading}
                        className="mt-6 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11"
                    >
                        {loading ? "Chargement..." : "Générer le rapport"}
                    </Button>
                </CardContent>
            </Card>

            {rapport && (
                <>
                    {/* Cartes statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Total Factures */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50 hover:shadow-2xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-cyan-900">Total Factures</CardTitle>
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    {rapport.totalFactures.toFixed(2)} DT
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {rapport.nombreFactures} facture{rapport.nombreFactures > 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Total Payé */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-emerald-50 hover:shadow-2xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-emerald-900">Total Payé</CardTitle>
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {rapport.totalPaye.toFixed(2)} DT
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {rapport.nombreFacturesPayees} facture{rapport.nombreFacturesPayees > 1 ? "s" : ""} payée{rapport.nombreFacturesPayees > 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>

                        {/* En Attente */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-orange-900">En Attente</CardTitle>
                                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                                    {rapport.totalEnAttente.toFixed(2)} DT
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {rapport.nombreFacturesEnAttente} facture{rapport.nombreFacturesEnAttente > 1 ? "s" : ""} en attente
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Détails du rapport */}
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-cyan-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-cyan-900">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                Détails du rapport
                            </CardTitle>
                            <CardDescription className="ml-11">
                                Période du {new Date(rapport.periodeDebut || debut).toLocaleDateString()} au{" "}
                                {new Date(rapport.periodeFin || fin).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Nombre total de factures</span>
                                        <span className="font-semibold text-lg text-cyan-700">{rapport.nombreFactures}</span>
                                    </div>
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Factures payées</span>
                                        <span className="font-semibold text-lg text-emerald-600">
                                            {rapport.nombreFacturesPayees}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Factures en attente</span>
                                        <span className="font-semibold text-lg text-orange-600">
                                            {rapport.nombreFacturesEnAttente}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Taux de paiement</span>
                                        <span className="font-semibold text-lg text-cyan-700">
                                            {rapport.nombreFactures > 0
                                                ? ((rapport.nombreFacturesPayees / rapport.nombreFactures) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-4 bg-gradient-to-r from-cyan-50 to-teal-50 -mx-6 px-6 py-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Montant total généré</span>
                                        <span className="font-bold text-3xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                            {rapport.totalFactures.toFixed(2)} DT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bouton vers la liste des factures */}
                    <div className="flex justify-center">
                        <Button
                            onClick={() => router.push("/dashboard/factures")}
                            variant="outline"
                            className="w-full md:w-auto border-cyan-200 text-cyan-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-300 h-11"
                        >
                            <FileText className="mr-2 h-5 w-5" />
                            Voir toutes les factures
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
