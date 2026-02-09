"use client"

import { useState, useCallback } from "react"
import {
    Search,
    Filter,
    X,
    Plus,
    MoreVertical,
    Eye,
    Edit,
    Folder,
    Archive,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    FolderOpen,
    Loader2,
    Menu,
    LogOut,
    Settings,
    Bell,
    Check,
    Pause,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Dossier {
    id: string
    numero: string
    titre: string
    type: "civil" | "pénal" | "commercial" | "administratif" | "famille"
    statut: "en_cours" | "terminé" | "suspendu" | "archivé"
    client: { nom: string }
    dateOuverture: Date
}

interface FilterState {
    search: string
    type: string[]
    statut: string[]
    dateRange: { start: Date | null; end: Date | null }
}

interface DossiersListProps {
    dossiers: Dossier[]
    totalCount: number
    loading?: boolean
    onSearch?: (query: string) => void
    onFilterChange?: (filters: FilterState) => void
    onSort?: (column: string, direction: "asc" | "desc") => void
    onPageChange?: (page: number) => void
    onItemsPerPageChange?: (count: number) => void
    onRowClick?: (dossierId: string) => void
    onActionClick?: (action: string, dossierId: string) => void
    user?: { displayName: string; avatar?: string }
    unreadNotifications?: number
    onNavigate?: (path: string) => void
    onLogout?: () => void
}

const typeColors = {
    civil: "bg-blue-100 text-blue-800 border-blue-200",
    pénal: "bg-red-100 text-red-800 border-red-200",
    commercial: "bg-green-100 text-green-800 border-green-200",
    administratif: "bg-purple-100 text-purple-800 border-purple-200",
    famille: "bg-pink-100 text-pink-800 border-pink-200",
}

const typeLabels = {
    civil: "Civil",
    pénal: "Pénal",
    commercial: "Commercial",
    administratif: "Administratif",
    famille: "Famille",
}

const statutConfig = {
    en_cours: { label: "En cours", color: "bg-blue-500", icon: null },
    terminé: { label: "Terminé", color: "bg-green-500", icon: Check },
    suspendu: { label: "Suspendu", color: "bg-orange-500", icon: Pause },
    archivé: { label: "Archivé", color: "bg-gray-500", icon: null },
}

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },
    { id: "dossiers", label: "Dossiers", icon: "FolderOpen", path: "/dossiers" },
    { id: "clients", label: "Clients", icon: "Users", path: "/clients" },
    { id: "audiences", label: "Audiences", icon: "Calendar", path: "/audiences" },
    { id: "documents", label: "Documents", icon: "FileText", path: "/documents" },
    { id: "messagerie", label: "Messagerie", icon: "MessageSquare", path: "/messagerie" },
    { id: "parametres", label: "Paramètres", icon: "Settings", path: "/parametres" },
]

export default function DossiersList({
    dossiers,
    totalCount,
    loading = false,
    onSearch,
    onFilterChange,
    onSort,
    onPageChange,
    onItemsPerPageChange,
    onRowClick,
    onActionClick,
    user = { displayName: "Maître Dupont", avatar: "/placeholder-user.jpg" },
    unreadNotifications = 0,
    onNavigate,
    onLogout,
}: DossiersListProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeNav, setActiveNav] = useState("dossiers")
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        type: [],
        statut: [],
        dateRange: { start: null, end: null },
    })
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    const handleSearch = useCallback(
        (query: string) => {
            setSearchQuery(query)
            if (searchTimeout) clearTimeout(searchTimeout)
            const timeout = setTimeout(() => {
                setFilters((prev) => ({ ...prev, search: query }))
                onSearch?.(query)
            }, 300)
            setSearchTimeout(timeout)
        },
        [onSearch, searchTimeout],
    )

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters }
        setFilters(updated)
        setCurrentPage(1)
        onFilterChange?.(updated)
    }

    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
        setSortColumn(column)
        setSortDirection(newDirection)
        onSort?.(column, newDirection)
    }

    const handleClearFilters = () => {
        setFilters({
            search: "",
            type: [],
            statut: [],
            dateRange: { start: null, end: null },
        })
        setSearchQuery("")
        setCurrentPage(1)
        onFilterChange?.({
            search: "",
            type: [],
            statut: [],
            dateRange: { start: null, end: null },
        })
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(dossiers.map((d) => d.id)))
        } else {
            setSelectedRows(new Set())
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedRows)
        if (checked) {
            newSelected.add(id)
        } else {
            newSelected.delete(id)
        }
        setSelectedRows(newSelected)
    }

    const handleNavClick = (id: string, path: string) => {
        setActiveNav(id)
        setSidebarOpen(false)
        onNavigate?.(path)
    }

    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const hasActiveFilters = filters.search || filters.type.length > 0 || filters.statut.length > 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between h-16 px-4 lg:px-6">
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
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-blue-600 text-white">
                                            {user.displayName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline-block text-sm font-medium">{user.displayName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleNavClick("parametres", "/parametres")}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Déconnexion
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
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id, item.path)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                                    activeNav === item.id
                                        ? "bg-gradient-to-r from-[#1E40AF] to-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-gray-700 hover:bg-blue-50/50 hover:text-[#1E40AF]",
                                )}
                            >
                                <span className="flex-1 text-left">{item.label}</span>
                                {activeNav === item.id && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                                )}
                            </button>
                        ))}

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

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden top-16"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Mes Dossiers
                                </h1>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium">
                                {totalCount} dossiers
                            </Badge>
                        </div>
                        <Button className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Dossier
                        </Button>
                    </div>

                    {/* Filters Bar */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher par numéro, titre ou client..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 w-full border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
                                />
                                {searchQuery && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                                )}
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                                <Select
                                    value={filters.type[0] || "all"}
                                    onValueChange={(value) => handleFilterChange({ type: value === "all" ? [] : [value] })}
                                >
                                    <SelectTrigger className="w-full sm:w-40 border-gray-200">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="civil">Civil</SelectItem>
                                        <SelectItem value="pénal">Pénal</SelectItem>
                                        <SelectItem value="commercial">Commercial</SelectItem>
                                        <SelectItem value="administratif">Administratif</SelectItem>
                                        <SelectItem value="famille">Famille</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.statut[0] || "all"}
                                    onValueChange={(value) => handleFilterChange({ statut: value === "all" ? [] : [value] })}
                                >
                                    <SelectTrigger className="w-full sm:w-40 border-gray-200">
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="en_cours">En cours</SelectItem>
                                        <SelectItem value="terminé">Terminé</SelectItem>
                                        <SelectItem value="suspendu">Suspendu</SelectItem>
                                        <SelectItem value="archivé">Archivé</SelectItem>
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearFilters}
                                        className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>

                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2">
                                    {filters.search && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                            onClick={() => handleFilterChange({ search: "" })}
                                        >
                                            {filters.search}
                                            <X className="h-3 w-3 ml-1" />
                                        </Badge>
                                    )}
                                    {filters.type.map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                            onClick={() =>
                                                handleFilterChange({
                                                    type: filters.type.filter((x) => x !== t),
                                                })
                                            }
                                        >
                                            {typeLabels[t as keyof typeof typeLabels]}
                                            <X className="h-3 w-3 ml-1" />
                                        </Badge>
                                    ))}
                                    {filters.statut.map((s) => (
                                        <Badge
                                            key={s}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                            onClick={() =>
                                                handleFilterChange({
                                                    statut: filters.statut.filter((x) => x !== s),
                                                })
                                            }
                                        >
                                            {statutConfig[s as keyof typeof statutConfig]?.label}
                                            <X className="h-3 w-3 ml-1" />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bulk Actions Bar */}
                    {selectedRows.size > 0 && (
                        <Card className="border-blue-200 bg-blue-50/50 shadow-lg">
                            <CardContent className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                    {selectedRows.size} dossier{selectedRows.size > 1 ? "s" : ""} sélectionné
                                    {selectedRows.size > 1 ? "s" : ""}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onActionClick?.("archive", Array.from(selectedRows)[0])}
                                    >
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archiver
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50 bg-transparent"
                                        onClick={() => onActionClick?.("delete", Array.from(selectedRows)[0])}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Table Section */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                        {loading ? (
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            </CardContent>
                        ) : dossiers.length === 0 ? (
                            <CardContent className="p-12">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                        <FolderOpen className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun dossier trouvé</h3>
                                    <p className="text-gray-600 mb-6">Créez votre premier dossier ou ajustez vos filtres</p>
                                    <Button className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Créer un dossier
                                    </Button>
                                </div>
                            </CardContent>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                                            <TableRow className="border-gray-100 hover:bg-transparent">
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={selectedRows.size === dossiers.length && dossiers.length > 0}
                                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                    />
                                                </TableHead>
                                                <TableHead
                                                    className="font-semibold text-gray-700 cursor-pointer hover:text-[#1E40AF] group"
                                                    onClick={() => handleSort("numero")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        N° Dossier
                                                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700">Titre</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Client</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                                                <TableHead
                                                    className="font-semibold text-gray-700 cursor-pointer hover:text-[#1E40AF] group"
                                                    onClick={() => handleSort("dateOuverture")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Date ouverture
                                                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </TableHead>
                                                <TableHead className="w-12 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dossiers.map((dossier, index) => {
                                                const isSelected = selectedRows.has(dossier.id)
                                                const statutInfo = statutConfig[dossier.statut]
                                                const StatutIcon = statutInfo.icon

                                                return (
                                                    <TableRow
                                                        key={dossier.id}
                                                        className={cn(
                                                            "cursor-pointer transition-colors border-gray-100 group",
                                                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                                                            "hover:bg-blue-50/50",
                                                        )}
                                                        onClick={() => onRowClick?.(dossier.id)}
                                                    >
                                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked) => handleSelectRow(dossier.id, checked as boolean)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-[#1E40AF] group-hover:underline">
                                                            {dossier.numero}
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="font-medium text-gray-900">{dossier.titre}</span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{dossier.titre}</TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">{dossier.client.nom}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn("capitalize font-medium shadow-sm", typeColors[dossier.type])}
                                                            >
                                                                {typeLabels[dossier.type]}
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
                                                                <span className="text-sm font-medium text-gray-700">{statutInfo.label}</span>
                                                                {StatutIcon && <StatutIcon className="h-4 w-4 text-gray-600" />}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-600 text-sm">{formatDate(dossier.dateOuverture)}</TableCell>
                                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => onActionClick?.("view", dossier.id)}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Voir
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => onActionClick?.("edit", dossier.id)}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Modifier
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => onActionClick?.("documents", dossier.id)}>
                                                                        <Folder className="mr-2 h-4 w-4" />
                                                                        Documents
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => onActionClick?.("archive", dossier.id)}>
                                                                        <Archive className="mr-2 h-4 w-4" />
                                                                        Archiver
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => onActionClick?.("delete", dossier.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Supprimer
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Affichage {startIndex + 1}-{endIndex} sur {totalCount} dossiers
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Par page:</span>
                                            <Select
                                                value={itemsPerPage.toString()}
                                                onValueChange={(value) => {
                                                    setItemsPerPage(Number.parseInt(value))
                                                    setCurrentPage(1)
                                                    onItemsPerPageChange?.(Number.parseInt(value))
                                                }}
                                            >
                                                <SelectTrigger className="w-20 border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                    <SelectItem value="100">100</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setCurrentPage(Math.max(1, currentPage - 1))
                                                    onPageChange?.(Math.max(1, currentPage - 1))
                                                }}
                                                disabled={currentPage === 1}
                                                className="border-gray-200"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            <div className="flex gap-1">
                                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                    const pageNum = i + 1
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => {
                                                                setCurrentPage(pageNum)
                                                                onPageChange?.(pageNum)
                                                            }}
                                                            className={cn(
                                                                currentPage === pageNum && "bg-gradient-to-r from-[#1E40AF] to-blue-600 border-none",
                                                            )}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                                                    onPageChange?.(Math.min(totalPages, currentPage + 1))
                                                }}
                                                disabled={currentPage === totalPages}
                                                className="border-gray-200"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </main>
            </div>
        </div>
    )
}
