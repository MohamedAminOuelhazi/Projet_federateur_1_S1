"use client";

export default function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-6">
                Coming Soon
            </h1>
            <p className="text-xl text-gray-700 mb-8 text-center">
                Cette page arrive très bientôt.<br />Restez connecté pour découvrir de nouvelles fonctionnalités !
            </p>
            <svg className="w-24 h-24 mb-8 text-blue-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M24 12v8m0 8h.01" />
            </svg>
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} MyConsultia — All rights reserved.</span>
        </div>
    );
}
