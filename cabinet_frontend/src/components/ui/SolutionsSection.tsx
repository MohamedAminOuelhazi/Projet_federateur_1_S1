import React from 'react'
export default function SolutionsSection() {
    const solutions = [
        {
            icon: "🗓️",
            title: "Gestion simplifiée des rendez-vous",
            description: "Planifiez, modifiez ou annulez vos consultations en quelques clics, avec des rappels automatiques pour vos clients.",
        },
        {
            icon: "💬",
            title: "Consultations en ligne fluides",
            description: "Proposez des rendez-vous en visio via des outils intégrés comme Google Meet , sans installation supplémentaire.",
        },
        {
            icon: "📁",
            title: "Dossiers clients centralisés",
            description: "Tous vos documents, notes, fichiers et historiques de consultations sont regroupés dans un espace sécurisé.",
        },
        {
            icon: "💰",
            title: "Paiements automatisés",
            description: "Recevez vos paiements directement via la plateforme et suivez l’état de vos revenus en temps réel.",
        },
        {
            icon: "🔔",
            title: "Notifications intelligentes",
            description: "Restez informé de chaque message, nouveau rendez-vous ou paiement avec un système de notifications en temps réel.",
        },
        {
            icon: "📊",
            title: "Statistiques & suivi d'activité",
            description: "Visualisez vos performances, le nombre de consultations, vos revenus, et optimisez votre activité.",
        },
    ];

    return (
        <section id='Solution' className="bg-white py-16 px-4 md:px-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#163362] mb-6">
                💡 Les solutions que MyConsultia vous apporte
            </h2>
            <p className="text-lg text-gray-600 mb-12 text-center">
                Tout ce dont un professionnel a besoin, dans une seule plateforme
            </p>
            <div className="@container mx-auto max-w-6xl px-1 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {solutions.map((sol, index) => (
                    <div
                        key={index}
                        className="bg-[#f7f7f7] hover:bg-[#eef1f6] transition p-6 rounded-2xl shadow-sm"
                    >
                        <div className="text-4xl mb-4">{sol.icon}</div>
                        <h3 className="text-xl font-semibold text-[#163362] mb-2">
                            {sol.title}
                        </h3>
                        <p className="text-gray-700 text-sm">{sol.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
