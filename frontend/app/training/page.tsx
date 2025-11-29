"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Play, Clock, Loader2, CheckCircle, Circle, Trophy,
    ChevronRight, Target, Dumbbell, Users, Lock, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Discipline = "BJJ" | "Wrestling" | "MMA";

interface Task {
    id: string;
    title: string;
    type: "video" | "exercise" | "reading";
    description: string;
    youtubeId?: string; // Placeholder - you'll provide real IDs
    reps?: string; // For exercises like "100 kicks"
    duration?: string;
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
}

interface Week {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface Roadmap {
    discipline: Discipline;
    title: string;
    description: string;
    weeks: Week[];
}

// Progress stored in localStorage
interface UserProgress {
    visitorId: string; // Use visitorId or odinguserId
    completedTasks: string[]; // Array of task IDs
    currentWeek: { [discipline: string]: number };
}

// ============================================
// ROADMAP DATA - Placeholder YouTube IDs
// ============================================

const roadmaps: Roadmap[] = [
    // BJJ ROADMAP
    {
        discipline: "BJJ",
        title: "Brazilian Jiu-Jitsu Fundamentals",
        description: "Master the gentle art from white belt basics to advanced submissions",
        weeks: [
            {
                id: "bjj-w1",
                weekNumber: 1,
                title: "Foundation & Guard Basics",
                description: "Learn the fundamental positions and closed guard",
                lessons: [
                    {
                        id: "bjj-w1-l1",
                        title: "Understanding BJJ Positions",
                        description: "Learn the hierarchy of positions in BJJ",
                        tasks: [
                            { id: "bjj-w1-l1-t1", title: "Video: BJJ Position Hierarchy", type: "video", description: "Understanding mount, back, side control, guard", youtubeId: "5E0paqb01hM", duration: "12:00" },
                            { id: "bjj-w1-l1-t2", title: "Reading: Position Scoring", type: "reading", description: "Learn how positions are scored in competition" },
                            { id: "bjj-w1-l1-t3", title: "Exercise: Position Drilling", type: "exercise", description: "Practice transitioning between positions", reps: "20 transitions each side" }
                        ]
                    },
                    {
                        id: "bjj-w1-l2",
                        title: "Closed Guard Fundamentals",
                        description: "Master the most important defensive position",
                        tasks: [
                            { id: "bjj-w1-l2-t1", title: "Video: Closed Guard Basics", type: "video", description: "How to maintain and control from closed guard", youtubeId: "Z_FBT8ZDSmo", duration: "15:00" },
                            { id: "bjj-w1-l2-t2", title: "Exercise: Guard Retention Drill", type: "exercise", description: "Practice keeping your guard closed", reps: "5 minutes continuous" }
                        ]
                    }
                ]
            },
            {
                id: "bjj-w2",
                weekNumber: 2,
                title: "Guard Attacks & Sweeps",
                description: "Learn to attack and sweep from guard position",
                lessons: [
                    {
                        id: "bjj-w2-l1",
                        title: "Hip Bump Sweep",
                        description: "Your first high-percentage sweep",
                        tasks: [
                            { id: "bjj-w2-l1-t1", title: "Video: Hip Bump Sweep Tutorial", type: "video", description: "Step-by-step hip bump technique", youtubeId: "86eSdQYSjxA", duration: "10:00" },
                            { id: "bjj-w2-l1-t2", title: "Exercise: Hip Bump Drilling", type: "exercise", description: "Drill the hip bump movement solo", reps: "50 reps each side" }
                        ]
                    },
                    {
                        id: "bjj-w2-l2",
                        title: "Scissor Sweep",
                        description: "Classic sweep for off-balancing opponents",
                        tasks: [
                            { id: "bjj-w2-l2-t1", title: "Video: Scissor Sweep Breakdown", type: "video", description: "Master the scissor sweep mechanics", youtubeId: "UBf7uF5x8GQ", duration: "12:00" },
                            { id: "bjj-w2-l2-t2", title: "Exercise: Scissor Motion Drill", type: "exercise", description: "Practice the scissoring leg motion", reps: "30 reps each side" }
                        ]
                    },
                    {
                        id: "bjj-w2-l3",
                        title: "Triangle Choke Setup",
                        description: "Introduction to the triangle submission",
                        tasks: [
                            { id: "bjj-w2-l3-t1", title: "Video: Triangle Choke Basics", type: "video", description: "Learn to lock and finish the triangle", youtubeId: "_0p90C3-62A", duration: "18:00" },
                            { id: "bjj-w2-l3-t2", title: "Exercise: Triangle Lock Drill", type: "exercise", description: "Practice locking the triangle position", reps: "25 reps each side" }
                        ]
                    }
                ]
            },
            {
                id: "bjj-w3",
                weekNumber: 3,
                title: "Passing the Guard",
                description: "Learn essential guard passing techniques",
                lessons: [
                    {
                        id: "bjj-w3-l1",
                        title: "Posture & Base in Guard",
                        description: "Establish proper posture before passing",
                        tasks: [
                            { id: "bjj-w3-l1-t1", title: "Video: Posture in Closed Guard", type: "video", description: "How to maintain strong posture", youtubeId: "ZKsfnBbBdjk", duration: "10:00" },
                            { id: "bjj-w3-l1-t2", title: "Exercise: Posture Drill", type: "exercise", description: "Practice maintaining posture against resistance", reps: "3 minutes" }
                        ]
                    },
                    {
                        id: "bjj-w3-l2",
                        title: "Standing Guard Break",
                        description: "The safest way to open closed guard",
                        tasks: [
                            { id: "bjj-w3-l2-t1", title: "Video: Standing Guard Break", type: "video", description: "Step-by-step standing break technique", youtubeId: "032wIsVv0hY", duration: "14:00" },
                            { id: "bjj-w3-l2-t2", title: "Exercise: Stand Up Drill", type: "exercise", description: "Practice the standing motion", reps: "20 reps" }
                        ]
                    }
                ]
            },
            {
                id: "bjj-w4",
                weekNumber: 4,
                title: "Side Control Mastery",
                description: "Dominate from side control position",
                lessons: [
                    {
                        id: "bjj-w4-l1",
                        title: "Side Control Pressure",
                        description: "Learn to apply crushing pressure",
                        tasks: [
                            { id: "bjj-w4-l1-t1", title: "Video: Side Control Pressure", type: "video", description: "Maximize your top pressure", youtubeId: "nDbHQPBvQvQ", duration: "12:00" },
                            { id: "bjj-w4-l1-t2", title: "Exercise: Pressure Drill", type: "exercise", description: "Practice weight distribution", reps: "5 minutes each side" }
                        ]
                    },
                    {
                        id: "bjj-w4-l2",
                        title: "Americana from Side Control",
                        description: "High percentage submission",
                        tasks: [
                            { id: "bjj-w4-l2-t1", title: "Video: Americana Tutorial", type: "video", description: "Lock and finish the americana", youtubeId: "ALEeReC3u5Y", duration: "10:00" },
                            { id: "bjj-w4-l2-t2", title: "Exercise: Figure-4 Drill", type: "exercise", description: "Practice the figure-4 grip", reps: "25 reps each side" }
                        ]
                    }
                ]
            }
        ]
    },
    // WRESTLING ROADMAP
    {
        discipline: "Wrestling",
        title: "Wrestling Fundamentals",
        description: "Build a solid wrestling foundation for MMA and competition",
        weeks: [
            {
                id: "wres-w1",
                weekNumber: 1,
                title: "Stance & Motion",
                description: "Master the wrestling stance and basic movement",
                lessons: [
                    {
                        id: "wres-w1-l1",
                        title: "Wrestling Stance",
                        description: "The foundation of all wrestling",
                        tasks: [
                            { id: "wres-w1-l1-t1", title: "Video: Perfect Wrestling Stance", type: "video", description: "Learn proper stance mechanics", youtubeId: "Tq9P2WPqq98", duration: "10:00" },
                            { id: "wres-w1-l1-t2", title: "Exercise: Stance Hold", type: "exercise", description: "Hold wrestling stance against wall", reps: "3 sets of 1 minute" },
                            { id: "wres-w1-l1-t3", title: "Exercise: Level Changes", type: "exercise", description: "Practice dropping levels from stance", reps: "50 level changes" }
                        ]
                    },
                    {
                        id: "wres-w1-l2",
                        title: "Footwork & Motion",
                        description: "Move efficiently on the mat",
                        tasks: [
                            { id: "wres-w1-l2-t1", title: "Video: Wrestling Footwork", type: "video", description: "Circle, angle, and penetration steps", youtubeId: "beghH7VaEOo", duration: "12:00" },
                            { id: "wres-w1-l2-t2", title: "Exercise: Shadow Wrestling", type: "exercise", description: "Move in stance for 3 rounds", reps: "3 x 3 minute rounds" }
                        ]
                    }
                ]
            },
            {
                id: "wres-w2",
                weekNumber: 2,
                title: "Takedown Fundamentals",
                description: "Learn your first takedowns",
                lessons: [
                    {
                        id: "wres-w2-l1",
                        title: "Double Leg Takedown",
                        description: "The most important wrestling takedown",
                        tasks: [
                            { id: "wres-w2-l1-t1", title: "Video: Double Leg Technique", type: "video", description: "Step-by-step double leg breakdown", youtubeId: "4DHzLvLd-0Y", duration: "15:00" },
                            { id: "wres-w2-l1-t2", title: "Exercise: Penetration Steps", type: "exercise", description: "Drill the penetration step", reps: "100 penetration steps" },
                            { id: "wres-w2-l1-t3", title: "Exercise: Knee Slide Drill", type: "exercise", description: "Practice the finishing slide", reps: "50 each side" }
                        ]
                    },
                    {
                        id: "wres-w2-l2",
                        title: "Single Leg Takedown",
                        description: "Versatile attack from distance",
                        tasks: [
                            { id: "wres-w2-l2-t1", title: "Video: Single Leg Basics", type: "video", description: "Master the single leg entry", youtubeId: "WsTqgJLhOaY", duration: "14:00" },
                            { id: "wres-w2-l2-t2", title: "Exercise: Single Leg Finishes", type: "exercise", description: "Practice 3 single leg finishes", reps: "20 each finish" }
                        ]
                    }
                ]
            },
            {
                id: "wres-w3",
                weekNumber: 3,
                title: "Takedown Defense",
                description: "Stop your opponent's shots",
                lessons: [
                    {
                        id: "wres-w3-l1",
                        title: "The Sprawl",
                        description: "Primary takedown defense",
                        tasks: [
                            { id: "wres-w3-l1-t1", title: "Video: Sprawl Technique", type: "video", description: "Perfect your sprawl mechanics", youtubeId: "6DYyE4pB7qs", duration: "10:00" },
                            { id: "wres-w3-l1-t2", title: "Exercise: Sprawl Drill", type: "exercise", description: "Explosive sprawl practice", reps: "50 sprawls" }
                        ]
                    },
                    {
                        id: "wres-w3-l2",
                        title: "Whizzer Defense",
                        description: "Counter single leg attacks",
                        tasks: [
                            { id: "wres-w3-l2-t1", title: "Video: Whizzer Technique", type: "video", description: "Use the whizzer to defend", youtubeId: "VZYf8AocWJ4", duration: "12:00" },
                            { id: "wres-w3-l2-t2", title: "Exercise: Whizzer Drill", type: "exercise", description: "Practice whizzer pressure", reps: "30 each side" }
                        ]
                    }
                ]
            },
            {
                id: "wres-w4",
                weekNumber: 4,
                title: "Chain Wrestling",
                description: "Link attacks together",
                lessons: [
                    {
                        id: "wres-w4-l1",
                        title: "Double to Single",
                        description: "Chain your takedown attacks",
                        tasks: [
                            { id: "wres-w4-l1-t1", title: "Video: Chain Wrestling Basics", type: "video", description: "Flow between takedowns", youtubeId: "7FTOVqioz2I", duration: "15:00" },
                            { id: "wres-w4-l1-t2", title: "Exercise: Chain Drill", type: "exercise", description: "Double-single-double combo", reps: "20 chains each side" }
                        ]
                    }
                ]
            }
        ]
    },
    // MMA ROADMAP
    {
        discipline: "MMA",
        title: "MMA Striking Fundamentals",
        description: "Complete striking program for mixed martial arts",
        weeks: [
            {
                id: "mma-w1",
                weekNumber: 1,
                title: "Stance & Basic Punches",
                description: "Build your MMA striking foundation",
                lessons: [
                    {
                        id: "mma-w1-l1",
                        title: "MMA Fighting Stance",
                        description: "Balance striking and grappling defense",
                        tasks: [
                            { id: "mma-w1-l1-t1", title: "Video: MMA Stance Basics", type: "video", description: "Stance that works for striking and TDD", youtubeId: "bqrT232UZDA", duration: "12:00" },
                            { id: "mma-w1-l1-t2", title: "Exercise: Stance Switching", type: "exercise", description: "Switch between orthodox and southpaw", reps: "100 switches" },
                            { id: "mma-w1-l1-t3", title: "Reading: Stance Principles", type: "reading", description: "Understand weight distribution for MMA" }
                        ]
                    },
                    {
                        id: "mma-w1-l2",
                        title: "The Jab",
                        description: "Your most important weapon",
                        tasks: [
                            { id: "mma-w1-l2-t1", title: "Video: Jab Mechanics", type: "video", description: "Throw a perfect jab", youtubeId: "4YvY1bObBCs", duration: "10:00" },
                            { id: "mma-w1-l2-t2", title: "Exercise: Jab Drill", type: "exercise", description: "Shadowbox focusing on jab", reps: "200 jabs" }
                        ]
                    },
                    {
                        id: "mma-w1-l3",
                        title: "The Cross",
                        description: "Power punching basics",
                        tasks: [
                            { id: "mma-w1-l3-t1", title: "Video: Cross Technique", type: "video", description: "Generate power in your cross", youtubeId: "fTxKuiSQk6s", duration: "12:00" },
                            { id: "mma-w1-l3-t2", title: "Exercise: 1-2 Combo", type: "exercise", description: "Jab-cross combination drill", reps: "100 combos" }
                        ]
                    }
                ]
            },
            {
                id: "mma-w2",
                weekNumber: 2,
                title: "Hooks & Uppercuts",
                description: "Complete your punching arsenal",
                lessons: [
                    {
                        id: "mma-w2-l1",
                        title: "Lead Hook",
                        description: "Devastating close-range punch",
                        tasks: [
                            { id: "mma-w2-l1-t1", title: "Video: Hook Technique", type: "video", description: "Proper hook mechanics", youtubeId: "3ZOQBx5dGUs", duration: "12:00" },
                            { id: "mma-w2-l1-t2", title: "Exercise: Hook Practice", type: "exercise", description: "Shadowbox hooks both sides", reps: "100 each side" }
                        ]
                    },
                    {
                        id: "mma-w2-l2",
                        title: "Uppercut",
                        description: "Punish ducking opponents",
                        tasks: [
                            { id: "mma-w2-l2-t1", title: "Video: Uppercut Basics", type: "video", description: "Short and long uppercuts", youtubeId: "eBxn21FtqPg", duration: "10:00" },
                            { id: "mma-w2-l2-t2", title: "Exercise: Uppercut Drill", type: "exercise", description: "Practice uppercut motion", reps: "75 each side" }
                        ]
                    }
                ]
            },
            {
                id: "mma-w3",
                weekNumber: 3,
                title: "Kick Fundamentals",
                description: "Add kicks to your arsenal",
                lessons: [
                    {
                        id: "mma-w3-l1",
                        title: "Low Kick",
                        description: "Attack the legs",
                        tasks: [
                            { id: "mma-w3-l1-t1", title: "Video: Low Kick Technique", type: "video", description: "Devastating leg kicks", youtubeId: "7PjnWbZPOJg", duration: "14:00" },
                            { id: "mma-w3-l1-t2", title: "Exercise: Low Kick Drill", type: "exercise", description: "Practice on heavy bag", reps: "50 each leg" }
                        ]
                    },
                    {
                        id: "mma-w3-l2",
                        title: "Body Kick",
                        description: "Target the midsection",
                        tasks: [
                            { id: "mma-w3-l2-t1", title: "Video: Body Kick Tutorial", type: "video", description: "Muay Thai body kick", youtubeId: "GLw5DiU_lWw", duration: "12:00" },
                            { id: "mma-w3-l2-t2", title: "Exercise: Body Kick Drill", type: "exercise", description: "Body kicks on bag", reps: "40 each leg" }
                        ]
                    },
                    {
                        id: "mma-w3-l3",
                        title: "Head Kick",
                        description: "The knockout weapon",
                        tasks: [
                            { id: "mma-w3-l3-t1", title: "Video: Head Kick Setup", type: "video", description: "Setting up head kicks", youtubeId: "1m8pY04ROjU", duration: "15:00" },
                            { id: "mma-w3-l3-t2", title: "Exercise: Flexibility Drill", type: "exercise", description: "Hip flexibility for high kicks", reps: "10 minutes stretching" }
                        ]
                    }
                ]
            },
            {
                id: "mma-w4",
                weekNumber: 4,
                title: "Defense & Head Movement",
                description: "Don't get hit",
                lessons: [
                    {
                        id: "mma-w4-l1",
                        title: "Slipping Punches",
                        description: "Evade with head movement",
                        tasks: [
                            { id: "mma-w4-l1-t1", title: "Video: Slip Technique", type: "video", description: "Inside and outside slips", youtubeId: "Uqb6XMI3K2g", duration: "12:00" },
                            { id: "mma-w4-l1-t2", title: "Exercise: Slip Bag Drill", type: "exercise", description: "Practice slipping motion", reps: "100 slips" }
                        ]
                    },
                    {
                        id: "mma-w4-l2",
                        title: "Checking Kicks",
                        description: "Defend leg attacks",
                        tasks: [
                            { id: "mma-w4-l2-t1", title: "Video: Kick Check Tutorial", type: "video", description: "Proper kick checking technique", youtubeId: "Z3xMglkVfvw", duration: "10:00" },
                            { id: "mma-w4-l2-t2", title: "Exercise: Check Drill", type: "exercise", description: "Practice checking motion", reps: "50 each leg" }
                        ]
                    }
                ]
            }
        ]
    }
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function TrainingPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("BJJ");
    const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [activeVideo, setActiveVideo] = useState<Task | null>(null);

    // Load progress from localStorage
    useEffect(() => {
        if (user?.id) {
            const saved = localStorage.getItem(`training-progress-${user.id}`);
            if (saved) {
                const progress: UserProgress = JSON.parse(saved);
                setCompletedTasks(progress.completedTasks);
            }
        }
    }, [user]);

    // Save progress to localStorage
    useEffect(() => {
        if (user?.id && completedTasks.length > 0) {
            const progress: UserProgress = {
                visitorId: user.id,
                completedTasks,
                currentWeek: {}
            };
            localStorage.setItem(`training-progress-${user.id}`, JSON.stringify(progress));
        }
    }, [completedTasks, user]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    const currentRoadmap = roadmaps.find(r => r.discipline === selectedDiscipline)!;
    
    // Set first week as default when changing discipline
    useEffect(() => {
        if (currentRoadmap && currentRoadmap.weeks.length > 0) {
            setSelectedWeek(currentRoadmap.weeks[0].id);
        }
    }, [selectedDiscipline]);

    const toggleTaskComplete = (taskId: string) => {
        setCompletedTasks(prev => 
            prev.includes(taskId) 
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const getWeekProgress = (week: Week): number => {
        const totalTasks = week.lessons.reduce((acc, l) => acc + l.tasks.length, 0);
        const completedInWeek = week.lessons.reduce((acc, l) => 
            acc + l.tasks.filter(t => completedTasks.includes(t.id)).length, 0);
        return totalTasks > 0 ? Math.round((completedInWeek / totalTasks) * 100) : 0;
    };

    const getTotalProgress = (): number => {
        const totalTasks = currentRoadmap.weeks.reduce((acc, w) => 
            acc + w.lessons.reduce((a, l) => a + l.tasks.length, 0), 0);
        const completed = currentRoadmap.weeks.reduce((acc, w) => 
            acc + w.lessons.reduce((a, l) => a + l.tasks.filter(t => completedTasks.includes(t.id)).length, 0), 0);
        return totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-octagon-red" />
            </div>
        );
    }

    const currentWeek = currentRoadmap.weeks.find(w => w.id === selectedWeek);

    return (
        <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display italic text-white mb-4">
                        TRAINING <span className="text-octagon-red">ROADMAP</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Structured curriculum designed to take you from beginner to advanced. Track your progress and master each discipline.
                    </p>
                </motion.div>

                {/* Discipline Selector with Sliding Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="relative bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1">
                        {/* Sliding Background Indicator */}
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 bg-octagon-red rounded-xl shadow-lg shadow-octagon-red/30"
                            initial={false}
                            animate={{
                                x: selectedDiscipline === "BJJ" ? 0 : selectedDiscipline === "Wrestling" ? "100%" : "200%",
                                width: "calc(33.333% - 2px)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ left: "4px" }}
                        />
                        
                        {(["BJJ", "Wrestling", "MMA"] as Discipline[]).map((disc) => (
                            <motion.button
                                key={disc}
                                onClick={() => setSelectedDiscipline(disc)}
                                className={`relative z-10 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 min-w-[120px] justify-center ${
                                    selectedDiscipline === disc
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                                whileHover={{ scale: selectedDiscipline === disc ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.span
                                    animate={{ 
                                        rotate: selectedDiscipline === disc ? [0, -10, 10, 0] : 0,
                                        scale: selectedDiscipline === disc ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {disc === "BJJ" && <Users className="w-4 h-4" />}
                                    {disc === "Wrestling" && <Dumbbell className="w-4 h-4" />}
                                    {disc === "MMA" && <Target className="w-4 h-4" />}
                                </motion.span>
                                {disc}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Overall Progress */}
                <Card variant="glass" className="p-4 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Overall Progress - {currentRoadmap.title}</span>
                        <span className="text-sm font-bold text-octagon-gold">{getTotalProgress()}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-octagon-red to-octagon-gold"
                            initial={{ width: 0 }}
                            animate={{ width: `${getTotalProgress()}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Week Sidebar */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-display uppercase text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-octagon-red" />
                            Curriculum
                        </h2>
                        {currentRoadmap.weeks.map((week) => {
                            const progress = getWeekProgress(week);
                            const isSelected = selectedWeek === week.id;
                            
                            return (
                                <button
                                    key={week.id}
                                    onClick={() => setSelectedWeek(week.id)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                                        isSelected
                                            ? "bg-octagon-red/10 border-octagon-red/50"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold uppercase text-sm ${isSelected ? "text-octagon-red" : "text-white"}`}>
                                            Week {week.weekNumber}
                                        </span>
                                        {progress === 100 ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : progress > 0 ? (
                                            <span className="text-xs text-octagon-gold">{progress}%</span>
                                        ) : (
                                            <Circle className="w-4 h-4 text-gray-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-1">{week.title}</p>
                                    
                                    {/* Mini progress bar */}
                                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className="h-full bg-octagon-red transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {currentWeek && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-display uppercase text-white mb-2">
                                        Week {currentWeek.weekNumber}: {currentWeek.title}
                                    </h2>
                                    <p className="text-gray-400">{currentWeek.description}</p>
                                </div>

                                {currentWeek.lessons.map((lesson, lessonIndex) => (
                                    <LessonCard 
                                        key={lesson.id}
                                        lesson={lesson}
                                        lessonNumber={lessonIndex + 1}
                                        completedTasks={completedTasks}
                                        onToggleTask={toggleTaskComplete}
                                        onPlayVideo={setActiveVideo}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Video Modal */}
                <AnimatePresence>
                    {activeVideo && activeVideo.youtubeId && (
                        <VideoModal 
                            task={activeVideo} 
                            onClose={() => setActiveVideo(null)}
                            onComplete={() => {
                                if (!completedTasks.includes(activeVideo.id)) {
                                    toggleTaskComplete(activeVideo.id);
                                }
                            }}
                            isCompleted={completedTasks.includes(activeVideo.id)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Lesson Card Component
function LessonCard({ 
    lesson, 
    lessonNumber,
    completedTasks, 
    onToggleTask,
    onPlayVideo 
}: { 
    lesson: Lesson; 
    lessonNumber: number;
    completedTasks: string[];
    onToggleTask: (id: string) => void;
    onPlayVideo: (task: Task) => void;
}) {
    const completedCount = lesson.tasks.filter(t => completedTasks.includes(t.id)).length;
    const isComplete = completedCount === lesson.tasks.length;

    return (
        <Card variant="glass" className="overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isComplete ? "bg-green-500/20 text-green-400" : "bg-octagon-red/20 text-octagon-red"
                    }`}>
                        {isComplete ? <CheckCircle className="w-4 h-4" /> : lessonNumber}
                    </div>
                    <div>
                        <h3 className="font-display uppercase text-white">{lesson.title}</h3>
                        <p className="text-xs text-gray-500">{lesson.description}</p>
                    </div>
                </div>
                <span className="text-xs text-gray-500">
                    {completedCount}/{lesson.tasks.length} tasks
                </span>
            </div>
            
            <div className="divide-y divide-white/5">
                {lesson.tasks.map((task) => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        isCompleted={completedTasks.includes(task.id)}
                        onToggle={() => onToggleTask(task.id)}
                        onPlay={() => task.type === "video" && onPlayVideo(task)}
                    />
                ))}
            </div>
        </Card>
    );
}

// Task Item Component
function TaskItem({ 
    task, 
    isCompleted, 
    onToggle,
    onPlay 
}: { 
    task: Task; 
    isCompleted: boolean;
    onToggle: () => void;
    onPlay: () => void;
}) {
    const typeIcon = {
        video: <Play className="w-4 h-4" />,
        exercise: <Dumbbell className="w-4 h-4" />,
        reading: <BookOpen className="w-4 h-4" />
    };

    const typeColor = {
        video: "text-blue-400 bg-blue-500/10",
        exercise: "text-green-400 bg-green-500/10",
        reading: "text-purple-400 bg-purple-500/10"
    };

    return (
        <div className={`p-4 flex items-center gap-4 transition-all ${isCompleted ? "bg-white/5" : "hover:bg-white/5"}`}>
            {/* Checkbox */}
            <button 
                onClick={onToggle}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted 
                        ? "bg-green-500 border-green-500" 
                        : "border-gray-600 hover:border-octagon-red"
                }`}
            >
                {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
            </button>

            {/* Type Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColor[task.type]}`}>
                {typeIcon[task.type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${isCompleted ? "text-gray-500 line-through" : "text-white"}`}>
                    {task.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">{task.description}</p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3">
                {task.duration && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration}
                    </span>
                )}
                {task.reps && (
                    <span className="text-xs text-octagon-gold font-bold">
                        {task.reps}
                    </span>
                )}
                {task.type === "video" && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onPlay}
                        className="h-8 w-8 p-0"
                    >
                        <Play className="w-4 h-4 text-octagon-red" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Video Modal Component
function VideoModal({ 
    task, 
    onClose, 
    onComplete,
    isCompleted 
}: { 
    task: Task; 
    onClose: () => void;
    onComplete: () => void;
    isCompleted: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                >
                    <span className="text-2xl">&times;</span>
                </button>

                <div className="bg-neutral-900 rounded-xl overflow-hidden border border-white/10">
                    <div className="aspect-video bg-black flex items-center justify-center">
                        {task.youtubeId?.startsWith("PLACEHOLDER") ? (
                            <div className="text-center">
                                <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">Video placeholder</p>
                                <p className="text-xs text-gray-600 mt-2">ID: {task.youtubeId}</p>
                            </div>
                        ) : (
                            <iframe
                                src={`https://www.youtube.com/embed/${task.youtubeId}?autoplay=1&rel=0`}
                                title={task.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        )}
                    </div>
                    
                    <div className="p-6">
                        <h2 className="text-xl font-display uppercase text-white mb-2">
                            {task.title}
                        </h2>
                        <p className="text-gray-400 mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                {task.duration && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {task.duration}
                                    </span>
                                )}
                            </div>
                            
                            <Button 
                                variant={isCompleted ? "outline" : "primary"}
                                onClick={onComplete}
                                className="gap-2"
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Completed
                                    </>
                                ) : (
                                    <>
                                        <Circle className="w-4 h-4" />
                                        Mark as Complete
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
