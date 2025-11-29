"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
};

const quickActions = [
    "How do I improve my jab?",
    "Find gyms near me",
    "Predict next UFC fight",
    "Show training roadmap"
];

const botResponses: Record<string, string> = {
    "How do I improve my jab?": "Great question! Focus on these key points:\n\n1. Keep your guard up\n2. Rotate your shoulder\n3. Snap it back quickly\n4. Use your hips for power\n\nCheck out our Form Correction tool for real-time feedback!",
    "Find gyms near me": "I can help you find martial arts gyms! Head over to the Gym Finder page where you can search for BJJ, Muay Thai, Boxing, and MMA gyms near your location.",
    "Predict next UFC fight": "You can get AI-powered predictions on the Predictions page! We analyze fighter stats, historical data, and performance metrics to give you accurate fight outcome predictions.",
    "Show training roadmap": "Visit the Training page to access structured roadmaps for beginners, intermediate, and advanced fighters. Each path includes video tutorials and progress tracking!",
    "default": "I'm here to help! You can ask me about:\n\n• Fight predictions\n• Training techniques\n• Finding gyms\n• Form correction\n• Fighter comparisons\n\nWhat would you like to know?"
};

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hey! I'm your Octagon Oracle AI assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponses[text] || botResponses["default"],
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 800);
    };

    const handleQuickAction = (action: string) => {
        sendMessage(action);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-octagon-red hover:bg-octagon-red/80 rounded-full shadow-2xl flex items-center justify-center transition-all group"
                    >
                        <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-octagon-gold rounded-full animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-6 right-6 z-50 w-96 bg-neutral-900 border border-white/20 rounded-lg shadow-2xl overflow-hidden ${isMinimized ? "h-16" : "h-[600px]"
                            } transition-all`}
                    >
                        {/* Header */}
                        <div className="bg-octagon-red p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-display text-lg">Oracle AI</h3>
                                    <p className="text-white/70 text-xs">Online</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    <Minimize2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(600px-180px)] bg-black/40">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user"
                                                        ? "bg-octagon-red text-white"
                                                        : "bg-white/10 text-gray-200 border border-white/20"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                                <span className="text-xs opacity-70 mt-1 block">
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Actions */}
                                {messages.length <= 2 && (
                                    <div className="px-4 py-2 bg-black/20 border-t border-white/10">
                                        <p className="text-xs text-gray-400 mb-2 font-heading uppercase">Quick Actions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {quickActions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuickAction(action)}
                                                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/20 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 bg-black/40 border-t border-white/10">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            sendMessage(inputValue);
                                        }}
                                        className="flex gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Ask me anything..."
                                            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-octagon-red transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-octagon-red hover:bg-octagon-red/80 text-white p-2 rounded-lg transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
