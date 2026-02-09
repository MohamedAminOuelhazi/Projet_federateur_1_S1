"use client"

import { useState } from "react"
import {
    LayoutDashboard,
    FolderOpen,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search,
    Plus,
    Upload,
    Menu,
    X,
    TrendingUp,
    Check,
    ChevronRight,
    ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import LogoutButton from "@/components/logout-button";



interface DashboardProps {
    user: {
        displayName: string
        avatar?: string
    }
    stats: {
        totalDossiers: number
        trendPercentage: number
        audiencesMonth: number
        nextAudienceDate?: string
        totalDocuments: number
        storageUsedGB: number
        activeClients: number
        newClients: number
    }
    recentDossiers: Array<{
        id: string
        numero: string
        client: string
        type: "civil" | "pénal" | "commercial" | "administratif"
        statut: "en_cours" | "terminé" | "suspendu"
        date: string
    }>
    upcomingAudiences: Array<{
        id: string
        date: string
        time: string
        title: string
        tribunal: string
        remindersCount: number
    }>
    unreadNotifications: number
    unreadMessages: number
    onNavigate?: (path: string) => void
    onNewDossier?: () => void
    onNewAudience?: () => void
    onUploadDocument?: () => void
    onLogout?: () => void
}

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "dossiers", label: "Dossiers", icon: FolderOpen, path: "/dossiers" },
    { id: "clients", label: "Clients", icon: Users, path: "/clients" },
    { id: "audiences", label: "Audiences", icon: Calendar, path: "/audiences" },
    { id: "documents", label: "Documents", icon: FileText, path: "/documents" },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, path: "/messagerie" },
    { id: "parametres", label: "Paramètres", icon: Settings, path: "/parametres" },
]

const typeColors = {
    civil: "bg-blue-100 text-blue-700 border-blue-200",
    pénal: "bg-red-100 text-red-700 border-red-200",
    commercial: "bg-green-100 text-green-700 border-green-200",
    administratif: "bg-purple-100 text-purple-700 border-purple-200",
}

const statutConfig = {
    en_cours: { label: "En cours", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
    terminé: { label: "Terminé", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
    suspendu: { label: "Suspendu", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
}

export default function LawyerDashboard({
    user,
    stats,
    recentDossiers,
    upcomingAudiences,
    unreadNotifications,
    unreadMessages,
    onNavigate,
    onNewDossier,
    onNewAudience,
    onUploadDocument,
    onLogout,
}: DashboardProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeNav, setActiveNav] = useState("dashboard")


    // Helper function pour gérer les initiales de façon sécurisée
    const getInitials = (name: string | undefined): string => {
        if (!name || name.trim() === "") return "?";
        return name.charAt(0).toUpperCase();
    };

    const handleNavClick = (id: string, path: string) => {
        setActiveNav(id)
        setSidebarOpen(false)
        onNavigate?.(path)
    }

    const getCurrentDate = () => {
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        const months = [
            "janvier",
            "février",
            "mars",
            "avril",
            "mai",
            "juin",
            "juillet",
            "août",
            "septembre",
            "octobre",
            "novembre",
            "décembre",
        ]
        const now = new Date()
        return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]
        return {
            day: date.getDate(),
            month: months[date.getMonth()],
        }
    }

    const storagePercentage = (stats.storageUsedGB / 10) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                    {/* Left: Logo + Menu */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E40AF] via-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 ring-2 ring-blue-100">
                                MC
                            </div>
                            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-[#1E40AF] to-blue-600 bg-clip-text text-transparent">
                                MyConsultia
                            </span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Rechercher un dossier, client..."
                                className="pl-10 w-full border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="relative hover:bg-blue-50/50">
                            <Bell className="h-5 w-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-medium shadow-lg shadow-red-500/30 animate-pulse">
                                    {unreadNotifications}
                                </span>
                            )}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3 hover:bg-blue-50/50">
                                    <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName || "User"} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-blue-600 text-white">
                                            {getInitials(user.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline-block text-sm font-medium">{user.displayName || "Utilisateur"}</span>

                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleNavClick("parametres", "/parametres")}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">

                                    <LogoutButton />

                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>


                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static shadow-xl lg:shadow-none",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full",
                        "top-16 lg:top-0",
                    )}
                >
                    <nav className="flex flex-col h-full p-4 space-y-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeNav === item.id
                            const badge = item.id === "messagerie" ? unreadMessages : 0

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id, item.path)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                                        isActive
                                            ? "bg-gradient-to-r from-[#1E40AF] to-blue-600 text-white shadow-lg shadow-blue-500/30"
                                            : "text-gray-700 hover:bg-blue-50/50 hover:text-[#1E40AF]",
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                            isActive && "drop-shadow-sm",
                                        )}
                                    />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {badge > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs px-2 py-0.5 h-5 min-w-5 shadow-md"
                                        >
                                            {badge}
                                        </Badge>
                                    )}
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                                    )}
                                </button>
                            )
                        })}

                        <div className="border-t border-gray-200/50 my-2" />

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/50 transition-all duration-200 group"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                            <span className="flex-1 text-left">Déconnexion</span>
                        </button>
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden top-16"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 space-y-6">
                    {/* Welcome Card */}
                    <Card className="border-none shadow-xl bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
                        <CardContent className="p-8 relative">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        Bienvenue, {user.displayName || "Utilisateur"}
                                    </h1>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        {getCurrentDate()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20 hidden sm:block ring-4 ring-blue-100 shadow-xl">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName || "User"} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-blue-600 text-white text-2xl">
                                            {getInitials(user.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        onClick={onNewDossier}
                                        className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nouveau dossier
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Dossiers */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-blue-100">Dossiers actifs</p>
                                        <p className="text-4xl font-bold">{stats.totalDossiers}</p>
                                        <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>+{stats.trendPercentage}% ce mois</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audiences */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-green-100">Audiences programmées</p>
                                        <p className="text-4xl font-bold">{stats.audiencesMonth}</p>
                                        {stats.nextAudienceDate && (
                                            <p className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                                Prochaine: {stats.nextAudienceDate}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-[#F59E0B] to-amber-600 text-white overflow-hidden relative group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 w-full">
                                        <p className="text-sm font-medium text-amber-100">Documents stockés</p>
                                        <p className="text-4xl font-bold">{stats.totalDocuments}</p>
                                        <div className="space-y-2">
                                            <p className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                                {stats.storageUsedGB} GB / 10 GB
                                            </p>
                                            <Progress value={storagePercentage} className="h-2 bg-white/20" />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                                        <FolderOpen className="h-7 w-7" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Clients */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-purple-100">Clients actifs</p>
                                        <p className="text-4xl font-bold">{stats.activeClients}</p>
                                        <p className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                                            +{stats.newClients} ce mois
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                                        <Users className="h-7 w-7" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Dossiers */}
                        <Card className="lg:col-span-2 shadow-xl border-none bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Dossiers Récents
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleNavClick("dossiers", "/dossiers")}
                                    className="text-[#1E40AF] hover:text-blue-700 hover:bg-blue-50/50 group"
                                >
                                    Voir tout
                                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {recentDossiers.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-100 hover:bg-transparent">
                                                    <TableHead className="font-semibold text-gray-700">N° Dossier</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Client</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Type</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                                                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentDossiers.slice(0, 5).map((dossier) => {
                                                    const statutInfo = statutConfig[dossier.statut]
                                                    return (
                                                        <TableRow
                                                            key={dossier.id}
                                                            className="cursor-pointer hover:bg-blue-50/50 transition-colors border-gray-100 group"
                                                            onClick={() => onNavigate?.(`/dossiers/${dossier.id}`)}
                                                        >
                                                            <TableCell className="font-semibold text-[#1E40AF] group-hover:underline">
                                                                {dossier.numero}
                                                            </TableCell>
                                                            <TableCell className="font-medium">{dossier.client}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn("capitalize font-medium shadow-sm", typeColors[dossier.type])}
                                                                >
                                                                    {dossier.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className={cn(
                                                                            "h-2 w-2 rounded-full shadow-sm",
                                                                            statutInfo.color,
                                                                            dossier.statut === "en_cours" && "animate-pulse",
                                                                        )}
                                                                    />
                                                                    <span className={cn("text-sm font-medium", statutInfo.textColor)}>
                                                                        {statutInfo.label}
                                                                    </span>
                                                                    {dossier.statut === "terminé" && <Check className="h-4 w-4 text-green-600" />}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-gray-600">{dossier.date}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                            <FolderOpen className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium">Aucun dossier récent</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Audiences */}
                        <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Audiences à venir
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {upcomingAudiences.length > 0 ? (
                                    <>
                                        {upcomingAudiences.slice(0, 3).map((audience) => {
                                            const dateInfo = formatDate(audience.date)
                                            return (
                                                <div
                                                    key={audience.id}
                                                    className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent hover:from-blue-50 hover:to-blue-50/30 cursor-pointer transition-all duration-200 border border-blue-100/50 hover:border-blue-200 hover:shadow-md group"
                                                    onClick={() => onNavigate?.(`/audiences/${audience.id}`)}
                                                >
                                                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#1E40AF] to-blue-600 rounded-xl px-4 py-3 min-w-[70px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                                        <span className="text-2xl font-bold text-white">{dateInfo.day}</span>
                                                        <span className="text-xs text-blue-100 uppercase font-semibold">{dateInfo.month}</span>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                                                                {audience.time}
                                                            </span>
                                                        </div>
                                                        <p className="font-semibold text-[#1E40AF] group-hover:underline flex items-center gap-1">
                                                            {audience.title}
                                                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </p>
                                                        <p className="text-sm text-gray-600">{audience.tribunal}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1 w-fit">
                                                            <Bell className="h-3 w-3" />
                                                            <span className="font-medium">{audience.remindersCount} rappels actifs</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <Button
                                            variant="outline"
                                            className="w-full bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 hover:to-blue-50 border-blue-200 text-[#1E40AF] font-semibold"
                                            onClick={() => handleNavClick("audiences", "/audiences")}
                                        >
                                            Voir le calendrier
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                        <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                            <Calendar className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium">Aucune audience programmée</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Quick Actions (Floating) */}
            <TooltipProvider>
                <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                onClick={onNewDossier}
                                className="h-16 w-16 rounded-2xl shadow-2xl bg-gradient-to-br from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-200 hover:scale-110 group"
                            >
                                <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-200" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-gray-900 text-white border-none shadow-xl">
                            <p className="font-medium">Nouveau dossier</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                onClick={onNewAudience}
                                className="h-16 w-16 rounded-2xl shadow-2xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-200 hover:scale-110 group"
                            >
                                <Calendar className="h-7 w-7 group-hover:scale-110 transition-transform" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-gray-900 text-white border-none shadow-xl">
                            <p className="font-medium">Nouvelle audience</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                onClick={onUploadDocument}
                                className="h-16 w-16 rounded-2xl shadow-2xl bg-gradient-to-br from-[#F59E0B] to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-200 hover:scale-110 group"
                            >
                                <Upload className="h-7 w-7 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-gray-900 text-white border-none shadow-xl">
                            <p className="font-medium">Upload document</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}
