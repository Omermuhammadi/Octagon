"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, BarChart2, Users, MapPin, Video, Brain, Target, Shield, Trophy, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroScene } from "@/components/3d/HeroScene";
import { useAuth } from "@/contexts/AuthContext";
import { TOP_CONTENDERS } from "@/lib/data";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath = user.role === "coach" ? "/dashboard/coach" : "/dashboard/fan";
      router.push(dashboardPath);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading while checking auth state or if authenticated (redirecting)
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-octagon-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        <HeroScene />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-octagon-red animate-pulse" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">V1.0 BETA</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-black font-display uppercase tracking-tighter text-white mb-8 drop-shadow-2xl leading-none"
          >
            OCTAGON <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">ORACLE</span>
            <span className="text-octagon-red inline-block ml-1 w-4 h-4 md:w-6 md:h-6 bg-octagon-red mb-2 md:mb-4" />
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono text-sm md:text-base max-w-lg mx-auto mb-12 leading-relaxed"
          >
            Transform your fight game with AI analytics.
            <br className="hidden md:block" />
            Prediction. Training. Domination.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/register">
              <Button className="h-12 px-8 bg-octagon-red hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-sm text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(210,10,10,0.3)] hover:shadow-[0_0_30px_rgba(210,10,10,0.5)]">
                Start Your Legacy
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5 text-gray-300 font-bold uppercase tracking-wider rounded-sm text-xs md:text-sm transition-all">
                Member Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SAMPLE ANALYSIS: CONOR VS KHABIB */}
      <section className="py-24 bg-neutral-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-octagon-red/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display italic text-white mb-2">LEGENDARY <span className="text-octagon-red">ANALYSIS</span></h2>
            <p className="text-gray-400">See how our AI breaks down historic matchups.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Fighter A: Conor */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[400px] mb-4 group">
                <div className="absolute inset-0 bg-octagon-gold/10 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img
                  src="/images/conor.png"
                  alt="Conor McGregor"
                  className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(197,179,88,0.2)] transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-3xl font-display text-white uppercase">Conor McGregor</h3>
              <p className="text-octagon-gold font-bold uppercase text-sm tracking-widest">"The Notorious"</p>
            </div>

            {/* VS / Stats */}
            <div className="relative">
              <Card variant="glass" className="p-8 border-octagon-red/20">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black border border-octagon-red text-octagon-red px-4 py-1 rounded font-bold uppercase text-xs tracking-widest">
                  AI Prediction
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 font-heading uppercase mb-2">Win Probability</div>
                    <div className="flex items-end justify-center gap-2">
                      <span className="text-4xl font-display text-gray-500">35%</span>
                      <span className="text-xl font-display text-white">VS</span>
                      <span className="text-6xl font-display text-octagon-red">65%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <StatBar label="Striking Accuracy" valueA={45} valueB={60} />
                    <StatBar label="Grappling Control" valueA={20} valueB={90} />
                    <StatBar label="Cardio / Pace" valueA={40} valueB={85} />
                  </div>

                  <div className="pt-4 border-t border-white/10 text-center">
                    <p className="text-gray-300 text-sm italic">
                      &quot;Khabib&apos;s grappling pressure overwhelms McGregor&apos;s striking in later rounds.&quot;
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Fighter B: Khabib */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[400px] mb-4 group">
                <div className="absolute inset-0 bg-octagon-red/10 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img
                  src="/images/khabib.png"
                  alt="Khabib Nurmagomedov"
                  className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(210,10,10,0.2)] transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-3xl font-display text-white uppercase">Khabib Nurmagomedov</h3>
              <p className="text-octagon-red font-bold uppercase text-sm tracking-widest">"The Eagle"</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP CONTENDERS SPOTLIGHT */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display italic text-white mb-2">TOP <span className="text-white">CONTENDERS</span></h2>
              <p className="text-gray-400">Rising stars and champions dominating the octagon.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_CONTENDERS.map((fighter) => (
              <motion.div 
                key={fighter.id} 
                className="group relative h-[400px] rounded-lg overflow-hidden border border-white/10 bg-neutral-900/50 cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="inline-block px-2 py-1 bg-octagon-red text-white text-[10px] font-bold uppercase tracking-wider mb-2 octagon-badge">
                    {fighter.status}
                  </div>
                  <h3 className="text-2xl font-display text-white uppercase leading-none mb-1">{fighter.name}</h3>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{fighter.nickname}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID (Existing, simplified) */}
      <section className="py-24 border-t border-white/10 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-octagon-red" />}
              title="AI Strategy"
              desc="Get tailored game plans based on opponent weaknesses."
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-octagon-gold" />}
              title="Precision Stats"
              desc="Deep dive into striking accuracy, grappling control, and more."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Defense Analysis"
              desc="Identify holes in your defense before your opponent does."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-display uppercase text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBar({ label, valueA, valueB }: { label: string, valueA: number, valueB: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs uppercase font-bold text-gray-500 mb-1">
        <span>{valueA}%</span>
        <span>{label}</span>
        <span>{valueB}%</span>
      </div>
      <div className="flex h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="bg-gray-500 h-full" style={{ width: `${valueA}%` }} />
        <div className="flex-grow bg-gray-800" />
        <div className="bg-octagon-red h-full" style={{ width: `${valueB}%` }} />
      </div>
    </div>
  );
}
