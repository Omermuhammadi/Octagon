"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User, Dumbbell, Star } from "lucide-react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Check if on auth pages (login/register) - show navbar but hide auth buttons
    const isAuthPage = pathname === "/login" || pathname === "/register";

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Role-based navigation links
    const getNavLinks = () => {
        if (!isAuthenticated || !user) {
            return [];
        }

        if (user.role === "coach") {
            return [
                { label: "DASHBOARD", href: "/dashboard/coach" },
                { label: "COMPARISON", href: "/comparison" },
                { label: "TRAINING", href: "/training" },
                { label: "GYMS", href: "/gyms" }
            ];
        } else {
            return [
                { label: "DASHBOARD", href: "/dashboard/fan" },
                { label: "PREDICTIONS", href: "/prediction" },
                { label: "FORM CHECK", href: "/form-check" },
                { label: "COMPARISON", href: "/comparison" },
                { label: "TRAINING", href: "/training" },
                { label: "GYMS", href: "/gyms" }
            ];
        }
    };

    const navLinks = getNavLinks();

    // Get logo link - on auth pages go to landing, authenticated users go to dashboard, others go to landing
    const logoHref = isAuthPage 
        ? "/"
        : (isAuthenticated && user 
            ? (user.role === "coach" ? "/dashboard/coach" : "/dashboard/fan")
            : "/");

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl shadow-octagon-red/10 flex items-center justify-between">

                {/* Logo Section */}
                <Link href={logoHref} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 relative overflow-hidden rounded-lg">
                        <img
                            src="/images/logo.png"
                            alt="Octagon Oracle Logo"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform"
                        />
                    </div>
                    <span className="text-xl font-display italic tracking-tighter text-white">
                        OCTAGON <span className="text-octagon-red">ORACLE</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-gray-300 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors font-heading relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-octagon-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                        </Link>
                    ))}
                </div>

                {/* Auth / User Section - Hide on auth pages */}
                {!isAuthPage && (
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 ${user.role === "coach" ? "bg-octagon-gold/10 text-octagon-gold" : "bg-octagon-red/10 text-octagon-red"
                                        }`}>
                                        {user.role === "coach" ? <Dumbbell className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                                    </div>
                                    <span className="text-white text-xs font-bold group-hover:text-octagon-red transition-colors">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                                    Sign in
                                </Link>
                                <Link href="/register">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-octagon-red to-octagon-gold rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200" />
                                        <button className="relative px-6 py-2 bg-black rounded-full leading-none flex items-center">
                                            <span className="text-white text-sm font-bold group-hover:text-gray-100 transition duration-200">
                                                Sign up <span className="ml-1">-&gt;</span>
                                            </span>
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Menu Button - Hide on auth pages */}
                {!isAuthPage && (
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-px bg-white/10 my-2" />

                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" /> Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-octagon-red hover:bg-octagon-red/10 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 p-2">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-center">Sign In</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
