// components/ProblemesRencontres.tsx

import { AlertTriangle, CheckCircle } from "lucide-react";

export default function ProblemesRencontres() {
    return (
        <section className="py-16 px-6 md:px-20">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#163362] mb-4">
                    Les difficultés que vous vivez au quotidien…
                </h2>
                <p className="text-lg text-gray-600 mb-12">
                    Vous êtes avocat, expert-comptable ou architecte ? Voici ce que vous affrontez chaque jour :
                </p>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                    {[
                        "Vous passez des heures à gérer vos appels et rendez-vous à la main ?",
                        "Vos clients vous appellent à tout moment, même hors horaires ?",
                        "Vous jonglez entre plusieurs outils pour travailler ?",
                        "Vous avez du mal à structurer vos dossiers clients ?",
                    ].map((problem, index) => (
                        <div
                            key={index}
                            className="flex items-start space-x-3 bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
                        >
                            <AlertTriangle className="text-red-500 mt-1" />
                            <p className="text-gray-700">{problem}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-[#163362] text-white rounded-2xl p-6 md:p-10 shadow-xl">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <CheckCircle className="text-green-300" />
                        <h3 className="text-xl font-semibold">Avec MyConsultia, vous reprenez le contrôle</h3>
                    </div>
                    <p className="text-lg">
                        Une seule plateforme pour gérer votre activité, vos clients, et vos consultations.<br />
                        Gagnez du temps, améliorez votre image professionnelle, et soyez plus disponible… pour les bonnes raisons.
                    </p>
                </div>
            </div>
        </section>
    );
}
