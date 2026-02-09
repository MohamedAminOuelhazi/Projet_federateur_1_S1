'use client'
import Link from 'next/link'
import React, { useState } from 'react'



export const Footer = () => {
    return (
        <footer className="bg-[#163362] text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-xl font-bold">MyConsultia</span>
                        </div>
                        <p className="text-blue-200 text-sm">
                            La solution LegalTech pour les cabinets d'avocats tunisiens.
                        </p>
                    </div>


                    <div>
                        <h4 className="font-bold mb-4">Produit</h4>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li><Link href="/#features" className="hover:text-white">Fonctionnalités</Link></li>
                            <li><Link href="/tarifs" className="hover:text-white">Tarifs</Link></li>
                            <li><a href="#" className="hover:text-white">Sécurité</a></li>
                            <li><a href="#" className="hover:text-white">Mises à jour</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-bold mb-4">Entreprise</h4>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li><a href="#" className="hover:text-white">À propos</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                            <li><a href="#" className="hover:text-white">Carrières</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
                            <li><a href="#" className="hover:text-white">Documentation</a></li>
                            <li><a href="#" className="hover:text-white">Nous contacter</a></li>
                        </ul>
                    </div>
                </div>


                <div className="border-t border-blue-800 mt-12 pt-8 text-center text-sm text-blue-200">
                    <p>&copy; 2025 MyConsultia. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
