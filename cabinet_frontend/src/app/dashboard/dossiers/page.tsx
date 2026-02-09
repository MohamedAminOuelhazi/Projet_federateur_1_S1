"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, MoreVertical, Eye, Edit, FolderOpen } from "lucide-react";
import { dossiersApi, type DossierPatientDTO } from "@/lib/api/dossiers";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DossiersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const [dossiers, setDossiers] = useState<(DossierPatientDTO & { patientName?: string })[]>([]);
    const [patients, setPatients] = useState<PatientDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [patientFilter, setPatientFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statutFilter, setStatutFilter] = useState<string>("all");

    useEffect(() => {
        if (!authLoading && user) {
            fetchDossiers();
        }
    }, [authLoading, user]);

    const fetchDossiers = async () => {
        try {
            setLoading(true);

            // Si l'utilisateur est un patient, charger uniquement ses dossiers
            if (user?.usertype === "PATIENT") {
                const myDossiers = await dossiersApi.getMyDossiers();
                const dossiersWithPatient = myDossiers.map(dossier => ({
                    ...dossier,
                    patientName: `${user.prenom} ${user.nom}`,
                }));
                setDossiers(dossiersWithPatient);
                return;
            }

            // Pour les médecins et assistants, charger tous les patients et leurs dossiers
            const allPatients = await patientsApi.getAll();
            setPatients(allPatients);

            // Récupérer les dossiers de chaque patient
            const allDossiers: (DossierPatientDTO & { patientName?: string })[] = [];

            for (const patient of allPatients) {
                if (patient.id) {
                    try {
                        const patientDossiers = await dossiersApi.getByPatient(patient.id);
                        const dossiersWithPatient = patientDossiers.map(dossier => ({
                            ...dossier,
                            patientName: `${patient.prenom} ${patient.nom}`,
                        }));
                        allDossiers.push(...dossiersWithPatient);
                    } catch (error) {
                        // Ignorer les erreurs pour les patients sans dossiers
                    }
                }
            }

            // Trier par date de création (plus récent en premier)
            const sortedDossiers = allDossiers.sort((a, b) => {
                const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
                const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
                return dateB - dateA;
            });

            setDossiers(sortedDossiers);
        } catch (error: any) {
            console.error("Erreur lors du chargement des dossiers:", error);
            toast.error("Erreur lors du chargement des dossiers: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    // Filter dossiers
    const filteredDossiers = dossiers.filter((dossier) => {
        const matchesSearch =
            searchQuery === "" ||
            dossier.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dossier.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dossier.id?.toString().includes(searchQuery);

        const matchesPatient =
            patientFilter === "all" ||
            dossier.patientId?.toString() === patientFilter;

        return matchesSearch && matchesPatient;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("fr-FR");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg shadow-cyan-500/30">
                        <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                        Dossiers Médicaux
                    </h1>
                </div>
                <p className="text-gray-600 ml-16">
                    {filteredDossiers.length} dossier{filteredDossiers.length > 1 ? "s" : ""} trouvé
                    {filteredDossiers.length > 1 ? "s" : ""}
                </p>
            </div>

            {/* Search and Filters */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-white to-cyan-50/30">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <Input
                                type="search"
                                placeholder="Rechercher un dossier, patient, description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Patient Filter - Only for MEDECIN/ASSISTANT */}
                        {user?.usertype !== "PATIENT" && (
                            <div className="w-full md:w-64">
                                <Select value={patientFilter} onValueChange={setPatientFilter}>
                                    <SelectTrigger className="h-12 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                                        <SelectValue placeholder="Filtrer par patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les patients</SelectItem>
                                        {patients.map((patient) => (
                                            <SelectItem key={patient.id} value={patient.id!.toString()}>
                                                {patient.prenom} {patient.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Dossiers Table */}
            <Card className="border-none shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-gray-600 font-medium">Chargement des dossiers...</div>
                            </div>
                        </div>
                    ) : filteredDossiers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl mb-4">
                                <FolderOpen className="h-16 w-16 text-cyan-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700">Aucun dossier trouvé</p>
                            <p className="text-sm text-gray-400 mt-2">Essayez de modifier vos filtres ou ajoutez un nouveau dossier</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50">
                                        <TableHead className="font-bold text-cyan-900">ID</TableHead>
                                        <TableHead className="font-bold text-cyan-900">Description</TableHead>
                                        <TableHead className="font-bold text-cyan-900">Patient</TableHead>
                                        <TableHead className="font-bold text-cyan-900">Date de création</TableHead>
                                        <TableHead className="font-bold text-cyan-900">Documents</TableHead>
                                        <TableHead className="font-bold text-cyan-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDossiers.map((dossier) => (
                                        <TableRow
                                            key={dossier.id}
                                            className="cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/50 transition-all duration-200 border-gray-100 group"
                                            onClick={() => router.push(`/dashboard/dossiers/${dossier.id}`)}
                                        >
                                            <TableCell className="font-bold text-cyan-600 group-hover:text-cyan-700">
                                                #{dossier.id}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                                                {dossier.description || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-gray-700">{dossier.patientName || "N/A"}</TableCell>
                                            <TableCell className="text-gray-600">
                                                {formatDate(dossier.dateCreation)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 border-cyan-300 font-semibold">
                                                    {dossier.documents?.length || 0} document{dossier.documents && dossier.documents.length > 1 ? "s" : ""}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/dashboard/dossiers/${dossier.id}`);
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/dashboard/dossiers/${dossier.id}/modifier`);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
