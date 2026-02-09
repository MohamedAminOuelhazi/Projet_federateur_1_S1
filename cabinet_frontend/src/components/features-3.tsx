import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'
import { Search, CalendarClock, MessageCircle } from "lucide-react";



export default function Features() {
    return (
        <section className="dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6 text-center">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#163362] mb-4">
                        Reçoivent des documents
                    </h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Besoin d’un conseil juridique, fiscal ou technique ? Avec MyConsultia, accédez rapidement aux meilleurs experts.
                    </p>
                </div>
                <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>

                                <Search className="text-[#163362] w-10 h-10 mb-4" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Reçoivent des documents</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">WhatsApp, email, papier.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <CalendarClock className="text-[#163362] w-10 h-10 mb-4" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Réservez</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Choisissez un créneau qui vous convient.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <MessageCircle className="text-[#163362] w-10 h-10 mb-4" />
                            </CardDecorator>
                            <h3 className="mt-6 font-medium">Consultez</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Posez vos questions via visio en toute sécurité.</p>
                        </CardContent>
                    </div>
                </Card>

                <button className="mt-10 bg-[#163362] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:bg-[#1e4172] transition">
                    Trouver un expert maintenant
                </button>
            </div>

        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
