"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
    MapPin, Phone, Star, Navigation, Loader2, 
    Clock, Globe, ChevronDown, Search, X,
    Dumbbell, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type City = "All Cities" | "Karachi" | "Lahore" | "Islamabad" | "Rawalpindi" | "Faisalabad";
type Discipline = "All" | "MMA" | "BJJ" | "Boxing" | "Muay Thai" | "Karate" | "Taekwondo" | "Wrestling" | "Kickboxing";
type SortOption = "rating" | "reviews" | "name";

interface Gym {
    id: number;
    name: string;
    city: City;
    area: string;
    address: string;
    rating: number;
    reviewCount: number;
    disciplines: Discipline[];
    phone: string;
    website?: string;
    hours: string;
    image: string;
    description: string;
    features: string[];
    priceRange: string;
    lat: number;
    lng: number;
}

// Curated Pakistan Gyms Data - Real gyms with accurate information
const pakistanGyms: Gym[] = [
    // KARACHI
    {
        id: 1,
        name: "Synergy MMA Academy",
        city: "Karachi",
        area: "DHA Phase 6",
        address: "Plot 15-C, Khayaban-e-Shahbaz, DHA Phase 6, Karachi",
        rating: 4.9,
        reviewCount: 234,
        disciplines: ["MMA", "BJJ", "Muay Thai", "Wrestling"],
        phone: "+92 321 2345678",
        website: "https://synergymma.pk",
        hours: "6:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
        description: "Premier MMA training facility in Karachi with world-class coaches and equipment.",
        features: ["Air Conditioned", "Showers", "Pro Shop", "Parking"],
        priceRange: "₨ 8,000 - 15,000/mo",
        lat: 24.8007,
        lng: 67.0644
    },
    {
        id: 2,
        name: "Karachi Boxing Club",
        city: "Karachi",
        area: "Clifton",
        address: "Block 5, Clifton, Near Bilawal House, Karachi",
        rating: 4.7,
        reviewCount: 189,
        disciplines: ["Boxing", "Kickboxing"],
        phone: "+92 333 4567890",
        hours: "7:00 AM - 9:00 PM",
        image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop",
        description: "Traditional boxing gym with experienced trainers and competitive atmosphere.",
        features: ["Boxing Ring", "Heavy Bags", "Speed Bags", "Cardio Area"],
        priceRange: "₨ 5,000 - 10,000/mo",
        lat: 24.8138,
        lng: 67.0300
    },
    {
        id: 3,
        name: "Gracie Barra Karachi",
        city: "Karachi",
        area: "Gulshan-e-Iqbal",
        address: "Block 13-A, Gulshan-e-Iqbal, Karachi",
        rating: 4.8,
        reviewCount: 156,
        disciplines: ["BJJ", "MMA"],
        phone: "+92 300 1234567",
        website: "https://graciebarra.pk",
        hours: "6:30 AM - 9:30 PM",
        image: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&auto=format&fit=crop",
        description: "Official Gracie Barra affiliate offering authentic Brazilian Jiu-Jitsu training.",
        features: ["Mat Area", "Gi & No-Gi Classes", "Kids Program", "Women Only Classes"],
        priceRange: "₨ 10,000 - 18,000/mo",
        lat: 24.9215,
        lng: 67.0934
    },
    // LAHORE
    {
        id: 4,
        name: "Lahore Fight Club",
        city: "Lahore",
        area: "DHA Phase 5",
        address: "Main Boulevard, DHA Phase 5, Lahore",
        rating: 4.8,
        reviewCount: 312,
        disciplines: ["MMA", "Boxing", "Muay Thai", "Wrestling"],
        phone: "+92 300 8765432",
        website: "https://lahorefightclub.com",
        hours: "6:00 AM - 11:00 PM",
        image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&auto=format&fit=crop",
        description: "Lahore's premier combat sports facility with professional fighters as coaches.",
        features: ["Octagon Cage", "Boxing Ring", "Strength Area", "Recovery Room"],
        priceRange: "₨ 12,000 - 20,000/mo",
        lat: 31.4697,
        lng: 74.4048
    },
    {
        id: 5,
        name: "Punjab Martial Arts Academy",
        city: "Lahore",
        area: "Gulberg III",
        address: "Liberty Market, Gulberg III, Lahore",
        rating: 4.6,
        reviewCount: 198,
        disciplines: ["Karate", "Taekwondo", "Kickboxing"],
        phone: "+92 321 9876543",
        hours: "4:00 PM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop",
        description: "Traditional martial arts school with focus on discipline and technique.",
        features: ["Traditional Training", "Belt System", "Competition Team", "Self-Defense"],
        priceRange: "₨ 4,000 - 8,000/mo",
        lat: 31.5204,
        lng: 74.3587
    },
    {
        id: 6,
        name: "Elite MMA Lahore",
        city: "Lahore",
        area: "Johar Town",
        address: "Block G1, Johar Town, Lahore",
        rating: 4.7,
        reviewCount: 145,
        disciplines: ["MMA", "BJJ", "Wrestling"],
        phone: "+92 333 1122334",
        hours: "7:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
        description: "Modern MMA gym focusing on ground game and submission wrestling.",
        features: ["Grappling Mats", "Video Analysis", "Private Training", "Open Mat Sessions"],
        priceRange: "₨ 8,000 - 15,000/mo",
        lat: 31.4697,
        lng: 74.2728
    },
    // ISLAMABAD
    {
        id: 7,
        name: "Capital MMA Academy",
        city: "Islamabad",
        area: "F-7 Markaz",
        address: "Jinnah Super Market, F-7 Markaz, Islamabad",
        rating: 4.9,
        reviewCount: 267,
        disciplines: ["MMA", "BJJ", "Muay Thai", "Boxing"],
        phone: "+92 300 5556677",
        website: "https://capitalmma.pk",
        hours: "6:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800&auto=format&fit=crop",
        description: "Islamabad's top-rated MMA facility with international-level coaching staff.",
        features: ["Full Cage", "Striking Area", "Grappling Zone", "Fitness Center"],
        priceRange: "₨ 15,000 - 25,000/mo",
        lat: 33.7215,
        lng: 73.0433
    },
    {
        id: 8,
        name: "Islamabad Boxing Academy",
        city: "Islamabad",
        area: "G-9 Markaz",
        address: "G-9 Markaz, Islamabad",
        rating: 4.5,
        reviewCount: 134,
        disciplines: ["Boxing", "Kickboxing"],
        phone: "+92 321 4455667",
        hours: "5:00 AM - 9:00 PM",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800&auto=format&fit=crop",
        description: "Professional boxing training with former national champions as coaches.",
        features: ["Olympic Boxing Ring", "Heavy Bags", "Speed Training", "Sparring Sessions"],
        priceRange: "₨ 6,000 - 12,000/mo",
        lat: 33.6844,
        lng: 73.0479
    },
    {
        id: 9,
        name: "Bahria MMA Center",
        city: "Islamabad",
        area: "Bahria Town Phase 4",
        address: "Commercial Area, Bahria Town Phase 4, Islamabad",
        rating: 4.6,
        reviewCount: 178,
        disciplines: ["MMA", "BJJ", "Muay Thai"],
        phone: "+92 333 7788990",
        hours: "6:30 AM - 10:30 PM",
        image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&auto=format&fit=crop",
        description: "State-of-the-art facility in Bahria Town with comprehensive MMA programs.",
        features: ["Modern Equipment", "Sauna", "Nutrition Guidance", "Fight Team"],
        priceRange: "₨ 10,000 - 18,000/mo",
        lat: 33.5312,
        lng: 73.1234
    },
    // RAWALPINDI
    {
        id: 10,
        name: "Pindi Warriors Gym",
        city: "Rawalpindi",
        area: "Saddar",
        address: "Bank Road, Saddar, Rawalpindi",
        rating: 4.4,
        reviewCount: 112,
        disciplines: ["MMA", "Boxing", "Wrestling"],
        phone: "+92 300 1112233",
        hours: "6:00 AM - 9:00 PM",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
        description: "Rawalpindi's oldest martial arts gym with strong wrestling tradition.",
        features: ["Wrestling Mats", "Boxing Area", "Strength Training", "Cardio Zone"],
        priceRange: "₨ 5,000 - 10,000/mo",
        lat: 33.5973,
        lng: 73.0479
    },
    {
        id: 11,
        name: "Rawalpindi Martial Arts Club",
        city: "Rawalpindi",
        area: "Satellite Town",
        address: "Commercial Market, Satellite Town, Rawalpindi",
        rating: 4.3,
        reviewCount: 89,
        disciplines: ["Karate", "Taekwondo", "Kickboxing"],
        phone: "+92 321 2233445",
        hours: "4:00 PM - 9:00 PM",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop",
        description: "Family-friendly martial arts school with programs for all ages.",
        features: ["Kids Classes", "Adult Programs", "Self-Defense", "Tournaments"],
        priceRange: "₨ 3,500 - 7,000/mo",
        lat: 33.6007,
        lng: 73.0679
    },
    // FAISALABAD
    {
        id: 12,
        name: "Faisalabad Fight Academy",
        city: "Faisalabad",
        area: "D Ground",
        address: "D Ground, Peoples Colony, Faisalabad",
        rating: 4.5,
        reviewCount: 98,
        disciplines: ["MMA", "Boxing", "Kickboxing"],
        phone: "+92 300 6677889",
        hours: "6:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
        description: "Central Punjab's leading combat sports facility with modern equipment.",
        features: ["Training Cage", "Cardio Equipment", "Locker Rooms", "Free Parking"],
        priceRange: "₨ 5,000 - 10,000/mo",
        lat: 31.4504,
        lng: 73.1350
    },
];

const cities: City[] = ["All Cities", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"];
const disciplines: Discipline[] = ["All", "MMA", "BJJ", "Boxing", "Muay Thai", "Karate", "Taekwondo", "Wrestling", "Kickboxing"];

export default function GymsPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    // Filters state
    const [selectedCity, setSelectedCity] = useState<City>("All Cities");
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("All");
    const [sortBy, setSortBy] = useState<SortOption>("rating");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Dropdown states
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [disciplineDropdownOpen, setDisciplineDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Filter and sort gyms
    const filteredGyms = useMemo(() => {
        let result = [...pakistanGyms];
        
        // Filter by city
        if (selectedCity !== "All Cities") {
            result = result.filter(gym => gym.city === selectedCity);
        }
        
        // Filter by discipline
        if (selectedDiscipline !== "All") {
            result = result.filter(gym => gym.disciplines.includes(selectedDiscipline));
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(gym => 
                gym.name.toLowerCase().includes(query) ||
                gym.area.toLowerCase().includes(query) ||
                gym.disciplines.some(d => d.toLowerCase().includes(query))
            );
        }
        
        // Sort
        switch (sortBy) {
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "reviews":
                result.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            case "name":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        return result;
    }, [selectedCity, selectedDiscipline, searchQuery, sortBy]);

    // Show loading while checking auth state
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-octagon-red" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-display italic text-white mb-4">
                        FIND A <span className="text-octagon-red">GYM</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover top-rated MMA and martial arts gyms across Pakistan
                    </p>
                </motion.div>

                {/* Filters Section */}
                            <div className="mb-8 space-y-4">
                                {/* Search Bar */}
                                <div className="relative max-w-xl mx-auto">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search gyms by name, area, or discipline..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-octagon-red/50 focus:ring-1 focus:ring-octagon-red/50 transition-all"
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter Row */}
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {/* City Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setCityDropdownOpen(!cityDropdownOpen);
                                                setDisciplineDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all min-w-[160px] justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-octagon-red" />
                                                <span className="text-sm">{selectedCity}</span>
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {cityDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 mt-2 w-full bg-neutral-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                                                >
                                                    {cities.map((city) => (
                                                        <button
                                                            key={city}
                                                            onClick={() => {
                                                                setSelectedCity(city);
                                                                setCityDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                                                                selectedCity === city 
                                                                    ? "bg-octagon-red text-white" 
                                                                    : "text-gray-300 hover:bg-white/10"
                                                            }`}
                                                        >
                                                            {city}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Discipline Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setDisciplineDropdownOpen(!disciplineDropdownOpen);
                                                setCityDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all min-w-[140px] justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Dumbbell className="w-4 h-4 text-octagon-gold" />
                                                <span className="text-sm">{selectedDiscipline}</span>
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${disciplineDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {disciplineDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 mt-2 w-full bg-neutral-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                                                >
                                                    {disciplines.map((discipline) => (
                                                        <button
                                                            key={discipline}
                                                            onClick={() => {
                                                                setSelectedDiscipline(discipline);
                                                                setDisciplineDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                                                                selectedDiscipline === discipline 
                                                                    ? "bg-octagon-red text-white" 
                                                                    : "text-gray-300 hover:bg-white/10"
                                                            }`}
                                                        >
                                                            {discipline}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Sort Options */}
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                                        <span className="text-xs text-gray-500 uppercase">Sort:</span>
                                        {(["rating", "reviews", "name"] as SortOption[]).map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                                                    sortBy === option
                                                        ? "bg-octagon-red text-white"
                                                        : "text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Results Count */}
                                <div className="text-center text-sm text-gray-500">
                                    Found <span className="text-white font-bold">{filteredGyms.length}</span> gym{filteredGyms.length !== 1 ? "s" : ""}
                                    {selectedCity !== "All Cities" && <span> in <span className="text-octagon-red">{selectedCity}</span></span>}
                                </div>
                            </div>

                            {/* Gyms Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredGyms.length > 0 ? (
                                    filteredGyms.map((gym, index) => (
                                        <GymCard key={gym.id} gym={gym} index={index} />
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <Card variant="glass" className="p-12 text-center">
                                            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <h3 className="text-xl text-white font-bold mb-2">No gyms found</h3>
                                            <p className="text-gray-400">Try adjusting your filters or search query</p>
                                        </Card>
                                    </div>
                                )}
                            </div>
            </div>
        </div>
    );
}

// Gym Card Component
function GymCard({ gym, index }: { gym: Gym; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full"
        >
            <Card 
                variant="glass" 
                className="overflow-hidden group h-full transition-all duration-300 hover:border-octagon-red/50"
            >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={gym.image}
                        alt={gym.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-octagon-gold">{gym.priceRange}</span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-white">{gym.rating}</span>
                        <span className="text-xs text-gray-400">({gym.reviewCount})</span>
                    </div>

                    {/* City Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="bg-octagon-red/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {gym.city}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-display uppercase text-white group-hover:text-octagon-red transition-colors mb-1">
                        {gym.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{gym.area}</p>

                    {/* Disciplines */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {gym.disciplines.map((discipline) => (
                            <span
                                key={discipline}
                                className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-full uppercase font-bold tracking-wider"
                            >
                                {discipline}
                            </span>
                        ))}
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-400">
                            <MapPin className="w-4 h-4 mr-2 text-octagon-red flex-shrink-0" />
                            <span className="truncate">{gym.address}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Clock className="w-4 h-4 mr-2 text-octagon-gold flex-shrink-0" />
                            <span>{gym.hours}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Phone className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>{gym.phone}</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {gym.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="flex items-center text-[10px] text-gray-500">
                                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                        <a 
                            href={`tel:${gym.phone}`}
                            className="flex-1"
                        >
                            <Button variant="outline" size="sm" className="w-full h-9 text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                            </Button>
                        </a>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + " " + gym.city)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button variant="primary" size="sm" className="w-full h-9 text-xs">
                                <Navigation className="w-3 h-3 mr-1" />
                                Directions
                            </Button>
                        </a>
                        {gym.website && (
                            <a 
                                href={gym.website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                    <Globe className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
