"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Phone, Star, Navigation, Filter, Play, Shield, Heart, Loader2 } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem'
};

const center = {
    lat: 40.7128,
    lng: -74.0060
};

type Discipline = "All" | "BJJ" | "Muay Thai" | "Boxing" | "MMA" | "Karate";

type Gym = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    rating: string;
    address: string;
    distance: string;
    disciplines: Discipline[];
};

const gymsData: Gym[] = [
    {
        id: 1,
        name: "Renzo Gracie Academy",
        lat: 40.7505,
        lng: -73.9934,
        rating: "5.0",
        address: "224 W 30th St, New York, NY",
        distance: "0.8 miles",
        disciplines: ["BJJ", "MMA"]
    },
    {
        id: 2,
        name: "Marcelo Garcia Jiu-Jitsu",
        lat: 40.7527,
        lng: -73.9930,
        rating: "4.9",
        address: "325 W 38th St, New York, NY",
        distance: "1.2 miles",
        disciplines: ["BJJ"]
    },
    {
        id: 3,
        name: "Unity Jiu Jitsu",
        lat: 40.7619,
        lng: -73.9663,
        rating: "4.8",
        address: "13 E 37th St, New York, NY",
        distance: "1.5 miles",
        disciplines: ["BJJ", "MMA"]
    },
    {
        id: 4,
        name: "Shaolin's MMA",
        lat: 40.7519,
        lng: -73.9863,
        rating: "4.7",
        address: "780 8th Ave, New York, NY",
        distance: "2.1 miles",
        disciplines: ["MMA", "Muay Thai", "Boxing"]
    },
    {
        id: 5,
        name: "Church Street Boxing",
        lat: 40.7128,
        lng: -74.0080,
        rating: "4.9",
        address: "25 Park Pl, New York, NY",
        distance: "1.8 miles",
        disciplines: ["Boxing"]
    }
];

const selfDefenseVideos = [
    {
        id: 1,
        title: "Basic Stance & Awareness",
        duration: "8:45",
        thumbnail: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Escaping Wrist Grabs",
        duration: "12:30",
        thumbnail: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Defense Against Chokes",
        duration: "10:15",
        thumbnail: "https://images.unsplash.com/photo-1615117970457-13873573824b?q=80&w=400&auto=format&fit=crop"
    }
];

export default function GymsPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("All");
    const [showSelfDefense, setShowSelfDefense] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    const disciplines: Discipline[] = ["All", "BJJ", "Muay Thai", "Boxing", "MMA", "Karate"];

    // Show loading while checking auth state
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-octagon-red" />
            </div>
        );
    }

    const filteredGyms = selectedDiscipline === "All"
        ? gymsData
        : gymsData.filter(gym => gym.disciplines.includes(selectedDiscipline));

    return (
        <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-display italic text-white mb-4">
                        FIND A <span className="text-octagon-red">GYM</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Locate top-rated MMA gyms and dojos near you
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/5 p-1 rounded-lg flex">
                        <button
                            onClick={() => setShowSelfDefense(false)}
                            className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${!showSelfDefense ? "bg-octagon-red text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Gym Finder
                        </button>
                        <button
                            onClick={() => setShowSelfDefense(true)}
                            className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${showSelfDefense ? "bg-octagon-red text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Shield className="w-4 h-4 inline mr-2" />
                            Self-Defense Guide
                        </button>
                    </div>
                </div>

                {!showSelfDefense ? (
                    <>
                        {/* Discipline Filters */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Filter className="w-4 h-4" />
                                    <span className="text-sm font-heading uppercase">Filter by:</span>
                                </div>
                                {disciplines.map((discipline) => (
                                    <button
                                        key={discipline}
                                        onClick={() => setSelectedDiscipline(discipline)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${selectedDiscipline === discipline
                                                ? "bg-octagon-red text-white shadow-lg"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                            }`}
                                    >
                                        {discipline}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                            {/* Gym List */}
                            <div className="space-y-4 overflow-y-auto pr-2">
                                {filteredGyms.length > 0 ? (
                                    filteredGyms.map((gym) => (
                                        <GymCard key={gym.id} gym={gym} />
                                    ))
                                ) : (
                                    <Card variant="glass" className="p-8 text-center">
                                        <p className="text-gray-400">No gyms found for {selectedDiscipline}</p>
                                    </Card>
                                )}
                            </div>

                            {/* Map Interface */}
                            <div className="lg:col-span-2 bg-neutral-900 rounded-lg border border-white/10 overflow-hidden relative">
                                <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        zoom={13}
                                        options={{
                                            styles: [
                                                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                                {
                                                    featureType: "administrative.locality",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#d59563" }],
                                                },
                                            ]
                                        }}
                                    >
                                        {filteredGyms.map(gym => (
                                            <Marker key={gym.id} position={{ lat: gym.lat, lng: gym.lng }} />
                                        ))}
                                    </GoogleMap>
                                </LoadScript>

                                {/* Fallback/Overlay */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/50">
                                    <div className="text-center p-6 bg-black/80 rounded border border-octagon-red/50 backdrop-blur-sm">
                                        <MapPin className="w-12 h-12 text-octagon-red mx-auto mb-4" />
                                        <h3 className="text-xl font-display text-white mb-2">Map Integration Ready</h3>
                                        <p className="text-gray-400 text-sm">Add your Google Maps API Key to enable live map data</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Self-Defense Guide Section */
                    <div className="space-y-8">
                        {/* Introduction */}
                        <Card variant="glass" className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-octagon-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-8 h-8 text-octagon-red" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display text-white mb-4">Self-Defense Essentials</h2>
                                    <p className="text-gray-300 mb-4">
                                        Learn fundamental self-defense techniques to stay safe. These beginner-friendly tutorials focus on practical, effective movements for real-world situations.
                                    </p>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-octagon-gold">
                                            <Heart className="w-4 h-4" />
                                            <span>Beginner Friendly</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-octagon-gold">
                                            <Shield className="w-4 h-4" />
                                            <span>Safety First</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Video Tutorials */}
                        <div>
                            <h3 className="text-2xl font-display text-white mb-6">Video Tutorials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selfDefenseVideos.map((video) => (
                                    <Card key={video.id} variant="glass" className="overflow-hidden group cursor-pointer hover:border-octagon-red/50 transition-all">
                                        <div className="relative aspect-video bg-neutral-900">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-octagon-red/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-white font-bold group-hover:text-octagon-red transition-colors">
                                                {video.title}
                                            </h4>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <Card variant="glass" className="p-8">
                            <h3 className="text-2xl font-display text-white mb-6">Safety Tips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <TipItem text="Always be aware of your surroundings" />
                                    <TipItem text="Trust your instincts - if something feels wrong, it probably is" />
                                    <TipItem text="Keep your phone charged and accessible" />
                                    <TipItem text="Walk confidently and with purpose" />
                                </div>
                                <div className="space-y-4">
                                    <TipItem text="Avoid isolated areas, especially at night" />
                                    <TipItem text="Let someone know where you're going" />
                                    <TipItem text="Practice techniques regularly to build muscle memory" />
                                    <TipItem text="Your safety is more important than any possession" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

function GymCard({ gym }: { gym: Gym }) {
    return (
        <Card variant="glass" className="p-6 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-display uppercase text-white group-hover:text-octagon-red transition-colors">
                    {gym.name}
                </h3>
                <div className="flex items-center bg-octagon-gold/10 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-octagon-gold fill-current mr-1" />
                    <span className="text-xs font-bold text-octagon-gold">{gym.rating}</span>
                </div>
            </div>
            <div className="flex items-start text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {gym.address}
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
                {gym.disciplines.map((discipline) => (
                    <span
                        key={discipline}
                        className="text-xs bg-octagon-red/20 text-octagon-red px-2 py-1 rounded border border-octagon-red/30"
                    >
                        {discipline}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-xs font-bold uppercase text-gray-500">{gym.distance}</div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Navigation className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function TipItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-octagon-red/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3 h-3 text-octagon-red" />
            </div>
            <p className="text-gray-300 text-sm">{text}</p>
        </div>
    );
}
