"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { toast } from "sonner";

export default function ModifierPatientPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = Number(params.id);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState<PatientDTO>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        dateNaissance: "",
    });

    useEffect(() => {
        if (patientId) {
            fetchPatient();
        }
    }, [patientId]);

    const fetchPatient = async () => {
        try {
            setLoadingData(true);
            const data = await patientsApi.get(patientId);
            // Convertir les valeurs null en chaînes vides pour éviter les warnings React
            setFormData({
                ...data,
                nom: data.nom || "",
                prenom: data.prenom || "",
                email: data.email || "",
                telephone: data.telephone || "",
                dateNaissance: data.dateNaissance || "",
            });
        } catch (error: any) {
            toast.error("Erreur lors du chargement du patient: " + (error.message || error));
            router.push("/dashboard/patients");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (field: keyof PatientDTO, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await patientsApi.update(patientId, formData);
            toast.success("Patient modifié avec succès");
            router.push(`/dashboard/patients/${patientId}`);
        } catch (error: any) {
            toast.error("Erreur lors de la modification: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-cyan-100">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Modifier le patient</h1>
                    <p className="text-gray-600 mt-1">Mettez à jour les informations du patient</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <CardTitle className="text-cyan-900">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="font-semibold text-gray-700">Nom *</Label>
                                <Input
                                    value={formData.nom || ""}
                                    onChange={(e) => handleChange("nom", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Prénom *</Label>
                                <Input
                                    value={formData.prenom || ""}
                                    onChange={(e) => handleChange("prenom", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="font-semibold text-gray-700">Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Téléphone</Label>
                                <Input
                                    value={formData.telephone || ""}
                                    onChange={(e) => handleChange("telephone", e.target.value)}
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="font-semibold text-gray-700">Date de naissance</Label>
                            <Input
                                type="date"
                                value={formData.dateNaissance || ""}
                                onChange={(e) => handleChange("dateNaissance", e.target.value)}
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="h-11">
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Enregistrer
                    </Button>
                </div>
            </form>
        </div>
    );
}

