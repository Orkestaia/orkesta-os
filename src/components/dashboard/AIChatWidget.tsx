"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello Aitor! I am Orkesta AI. I can help you add leads, update emails, or query your data. How can I help today?' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user' as const, content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Simulate functionality or call n8n webhook here
        // In a real implementation: fetch('N8N_WEBHOOK_URL', { method: 'POST', body: JSON.stringify({ message: inputValue }) })

        setTimeout(() => {
            let responseText = "I've processed your request.";
            if (inputValue.toLowerCase().includes("lead") || inputValue.toLowerCase().includes("add")) {
                responseText = "I've triggered the 'Add Lead' workflow. The new lead will appear in your CRM sheet momentarily.";
            } else if (inputValue.toLowerCase().includes("email")) {
                responseText = "Updating email address in the database...";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-cyan-500 hover:bg-cyan-600'
                    }`}
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-96 h-[500px] flex flex-col shadow-2xl bg-[#0B0E14] border-gray-800 z-50 animate-in slide-in-from-bottom-10 fade-in">
                    <CardHeader className="border-b border-gray-800 py-3 bg-gray-900/50 rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-cyan-500" />
                            <CardTitle className="text-sm font-medium text-white">Orkesta Assistant</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-cyan-600 text-white rounded-tr-none'
                                            : 'bg-gray-800 text-gray-200 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>
                    <div className="p-3 border-t border-gray-800 bg-gray-900/50 rounded-b-xl flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a command..."
                            className="flex-1 bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <Button size="icon" onClick={handleSend} className="bg-cyan-600 hover:bg-cyan-700">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            )}
        </>
    );
}
