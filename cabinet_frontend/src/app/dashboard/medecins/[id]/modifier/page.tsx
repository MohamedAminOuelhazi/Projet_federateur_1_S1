"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { medecinsApi, type MedecinDTO } from "@/lib/api/medecins";
import { toast } from "sonner";

export default function ModifierMedecinPage() {
    const router = useRouter();
    const params = useParams();
    const medecinId = Number(params.id);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState<MedecinDTO>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
    });

    useEffect(() => {
        if (medecinId) {
            fetchMedecin();
        }
    }, [medecinId]);

    const fetchMedecin = async () => {
        try {
            setLoadingData(true);
            const data = await medecinsApi.get(medecinId);
            setFormData({
                ...data,
                nom: data.nom || "",
                prenom: data.prenom || "",
                email: data.email || "",
                telephone: data.telephone || "",
                specialite: data.specialite || "",
            });
        } catch (error: any) {
            toast.error("Erreur lors du chargement du médecin: " + (error.message || error));
            router.push("/dashboard/medecins");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (field: keyof MedecinDTO, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await medecinsApi.update(medecinId, formData);
            toast.success("Médecin modifié avec succès");
            router.push(`/dashboard/medecins/${medecinId}`);
        } catch (error: any) {
            toast.error("Erreur lors de la modification: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Modifier le médecin</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nom *</Label>
                                <Input
                                    value={formData.nom || ""}
                                    onChange={(e) => handleChange("nom", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Prénom *</Label>
                                <Input
                                    value={formData.prenom || ""}
                                    onChange={(e) => handleChange("prenom", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Téléphone</Label>
                                <Input
                                    value={formData.telephone || ""}
                                    onChange={(e) => handleChange("telephone", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Spécialité</Label>
                            <Input
                                value={formData.specialite || ""}
                                onChange={(e) => handleChange("specialite", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#1E40AF] to-blue-600">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Enregistrer
                    </Button>
                </div>
            </form>
        </div>
    );
}

