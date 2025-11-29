"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, CameraOff, CheckCircle, XCircle, AlertTriangle, Play, Square, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormFeedback = {
    id: string;
    timestamp: string;
    technique: string;
    score: number;
    feedback: string[];
    status: "good" | "needs-improvement" | "poor";
};

export default function FormCheckPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isStreaming, setIsStreaming] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState<FormFeedback | null>(null);
    const [history, setHistory] = useState<FormFeedback[]>([]);
    const [sessionStats, setSessionStats] = useState({ jabs: 0, score: 0 });
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: "user" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Camera access is required for form analysis. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setIsStreaming(false);
            setIsAnalyzing(false);
        }
    };

    const toggleAnalysis = () => {
        if (!isAnalyzing) {
            setIsAnalyzing(true);
            // Simulate periodic analysis
            const interval = setInterval(() => {
                analyzeForm();
            }, 3000);
            return () => clearInterval(interval);
        } else {
            setIsAnalyzing(false);
        }
    };

    const analyzeForm = () => {
        const techniques = ["Jab", "Cross", "Hook", "Uppercut", "Front Kick", "Roundhouse", "Teep"];
        const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
        const score = Math.floor(Math.random() * 40) + 60;

        let status: "good" | "needs-improvement" | "poor";
        let feedback: string[];

        if (score >= 85) {
            status = "good";
            feedback = [
                "Excellent form!",
                "Good hip rotation detected",
                "Proper weight transfer",
                "Guard position maintained"
            ];
        } else if (score >= 70) {
            status = "needs-improvement";
            feedback = [
                "Keep your guard up after striking",
                "Rotate hips more for power",
                "Extend fully on impact",
                "Return to stance quicker"
            ];
        } else {
            status = "poor";
            feedback = [
                "Stance too narrow - widen base",
                "Dropping your hands - vulnerable",
                "No hip engagement detected",
                "Overextending - loss of balance"
            ];
        }

        const newFeedback: FormFeedback = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            technique: randomTechnique,
            score,
            feedback,
            status
        };

        setCurrentFeedback(newFeedback);
        setHistory(prev => [newFeedback, ...prev].slice(0, 5));
        setSessionStats(prev => ({
            jabs: prev.jabs + 1,
            score: Math.round((prev.score * prev.jabs + score) / (prev.jabs + 1))
        }));
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

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
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-display italic text-white mb-4">
                        FORM <span className="text-octagon-red">CORRECTION</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        AI-powered technique analysis to perfect your striking and movement
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Feed */}
                    <div className="lg:col-span-2">
                        <Card variant="glass" className="p-0 overflow-hidden">
                            <div className="relative bg-neutral-900 aspect-video">
                                {isStreaming ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover mirror"
                                            style={{ transform: "scaleX(-1)" }}
                                        />
                                        {/* Skeleton Overlay Simulation */}
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <svg className="w-full h-full opacity-60">
                                                    {/* Head */}
                                                    <circle cx="50%" cy="15%" r="30" fill="none" stroke="#D20A0A" strokeWidth="3" />
                                                    {/* Shoulders */}
                                                    <circle cx="40%" cy="30%" r="8" fill="#C5B358" />
                                                    <circle cx="60%" cy="30%" r="8" fill="#C5B358" />
                                                    {/* Torso */}
                                                    <circle cx="50%" cy="45%" r="10" fill="#D20A0A" />
                                                    {/* Hips */}
                                                    <circle cx="45%" cy="60%" r="8" fill="#C5B358" />
                                                    <circle cx="55%" cy="60%" r="8" fill="#C5B358" />
                                                    {/* Knees */}
                                                    <circle cx="43%" cy="78%" r="6" fill="#C5B358" />
                                                    <circle cx="57%" cy="78%" r="6" fill="#C5B358" />
                                                    {/* Lines */}
                                                    <line x1="40%" y1="30%" x2="50%" y2="45%" stroke="#D20A0A" strokeWidth="3" />
                                                    <line x1="60%" y1="30%" x2="50%" y2="45%" stroke="#D20A0A" strokeWidth="3" />
                                                    <line x1="50%" y1="45%" x2="45%" y2="60%" stroke="#C5B358" strokeWidth="3" />
                                                    <line x1="50%" y1="45%" x2="55%" y2="60%" stroke="#C5B358" strokeWidth="3" />
                                                    <line x1="45%" y1="60%" x2="43%" y2="78%" stroke="#C5B358" strokeWidth="3" />
                                                    <line x1="55%" y1="60%" x2="57%" y2="78%" stroke="#C5B358" strokeWidth="3" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* AI Status Badge */}
                                        <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg border backdrop-blur-sm ${isAnalyzing
                                            ? "bg-green-900/80 border-green-500/50"
                                            : "bg-black/80 border-white/20"
                                            }`}>
                                            <p className={`font-bold text-sm flex items-center ${isAnalyzing ? "text-green-400" : "text-gray-400"
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${isAnalyzing ? "bg-green-500 animate-pulse" : "bg-gray-500"
                                                    }`} />
                                                {isAnalyzing ? "AI Analyzing" : "AI Standby"}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <Camera className="w-24 h-24 text-gray-600 mb-6" />
                                        <h3 className="text-2xl font-display text-white mb-2">Camera Not Active</h3>
                                        <p className="text-gray-500 text-center max-w-md mb-6">
                                            Allow camera access to analyze your stance and striking form in real-time using our AI vision model
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="p-6 bg-black/40 border-t border-white/10">
                                <div className="flex gap-4 justify-center flex-wrap">
                                    {!isStreaming ? (
                                        <Button onClick={startCamera} variant="primary" size="lg">
                                            <Camera className="w-5 h-5 mr-2" />
                                            Start Camera
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={toggleAnalysis}
                                                variant={isAnalyzing ? "outline" : "primary"}
                                                size="lg"
                                            >
                                                {isAnalyzing ? (
                                                    <><Square className="w-5 h-5 mr-2" /> Stop Analysis</>
                                                ) : (
                                                    <><Play className="w-5 h-5 mr-2" /> Start Analysis</>
                                                )}
                                            </Button>
                                            <Button onClick={stopCamera} variant="ghost" size="lg">
                                                <CameraOff className="w-5 h-5 mr-2" />
                                                Stop Camera
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Feedback Panel */}
                    <div className="space-y-6">
                        {/* Current Analysis */}
                        <Card variant="glass" className="p-6">
                            <h3 className="text-xl font-display uppercase text-white mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-octagon-gold" />
                                Live Feedback
                            </h3>

                            <AnimatePresence mode="wait">
                                {currentFeedback ? (
                                    <motion.div
                                        key={currentFeedback.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-gray-400 text-sm font-heading uppercase">Technique</span>
                                                <span className="text-white font-bold text-lg">{currentFeedback.technique}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-gray-400 text-sm font-heading uppercase">Form Score</span>
                                                <span className={`text-3xl font-display ${currentFeedback.status === "good" ? "text-green-500" :
                                                    currentFeedback.status === "needs-improvement" ? "text-octagon-gold" :
                                                        "text-octagon-red"
                                                    }`}>
                                                    {currentFeedback.score}%
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${currentFeedback.status === "good" ? "bg-green-500" :
                                                        currentFeedback.status === "needs-improvement" ? "bg-octagon-gold" :
                                                            "bg-octagon-red"
                                                        }`}
                                                    style={{ width: `${currentFeedback.score}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {currentFeedback.feedback.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-white/5 rounded">
                                                    {currentFeedback.status === "good" ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-octagon-red mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <span className="text-gray-300">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Start camera and begin analysis to see feedback</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </Card>

                        {/* Session Stats */}
                        <Card variant="glass" className="p-6">
                            <h3 className="text-xl font-display uppercase text-white mb-4">Session Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-heading">Techniques Analyzed</span>
                                    <span className="text-2xl font-display text-white">{sessionStats.jabs}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-heading">Average Score</span>
                                    <span className="text-2xl font-display text-octagon-gold">
                                        {sessionStats.jabs > 0 ? `${sessionStats.score}%` : "-"}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* History */}
                        <Card variant="glass" className="p-6">
                            <h3 className="text-xl font-display uppercase text-white mb-4">Recent Analysis</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <div key={item.id} className="p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-white font-bold text-sm">{item.technique}</span>
                                                <span className={`text-xl font-display ${item.status === "good" ? "text-green-500" :
                                                    item.status === "needs-improvement" ? "text-octagon-gold" :
                                                        "text-octagon-red"
                                                    }`}>
                                                    {item.score}%
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">{item.timestamp}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-8">No analysis history yet</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
