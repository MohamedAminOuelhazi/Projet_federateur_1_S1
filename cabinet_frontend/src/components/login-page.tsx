"use client"

import type React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, Eye, EyeOff, Stethoscope, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { useState } from "react"
import Link from "next/link"

const loginSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    password: z.string().min(1, "Le mot de passe est requis"),
    remember: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginPageProps {
    onSubmit: (data: LoginFormData) => Promise<void>
    loading?: boolean
    error?: string
}

export default function LoginPage({ onSubmit, loading = false, error }: LoginPageProps) {
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: false,
        }
    })

    const handleFormSubmit = async (data: LoginFormData) => {
        await onSubmit(data)
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-teal-950/20 to-black"></div>
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Login Card */}
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
                            <span className="text-sm font-semibold">Cabinet Médical</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Bienvenue
                            </span>
                        </h1>
                        <p className="text-gray-400">Connectez-vous à votre espace</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                                Nom d'utilisateur
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="votre_nom_utilisateur"
                                    {...register("username")}
                                    className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""
                                        }`}
                                    disabled={loading || isSubmitting}
                                />
                            </div>
                            {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                                Mot de passe
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                                        }`}
                                    disabled={loading || isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    disabled={loading || isSubmitting}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="remember"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading || isSubmitting}
                                            className="border-white/20 data-[state=checked]:bg-cyan-500"
                                        />
                                    )}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer select-none">
                                    Se souvenir de moi
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 py-6"
                            disabled={loading || isSubmitting}
                        >
                            {loading || isSubmitting ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Connexion...</span>
                                </div>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-500">OU</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                                Pas encore de compte ? <span className="font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Créer un compte</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
