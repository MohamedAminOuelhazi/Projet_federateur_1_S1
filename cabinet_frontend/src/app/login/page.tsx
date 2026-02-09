"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { authApi } from "@/lib/api/auth"

type LoginFormData = {
    username: string
    password: string
    remember: boolean
}

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()

    // ✅ Redirection automatique si déjà connecté
    useEffect(() => {
        if (!authLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, authLoading, router])

    const handleLogin = async (data: LoginFormData) => {
        setLoading(true)
        setError(undefined)
        try {
            // Utiliser l'API Spring Boot pour la connexion
            // Le backend attend username et mot_de_passe
            const response = await authApi.login({
                username: data.username,
                mot_de_passe: data.password,
            })

            // Vérifier que le token est bien stocké
            // Attendre un peu pour que le token soit stocké
            await new Promise(resolve => setTimeout(resolve, 100));

            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
            console.log("Token stocké:", token ? "Oui" : "Non")

            if (!token) {
                throw new Error("Erreur: Token non stocké après la connexion")
            }

            toast.success("Connexion réussie !")

            // Utiliser window.location pour forcer une navigation complète
            // Cela recharge toute la page et réinitialise tous les hooks
            window.location.href = "/dashboard"
        } catch (err: any) {
            console.error("Login error:", err)
            const errorMessage = err.message || "Identifiants invalides. Vérifiez votre nom d'utilisateur et votre mot de passe."
            setError(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    };

    // ✅ Affiche un loader pendant la vérification d'authentification
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Vérification de la session...</div>
            </div>
        )
    }

    // ✅ Si l'utilisateur est connecté, on ne rend rien (redirection en cours)
    if (user) {
        return null
    }

    return <LoginPage onSubmit={handleLogin} loading={loading} error={error} />
}
