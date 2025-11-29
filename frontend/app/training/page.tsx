"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Play, Clock, CheckCircle, Lock, Loader2 } from "lucide-react";

export default function TrainingPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading while checking auth state
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-octagon-red" />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl font-display italic text-white mb-2">TRAINING <span className="text-octagon-red">ROADMAP</span></h1>
                        <p className="text-gray-400 max-w-xl">Structured curriculum designed by world-class coaches to take you from amateur to pro.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant="outline" size="sm">Striking</Button>
                        <Button variant="outline" size="sm">Grappling</Button>
                        <Button variant="primary" size="sm">Conditioning</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - Weeks */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-display uppercase text-white mb-4">Curriculum</h2>
                        {[1, 2, 3, 4, 5, 6].map((week) => (
                            <div
                                key={week}
                                className={`p-4 rounded border cursor-pointer transition-all ${week === 1
                                    ? "bg-octagon-red/10 border-octagon-red/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className={`font-heading font-bold uppercase ${week === 1 ? "text-octagon-red" : "text-white"}`}>Week {week}</div>
                                    {week === 1 ? <CheckCircle className="w-4 h-4 text-octagon-red" /> : <Lock className="w-4 h-4 text-gray-600" />}
                                </div>
                                <div className="text-sm text-gray-400">Fundamentals of Stance & Footwork</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content - Lessons */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-display uppercase text-white mb-4">Week 1: Fundamentals</h2>

                        {/* Video Hero */}
                        <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="w-16 h-16 bg-octagon-red/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                                alt="Training Video"
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                <div className="text-2xl font-display uppercase text-white mb-1">Lesson 1: The Stance</div>
                                <div className="flex items-center text-sm text-gray-300">
                                    <Clock className="w-4 h-4 mr-2" /> 12:45 • Coach Mike Brown
                                </div>
                            </div>
                        </div>

                        {/* Lesson List */}
                        <div className="space-y-4">
                            <LessonItem title="Lesson 2: Forward & Backward Movement" duration="08:30" />
                            <LessonItem title="Lesson 3: Lateral Movement & Pivoting" duration="10:15" />
                            <LessonItem title="Lesson 4: Basic Jab Mechanics" duration="15:00" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LessonItem({ title, duration, locked }: { title: string, duration: string, locked?: boolean }) {
    return (
        <Card variant="glass" className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                    {locked ? <Lock className="w-4 h-4 text-gray-500" /> : <Play className="w-4 h-4 text-white" />}
                </div>
                <div>
                    <div className={`font-bold uppercase font-heading ${locked ? "text-gray-500" : "text-white"}`}>{title}</div>
                    <div className="text-xs text-gray-500">{duration}</div>
                </div>
            </div>
            {locked && <div className="text-xs font-bold uppercase text-gray-600 border border-gray-700 px-2 py-1 rounded">Pro</div>}
        </Card>
    );
}
