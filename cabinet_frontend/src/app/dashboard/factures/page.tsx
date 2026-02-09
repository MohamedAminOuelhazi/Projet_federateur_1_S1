"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { facturesApi, FactureDTO, CreateFactureDTO, PaiementDTO } from "@/lib/api/factures";
import { patientsApi, PatientDTO } from "@/lib/api/patients";
import { rendezVousApi, RendezVousSimpleDTO } from "@/lib/api/rendezvous";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2, Plus, Receipt, CheckCircle, Clock, Search, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function FacturesPage() {
    const { user, loading: authLoading } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [factures, setFactures] = useState<FactureDTO[]>([]);
    const [filteredFactures, setFilteredFactures] = useState<FactureDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState<PatientDTO[]>([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [rendezVous, setRendezVous] = useState<RendezVousSimpleDTO[]>([]);
    const [loadingRendezVous, setLoadingRendezVous] = useState(false);

    const [createDialog, setCreateDialog] = useState(false);
    const [payDialog, setPayDialog] = useState(false);
    const [creating, setCreating] = useState(false);
    const [paying, setPaying] = useState(false);

    const [selectedFacture, setSelectedFacture] = useState<FactureDTO | null>(null);
    const [createForm, setCreateForm] = useState<CreateFactureDTO>({
        patientId: 0,
        rendezVousId: undefined,
        montantTotal: 0,
    });
    const [paiementForm, setPaiementForm] = useState<PaiementDTO>({
        montant: 0,
        methode: "ESPECE",
    });

    useEffect(() => {
        if (!authLoading && user) {
            loadFactures();
        }
    }, [authLoading, user]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = factures.filter((f) =>
            f.numero.toLowerCase().includes(query) ||
            f.patientNom?.toLowerCase().includes(query) ||
            f.patientPrenom?.toLowerCase().includes(query)
        );
        setFilteredFactures(filtered);
    }, [searchQuery, factures]);

    const loadPatients = async () => {
        try {
            setLoadingPatients(true);
            // Si c'est un assistant, charger seulement ses patients liés
            // Si c'est un médecin, charger tous les patients
            const data = user?.usertype === "ASSISTANT"
                ? await patientsApi.getMesPatients()
                : await patientsApi.getListe();
            setPatients(data);
        } catch (error: any) {
            console.error("Erreur chargement patients:", error);
            toast.error("Impossible de charger les patients");
        } finally {
            setLoadingPatients(false);
        }
    };

    const loadRendezVous = async (patientId: number) => {
        try {
            setLoadingRendezVous(true);
            const data = await rendezVousApi.getByPatientSimple(patientId);
            setRendezVous(data);
        } catch (error: any) {
            console.error("Erreur chargement rendez-vous:", error);
            toast.error("Impossible de charger les rendez-vous");
        } finally {
            setLoadingRendezVous(false);
        }
    };

    const loadFactures = async () => {
        try {
            setLoading(true);
            const data = await facturesApi.getAll();
            setFactures(data);
            setFilteredFactures(data);
        } catch (error: any) {
            console.error("Erreur chargement factures:", error);
            toast.error("Impossible de charger les factures");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!createForm.patientId || createForm.montantTotal <= 0) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        try {
            setCreating(true);
            await facturesApi.create(createForm);
            toast.success("✅ Facture créée avec succès");
            setCreateDialog(false);
            setCreateForm({ patientId: 0, rendezVousId: undefined, montantTotal: 0 });
            setRendezVous([]);
            loadFactures();
        } catch (error: any) {
            console.error("Erreur création facture:", error);
            toast.error("Erreur lors de la création de la facture");
        } finally {
            setCreating(false);
        }
    };

    const handlePay = async () => {
        if (!selectedFacture || paiementForm.montant <= 0) {
            toast.error("Montant invalide");
            return;
        }

        try {
            setPaying(true);
            await facturesApi.marquerPaye(selectedFacture.id!, paiementForm);
            toast.success("✅ Facture marquée comme payée");
            setPayDialog(false);
            setSelectedFacture(null);
            setPaiementForm({ montant: 0, methode: "ESPECE" });
            loadFactures();
        } catch (error: any) {
            console.error("Erreur paiement:", error);
            toast.error("Erreur lors du paiement");
        } finally {
            setPaying(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) return;

        try {
            await facturesApi.delete(id);
            toast.success("Facture supprimée");
            loadFactures();
        } catch (error: any) {
            console.error("Erreur suppression:", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    const openPayDialog = (facture: FactureDTO) => {
        setSelectedFacture(facture);
        setPaiementForm({ montant: facture.montantTotal, methode: "ESPECE" });
        setPayDialog(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement des factures...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                            <Receipt className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Gestion des Factures</h1>
                    </div>
                    <p className="text-gray-600 ml-16">
                        {filteredFactures.length} facture{filteredFactures.length > 1 ? "s" : ""} enregistrée{filteredFactures.length > 1 ? "s" : ""}
                    </p>
                </div>

                {/* Bouton Créer facture */}
                <Dialog open={createDialog} onOpenChange={(open) => {
                    setCreateDialog(open);
                    if (open) loadPatients();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11">
                            <Plus className="mr-2 h-5 w-5" />
                            Nouvelle Facture
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader className="pb-4 border-b border-emerald-100">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                                    <Receipt className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Créer une facture
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Créer une nouvelle facture pour un patient
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient" className="font-semibold text-gray-700">Patient</Label>
                                {loadingPatients ? (
                                    <div className="flex items-center justify-center py-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                                    </div>
                                ) : (
                                    <Select
                                        value={createForm.patientId?.toString() || ""}
                                        onValueChange={(value) => {
                                            const patientId = parseInt(value);
                                            setCreateForm({ ...createForm, patientId, rendezVousId: undefined });
                                            setRendezVous([]);
                                            loadRendezVous(patientId);
                                        }}
                                    >
                                        <SelectTrigger id="patient" className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                                            <SelectValue placeholder="Sélectionner un patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map((patient) => (
                                                <SelectItem key={patient.id} value={patient.id!.toString()}>
                                                    {patient.prenom} {patient.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* Sélecteur de rendez-vous */}
                            {createForm.patientId > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="rendezVous" className="flex items-center gap-2 font-semibold text-gray-700">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        Rendez-vous (optionnel)
                                    </Label>
                                    {loadingRendezVous ? (
                                        <div className="flex items-center justify-center py-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                                        </div>
                                    ) : rendezVous.length === 0 ? (
                                        <p className="text-sm text-gray-500 py-2">Aucun rendez-vous disponible</p>
                                    ) : (
                                        <div className="space-y-2">
                                            <Select
                                                value={createForm.rendezVousId?.toString() || "none"}
                                                onValueChange={(value) =>
                                                    setCreateForm({ ...createForm, rendezVousId: value === "none" ? undefined : parseInt(value) })
                                                }
                                            >
                                                <SelectTrigger id="rendezVous" className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                    <SelectValue placeholder="Aucun rendez-vous" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Aucun</SelectItem>
                                                    {rendezVous.map((rdv) => (
                                                        <SelectItem key={rdv.id} value={rdv.id.toString()}>
                                                            {format(new Date(rdv.dateHeure), "dd/MM/yyyy HH:mm", { locale: fr })}
                                                            {rdv.motif && ` - ${rdv.motif}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500">Le rendez-vous est optionnel</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="montant" className="font-semibold text-gray-700">Montant (DT)</Label>
                                <Input
                                    id="montant"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={createForm.montantTotal || ""}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, montantTotal: parseFloat(e.target.value) })
                                    }
                                    className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateDialog(false)} disabled={creating} className="h-11">
                                Annuler
                            </Button>
                            <Button onClick={handleCreate} disabled={creating} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg h-11">
                                {creating ? "Création..." : "Créer la facture"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Recherche */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                            type="search"
                            placeholder="Rechercher par numéro ou nom patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table des factures */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-emerald-900">Liste des factures</CardTitle>
                    <CardDescription>
                        {filteredFactures.length} facture{filteredFactures.length > 1 ? "s" : ""} trouvée{filteredFactures.length > 1 ? "s" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredFactures.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mx-auto w-fit mb-4">
                                <Receipt className="h-12 w-12 text-emerald-600" />
                            </div>
                            <p className="text-lg font-medium">Aucune facture</p>
                            <p className="text-sm">Créez votre première facture</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-emerald-100 hover:bg-transparent">
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Numéro</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Date</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Patient</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Rendez-vous</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Montant</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Statut</TableHead>
                                    <TableHead className="bg-gradient-to-r from-emerald-50 to-teal-50 font-bold text-emerald-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFactures.map((facture) => (
                                    <TableRow key={facture.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200 border-gray-100 group">
                                        <TableCell className="font-medium group-hover:text-emerald-700">{facture.numero}</TableCell>
                                        <TableCell className="group-hover:text-emerald-700">
                                            {format(new Date(facture.dateEmission), "dd MMM yyyy", { locale: fr })}
                                        </TableCell>
                                        <TableCell className="group-hover:text-emerald-700">
                                            {facture.patientPrenom} {facture.patientNom}
                                        </TableCell>
                                        <TableCell className="group-hover:text-emerald-700">
                                            {facture.rendezVousId ? (
                                                <span className="text-sm font-medium">RDV {facture.rendezVousId}</span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-semibold group-hover:text-emerald-700">{facture.montantTotal.toFixed(2)} DT</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={facture.statut === "PAYEE" ? "default" : "secondary"}
                                                className={facture.statut === "PAYEE" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-orange-500 text-white"}
                                            >
                                                {facture.statut === "PAYEE" ? (
                                                    <>
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Payée
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        En attente
                                                    </>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {facture.statut !== "PAYEE" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openPayDialog(facture)}
                                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                                                    >
                                                        Marquer payée
                                                    </Button>
                                                )}
                                                {user?.usertype === "MEDECIN" && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(facture.id!)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog Paiement */}
            <Dialog open={payDialog} onOpenChange={setPayDialog}>
                <DialogContent>
                    <DialogHeader className="pb-4 border-b border-emerald-100">
                        <DialogTitle className="text-emerald-900">Enregistrer le paiement</DialogTitle>
                        <DialogDescription>
                            Facture {selectedFacture?.numero}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="montantPaiement" className="font-semibold text-gray-700">Montant (DT)</Label>
                            <Input
                                id="montantPaiement"
                                type="number"
                                step="0.01"
                                value={paiementForm.montant || ""}
                                onChange={(e) =>
                                    setPaiementForm({ ...paiementForm, montant: parseFloat(e.target.value) })
                                }
                                className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="methode" className="font-semibold text-gray-700">Méthode de paiement</Label>
                            <Select
                                value={paiementForm.methode}
                                onValueChange={(value) => setPaiementForm({ ...paiementForm, methode: value })}
                            >
                                <SelectTrigger id="methode" className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ESPECE">Espèce</SelectItem>
                                    <SelectItem value="CARTE">Carte bancaire</SelectItem>
                                    <SelectItem value="KONNECT">Konnect</SelectItem>
                                    <SelectItem value="CHEQUE">Chèque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPayDialog(false)} disabled={paying} className="h-11">
                            Annuler
                        </Button>
                        <Button onClick={handlePay} disabled={paying} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg h-11">
                            {paying ? "Enregistrement..." : "Confirmer le paiement"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
