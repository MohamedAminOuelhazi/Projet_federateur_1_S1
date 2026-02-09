"use client";

import { useState } from "react";
import {
    ChevronRight, Pencil, MoreVertical, Archive, Copy,
    FileDown, Trash2, User, Mail, Phone, Building, Calendar, AlertCircle,
    Plus, FileText, MessageSquare, Clock, Download, Eye, Share2, Upload,
    Search, Pin, Edit2, FolderPlus, ArrowRight, Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Interface étendue avancée
interface DossierDetailContentProps {
    dossier: {
        id: string;
        numero: string;
        titre: string;
        type: string;
        statut: string;
        client: {
            nom: string;
            email?: string | null;
            phone?: string | null;
            adresse?: string | null;
        };
        adversaire?: {
            nom: string;
            avocat?: string;
            contact?: string;
        };
        tribunal: string;
        numeroRG?: string;
        datePremiereSession?: Date;
        montantLitige?: number;
        dateOuverture: Date;
        dateEcheance?: Date;
        equipe: Array<{
            userId: string;
            nom: string;
            role: string;
            avatar?: string;
        }>;
        objet?: string;
        autresParties?: Array<{
            nom: string;
            role: string;
            contact?: string;
        }>;

    };
    timeline: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        user: { nom: string; avatar?: string };
        timestamp: Date;
        icon: string;
        color: string;
    }>;
    documents: Array<{
        id: string;
        nom: string;
        type: string;
        taille: number;
        url: string;
        uploadedBy: { nom: string };
        uploadedAt: Date;
    }>;
    notes: Array<{
        id: string;
        titre: string;
        contenu: string;
        tags: string[];
        couleur: string;
        epingle: boolean;
        createdBy: { nom: string };
        createdAt: Date;
    }>;
    audiences: Array<{
        id: string;
        date: Date;
        heure: string;
        type: string;
        tribunal: string;
        statut: string;
        juge?: string;
        rappels: { count: number };
    }>;
    onNavigate?: (path: string) => void;
}

const typeColors = {
    civil: "bg-blue-100 text-blue-800 border-blue-200",
    pénal: "bg-red-100 text-red-800 border-red-200",
    commercial: "bg-green-100 text-green-800 border-green-200",
    administratif: "bg-purple-100 text-purple-800 border-purple-200",
};

const statutConfig = {
    en_cours: { label: "En cours", color: "bg-blue-500", bgColor: "bg-blue-50" },
    terminé: { label: "Terminé", color: "bg-green-500", bgColor: "bg-green-50" },
    suspendu: { label: "Suspendu", color: "bg-orange-500", bgColor: "bg-orange-50" },
};


export default function DossierDetailContent({
    dossier,
    timeline,
    documents,
    notes,
    audiences,
    onNavigate,
}: DossierDetailContentProps) {
    const [activeTab, setActiveTab] = useState("timeline");

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const getFileIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            pdf: "🔴",
            doc: "🔵",
            docx: "🔵",
            xls: "🟢",
            xlsx: "🟢",
            ppt: "🟠",
            pptx: "🟠",
        };
        return iconMap[type.toLowerCase()] || "📄";
    };

    return (
        <div className="space-y-6 p-4 lg:p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                    onClick={() => onNavigate?.("/dashboard/dossiers")}
                    className="hover:text-[#1E40AF] font-medium transition-colors"
                >
                    Dossiers
                </button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#1E40AF] font-semibold">{dossier.numero}</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {dossier.numero}
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">{dossier.titre}</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <Badge
                            className={cn(
                                "capitalize font-medium shadow-sm",
                                typeColors[dossier.type as keyof typeof typeColors]
                            )}
                        >
                            {dossier.type}
                        </Badge>
                        <Badge
                            className={cn(
                                "font-medium shadow-sm text-white",
                                statutConfig[dossier.statut as keyof typeof statutConfig]?.color
                            )}
                        >
                            {statutConfig[dossier.statut as keyof typeof statutConfig]?.label}
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                Archiver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FileDown className="mr-2 h-4 w-4" />
                                Exporter PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - 25% */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Client Info */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Informations générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-4 w-4 text-[#1E40AF]" />
                                    <span className="font-medium">{dossier.client.nom}</span>
                                </div>
                                <a
                                    href={`mailto:${dossier.client.email}`}
                                    className="flex items-center gap-2 text-sm text-[#1E40AF] hover:underline"
                                >
                                    <Mail className="h-4 w-4" />
                                    {dossier.client.email}
                                </a>
                                <a
                                    href={`tel:${dossier.client.phone}`}
                                    className="flex items-center gap-2 text-sm text-[#1E40AF] hover:underline"
                                >
                                    <Phone className="h-4 w-4" />
                                    {dossier.client.phone}
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jurisdiction */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">Juridiction</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start gap-2">
                                <Building className="h-4 w-4 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-gray-600">Tribunal</p>
                                    <p className="font-medium text-gray-900">{dossier.tribunal}</p>
                                </div>
                            </div>

                            {dossier.numeroRG && (
                                <div className="text-sm">
                                    <p className="text-gray-600">N° RG</p>
                                    <p className="font-medium text-gray-900">{dossier.numeroRG}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Important Dates */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">Dates importantes</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-gray-600">Ouverture</p>
                                    <p className="font-medium text-gray-900">{formatDate(dossier.dateOuverture)}</p>
                                </div>

                            </div>
                            {dossier.datePremiereSession && (
                                <div className="text-sm">
                                    <p className="text-gray-600">Première session</p>
                                    <p className="font-medium text-gray-900">{formatDate(dossier.datePremiereSession)}</p>
                                </div>
                            )}

                            {dossier.dateEcheance && (
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="text-gray-600">Échéance</p>
                                        <p className="font-medium text-gray-900">{formatDate(dossier.dateEcheance)}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Opposing Party */}
                    {dossier.adversaire && (
                        <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-sm font-semibold text-gray-700">Partie adverse</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-2">
                                <div className="text-sm">
                                    <p className="text-gray-600">Nom</p>
                                    <p className="font-medium text-gray-900">{dossier.adversaire.nom}</p>
                                </div>
                                {dossier.adversaire.avocat && (
                                    <div className="text-sm">
                                        <p className="text-gray-600">Avocat</p>
                                        <p className="font-medium text-gray-900">{dossier.adversaire.avocat}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Amount */}
                    {dossier.montantLitige && (
                        <Card className="border-gray-200/50 shadow-lg bg-gradient-to-br from-blue-50 to-transparent backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-600 mb-2">Montant du litige</p>
                                <p className="text-3xl font-bold text-[#1E40AF]">
                                    {dossier.montantLitige.toLocaleString("fr-FR")} TND
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Team */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700">Équipe</CardTitle>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {dossier.equipe.map((member) => (
                                <div key={member.userId} className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.nom} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-blue-600 text-white text-xs">
                                            {member.nom.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{member.nom}</p>
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                            {member.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content - 50% */}
                <div className="lg:col-span-2">
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start border-b border-gray-100 bg-transparent p-0 rounded-none">
                                <TabsTrigger
                                    value="timeline"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E40AF] data-[state=active]:bg-transparent"
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Timeline
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documents"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E40AF] data-[state=active]:bg-transparent"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Documents
                                </TabsTrigger>
                                <TabsTrigger
                                    value="notes"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E40AF] data-[state=active]:bg-transparent"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Notes
                                </TabsTrigger>
                                <TabsTrigger
                                    value="audiences"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E40AF] data-[state=active]:bg-transparent"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Audiences
                                </TabsTrigger>
                            </TabsList>

                            {/* Timeline Tab */}
                            <TabsContent value="timeline" className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajouter une entrée
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {timeline.map((entry, index) => (
                                        <div key={entry.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={cn(
                                                        "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg",
                                                        entry.color === "green" && "bg-green-500",
                                                        entry.color === "blue" && "bg-blue-500",
                                                        entry.color === "purple" && "bg-purple-500",
                                                        entry.color === "orange" && "bg-orange-500",
                                                        entry.color === "gray" && "bg-gray-500"
                                                    )}
                                                >
                                                    {entry.icon === "FolderPlus" && <FolderPlus className="h-5 w-5" />}
                                                    {entry.icon === "FileText" && <FileText className="h-5 w-5" />}
                                                    {entry.icon === "Calendar" && <Calendar className="h-5 w-5" />}
                                                    {entry.icon === "ArrowRight" && <ArrowRight className="h-5 w-5" />}
                                                    {entry.icon === "MessageSquare" && <MessageSquare className="h-5 w-5" />}
                                                    {entry.icon === "Mail" && <Mail className="h-5 w-5" />}
                                                </div>
                                                {index < timeline.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
                                            </div>

                                            <div className="flex-1 pb-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(entry.timestamp).toLocaleDateString("fr-FR")}
                                                        </p>
                                                        <p className="font-semibold text-gray-900 mt-1">{entry.title}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.nom} />
                                                        <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                                                            {entry.user.nom.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs text-gray-600">Par {entry.user.nom}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full border-gray-200 bg-transparent">
                                    Charger plus
                                </Button>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents" className="p-6 space-y-6">
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex-1 min-w-64">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Rechercher un document..."
                                                className="pl-10 border-gray-200 bg-white/50 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>
                                    <Button className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Importer
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-blue-50/50 transition-colors group"
                                        >
                                            <div className="text-2xl">{getFileIcon(doc.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{doc.nom}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                                    <span>{formatFileSize(doc.taille)}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(doc.uploadedAt)}</span>
                                                    <span>•</span>
                                                    <span>{doc.uploadedBy.nom}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Notes Tab */}
                            <TabsContent value="notes" className="p-6 space-y-6">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouvelle note
                                </Button>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className={cn(
                                                "p-4 rounded-lg border-2 relative group hover:shadow-md transition-all",
                                                note.couleur === "yellow" && "bg-yellow-50 border-yellow-200",
                                                note.couleur === "blue" && "bg-blue-50 border-blue-200",
                                                note.couleur === "green" && "bg-green-50 border-green-200",
                                                note.couleur === "pink" && "bg-pink-50 border-pink-200"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 flex-1">{note.titre}</h3>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    {note.epingle ? <Pin className="h-4 w-4 fill-current" /> : <Pin className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3 line-clamp-3">{note.contenu}</p>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {note.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                                                <span>{note.createdBy.nom}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-5 w-5">
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-5 w-5">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Audiences Tab */}
                            <TabsContent value="audiences" className="p-6 space-y-6">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-[#1E40AF] to-blue-600 hover:from-blue-700 hover:to-blue-800"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Nouvelle audience
                                </Button>

                                <div className="space-y-3">
                                    {audiences.map((audience) => {
                                        const audienceDate = new Date(audience.date);
                                        const day = audienceDate.getDate();
                                        const month = audienceDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

                                        return (
                                            <div
                                                key={audience.id}
                                                className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:bg-blue-50/50 transition-colors group"
                                            >
                                                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#1E40AF] to-blue-600 rounded-lg px-3 py-2 min-w-[60px] text-white shadow-lg shadow-blue-500/20">
                                                    <span className="text-lg font-bold">{day}</span>
                                                    <span className="text-xs font-semibold">{month}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-gray-900">{audience.heure}</span>
                                                        <Badge className="text-xs bg-blue-100 text-blue-800">{audience.type}</Badge>
                                                        <Badge className="text-xs bg-green-100 text-green-800">{audience.statut}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{audience.tribunal}</p>
                                                    {audience.juge && <p className="text-sm text-gray-600">Juge: {audience.juge}</p>}
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                        <Bell className="h-3 w-3" />
                                                        <span>{audience.rappels.count} rappels actifs</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Right Sidebar - 25% */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Recent Activity */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">Activité récente</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {timeline.slice(0, 3).map((entry) => (
                                <div key={entry.id} className="text-xs">
                                    <p className="font-medium text-gray-900">{entry.title}</p>
                                    <p className="text-gray-600 mt-0.5">{entry.user.nom}</p>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-[#1E40AF] hover:bg-blue-50/50">
                                Voir tout
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Documents</span>
                                <span className="font-bold text-[#1E40AF]">{documents.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Audiences</span>
                                <span className="font-bold text-[#1E40AF]">{audiences.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Notes</span>
                                <span className="font-bold text-[#1E40AF]">{notes.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold text-gray-700">Actions rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-blue-50/50 bg-transparent"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Programmer audience
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-blue-50/50 bg-transparent"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Ajouter document
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-blue-50/50 bg-transparent"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Créer note
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-blue-50/50 bg-transparent"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Envoyer message
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

