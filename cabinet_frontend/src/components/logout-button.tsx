"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LogOut } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"

export default function LogoutButton() {
    const [loading, setLoading] = useState(false)
    const { logout } = useAuthContext()

    const handleLogout = async () => {
        setLoading(true)
        try {
            logout()
        } catch (err) {
            alert("Erreur lors de la déconnexion")
            setLoading(false)
        }
    }

    return (
        <Button onClick={handleLogout} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? "Déconnexion..." : "Se déconnecter"}
        </Button>
    )
}
