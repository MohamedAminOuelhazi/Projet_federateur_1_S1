"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Eye, Edit, Trash2, Users } from "lucide-react";
import { patientsApi, type PatientDTO } from "@/lib/api/patients";
import { RoleGuard } from '@/components/RoleGuard';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PatientsPage() {
    // Protection par rôle: seulement MEDECIN et ASSISTANT peuvent gérer la liste des patients
    // Le composant RoleGuard enveloppe le rendu ci-dessous (injection plus bas)
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const [patients, setPatients] = useState<PatientDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; patientId: number | null }>({
        open: false,
        patientId: null,
    });

    useEffect(() => {
        // Ne charger les patients que si l'utilisateur est authentifié
        if (!authLoading && user) {
            fetchPatients();
        }
    }, [authLoading, user]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientsApi.getAll();
            setPatients(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des patients: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await patientsApi.delete(id);
            toast.success("Patient supprimé avec succès");
            fetchPatients();
            setDeleteDialog({ open: false, patientId: null });
        } catch (error: any) {
            toast.error("Erreur lors de la suppression: " + (error.message || error));
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const query = searchQuery.toLowerCase();
        return (
            patient.nom?.toLowerCase().includes(query) ||
            patient.prenom?.toLowerCase().includes(query) ||
            patient.email?.toLowerCase().includes(query) ||
            patient.telephone?.toLowerCase().includes(query)
        );
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
        <RoleGuard allowedRoles={["MEDECIN", "ASSISTANT"]}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg shadow-cyan-500/30">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                Patients
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-16">
                            {filteredPatients.length} patient{filteredPatients.length > 1 ? "s" : ""} trouvé
                            {filteredPatients.length > 1 ? "s" : ""}
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/dashboard/patients/nouveau")}
                        className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 border-0 shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau patient
                    </Button>
                </div>

                {/* Search */}
                <Card className="border-none shadow-lg bg-gradient-to-r from-white to-cyan-50/30">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <Input
                                type="search"
                                placeholder="Rechercher un patient (nom, prénom, email, téléphone)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Patients Table */}
                <Card className="border-none shadow-xl overflow-hidden">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="text-gray-600 font-medium">Chargement des patients...</div>
                                </div>
                            </div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl mb-4">
                                    <Users className="h-16 w-16 text-cyan-400" />
                                </div>
                                <p className="text-lg font-semibold text-gray-700">Aucun patient trouvé</p>
                                <p className="text-sm text-gray-400 mt-2">Essayez de modifier votre recherche ou ajoutez un nouveau patient</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50">
                                            <TableHead className="font-bold text-cyan-900">Nom</TableHead>
                                            <TableHead className="font-bold text-cyan-900">Prénom</TableHead>
                                            <TableHead className="font-bold text-cyan-900">Email</TableHead>
                                            <TableHead className="font-bold text-cyan-900">Téléphone</TableHead>
                                            <TableHead className="font-bold text-cyan-900">Date de naissance</TableHead>
                                            <TableHead className="font-bold text-cyan-900 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPatients.map((patient) => (
                                            <TableRow
                                                key={patient.id}
                                                className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/50 transition-all duration-200 border-gray-100 group cursor-pointer"
                                                onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                                            >
                                                <TableCell className="font-semibold text-gray-900 group-hover:text-cyan-700">{patient.nom || "N/A"}</TableCell>
                                                <TableCell className="font-medium text-gray-700">{patient.prenom || "N/A"}</TableCell>
                                                <TableCell className="text-gray-600">{patient.email || "N/A"}</TableCell>
                                                <TableCell className="text-gray-600">{patient.telephone || "N/A"}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {formatDate(patient.dateNaissance)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-cyan-100">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push(`/dashboard/patients/${patient.id}`);
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Voir
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push(`/dashboard/patients/${patient.id}/modifier`);
                                                                }}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeleteDialog({ open: true, patientId: patient.id! });
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Supprimer
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

                {/* Delete Dialog */}
                <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, patientId: null })}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteDialog.patientId && handleDelete(deleteDialog.patientId)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </RoleGuard>
    );
}
