"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { dossiersApi, type DossierPatientDTO, type TraitementDTO } from "@/lib/api/dossiers";
import { patientsApi } from "@/lib/api/patients";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, Upload, Download, FileText, Save, Plus, Trash2, Pill, ClipboardList, Stethoscope, FileEdit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DossierDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const dossierId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [dossier, setDossier] = useState<DossierPatientDTO | null>(null);
    const [patientName, setPatientName] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // États pour les champs médicaux
    const [motifConsultation, setMotifConsultation] = useState("");
    const [symptomes, setSymptomes] = useState("");
    const [diagnostic, setDiagnostic] = useState("");
    const [traitements, setTraitements] = useState<TraitementDTO[]>([]);
    const [observations, setObservations] = useState("");
    const [recommandations, setRecommandations] = useState("");

    useEffect(() => {
        if (!dossierId || !user) return;
        fetchData();
    }, [dossierId, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const dossierData = await dossiersApi.get(dossierId);
            setDossier(dossierData);

            // Charger les données médicales
            setMotifConsultation(dossierData.motifConsultation || "");
            setSymptomes(dossierData.symptomes || "");
            setDiagnostic(dossierData.diagnostic || "");
            setObservations(dossierData.observations || "");
            setRecommandations(dossierData.recommandations || "");

            // Parser les traitements JSON
            if (dossierData.traitement) {
                try {
                    const parsedTraitements = JSON.parse(dossierData.traitement);
                    setTraitements(Array.isArray(parsedTraitements) ? parsedTraitements : []);
                } catch {
                    setTraitements([]);
                }
            } else {
                setTraitements([]);
            }

            // Récupérer le nom du patient
            if (dossierData.patientId) {
                try {
                    const patient = await patientsApi.get(dossierData.patientId);
                    setPatientName(`${patient.prenom} ${patient.nom}`);
                } catch (error) {
                    console.error("Erreur lors du chargement du patient:", error);
                }
            }
        } catch (error: any) {
            toast.error("Erreur lors du chargement du dossier: " + (error.message || error));
            router.push("/dashboard/dossiers");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !dossierId) return;

        setUploading(true);
        try {
            await dossiersApi.uploadDocument(dossierId, file);
            toast.success("Document uploadé avec succès !");
            fetchData(); // Recharger les documents
        } catch (error: any) {
            toast.error("Erreur lors de l'upload: " + (error.message || error));
        } finally {
            setUploading(false);
        }
    };

    const handleSaveMedicalData = async () => {
        if (!dossier || user?.usertype !== "MEDECIN") return;

        setSaving(true);
        try {
            const updatedDossier: DossierPatientDTO = {
                ...dossier,
                motifConsultation,
                symptomes,
                diagnostic,
                traitement: JSON.stringify(traitements),
                observations,
                recommandations,
            };

            await dossiersApi.update(dossierId, updatedDossier);
            toast.success("Informations médicales enregistrées avec succès !");
            setEditing(false);
            fetchData();
        } catch (error: any) {
            toast.error("Erreur lors de l'enregistrement: " + (error.message || error));
        } finally {
            setSaving(false);
        }
    };

    const addTraitement = () => {
        setTraitements([...traitements, { medicament: "", dosage: "", duree: "", instructions: "" }]);
    };

    const removeTraitement = (index: number) => {
        setTraitements(traitements.filter((_, i) => i !== index));
    };

    const updateTraitement = (index: number, field: keyof TraitementDTO, value: string) => {
        const updated = [...traitements];
        updated[index][field] = value;
        setTraitements(updated);
    };

    const handleDownload = async (docId: number) => {
        if (!dossierId) return;
        try {
            await dossiersApi.downloadDocument(dossierId, docId);
            toast.success("Téléchargement démarré !");
        } catch (error: any) {
            toast.error("Erreur lors du téléchargement: " + (error.message || error));
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

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "N/A";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!dossier) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Dossier non trouvé</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-cyan-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            Dossier #{dossier.id}
                        </h1>
                        <p className="text-gray-600 mt-1">Patient: {patientName}</p>
                    </div>
                </div>

                {user?.usertype === "MEDECIN" && !editing && (
                    <Button
                        onClick={() => setEditing(true)}
                        className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white h-11"
                    >
                        <FileEdit className="mr-2 h-5 w-5" />
                        Modifier les informations médicales
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations du dossier */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <CardTitle className="flex items-center gap-2 text-cyan-900">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            Informations générales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-6">
                        <div>
                            <p className="text-sm text-gray-600 font-semibold">ID</p>
                            <p className="font-medium text-cyan-900">#{dossier.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-semibold">Patient</p>
                            <p className="font-medium text-cyan-900">{patientName || `ID: ${dossier.patientId}`}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-semibold">Date de création</p>
                            <p className="font-medium text-cyan-900">{formatDate(dossier.dateCreation)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-semibold">Description</p>
                            <p className="font-medium text-gray-700">{dossier.description || "Aucune description"}</p>
                        </div>
                        {dossier.rendezVousId && (
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">Rendez-vous lié</p>
                                <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                                    RDV #{dossier.rendezVousId}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm lg:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-cyan-900">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                Documents médicaux
                            </CardTitle>
                            <div>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                    disabled={uploading}
                                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-9"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {uploading ? "Upload..." : "Ajouter"}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-6">
                        {dossier.documents && dossier.documents.length > 0 ? (
                            <div className="space-y-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-cyan-100">
                                            <TableHead className="text-cyan-900 font-bold">Nom</TableHead>
                                            <TableHead className="text-cyan-900 font-bold">Taille</TableHead>
                                            <TableHead className="text-cyan-900 font-bold">Date</TableHead>
                                            <TableHead className="text-right text-cyan-900 font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dossier.documents.map((doc) => (
                                            <TableRow key={doc.id} className="hover:bg-cyan-50/50">
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-cyan-600" />
                                                    {doc.filename}
                                                </TableCell>
                                                <TableCell>{formatFileSize(doc.size)}</TableCell>
                                                <TableCell>
                                                    {doc.uploadedAt ? formatDate(doc.uploadedAt) : "N/A"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => doc.id && handleDownload(doc.id)}
                                                        className="hover:bg-cyan-100"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <div className="p-4 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl mx-auto w-fit mb-4">
                                    <FileText className="h-12 w-12 text-cyan-600" />
                                </div>
                                <p className="font-medium">Aucun document</p>
                                <p className="text-sm">Ajoutez des documents médicaux</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Medical Information - Visible for MEDECIN (edit mode) and PATIENT (read-only) */}
            {(user?.usertype === "MEDECIN" || user?.usertype === "PATIENT") && (
                <>
                    {editing && user?.usertype === "MEDECIN" ? (
                        <div className="space-y-6 mt-6">
                            {/* Consultation Details */}
                            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                            <Stethoscope className="h-5 w-5 text-white" />
                                        </div>
                                        Détails de la consultation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 mt-6">
                                    <div>
                                        <Label htmlFor="motif" className="text-sm font-semibold text-gray-700">Motif de consultation</Label>
                                        <Textarea
                                            id="motif"
                                            value={motifConsultation}
                                            onChange={(e) => setMotifConsultation(e.target.value)}
                                            placeholder="Raison de la visite du patient..."
                                            className="mt-1.5 min-h-[80px] border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="symptomes" className="text-sm font-semibold text-gray-700">Symptômes</Label>
                                        <Textarea
                                            id="symptomes"
                                            value={symptomes}
                                            onChange={(e) => setSymptomes(e.target.value)}
                                            placeholder="Description des symptômes observés..."
                                            className="mt-1.5 min-h-[100px] border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="diagnostic" className="text-sm font-semibold text-gray-700">Diagnostic</Label>
                                        <Textarea
                                            id="diagnostic"
                                            value={diagnostic}
                                            onChange={(e) => setDiagnostic(e.target.value)}
                                            placeholder="Diagnostic médical..."
                                            className="mt-1.5 min-h-[100px] border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Treatment Details */}
                            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-cyan-900">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                                <Pill className="h-5 w-5 text-white" />
                                            </div>
                                            💊 Détails du traitement
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addTraitement}
                                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 h-9"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter un médicament
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 mt-6">
                                    {traitements.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="p-4 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl mx-auto w-fit mb-4">
                                                <Pill className="h-12 w-12 text-cyan-600" />
                                            </div>
                                            <p className="font-medium">Aucun médicament prescrit</p>
                                            <p className="text-sm">Cliquez sur "Ajouter un médicament" pour commencer</p>
                                        </div>
                                    ) : (
                                        traitements.map((traitement, index) => (
                                            <div key={index} className="p-4 border border-cyan-100 rounded-lg bg-cyan-50/30 space-y-3">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-cyan-900">Médicament #{index + 1}</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeTraitement(index)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <Label htmlFor={`medicament-${index}`} className="text-sm font-medium text-gray-700">Médicament</Label>
                                                        <Input
                                                            id={`medicament-${index}`}
                                                            value={traitement.medicament}
                                                            onChange={(e) => updateTraitement(index, "medicament", e.target.value)}
                                                            placeholder="Nom du médicament"
                                                            className="mt-1.5 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`dosage-${index}`} className="text-sm font-medium text-gray-700">Dosage</Label>
                                                        <Input
                                                            id={`dosage-${index}`}
                                                            value={traitement.dosage}
                                                            onChange={(e) => updateTraitement(index, "dosage", e.target.value)}
                                                            placeholder="Ex: 500mg"
                                                            className="mt-1.5 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`duree-${index}`} className="text-sm font-medium text-gray-700">Durée</Label>
                                                        <Input
                                                            id={`duree-${index}`}
                                                            value={traitement.duree}
                                                            onChange={(e) => updateTraitement(index, "duree", e.target.value)}
                                                            placeholder="Ex: 7 jours"
                                                            className="mt-1.5 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`instructions-${index}`} className="text-sm font-medium text-gray-700">Instructions</Label>
                                                        <Input
                                                            id={`instructions-${index}`}
                                                            value={traitement.instructions}
                                                            onChange={(e) => updateTraitement(index, "instructions", e.target.value)}
                                                            placeholder="Ex: 2 fois par jour"
                                                            className="mt-1.5 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Medical Notes */}
                            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                            <ClipboardList className="h-5 w-5 text-white" />
                                        </div>
                                        📝 Notes du médecin
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 mt-6">
                                    <div>
                                        <Label htmlFor="observations" className="text-sm font-semibold text-gray-700">Observations</Label>
                                        <Textarea
                                            id="observations"
                                            value={observations}
                                            onChange={(e) => setObservations(e.target.value)}
                                            placeholder="Observations cliniques additionnelles..."
                                            className="mt-1.5 min-h-[100px] border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="recommandations" className="text-sm font-semibold text-gray-700">Recommandations</Label>
                                        <Textarea
                                            id="recommandations"
                                            value={recommandations}
                                            onChange={(e) => setRecommandations(e.target.value)}
                                            placeholder="Recommandations pour le patient..."
                                            className="mt-1.5 min-h-[100px] border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Save/Cancel Buttons */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditing(false);
                                        fetchData();
                                    }}
                                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-11"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSaveMedicalData}
                                    disabled={saving}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-11 shadow-lg"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Read-only view of medical data */}
                            {(motifConsultation || symptomes || diagnostic || traitements.length > 0 || observations || recommandations) && (
                                <div className="space-y-6 mt-6">
                                    {/* Consultation Details - Read Only */}
                                    {(motifConsultation || symptomes || diagnostic) && (
                                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                                        <Stethoscope className="h-5 w-5 text-white" />
                                                    </div>
                                                    Détails de la consultation
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 mt-6">
                                                {motifConsultation && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-semibold">Motif de consultation</p>
                                                        <p className="font-medium text-gray-800 mt-1">{motifConsultation}</p>
                                                    </div>
                                                )}
                                                {symptomes && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-semibold">Symptômes</p>
                                                        <p className="font-medium text-gray-800 mt-1">{symptomes}</p>
                                                    </div>
                                                )}
                                                {diagnostic && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-semibold">Diagnostic</p>
                                                        <p className="font-medium text-gray-800 mt-1">{diagnostic}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Treatment Details - Read Only */}
                                    {traitements.length > 0 && (
                                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                                        <Pill className="h-5 w-5 text-white" />
                                                    </div>
                                                    💊 Détails du traitement
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="mt-6">
                                                <div className="space-y-4">
                                                    {traitements.map((traitement, index) => (
                                                        <div key={index} className="p-4 border border-cyan-100 rounded-lg bg-cyan-50/30">
                                                            <h4 className="font-semibold text-cyan-900 mb-3">Médicament #{index + 1}</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <p className="text-sm text-gray-600 font-semibold">Médicament</p>
                                                                    <p className="font-medium text-gray-800">{traitement.medicament || "Non spécifié"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600 font-semibold">Dosage</p>
                                                                    <p className="font-medium text-gray-800">{traitement.dosage || "Non spécifié"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600 font-semibold">Durée</p>
                                                                    <p className="font-medium text-gray-800">{traitement.duree || "Non spécifié"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600 font-semibold">Instructions</p>
                                                                    <p className="font-medium text-gray-800">{traitement.instructions || "Non spécifié"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Medical Notes - Read Only */}
                                    {(observations || recommandations) && (
                                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                                        <ClipboardList className="h-5 w-5 text-white" />
                                                    </div>
                                                    📝 Notes du médecin
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 mt-6">
                                                {observations && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-semibold">Observations</p>
                                                        <p className="font-medium text-gray-800 mt-1">{observations}</p>
                                                    </div>
                                                )}
                                                {recommandations && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-semibold">Recommandations</p>
                                                        <p className="font-medium text-gray-800 mt-1">{recommandations}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
