"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { toast } from "sonner";

export default function NouveauPatientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PatientDTO>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        dateNaissance: "",
    });

    const handleChange = (field: keyof PatientDTO, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Note: Le backend ne semble pas avoir d'endpoint POST pour créer un patient
            // Il faut probablement utiliser l'endpoint de registration
            // Pour l'instant, on affiche un message
            toast.error("La création de patient doit passer par l'inscription. Utilisez /register");
            router.push("/dashboard/patients");
        } catch (error: any) {
            toast.error("Erreur lors de la création du patient: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-cyan-50"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                        Nouveau Patient
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">Ajouter un nouveau patient au système</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <CardTitle className="text-xl text-cyan-900">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">Nom *</Label>
                                <Input
                                    value={formData.nom}
                                    onChange={(e) => handleChange("nom", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    placeholder="Nom de famille"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">Prénom *</Label>
                                <Input
                                    value={formData.prenom}
                                    onChange={(e) => handleChange("prenom", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    placeholder="Prénom"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    placeholder="email@exemple.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">Téléphone</Label>
                                <Input
                                    value={formData.telephone}
                                    onChange={(e) => handleChange("telephone", e.target.value)}
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    placeholder="+212 6XX XXX XXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-semibold">Date de naissance</Label>
                            <Input
                                type="date"
                                value={formData.dateNaissance}
                                onChange={(e) => handleChange("dateNaissance", e.target.value)}
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="h-11 px-6 border-gray-300 hover:bg-gray-50"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 px-8 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 border-0 shadow-lg shadow-cyan-500/30"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Créer le patient
                    </Button>
                </div>
            </form>
        </div>
    );
}

