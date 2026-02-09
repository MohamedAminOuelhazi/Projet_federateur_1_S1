"use client";

import { useState, useEffect } from "react";
import { usersApi, MedecinDTO } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Calendar,
  Shield,
  Users,
  Heart,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  Lock,
  BarChart3,
  MessagesSquare,
  Bell,
  Activity,
  Sun,
  Moon
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [medecin, setMedecin] = useState<MedecinDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadMedecin();
  }, []);

  const loadMedecin = async () => {
    try {
      const data = await usersApi.getMedecins();
      if (data.length > 0) {
        setMedecin(data[0]);
      }
    } catch (error) {
      console.error("Erreur chargement médecin:", error);
    } finally {
      setLoading(false);
    }
  };

  const cabinetName = medecin
    ? `Dr. ${medecin.prenom} ${medecin.nom}`
    : "Cabinet Médical";

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${isDark
      ? 'bg-black text-white'
      : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark
        ? 'bg-black/50 border-white/10'
        : 'bg-white/50 border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-sky-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">{cabinetName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
              >
                Connexion
              </Button>
              <Button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Effects */}
        <div className={`absolute inset-0 transition-colors duration-300 ${isDark
          ? 'bg-gradient-to-b from-cyan-950/20 via-teal-950/20 to-black'
          : 'bg-gradient-to-b from-cyan-50 via-teal-50 to-white'
          }`}></div>
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-cyan-500/30' : 'bg-cyan-300/40'
            }`}></div>
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${isDark ? 'bg-teal-500/30' : 'bg-teal-300/40'
            }`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 backdrop-blur-xl border px-4 py-2 rounded-full ${isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-gray-200'
              }`}>
              <Sparkles className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className="text-sm bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-semibold">
                Plateforme médicale nouvelle génération
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark
                ? 'from-white via-cyan-100 to-teal-100'
                : 'from-gray-900 via-cyan-900 to-teal-900'
                }`}>
                Votre santé,
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Digitalisée
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {medecin?.description || "Une plateforme complète de gestion médicale. Prenez rendez-vous, consultez votre dossier et communiquez avec votre médecin en toute simplicité."}
            </p>

            {medecin?.specialite && (
              <div className={`flex items-center justify-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                <Award className="h-5 w-5" />
                <span className="text-lg font-semibold">Spécialiste en {medecin.specialite}</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 px-8 py-6 text-lg group"
              >
                Prendre rendez-vous
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 px-8 py-6 text-lg"
              >
                Espace
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">24/7</div>
                <div className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">100%</div>
                <div className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Sécurisé</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  <Activity className="h-8 w-8 mx-auto" />
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Suivi en temps réel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center gap-2 backdrop-blur-xl border px-4 py-2 rounded-full mb-6 ${isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-gray-200'
              }`}>
              <Zap className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fonctionnalités puissantes</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'
                }`}>
                Tout ce dont vous avez besoin
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Une plateforme complète conçue pour simplifier votre parcours de soins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Rendez-vous intelligents",
                description: "Réservation en ligne 24/7 avec confirmation instantanée et rappels automatiques",
                gradient: "from-cyan-500 to-teal-500"
              },
              {
                icon: FileText,
                title: "Dossier médical numérique",
                description: "Accédez à votre historique médical complet, ordonnances et résultats d'analyses",
                gradient: "from-teal-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Sécurité maximale",
                description: "Chiffrement de bout en bout et conformité totale aux normes médicales",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: MessagesSquare,
                title: "Communication directe",
                description: "Échangez avec votre médecin via messagerie sécurisée",
                gradient: "from-cyan-500 to-teal-600"
              },
              {
                icon: BarChart3,
                title: "Suivi personnalisé",
                description: "Visualisez votre évolution avec des graphiques et rapports détaillés",
                gradient: "from-teal-500 to-cyan-500"
              },
              {
                icon: Bell,
                title: "Notifications intelligentes",
                description: "Rappels automatiques pour vos rendez-vous et traitements",
                gradient: "from-emerald-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <Card key={index} className={`backdrop-blur-xl border transition-all group hover:scale-105 ${isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white/80 border-gray-200 hover:bg-white shadow-lg hover:shadow-xl'
                }`}>
                <CardContent className="p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Profile Section */}
      {medecin && (
        <section className="relative py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className={`backdrop-blur-xl border rounded-3xl p-12 relative overflow-hidden ${isDark
              ? 'bg-gradient-to-br from-cyan-950/50 to-teal-950/50 border-white/10'
              : 'bg-gradient-to-br from-cyan-50/80 to-teal-50/80 border-gray-200'
              }`}>
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-300/30'
                }`}></div>
              <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-teal-500/20' : 'bg-teal-300/30'
                }`}></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className={`inline-flex items-center gap-2 border px-4 py-2 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200'
                    }`}>
                    <Award className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Votre médecin</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold">
                    <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'
                      }`}>
                      {cabinetName}
                    </span>
                  </h2>

                  {medecin.specialite && (
                    <div className={`flex items-center gap-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Spécialité</p>
                        <p className="text-xl font-semibold">{medecin.specialite}</p>
                      </div>
                    </div>
                  )}

                  {medecin.description && (
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {medecin.description}
                    </p>
                  )}

                  <div className="space-y-3 pt-4">
                    {medecin.email && (
                      <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-white/80'
                          }`}>
                          <Mail className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        </div>
                        <span>{medecin.email}</span>
                      </div>
                    )}
                    {medecin.telephone && (
                      <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-white/80'
                          }`}>
                          <Phone className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <span>{medecin.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  {medecin.photoUrl ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl blur-2xl opacity-50"></div>
                      <img
                        src={medecin.photoUrl}
                        alt={cabinetName}
                        className={`relative w-80 h-80 rounded-3xl object-cover border ${isDark ? 'border-white/20' : 'border-gray-200'
                          }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-80 h-80 rounded-3xl backdrop-blur-xl border flex items-center justify-center ${isDark
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                      : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200'
                      }`}>
                      <Stethoscope className={`h-32 w-32 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'
                }`}>
                Comment ça marche ?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Créez votre compte", icon: Users, desc: "Inscription rapide en 2 minutes" },
              { step: "02", title: "Prenez rendez-vous", icon: Calendar, desc: "Choisissez votre créneau" },
              { step: "03", title: "Consultez", icon: Stethoscope, desc: "Rencontrez votre médecin" },
              { step: "04", title: "Suivez votre santé", icon: TrendingUp, desc: "Accédez à votre dossier" }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className={`backdrop-blur-xl border rounded-2xl p-8 transition-all ${isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/80 border-gray-200 hover:bg-white shadow-lg hover:shadow-xl'
                  }`}>
                  <div className="text-6xl font-bold bg-gradient-to-br from-cyan-500/20 to-teal-500/20 bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-teal-500 to-sky-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`relative backdrop-blur-xl border rounded-3xl p-12 overflow-hidden ${isDark
            ? 'bg-gradient-to-br from-cyan-950/80 to-teal-950/80 border-white/10'
            : 'bg-gradient-to-br from-cyan-50/90 to-teal-50/90 border-gray-200'
            }`}>
            {/* Background effects */}
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-cyan-500/10 to-teal-500/10' : 'bg-gradient-to-br from-cyan-100/20 to-teal-100/20'
              }`}></div>
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-300/30'
              }`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-teal-500/20' : 'bg-teal-300/30'
              }`}></div>

            <div className="relative z-10 text-center space-y-8">
              <div className={`inline-flex items-center gap-2 backdrop-blur-xl border px-4 py-2 rounded-full ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'
                }`}>
                <Sparkles className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Commencez gratuitement</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white via-cyan-100 to-teal-100' : 'from-gray-900 via-cyan-900 to-teal-900'
                  }`}>
                  Prêt à digitaliser votre santé ?
                </span>
              </h2>

              <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Rejoignez des centaines de patients qui font confiance à notre plateforme pour gérer leur parcours de soins
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 px-8 py-6 text-lg group"
                >
                  Créer mon compte
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 px-8 py-6 text-lg"
                >
                  Me connecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative border-t py-12 px-4 transition-colors duration-300 ${isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">{cabinetName}</span>
              </div>
              <p className={`mb-4 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {medecin?.specialite ? `Spécialiste en ${medecin.specialite}` : "Plateforme médicale de nouvelle génération"}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                © {new Date().getFullYear()} {cabinetName}. Tous droits réservés.
              </p>
            </div>

            <div>
              <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/register")}
                  className={`block transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Inscription
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className={`block transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Connexion
                </button>
              </div>
            </div>

            <div>
              <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
              <div className={`space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {medecin?.email && (
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {medecin.email}
                  </p>
                )}
                {medecin?.telephone && (
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {medecin.telephone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={`border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm ${isDark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-600'
            }`}>
            <div className="flex gap-4">
              <Lock className="h-4 w-4" />
              <span>Données sécurisées et chiffrées</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'
                }`}>Confidentialité</a>
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'
                }`}>CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
