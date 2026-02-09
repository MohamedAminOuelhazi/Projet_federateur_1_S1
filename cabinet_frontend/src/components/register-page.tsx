"use client"

import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Eye, EyeOff, User, Calendar, Stethoscope, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import clsx from "clsx"
import { useState } from "react"

const registerSchema = z.object({
    firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Les mots de passe ne correspondent pas"),
    userType: z.enum(["PATIENT", "MEDECIN", "ASSISTANT"], {
        required_error: "Veuillez sélectionner un type d'utilisateur",
    }),
    specialite: z.string().optional(),
    dateNaissance: z.string().optional(),
    acceptedTerms: z.boolean().refine(val => val, { message: "Vous devez accepter les conditions générales" }),
    acceptedPrivacy: z.boolean().refine(val => val, { message: "Vous devez accepter la politique de confidentialité" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage({ onSubmit, loading = false }: { onSubmit: (data: RegisterFormData) => Promise<void>, loading?: boolean }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            userType: "PATIENT",
            specialite: "",
            dateNaissance: "",
            acceptedTerms: false,
            acceptedPrivacy: false,
        },
    })
    const password = watch("password")
    const userType = watch("userType")
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    const passwordStrength = strength <= 2 ? "weak" : strength <= 3 ? "medium" : "strong"
    const getPasswordStrengthText = () => passwordStrength === "weak" ? "Faible" : passwordStrength === "medium" ? "Moyen" : "Fort"
    const getPasswordStrengthColor = () => passwordStrength === "weak" ? "bg-red-500"
        : passwordStrength === "medium" ? "bg-orange-500"
            : "bg-green-500"
    const getPasswordStrengthIcon = () => passwordStrength === "weak" ? <XCircle className="h-4 w-4 text-red-500" />
        : passwordStrength === "medium" ? <AlertCircle className="h-4 w-4 text-orange-500" />
            : <CheckCircle2 className="h-4 w-4 text-green-500" />

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
                <div className="absolute inset-0 opacity-10">{/* SVG pattern ici */}</div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                    <div className="text-6xl font-bold text-white mb-4">MC</div>
                    <h1 className="text-3xl font-bold text-white mt-4">MyConsultia</h1>
                    <p className="text-xl text-white opacity-90 mt-2 text-center">Gestion de cabinet médical</p>
                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full mt-8 font-semibold">🏥 Solution médicale 2025</div>
                </div>
            </div>
            {/* FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer votre compte</h2>
                        <p className="text-gray-600">Rejoignez notre plateforme de gestion médicale</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Type d'utilisateur */}
                            <div className="space-y-2">
                                <Label>Type de compte *</Label>
                                <Controller
                                    name="userType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PATIENT">Patient</SelectItem>
                                                <SelectItem value="MEDECIN">Médecin</SelectItem>
                                                <SelectItem value="ASSISTANT">Assistant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.userType && <p className="text-sm text-red-600">{errors.userType.message}</p>}
                            </div>

                            {/* Prénom et Nom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">Prénom *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="firstname"
                                            type="text"
                                            placeholder="Prénom"
                                            {...register("firstname")}
                                            className={clsx("pl-10", errors.firstname && "border-red-500 focus-visible:ring-red-500")}
                                            disabled={loading || isSubmitting}
                                        />
                                    </div>
                                    {errors.firstname && <p className="text-sm text-red-600">{errors.firstname.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Nom *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="lastname"
                                            type="text"
                                            placeholder="Nom"
                                            {...register("lastname")}
                                            className={clsx("pl-10", errors.lastname && "border-red-500 focus-visible:ring-red-500")}
                                            disabled={loading || isSubmitting}
                                        />
                                    </div>
                                    {errors.lastname && <p className="text-sm text-red-600">{errors.lastname.message}</p>}
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username">Nom d'utilisateur *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="nom_utilisateur"
                                        {...register("username")}
                                        className={clsx("pl-10", errors.username && "border-red-500 focus-visible:ring-red-500")}
                                        disabled={loading || isSubmitting}
                                    />
                                </div>
                                {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        {...register("email")}
                                        className={clsx("pl-10", errors.email && "border-red-500 focus-visible:ring-red-500")}
                                        disabled={loading || isSubmitting}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            {/* Spécialité (pour médecins) */}
                            {userType === "MEDECIN" && (
                                <div className="space-y-2">
                                    <Label htmlFor="specialite">Spécialité</Label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="specialite"
                                            type="text"
                                            placeholder="Ex: Cardiologie, Pédiatrie..."
                                            {...register("specialite")}
                                            className="pl-10"
                                            disabled={loading || isSubmitting}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Date de naissance */}
                            <div className="space-y-2">
                                <Label htmlFor="dateNaissance">Date de naissance</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="dateNaissance"
                                        type="date"
                                        {...register("dateNaissance")}
                                        className="pl-10"
                                        disabled={loading || isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={clsx("pl-10 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                                        disabled={loading || isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={loading || isSubmitting}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {password && (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">Force du mot de passe</span>
                                            <div className="flex items-center gap-1">{getPasswordStrengthIcon()}<span className={`font-medium ${passwordStrength === "weak" ? "text-red-500" : passwordStrength === "medium" ? "text-orange-500" : "text-green-500"}`}>{getPasswordStrengthText()}</span></div>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%" }} />
                                        </div>
                                    </div>
                                )}
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmation mot de passe *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className={clsx("pl-10 pr-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
                                        disabled={loading || isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={loading || isSubmitting}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {/* Acceptation */}
                        <div className="space-y-4">
                            <div className="border-b pb-2"><h3 className="text-lg font-semibold text-gray-900">Acceptation</h3></div>
                            <div className="flex items-start space-x-3">
                                <Controller
                                    name="acceptedTerms"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="acceptedTerms"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading || isSubmitting}
                                            className={errors.acceptedTerms && "border-red-500"}
                                        />
                                    )}
                                />
                                <label htmlFor="acceptedTerms" className="text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
                                    J'accepte les <a href="#" className="text-blue-600 hover:underline font-medium">Conditions Générales d'Utilisation</a>
                                </label>
                            </div>
                            {errors.acceptedTerms && <p className="text-sm text-red-600 ml-7">{errors.acceptedTerms.message}</p>}
                            <div className="flex items-start space-x-3">
                                <Controller
                                    name="acceptedPrivacy"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="acceptedPrivacy"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading || isSubmitting}
                                            className={errors.acceptedPrivacy && "border-red-500"}
                                        />
                                    )}
                                />
                                <label htmlFor="acceptedPrivacy" className="text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
                                    J'accepte la <a href="#" className="text-blue-600 hover:underline font-medium">Politique de Confidentialité</a>
                                </label>
                            </div>
                            {errors.acceptedPrivacy && <p className="text-sm text-red-600 ml-7">{errors.acceptedPrivacy.message}</p>}
                            <p className="text-xs text-gray-500 leading-relaxed">
                                En créant un compte, vous acceptez notre politique de protection des données
                            </p>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200" disabled={loading || isSubmitting}>
                            {loading || isSubmitting ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Création en cours...</span>
                                </div>
                            ) : (
                                "Créer mon compte"
                            )}
                        </Button>
                        <div className="text-center">
                            <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                Déjà un compte ? <span className="font-semibold">Se connecter</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
