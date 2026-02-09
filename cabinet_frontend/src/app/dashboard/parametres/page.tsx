"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { preferencesApi, PreferenceNotificationDTO } from "@/lib/api/preferences";
import { accountApi } from "@/lib/api/account";
import { Bell, Mail, Clock, Save, Loader2, Lock, Trash2, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DELAI_OPTIONS = [
    { value: 1, label: "1 heure avant" },
    { value: 2, label: "2 heures avant" },
    { value: 6, label: "6 heures avant" },
    { value: 12, label: "12 heures avant" },
    { value: 24, label: "1 jour avant" },
    { value: 48, label: "2 jours avant" },
    { value: 72, label: "3 jours avant" },
    { value: 168, label: "1 semaine avant" },
];

export default function ParametresPage() {
    const router = useRouter();
    const { user, logout } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [preferences, setPreferences] = useState<PreferenceNotificationDTO>({
        delaiRappelHeures: 24,
        emailActif: true,
        notificationInterneActive: true,
        emailPersonnalise: "",
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Charger les préférences au montage
    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const data = await preferencesApi.getMyPreferences();
            setPreferences(data);
        } catch (error: any) {
            console.error("Erreur chargement préférences:", error);
            toast.error("Impossible de charger vos préférences");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updated = await preferencesApi.updateMyPreferences(preferences);
            setPreferences(updated);
            toast.success("✅ Préférences enregistrées avec succès");
        } catch (error: any) {
            console.error("Erreur sauvegarde:", error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
            return;
        }

        try {
            setChangingPassword(true);
            await accountApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("🔐 Mot de passe modifié avec succès");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            console.error("Erreur changement mot de passe:", error);
            if (error.message?.includes("incorrect") || error.message?.includes("invalide")) {
                toast.error("Ancien mot de passe incorrect");
            } else {
                toast.error("Erreur lors du changement de mot de passe");
            }
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setDeletingAccount(true);
            await accountApi.deleteAccount();
            toast.success("Compte supprimé avec succès");
            logout(); // Déconnexion et redirection
        } catch (error: any) {
            console.error("Erreur suppression compte:", error);
            toast.error("Erreur lors de la suppression du compte");
            setDeletingAccount(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement des paramètres...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                    <Bell className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Paramètres</h1>
                    <p className="text-gray-600 mt-1">Gérez vos préférences de notifications et rappels</p>
                </div>
            </div>

            {/* Notifications Email */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Mail className="h-5 w-5 text-white" />
                        </div>
                        Notifications Email
                    </CardTitle>
                    <CardDescription className="ml-11">
                        Configurez les rappels par email pour vos rendez-vous
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {/* Activer/Désactiver emails */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-actif" className="font-semibold text-gray-700">Recevoir des emails</Label>
                            <p className="text-sm text-gray-500">
                                Recevez un email de confirmation et des rappels avant vos rendez-vous
                            </p>
                        </div>
                        <Switch
                            id="email-actif"
                            checked={preferences.emailActif}
                            onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, emailActif: checked })
                            }
                        />
                    </div>

                    {/* Email personnalisé */}
                    {preferences.emailActif && (
                        <div className="space-y-2">
                            <Label htmlFor="email-personnalise" className="font-semibold text-gray-700">Email personnalisé (optionnel)</Label>
                            <Input
                                id="email-personnalise"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                value={preferences.emailPersonnalise || ""}
                                onChange={(e) =>
                                    setPreferences({ ...preferences, emailPersonnalise: e.target.value })
                                }
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-gray-500">
                                Laissez vide pour utiliser l'email de votre compte
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notifications internes */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        Notifications internes
                    </CardTitle>
                    <CardDescription className="ml-11">
                        Notifications dans l'application
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="notif-interne" className="font-semibold text-gray-700">Activer les notifications</Label>
                            <p className="text-sm text-gray-500">
                                Recevez des notifications dans l'application
                            </p>
                        </div>
                        <Switch
                            id="notif-interne"
                            checked={preferences.notificationInterneActive}
                            onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, notificationInterneActive: checked })
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Délai de rappel */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        Délai de rappel
                    </CardTitle>
                    <CardDescription className="ml-11">
                        Choisissez quand recevoir vos rappels avant un rendez-vous
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="delai" className="font-semibold text-gray-700">Envoyer un rappel</Label>
                        <Select
                            value={preferences.delaiRappelHeures.toString()}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, delaiRappelHeures: parseInt(value) })
                            }
                        >
                            <SelectTrigger id="delai" className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                                <SelectValue placeholder="Sélectionnez un délai" />
                            </SelectTrigger>
                            <SelectContent>
                                {DELAI_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Le rappel sera envoyé automatiquement à 9h00 le jour J
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Bouton sauvegarder */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            Enregistrer les préférences
                        </>
                    )}
                </Button>
            </div>

            {/* Sécurité - Changement mot de passe */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Lock className="h-5 w-5 text-white" />
                        </div>
                        Sécurité
                    </CardTitle>
                    <CardDescription className="ml-11">
                        Modifiez votre mot de passe
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="old-password" className="font-semibold text-gray-700">Ancien mot de passe</Label>
                        <Input
                            id="old-password"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password" className="font-semibold text-gray-700">Nouveau mot de passe</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="font-semibold text-gray-700">Confirmer le nouveau mot de passe</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                    </div>
                    <Button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg h-11"
                    >
                        {changingPassword ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Modification...
                            </>
                        ) : (
                            "Changer le mot de passe"
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Zone dangereuse - Suppression compte (patient seulement) */}
            {user?.usertype === "PATIENT" && (
                <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50/30">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                                <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            Zone dangereuse
                        </CardTitle>
                        <CardDescription className="ml-11">
                            Actions irréversibles sur votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full h-11 shadow-lg" disabled={deletingAccount}>
                                    <Trash2 className="mr-2 h-5 w-5" />
                                    Supprimer mon compte
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible. Votre compte et toutes vos données seront
                                        définitivement supprimés de nos serveurs.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="h-11">Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 hover:bg-red-700 h-11"
                                    >
                                        {deletingAccount ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Suppression...
                                            </>
                                        ) : (
                                            "Oui, supprimer mon compte"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
