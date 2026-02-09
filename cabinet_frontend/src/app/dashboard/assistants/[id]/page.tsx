"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, CheckCircle2, XCircle } from "lucide-react";
import { assistantsApi, type AssistantDTO } from "@/lib/api/assistants";
import { toast } from "sonner";

export default function AssistantDetailPage() {
    const router = useRouter();
    const params = useParams();
    const assistantId = Number(params.id);
    const [assistant, setAssistant] = useState<AssistantDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (assistantId) {
            fetchAssistant();
        }
    }, [assistantId]);

    const fetchAssistant = async () => {
        try {
            setLoading(true);
            const data = await assistantsApi.get(assistantId);
            setAssistant(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement de l'assistant: " + (error.message || error));
            router.push("/dashboard/assistants");
        } finally {
            setLoading(false);
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

    if (!assistant) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Assistant non trouvé</div>
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
                            {assistant.prenom} {assistant.nom}
                        </h1>
                        <p className="text-gray-600 mt-1">Détails de l'assistant médical</p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push(`/dashboard/assistants/${assistantId}/modifier`)}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11"
                >
                    <Edit className="mr-2 h-5 w-5" />
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
                            <p className="font-medium">{assistant.nom || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Prénom</p>
                            <p className="font-medium">{assistant.prenom || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{assistant.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p className="font-medium">{assistant.telephone || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Statut</p>
                            <Badge
                                variant={assistant.active ? "default" : "secondary"}
                                className={assistant.active ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-gray-400"}
                            >
                                {assistant.active ? (
                                    <>
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Actif
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Inactif
                                    </>
                                )}
                            </Badge>
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
                            <p className="font-medium">{assistant.id || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">{assistant.username || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

