"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { User, Mail, Phone, Calendar, Save, Loader2, UserCircle } from "lucide-react";
import { usersApi } from "@/lib/api/users";

export default function ProfilPage() {
    const { user, refreshUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        dateNaissance: "",
        specialite: "",
        description: "",
        photoUrl: "",
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                telephone: user.telephone || "",
                dateNaissance: user.dateNaissance || "",
                specialite: (user as any).specialite || "",
                description: (user as any).description || "",
                photoUrl: (user as any).photoUrl || "",
            });
        }
    }, [user]);

    const handleSave = async () => {
        // Validation
        if (!profileData.nom || !profileData.prenom || !profileData.email) {
            toast.error("Nom, prénom et email sont obligatoires");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            toast.error("Email invalide");
            return;
        }

        if (profileData.telephone && !/^[\d\s\-\+\(\)]{8,}$/.test(profileData.telephone)) {
            toast.error("Numéro de téléphone invalide");
            return;
        }

        try {
            setSaving(true);
            await usersApi.updateProfile(profileData);
            toast.success("✅ Profil mis à jour avec succès");
            // Rafraîchir les données utilisateur
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error: any) {
            console.error("Erreur mise à jour profil:", error);
            toast.error(error.message || "Erreur lors de la mise à jour du profil");
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadge = () => {
        const roleColors = {
            MEDECIN: "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg",
            ASSISTANT: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",
            PATIENT: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg",
        };

        const roleLabels = {
            MEDECIN: "Médecin",
            ASSISTANT: "Assistant(e)",
            PATIENT: "Patient",
        };

        const roleType = user?.usertype?.toUpperCase() as keyof typeof roleColors;
        const colorClass = roleColors[roleType] || "bg-gray-100 text-gray-800 border-gray-200";
        const label = roleLabels[roleType] || user?.usertype;

        return (
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${colorClass}`}>
                {label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <div className="text-cyan-600 font-medium">Chargement du profil...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                        <UserCircle className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Mon profil</h1>
                        <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
                    </div>
                </div>
                {getRoleBadge()}
            </div>

            {/* Carte Profil */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        Informations personnelles
                    </CardTitle>
                    <CardDescription className="ml-11">
                        Modifiez vos informations de compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom */}
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="flex items-center gap-2 font-semibold text-gray-700">
                                <User className="h-4 w-4 text-cyan-600" />
                                Nom <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nom"
                                type="text"
                                value={profileData.nom}
                                onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                                placeholder="Votre nom"
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Prénom */}
                        <div className="space-y-2">
                            <Label htmlFor="prenom" className="flex items-center gap-2 font-semibold text-gray-700">
                                <User className="h-4 w-4 text-cyan-600" />
                                Prénom <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="prenom"
                                type="text"
                                value={profileData.prenom}
                                onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                                placeholder="Votre prénom"
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 font-semibold text-gray-700">
                                <Mail className="h-4 w-4 text-cyan-600" />
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="votre.email@exemple.com"
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Téléphone */}
                        <div className="space-y-2">
                            <Label htmlFor="telephone" className="flex items-center gap-2 font-semibold text-gray-700">
                                <Phone className="h-4 w-4 text-cyan-600" />
                                Téléphone
                            </Label>
                            <Input
                                id="telephone"
                                type="tel"
                                value={profileData.telephone}
                                onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                                placeholder="+33 6 12 34 56 78"
                                className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Date de naissance (pour les patients) */}
                        {user?.usertype?.toUpperCase() === "PATIENT" && (
                            <div className="space-y-2">
                                <Label htmlFor="dateNaissance" className="flex items-center gap-2 font-semibold text-gray-700">
                                    <Calendar className="h-4 w-4 text-cyan-600" />
                                    Date de naissance
                                </Label>
                                <Input
                                    id="dateNaissance"
                                    type="date"
                                    value={profileData.dateNaissance}
                                    onChange={(e) => setProfileData({ ...profileData, dateNaissance: e.target.value })}
                                    className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                        )}

                        {/* Champs spécifiques au médecin */}
                        {user?.usertype?.toUpperCase() === "MEDECIN" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="specialite" className="font-semibold text-gray-700">
                                        Spécialité
                                    </Label>
                                    <Input
                                        id="specialite"
                                        type="text"
                                        value={profileData.specialite}
                                        onChange={(e) => setProfileData({ ...profileData, specialite: e.target.value })}
                                        placeholder="Ex: Cardiologue, Dermatologue..."
                                        className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="description" className="font-semibold text-gray-700">
                                        Description professionnelle
                                    </Label>
                                    <textarea
                                        id="description"
                                        value={profileData.description}
                                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                        placeholder="Décrivez votre parcours, vos compétences..."
                                        className="w-full min-h-[120px] px-3 py-2 border border-cyan-200 rounded-md transition-all focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none resize-none"
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="photoUrl" className="font-semibold text-gray-700">
                                        URL de votre photo
                                    </Label>
                                    <Input
                                        id="photoUrl"
                                        type="url"
                                        value={profileData.photoUrl}
                                        onChange={(e) => setProfileData({ ...profileData, photoUrl: e.target.value })}
                                        placeholder="https://exemple.com/photo.jpg"
                                        className="h-11 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                    {profileData.photoUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={profileData.photoUrl}
                                                alt="Aperçu"
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-200 shadow-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Photo";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Username (lecture seule) */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="flex items-center gap-2 font-semibold text-gray-700">
                                <UserCircle className="h-4 w-4 text-gray-500" />
                                Nom d'utilisateur
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={user?.username || ""}
                                disabled
                                className="h-11 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">
                                Le nom d'utilisateur ne peut pas être modifié
                            </p>
                        </div>
                    </div>

                    {/* Bouton Sauvegarder */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-cyan-100">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all h-11 px-6"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Enregistrer les modifications
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                            <UserCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-cyan-900 mb-3 text-lg">Informations du compte</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="flex items-center gap-2"><strong className="text-gray-900">Type de compte :</strong> {getRoleBadge()}</p>
                                <p><strong className="text-gray-900">Nom d'utilisateur :</strong> {user?.username}</p>
                                {user?.dateCreation && (
                                    <p><strong className="text-gray-900">Membre depuis :</strong> {new Date(user.dateCreation).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
