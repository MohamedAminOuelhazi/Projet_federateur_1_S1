"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Search, MoreVertical, Eye, Edit, Trash2, UserCog, CheckCircle2, XCircle, Plus, UserPlus, Mail, User, Lock } from "lucide-react";
import { assistantsApi, type AssistantDTO } from "@/lib/api/assistants";
import type { CreateAssistantDTO } from "@/lib/api/assistants";
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
import { Switch } from "@/components/ui/switch";

export default function AssistantsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const [assistants, setAssistants] = useState<AssistantDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; assistantId: number | null }>({
        open: false,
        assistantId: null,
    });
    const [createDialog, setCreateDialog] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState<CreateAssistantDTO>({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (!authLoading && user) {
            fetchAssistants();
        }
    }, [authLoading, user]);

    const fetchAssistants = async () => {
        try {
            setLoading(true);
            const data = await assistantsApi.getAll();
            setAssistants(data);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des assistants: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: number, currentActive: boolean) => {
        try {
            await assistantsApi.toggleActivation(id);
            toast.success(`Assistant ${!currentActive ? "activé" : "désactivé"} avec succès`);
            fetchAssistants();
        } catch (error: any) {
            toast.error("Erreur lors de la modification: " + (error.message || error));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await assistantsApi.delete(id);
            toast.success("Assistant supprimé avec succès");
            fetchAssistants();
            setDeleteDialog({ open: false, assistantId: null });
        } catch (error: any) {
            toast.error("Erreur lors de la suppression: " + (error.message || error));
        }
    };

    const handleCreate = async () => {
        if (!formData.firstname || !formData.lastname || !formData.username ||
            !formData.email || !formData.password) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        try {
            setCreating(true);
            await assistantsApi.create(formData);
            toast.success("✅ Assistant créé avec succès");
            setCreateDialog(false);
            setFormData({
                firstname: "",
                lastname: "",
                username: "",
                email: "",
                password: "",
            });
            fetchAssistants();
        } catch (error: any) {
            let msg = "Erreur lors de la création";
            if (error.message?.includes("email") || error.message?.includes("Email"))
                msg = "Cet email est déjà utilisé";
            else if (error.message?.includes("username") || error.message?.includes("Username"))
                msg = "Ce nom d'utilisateur est déjà utilisé";
            else if (error.message)
                msg = error.message;
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const filteredAssistants = assistants.filter((assistant) => {
        const query = searchQuery.toLowerCase();
        return (
            assistant.nom?.toLowerCase().includes(query) ||
            assistant.prenom?.toLowerCase().includes(query) ||
            assistant.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                            <UserCog className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            Assistants Médicaux
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-16">
                        Gérez votre équipe d'assistants - {filteredAssistants.length} assistant{filteredAssistants.length > 1 ? "s" : ""} trouvé{filteredAssistants.length > 1 ? "s" : ""}
                    </p>
                </div>

                {/* Bouton Créer un assistant */}
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11">
                            <Plus className="mr-2 h-5 w-5" />
                            Nouvel Assistant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader className="pb-4 border-b border-cyan-100">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                                    <UserPlus className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    Créer un assistant
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Remplissez les informations du nouvel assistant médical
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname" className="font-semibold text-gray-700">Prénom</Label>
                                    <Input
                                        id="firstname"
                                        placeholder="Prénom"
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname" className="font-semibold text-gray-700">Nom</Label>
                                    <Input
                                        id="lastname"
                                        placeholder="Nom"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="font-semibold text-gray-700">Nom d'utilisateur</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                                    <Input
                                        id="username"
                                        placeholder="username"
                                        className="pl-10 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@exemple.com"
                                        className="pl-10 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-semibold text-gray-700">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Minimum 6 caractères
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialog(false)}
                                disabled={creating}
                                className="h-11"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={creating}
                                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11"
                            >
                                {creating ? "Création..." : "Créer l'assistant"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                        <Input
                            type="search"
                            placeholder="Rechercher par nom, prénom ou email..."
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
                                <div className="text-cyan-600 font-medium">Chargement des assistants...</div>
                            </div>
                        </div>
                    ) : filteredAssistants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="p-4 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl mb-4">
                                <UserCog className="h-12 w-12 text-cyan-600" />
                            </div>
                            <p className="text-sm font-medium">Aucun assistant trouvé</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-cyan-100 hover:bg-transparent">
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Nom</TableHead>
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Prénom</TableHead>
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Email</TableHead>
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Téléphone</TableHead>
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900">Statut</TableHead>
                                        <TableHead className="bg-gradient-to-r from-cyan-50 to-teal-50 font-bold text-cyan-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAssistants.map((assistant) => (
                                        <TableRow
                                            key={assistant.id}
                                            className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/50 transition-all duration-200 border-gray-100 cursor-pointer group"
                                        >
                                            <TableCell className="font-medium group-hover:text-cyan-700">{assistant.nom || "N/A"}</TableCell>
                                            <TableCell className="group-hover:text-cyan-700">{assistant.prenom || "N/A"}</TableCell>
                                            <TableCell className="group-hover:text-cyan-700">{assistant.email || "N/A"}</TableCell>
                                            <TableCell className="group-hover:text-cyan-700">{assistant.telephone || "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Switch
                                                        checked={assistant.active ?? false}
                                                        onCheckedChange={() => handleToggleActive(assistant.id!, assistant.active ?? false)}
                                                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-teal-500"
                                                    />
                                                    <Badge
                                                        variant={assistant.active ? "default" : "secondary"}
                                                        className={assistant.active ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-gray-400"}
                                                    >
                                                        {assistant.active ? (
                                                            <>
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                Actif
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="mr-1 h-3 w-3" />
                                                                Inactif
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>
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
                                                            onClick={() => router.push(`/dashboard/assistants/${assistant.id}`)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/dashboard/assistants/${assistant.id}/modifier`)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setDeleteDialog({ open: true, assistantId: assistant.id! })}
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

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, assistantId: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet assistant ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteDialog.assistantId && handleDelete(deleteDialog.assistantId)}
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

