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
import { Search, Plus, MoreVertical, Eye, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { rendezVousApi, type RendezVousDTO } from "@/lib/api/rendezvous";
import { toast } from "sonner";
import { RoleGuard } from '@/components/RoleGuard';
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

export default function RendezVousPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const [rendezVous, setRendezVous] = useState<RendezVousDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [cancelDialog, setCancelDialog] = useState<{ open: boolean; rdvId: number | null }>({
        open: false,
        rdvId: null,
    });

    useEffect(() => {
        if (!authLoading && user) {
            fetchRendezVous();
        }
    }, [authLoading, user]);

    const fetchRendezVous = async () => {
        try {
            setLoading(true);
            const data = await rendezVousApi.getMyRdvs();
            setRendezVous(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des rendez-vous: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await rendezVousApi.cancel(id);
            toast.success("Rendez-vous annulé avec succès");
            fetchRendezVous();
            setCancelDialog({ open: false, rdvId: null });
        } catch (error: any) {
            toast.error("Erreur lors de l'annulation: " + (error.message || error));
        }
    };

    const filteredRdvs = rendezVous.filter((rdv) => {
        const query = searchQuery.toLowerCase();
        const dateStr = rdv.dateHeure ? new Date(rdv.dateHeure).toLocaleString("fr-FR") : "";
        return (
            dateStr.toLowerCase().includes(query) ||
            rdv.motif?.toLowerCase().includes(query) ||
            rdv.statut?.toLowerCase().includes(query)
        );
    });

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    const getStatutColor = (statut?: string) => {
        switch (statut?.toLowerCase()) {
            case "confirmé":
            case "confirme":
                return "bg-green-100 text-green-700 border-green-200";
            case "terminé":
            case "termine":
                return "bg-green-100 text-green-700 border-green-200";
            case "annulé":
            case "annule":
                return "bg-red-100 text-red-700 border-red-200";
            case "en_attente":
            case "en attente":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    return (
        <RoleGuard allowedRoles={["MEDECIN", "ASSISTANT", "PATIENT"]}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                                <Calendar className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                Rendez-vous
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-16">
                            Gérez vos consultations - {filteredRdvs.length} rendez-vous trouvé{filteredRdvs.length > 1 ? "s" : ""}
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/dashboard/rendezvous/nouveau")}
                        className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Nouveau rendez-vous
                    </Button>
                </div>

                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <Input
                                type="search"
                                placeholder="Rechercher par date, motif ou statut..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 bg-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                                    <div className="text-cyan-600 font-medium">Chargement des rendez-vous...</div>
                                </div>
                            </div>
                        ) : filteredRdvs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <div className="p-4 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl mb-4">
                                    <Calendar className="h-12 w-12 text-cyan-600" />
                                </div>
                                <p className="text-sm font-medium">Aucun rendez-vous trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-cyan-100 hover:bg-transparent">
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">ID</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Date & Heure</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Patient</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Médecin</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Motif</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Statut</TableHead>
                                            <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRdvs.map((rdv) => (
                                            <TableRow
                                                key={rdv.id}
                                                className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/50 transition-all duration-200 border-gray-100 cursor-pointer group"
                                            >
                                                <TableCell className="font-medium group-hover:text-cyan-700">
                                                    {rdv.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 group-hover:text-cyan-700">
                                                        <Clock className="h-4 w-4 text-cyan-500" />
                                                        <span className="font-medium">{formatDateTime(rdv.dateHeure)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="group-hover:text-cyan-700">
                                                    {rdv.nomPatient && rdv.prenomPatient
                                                        ? `${rdv.prenomPatient} ${rdv.nomPatient}`
                                                        : `Patient #${rdv.patientId || "N/A"}`}
                                                </TableCell>
                                                <TableCell className="group-hover:text-cyan-700">
                                                    {rdv.nomMedecin && rdv.prenomMedecin
                                                        ? `Dr. ${rdv.prenomMedecin} ${rdv.nomMedecin}`
                                                        : `Médecin #${rdv.medecinId || "N/A"}`}
                                                </TableCell>
                                                <TableCell className="group-hover:text-cyan-700">{rdv.motif || "N/A"}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize font-medium shadow-sm ${getStatutColor(rdv.statut)}`}
                                                    >
                                                        {rdv.statut || "N/A"}
                                                    </Badge>
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
                                                                onClick={() => router.push(`/dashboard/rendezvous/${rdv.id}`)}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Voir
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/dashboard/rendezvous/${rdv.id}/modifier`)}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => setCancelDialog({ open: true, rdvId: rdv.id! })}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Annuler
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

                <AlertDialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, rdvId: null })}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => cancelDialog.rdvId && handleCancel(cancelDialog.rdvId)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Confirmer l'annulation
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </RoleGuard>
    );
}

