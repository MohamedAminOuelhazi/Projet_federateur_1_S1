"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { rendezVousApi, type RendezVousDTO } from "@/lib/api/rendezvous";
import { toast } from "sonner";

export default function ModifierRendezVousPage() {
    const router = useRouter();
    const params = useParams();
    const rdvId = Number(params.id);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState<Partial<RendezVousDTO>>({
        dateHeure: "",
        statut: "",
        motif: "",
    });

    useEffect(() => {
        if (rdvId) {
            fetchRdv();
        }
    }, [rdvId]);

    const fetchRdv = async () => {
        try {
            setLoadingData(true);
            const allRdvs = await rendezVousApi.getMyRdvs();
            const foundRdv = allRdvs.find((r) => r.id === rdvId);
            if (foundRdv) {
                // Convertir la date au format datetime-local
                const dateStr = foundRdv.dateHeure
                    ? new Date(foundRdv.dateHeure).toISOString().slice(0, 16)
                    : "";
                setFormData({
                    ...foundRdv,
                    dateHeure: dateStr,
                    statut: foundRdv.statut || "",
                    motif: foundRdv.motif || "",
                });
            } else {
                toast.error("Rendez-vous non trouvé");
                router.push("/dashboard/rendezvous");
            }
        } catch (error: any) {
            toast.error("Erreur lors du chargement: " + (error.message || error));
            router.push("/dashboard/rendezvous");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (field: keyof RendezVousDTO, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convertir la date au format ISO
            const dateHeureISO = formData.dateHeure
                ? new Date(formData.dateHeure).toISOString()
                : new Date().toISOString();

            await rendezVousApi.update(rdvId, {
                ...formData,
                dateHeure: dateHeureISO,
            });
            toast.success("Rendez-vous modifié avec succès");
            router.push(`/dashboard/rendezvous/${rdvId}`);
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Modifier le rendez-vous</h1>
                    <p className="text-gray-600 mt-1">Mettez à jour les informations de la consultation</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <CardTitle className="text-cyan-900">Informations du rendez-vous</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="font-semibold text-gray-700">Date & Heure *</Label>
                                <Input
                                    type="datetime-local"
                                    value={formData.dateHeure || ""}
                                    onChange={(e) => handleChange("dateHeure", e.target.value)}
                                    required
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Statut</Label>
                                <Select
                                    value={formData.statut || ""}
                                    onValueChange={(value) => handleChange("statut", value)}
                                >
                                    <SelectTrigger className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en_attente">En attente</SelectItem>
                                        <SelectItem value="confirmé">Confirmé</SelectItem>
                                        <SelectItem value="annulé">Annulé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label className="font-semibold text-gray-700">Motif</Label>
                            <Textarea
                                value={formData.motif || ""}
                                onChange={(e) => handleChange("motif", e.target.value)}
                                rows={3}
                                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
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

