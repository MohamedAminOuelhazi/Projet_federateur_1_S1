"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Eye, Edit, Trash2, Stethoscope } from "lucide-react";
import { medecinsApi, type MedecinDTO } from "@/lib/api/medecins";
import { toast } from "sonner";
import { useAuthContext } from '@/context/AuthContext';
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

export default function MedecinsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const [medecins, setMedecins] = useState<MedecinDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; medecinId: number | null }>({
        open: false,
        medecinId: null,
    });

    useEffect(() => {
        if (!authLoading && user) {
            fetchMedecins();
        }
    }, [authLoading, user]);

    const fetchMedecins = async () => {
        try {
            setLoading(true);
            const data = await medecinsApi.getAll();
            setMedecins(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des médecins: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await medecinsApi.delete(id);
            toast.success("Médecin supprimé avec succès");
            fetchMedecins();
            setDeleteDialog({ open: false, medecinId: null });
        } catch (error: any) {
            toast.error("Erreur lors de la suppression: " + (error.message || error));
        }
    };

    const filteredMedecins = medecins.filter((medecin) => {
        const query = searchQuery.toLowerCase();
        return (
            medecin.nom?.toLowerCase().includes(query) ||
            medecin.prenom?.toLowerCase().includes(query) ||
            medecin.email?.toLowerCase().includes(query) ||
            medecin.specialite?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Médecins
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {filteredMedecins.length} médecin{filteredMedecins.length > 1 ? "s" : ""} trouvé
                        {filteredMedecins.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Rechercher un médecin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500">Chargement des médecins...</div>
                        </div>
                    ) : filteredMedecins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                <Stethoscope className="h-12 w-12 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium">Aucun médecin trouvé</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-100 hover:bg-transparent">
                                        <TableHead className="font-semibold text-gray-700">Nom</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Prénom</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Téléphone</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Spécialité</TableHead>
                                        <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMedecins.map((medecin) => (
                                        <TableRow
                                            key={medecin.id}
                                            className="hover:bg-blue-50/50 transition-colors border-gray-100"
                                        >
                                            <TableCell className="font-medium">{medecin.nom || "N/A"}</TableCell>
                                            <TableCell>{medecin.prenom || "N/A"}</TableCell>
                                            <TableCell>{medecin.email || "N/A"}</TableCell>
                                            <TableCell>{medecin.telephone || "N/A"}</TableCell>
                                            <TableCell>{medecin.specialite || "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/dashboard/medecins/${medecin.id}`)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/dashboard/medecins/${medecin.id}/modifier`)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setDeleteDialog({ open: true, medecinId: medecin.id! })}
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

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, medecinId: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce médecin ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteDialog.medecinId && handleDelete(deleteDialog.medecinId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

