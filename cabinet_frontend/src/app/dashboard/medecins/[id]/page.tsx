"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { medecinsApi, type MedecinDTO } from "@/lib/api/medecins";
import { toast } from "sonner";

export default function MedecinDetailPage() {
    const router = useRouter();
    const params = useParams();
    const medecinId = Number(params.id);
    const [medecin, setMedecin] = useState<MedecinDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (medecinId) {
            fetchMedecin();
        }
    }, [medecinId]);

    const fetchMedecin = async () => {
        try {
            setLoading(true);
            const data = await medecinsApi.get(medecinId);
            setMedecin(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement du médecin: " + (error.message || error));
            router.push("/dashboard/medecins");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (!medecin) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Médecin non trouvé</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Dr. {medecin.prenom} {medecin.nom}
                        </h1>
                        <p className="text-gray-600 mt-1">Détails du médecin</p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push(`/dashboard/medecins/${medecinId}/modifier`)}
                    className="bg-gradient-to-r from-[#1E40AF] to-blue-600"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="font-medium">{medecin.nom || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Prénom</p>
                            <p className="font-medium">{medecin.prenom || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{medecin.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p className="font-medium">{medecin.telephone || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Spécialité</p>
                            <p className="font-medium">{medecin.specialite || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Informations système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">ID</p>
                            <p className="font-medium">{medecin.id || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">{medecin.username || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

