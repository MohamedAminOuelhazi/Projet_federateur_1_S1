"use client"

import { useState } from "react"
import { authApi } from "@/lib/api/auth"
import { accountApi } from "@/lib/api/account"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, User, Calendar, ArrowLeft, Stethoscope, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Register() {
    const router = useRouter()
    const [step, setStep] = useState<"form" | "verify">("form")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateNaissance: "",
    })

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.firstname || !formData.lastname || !formData.username ||
            !formData.email || !formData.password || !formData.dateNaissance) {
            toast.error("Veuillez remplir tous les champs")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        if (formData.password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return
        }

        try {
            setLoading(true)
            setEmail(formData.email)

            await accountApi.sendVerificationCode(formData.email)
            toast.success("📧 Code de vérification envoyé à votre email")

            setStep("verify")
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'envoi du code")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()

        if (code.length !== 4) {
            toast.error("Le code doit contenir 4 chiffres")
            return
        }

        try {
            setLoading(true)

            const result = await accountApi.verifyEmail({ email, code })

            if (!result.verified) {
                toast.error("Code invalide ou expiré")
                return
            }

            const registerData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstname: formData.firstname,
                lastname: formData.lastname,
                active: true,
                dateNaissance: formData.dateNaissance,
            }

            await authApi.registerPatient(registerData)

            toast.success("✅ Compte créé avec succès !")
            router.push("/login")
        } catch (error: any) {
            let msg = "Erreur lors de la création du compte"
            if (error.message?.includes("email") || error.message?.includes("Email"))
                msg = "Cet email est déjà utilisé"
            else if (error.message?.includes("username") || error.message?.includes("Username"))
                msg = "Ce nom d'utilisateur est déjà utilisé"
            else if (error.message)
                msg = error.message
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        try {
            setLoading(true)
            await accountApi.sendVerificationCode(email)
            toast.success("📧 Nouveau code envoyé")
        } catch (error: any) {
            toast.error("Erreur lors du renvoi du code")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-teal-950/20 to-black"></div>
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Retour à l'accueil</span>
                </Link>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
                            <Stethoscope className="h-5 w-5 text-cyan-400" />
                            <span className="text-sm font-semibold">Nouveau patient</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {step === "form" ? "Créer un compte" : "Vérification"}
                            </span>
                        </h1>
                        <p className="text-gray-400">
                            {step === "form"
                                ? "Rejoignez notre plateforme médicale"
                                : `Code envoyé à ${email}`}
                        </p>
                    </div>
                    {step === "form" ? (
                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname" className="text-sm font-medium text-gray-300">Prénom</Label>
                                    <Input
                                        id="firstname"
                                        value={formData.firstname}
                                        onChange={(e) => handleFormChange("firstname", e.target.value)}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname" className="text-sm font-medium text-gray-300">Nom</Label>
                                    <Input
                                        id="lastname"
                                        value={formData.lastname}
                                        onChange={(e) => handleFormChange("lastname", e.target.value)}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-300">Nom d'utilisateur</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        value={formData.username}
                                        onChange={(e) => handleFormChange("username", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        value={formData.email}
                                        onChange={(e) => handleFormChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateNaissance" className="text-sm font-medium text-gray-300">Date de naissance</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="dateNaissance"
                                        type="date"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus-visible:ring-blue-500 focus-visible:border-blue-500 [&::-webkit-calendar-picker-indicator]:invert"
                                        value={formData.dateNaissance}
                                        onChange={(e) => handleFormChange("dateNaissance", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-300">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        value={formData.password}
                                        onChange={(e) => handleFormChange("password", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirmer le mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 py-6 mt-6"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Envoi du code...
                                    </>
                                ) : (
                                    "Continuer"
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-400 mt-4">
                                Vous avez déjà un compte ?{" "}
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-sm font-medium text-gray-300">Code de vérification</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    maxLength={4}
                                    placeholder="0000"
                                    className="text-center text-2xl tracking-widest font-mono bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                    required
                                />
                                <p className="text-xs text-gray-500 text-center">
                                    Le code expire dans 15 minutes
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 py-6"
                                disabled={loading || code.length !== 4}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Vérification...
                                    </>
                                ) : (
                                    "Vérifier et créer le compte"
                                )}
                            </Button>

                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="w-full border-white/20 text-white hover:bg-white/10"
                                >
                                    Renvoyer le code
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep("form")}
                                    disabled={loading}
                                    className="w-full text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Retour
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
