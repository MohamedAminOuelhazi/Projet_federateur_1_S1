'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Image from 'next/image'



export const HeroHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className=" bg-[#ffffff] rounded-lg flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                width={50}
                                height={50}
                                alt="MyConsultia"
                            />
                        </div>

                        <span className="text-xl font-bold text-[#1E40AF]">MyConsultia</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
                            Fonctionnalités
                        </Link>
                        <Link href="/#testimonials" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
                            Témoignages
                        </Link>
                        <Link href="/tarifs" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
                            Tarifs
                        </Link>
                        <Link href="/#faq" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
                            FAQ
                        </Link>


                        <Link href="/login">
                            <Button variant="outline" className="border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
                                Commencer
                            </Button>
                        </Link>
                    </nav>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <a href="/#features" className="text-gray-700 hover:text-[#1E40AF]">Fonctionnalités</a>
                            <a href="/#testimonials" className="text-gray-700 hover:text-[#1E40AF]">Témoignages</a>
                            <Link href="/tarifs" className="text-gray-700 hover:text-[#1E40AF]">Tarifs</Link>
                            <a href="/#faq" className="text-gray-700 hover:text-[#1E40AF]">FAQ</a>
                            <Link href="/login">
                                <Button variant="outline" className="border-[#1E40AF] text-[#1E40AF] w-full">
                                    Connexion
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white w-full">
                                    Commencer
                                </Button>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
