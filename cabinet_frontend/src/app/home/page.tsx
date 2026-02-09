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
  MapPin
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [medecin, setMedecin] = useState<MedecinDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedecin();
  }, []);

  const loadMedecin = async () => {
    try {
      const data = await usersApi.getMedecins();
      // Récupérer le premier (et unique) médecin
      if (data.length > 0) {
        setMedecin(data[0]);
      }
    } catch (error) {
      console.error("Erreur chargement médecin:", error);
    } finally {
      setLoading(false);
    }
  };

  const cabinetTitle = medecin
    ? `Cabinet du Dr. ${medecin.prenom} ${medecin.nom}`
    : "Cabinet Médical";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <Heart className="h-4 w-4" />
                <span>Votre santé, notre priorité</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                {cabinetTitle}
              </h1>

              {medecin?.specialite && (
                <p className="text-2xl text-blue-200 font-semibold">
                  Spécialiste en {medecin.specialite}
                </p>
              )}

              <p className="text-xl text-blue-100">
                {medecin?.description || "Plateforme de gestion complète pour votre cabinet médical"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
                >
                  Prendre rendez-vous <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Connexion patient
                </Button>
              </div>
            </div>

            {/* Photo du médecin ou icône */}
            <div className="flex justify-center">
              {medecin?.photoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-50 rounded-full"></div>
                  <img
                    src={medecin.photoUrl}
                    alt={`Dr. ${medecin.nom}`}
                    className="relative w-80 h-80 rounded-full object-cover border-8 border-white/20 shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-80 h-80 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-8 border-white/20">
                  <Stethoscope className="h-40 w-40 text-white/80" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact rapide */}
      {medecin && (medecin.email || medecin.telephone) && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8">
              {medecin.email && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{medecin.email}</p>
                  </div>
                </div>
              )}

              {medecin.telephone && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold text-gray-900">{medecin.telephone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Services proposés
            </h2>
            <p className="text-xl text-gray-600">
              Une prise en charge complète et personnalisée
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Prise de rendez-vous facile</h3>
                <p className="text-gray-600">
                  Réservez votre consultation en ligne en quelques clics
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Consultations de qualité</h3>
                <p className="text-gray-600">
                  Bénéficiez d'un suivi médical professionnel et attentif
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confidentialité garantie</h3>
                <p className="text-gray-600">
                  Vos données médicales sont sécurisées et protégées
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi choisir notre cabinet ?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Expérience et expertise</h3>
                    <p className="text-gray-600">
                      {medecin?.specialite ? `Spécialisation en ${medecin.specialite}` : "Médecin qualifié et expérimenté"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Horaires flexibles</h3>
                    <p className="text-gray-600">
                      Prenez rendez-vous selon vos disponibilités
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Suivi personnalisé</h3>
                    <p className="text-gray-600">
                      Accédez à votre dossier médical en ligne
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Plateforme moderne</h3>
                    <p className="text-gray-600">
                      Gestion digitale simplifiée de vos consultations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Horaires d'ouverture</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Samedi</span>
                  <span className="font-semibold">9h00 - 13h00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dimanche</span>
                  <span className="font-semibold">Fermé</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <p className="text-sm">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Sur rendez-vous uniquement
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Prêt à prendre rendez-vous ?
          </h2>
          <p className="text-xl text-blue-100">
            Créez votre compte patient et accédez à tous nos services en ligne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
            >
              Créer mon compte patient <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6" />
                <span className="text-xl font-bold">{cabinetTitle}</span>
              </div>
              <p className="text-gray-400">
                {medecin?.specialite && `Spécialiste en ${medecin.specialite}`}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                {medecin?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {medecin.email}
                  </p>
                )}
                {medecin?.telephone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {medecin.telephone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Liens rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/register")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Prendre rendez-vous
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {cabinetTitle} - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
