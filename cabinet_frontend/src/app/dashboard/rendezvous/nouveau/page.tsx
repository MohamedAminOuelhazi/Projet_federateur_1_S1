"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Loader2 } from "lucide-react";
import { rendezVousApi, type TimeSlotDTO } from "@/lib/api/rendezvous";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { medecinsApi, type MedecinDTO } from "@/lib/api/medecins";
import { assistantsApi } from "@/lib/api/assistants";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function NewRendezVousPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedSlot, setSelectedSlot] = useState<TimeSlotDTO | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlotDTO[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [selectedPatient, setSelectedPatient] = useState<string>("");
    const [motif, setMotif] = useState("");

    // Lists & data
    const [patients, setPatients] = useState<PatientDTO[]>([]);
    const [medecin, setMedecin] = useState<MedecinDTO | null>(null);
    const [assistantId, setAssistantId] = useState<number | null>(null);
    const [loadingData, setLoadingData] = useState(true);

    // Charger les données au montage
    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoadingData(true);

            // Récupérer les médecins (il doit y en avoir qu'un seul)
            const medecinsData = await medecinsApi.getAll();
            if (medecinsData.length === 0) {
                toast.error("Aucun médecin trouvé dans le système");
                return;
            }
            const uniqueMedecin = medecinsData[0]; // Prendre le premier (et normalement unique) médecin
            setMedecin(uniqueMedecin);

            // Selon le rôle de l'utilisateur
            if (user?.usertype === "PATIENT") {
                // Si patient: auto-sélectionner comme patient
                setSelectedPatient(user.id!.toString());
                // Utiliser l'ID du patient comme créateur du RDV
                setAssistantId(user.id!);
            } else if (user?.usertype === "ASSISTANT") {
                // Si assistant: charger la liste des patients
                const patientsData = await patientsApi.getAll();
                setPatients(patientsData);
                // Utiliser l'ID de l'assistant comme créateur du RDV
                setAssistantId(user.id!);
            } else if (user?.usertype === "MEDECIN") {
                // Si médecin: charger la liste des patients
                const patientsData = await patientsApi.getAll();
                setPatients(patientsData);
                // Utiliser l'ID du médecin comme créateur du RDV
                setAssistantId(user.id!);
            }
        } catch (error: any) {
            toast.error("Erreur lors du chargement des données: " + (error.message || error));
        } finally {
            setLoadingData(false);
        }
    };

    // Charger les créneaux disponibles quand la date change
    useEffect(() => {
        if (selectedDate && medecin) {
            fetchAvailableSlots();
        }
    }, [selectedDate, medecin]);

    const fetchAvailableSlots = async () => {
        if (!selectedDate || !medecin) return;

        try {
            setLoadingSlots(true);
            setSelectedSlot(null); // Reset slot selection
            const dateStr = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
            const slots = await rendezVousApi.getAvailableSlots(medecin.id!, dateStr);
            setAvailableSlots(slots);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des créneaux: " + (error.message || error));
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient || !selectedSlot || !medecin || !assistantId) {
            toast.error("Veuillez remplir tous les champs et sélectionner un créneau");
            return;
        }

        try {
            setSubmitting(true);
            await rendezVousApi.create(
                assistantId,
                parseInt(selectedPatient),
                {
                    dateHeure: selectedSlot.startTime,
                    motif: motif || "",
                    assistantId: assistantId,
                    patientId: parseInt(selectedPatient),
                    medecinId: medecin.id!,
                    statut: "PLANIFIE",
                }
            );
            toast.success("Rendez-vous créé avec succès");
            router.push("/dashboard/rendezvous");
        } catch (error: any) {
            toast.error("Erreur lors de la création: " + (error.message || error));
        } finally {
            setSubmitting(false);
        }
    };

    // Désactiver les dates passées
    const disabledDays = {
        before: new Date(),
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard/rendezvous")}
                    className="hover:bg-cyan-100"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                        Nouveau rendez-vous
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {user?.usertype === "PATIENT"
                            ? "Choisissez une date et un créneau disponible pour votre consultation"
                            : "Sélectionnez un patient, une date et un créneau disponible"
                        }
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Informations du rendez-vous */}
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                            <CardTitle className="flex items-center gap-2 text-cyan-900">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                Informations
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {medecin && `Rendez-vous avec Dr. ${medecin.prenom} ${medecin.nom}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-6">
                            {/* Patient - visible seulement si MEDECIN ou ASSISTANT */}
                            {user?.usertype !== "PATIENT" && (
                                <div className="space-y-2">
                                    <Label htmlFor="patient" className="font-semibold text-gray-700">Patient *</Label>
                                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                        <SelectTrigger id="patient" className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                                            <SelectValue placeholder="Sélectionnez un patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.length === 0 ? (
                                                <SelectItem value="empty" disabled>
                                                    Aucun patient disponible
                                                </SelectItem>
                                            ) : (
                                                patients.map((patient) => (
                                                    <SelectItem key={patient.id} value={patient.id!.toString()}>
                                                        {patient.prenom} {patient.nom}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Info patient si connecté en tant que patient */}
                            {user?.usertype === "PATIENT" && (
                                <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
                                    <p className="text-sm text-gray-600 mb-1">Patient</p>
                                    <p className="font-semibold text-cyan-900">
                                        {user.prenom} {user.nom}
                                    </p>
                                </div>
                            )}

                            {/* Motif */}
                            <div className="space-y-2">
                                <Label htmlFor="motif" className="font-semibold text-gray-700">Motif de consultation (optionnel)</Label>
                                <Textarea
                                    id="motif"
                                    placeholder="Décrivez le motif de la consultation..."
                                    value={motif}
                                    onChange={(e) => setMotif(e.target.value)}
                                    rows={4}
                                    className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calendrier et créneaux */}
                    <div className="space-y-6">
                        {/* Calendrier */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                        <CalendarIcon className="h-5 w-5 text-white" />
                                    </div>
                                    Sélectionnez une date
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center pt-6 pb-6">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={disabledDays}
                                    className="rounded-lg border-2 border-cyan-200 shadow-lg bg-white p-3"
                                />
                            </CardContent>
                        </Card>

                        {/* Créneaux disponibles */}
                        {selectedDate && (
                            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        Créneaux disponibles
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedDate.toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingSlots ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm">Aucun créneau disponible pour cette date</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                                            {availableSlots.map((slot, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant={
                                                        selectedSlot?.startTime === slot.startTime
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    disabled={!slot.available}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`${!slot.available
                                                        ? "opacity-50 cursor-not-allowed bg-gray-100"
                                                        : ""
                                                        } ${selectedSlot?.startTime === slot.startTime
                                                            ? "bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                                                            : "hover:border-cyan-400 hover:bg-cyan-50 border-cyan-200"
                                                        }`}
                                                >
                                                    {slot.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Récapitulatif et boutons */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mt-6">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                        <CardTitle className="text-cyan-900">Récapitulatif</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-6">
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-100">
                                <p className="text-xs text-gray-600">Patient</p>
                                <p className="font-semibold text-cyan-900">
                                    {user?.usertype === "PATIENT"
                                        ? `${user.prenom} ${user.nom}`
                                        : selectedPatient
                                            ? patients.find((p) => p.id?.toString() === selectedPatient)
                                                ?.prenom +
                                            " " +
                                            patients.find((p) => p.id?.toString() === selectedPatient)?.nom
                                            : "Non sélectionné"}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-100">
                                <p className="text-xs text-gray-600">Date</p>
                                <p className="font-semibold text-cyan-900">
                                    {selectedDate
                                        ? selectedDate.toLocaleDateString("fr-FR")
                                        : "Non sélectionnée"}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-100">
                                <p className="text-xs text-gray-600">Heure</p>
                                <p className="font-semibold text-cyan-900">{selectedSlot?.label || "Non sélectionnée"}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/rendezvous")}
                                className="h-11"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !selectedPatient ||
                                    !selectedSlot ||
                                    submitting
                                }
                                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    "Créer le rendez-vous"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
