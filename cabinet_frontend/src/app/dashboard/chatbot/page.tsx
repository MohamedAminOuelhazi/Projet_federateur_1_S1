"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { apiCall } from "@/lib/api/config";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export default function ChatbotPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Bonjour ! Je suis votre assistant médical. Posez-moi des questions sur vos consultations passées. Vous pouvez mentionner un rendez-vous spécifique avec @RDV : date (ex: @RDV : 15/01/2026).",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user?.id) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await apiCall<{ success: boolean; response: string; timestamp: string }>(
                "/api/chatbot/ask",
                {
                    method: "POST",
                    body: JSON.stringify({
                        patientId: user.id,
                        question: input,
                    }),
                }
            );

            const assistantMessage: Message = {
                role: "assistant",
                content: response.response,
                timestamp: response.timestamp,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            toast.error("Erreur lors de la communication avec le chatbot");
            const errorMessage: Message = {
                role: "assistant",
                content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    };

    if (user?.usertype !== "PATIENT") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-gray-600">
                            Ce chatbot est réservé aux patients.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                    <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                        Assistant Médical
                    </h1>
                    <p className="text-gray-600 mt-1">Posez vos questions sur vos consultations</p>
                </div>
            </div>

            {/* Info Card */}
            <Card className="border-cyan-200 bg-cyan-50/50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-cyan-600 mt-0.5" />
                        <div className="text-sm text-cyan-900">
                            <p className="font-semibold mb-1">Comment utiliser le chatbot :</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Posez une question générale sur toutes vos consultations</li>
                                <li>
                                    Mentionnez un rendez-vous spécifique avec{" "}
                                    <code className="bg-cyan-100 px-1 rounded">@RDV : 15/01/2026</code>
                                </li>
                                <li>Exemples : "Explique-moi mon traitement", "@RDV : 15/01/2026 Quel était mon diagnostic ?"</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chat Container */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-100">
                    <CardTitle className="flex items-center gap-2 text-cyan-900">
                        <Bot className="h-5 w-5" />
                        Conversation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Messages */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {message.role === "assistant" && (
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 h-fit">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[70%] rounded-xl p-4 ${message.role === "user"
                                            ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                                            : "bg-gray-100 text-gray-900"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                    <p
                                        className={`text-xs mt-2 ${message.role === "user" ? "text-cyan-100" : "text-gray-500"
                                            }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                                {message.role === "user" && (
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 h-fit">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 justify-start">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 h-fit">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-gray-100 rounded-xl p-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-cyan-100 p-4 bg-gray-50">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
                                placeholder="Posez votre question... (ex: @RDV : 15/01/2026 Quel traitement ?)"
                                disabled={loading}
                                className="flex-1 h-12 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white h-12 px-6"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
