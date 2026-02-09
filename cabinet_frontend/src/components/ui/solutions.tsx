import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import AnimatedListDemo from "../animated-list-demo";
import AnimatedBeamMultipleOutputDemo from "../animated-beam-multiple-outputs";


const files = [
    {
        name: "Contrat_de_prestation.pdf",
        body: "Modèle de contrat utilisé pour formaliser une prestation entre l’expert et son client. Inclut les conditions, les tarifs et la durée.",
    },
    {
        name: "Facture_Consultation_23_mai_2025.pdf",
        body: "Facture générée pour la consultation du 23 mai 2025 avec le client Karim M. — Montant : 120 TND.",
    },
    {
        name: "Compte_rendu_consultation.docx",
        body: "Résumé écrit de la consultation du 17 avril avec Mme Beya R. comprenant les recommandations et prochaines étapes.",
    },
    {
        name: "Attestation_RDV.pdf",
        body: "Attestation de présence à un rendez-vous, générée pour le client à des fins administratives.",
    },
    {
        name: "Guide_utilisation_plateforme_MyConsultia.pdf",
        body: "Document officiel de la plateforme expliquant aux experts comment gérer leurs rendez-vous, clients et fichiers.",
    },
    {
        name: "Fiche_client_Sami_H.pdf",
        body: "Dossier personnel de M. Sami H. contenant ses informations de contact, historique de consultation et documents échangés.",
    },
    {
        name: "Reçu_Paiement_mai_2025.pdf",
        body: "Justificatif du paiement reçu pour l’ensemble des prestations effectuées durant le mois de mai 2025.",
    },
    {
        name: "Règlement_intérieur_expert.pdf",
        body: "Document officiel de MyConsultia expliquant les règles d’éthique, confidentialité et conditions d’utilisation pour les experts.",
    },
];

const features = [
    {
        Icon: FileTextIcon,
        name: "Dossiers centralisés",
        description:
            "Regroupez tous les documents, notes et historiques de vos clients au même endroit, accessibles à tout moment.",
        href: "#",
        cta: "En savoir plus",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Marquee
                pauseOnHover
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
            >
                {files.map((f, idx) => (
                    <figure
                        key={idx}
                        className={cn(
                            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
                        )}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex flex-col">
                                <figcaption className="text-sm font-medium dark:text-white">
                                    {f.name}
                                </figcaption>
                            </div>
                        </div>
                        <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                    </figure>
                ))}
            </Marquee>
        ),
    },
    {
        Icon: BellIcon,
        name: "Alertes & notifications",
        description:
            "Soyez alerté en temps réel pour chaque nouveau rendez-vous, message ou paiement reçu.",
        href: "#",
        cta: "En savoir plus",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
        ),
    },
    {
        Icon: Share2Icon, // Tu peux changer l'icône ici si tu veux un visuel plus adapté
        name: "E-bureau intelligent",
        description:
            "Gérez votre activité comme au cabinet : prise de notes, documents, visio, IA, réponses à vos clients, et plus, tout au même endroit.",
        href: "#",
        cta: "En savoir plus",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: CalendarIcon,
        name: "Agenda intelligent",
        description:
            "Visualisez et gérez tous vos rendez-vous facilement avec une synchronisation automatique.",
        className: "col-span-3 lg:col-span-1",
        href: "#",
        cta: "En savoir plus",
        background: (
            <Calendar
                mode="single"
                selected={new Date()}
                className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
            />
        ),
    },
];


export function BentoDemo() {
    return (
        <div id='Features' className="@container mx-auto max-w-6xl px-1">
            <BentoGrid>
                {features.map((feature, idx) => (
                    <BentoCard key={idx} {...feature} />
                ))}
            </BentoGrid>
        </div>
    );
}
