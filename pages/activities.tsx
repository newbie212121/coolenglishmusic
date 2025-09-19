// pages/activities.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Play, Clock, Filter, Music2, Zap, Crown } from "lucide-react";

// Using your actual activity data
const SAMPLES = [
  {
    title: "Golden - Full Song Pop",
    description: "Learn vocabulary and expressions with this upbeat pop song by Huntrix.",
    img: "/samples/golden.jpg",
    href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html",
    duration: "10 minutes",
    level: "Beginner",
    category: "Full Song",
    genre: "Pop",
  },
  {
    title: "Elvis Song Clips Game",
    description: "Explore vocabulary and listening skills with classic rock clips from Elvis.",
    img: "/samples/elvis.jpg",
    href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html",
    duration: "15 minutes",
    level: "Intermediate",
    category: "Song Clips",
    genre: "Rock",
  },
];

const premiumActivities = [
  { id: 3, title: "Bohemian Rhapsody", artist: "Queen", category: "Rock", duration: "12 minutes" },
  { id: 4, title: "Old Town Road", artist: "Lil Nas X", category: "Hip Hop", duration: "12 minutes" },
  { id: 5, title: "Hotel California", artist: "Eagles", category: "Rock", duration: "18 minutes" },
  { id: 6, title: "Billie Jean", artist: "Michael Jackson", category: "Pop", duration: "8 minutes" },
];

export default function ActivitiesPage() {
  const router = useRouter();
  const { isMember } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All Activities");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  const categories = [
    { id: 'all', label: 'All Activities', icon: '✓' },
    { id: 'full', label: 'Full Songs', icon: '🎵' },
    { id: 'clips', label: 'Song Clips', icon: '🎶' }
  ];
  
  const genres = ["All Genres", "Pop", "Rock", "Country", "Hip Hop"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Music Activities</h1>
        <p className="text-gray-400 mb-8">Explore our free activities and upgrade for full access</p>

        {/* Professional Filter Section */}
        <div className="bg-gray-900/30 backdrop-blur border border-gray-800/50 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Filter Activities</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      cat.label === selectedCategory 
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    <span className="mr-1.5">{cat.label === selectedCategory ? '✓' : cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                      genre === selectedGenre
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Free Activities */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Free Activities</span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">Try these activities at no cost</p>

          <div className="grid md:grid-cols-2 gap-6">
            {SAMPLES.map((activity) => (
              <a 
                key={activity.title} 
                href={activity.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-gray-900/50 backdrop-blur border border-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all hover:border-gray-700"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image 
                    src={activity.img} 
                    alt={activity.title} 
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-black text-xs font-bold px-2.5 py-1 rounded">FREE</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/50 backdrop-blur text-white text-xs px-2.5 py-1 rounded">{activity.genre}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition">{activity.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.duration}
                    </span>
                    <span>{activity.level}</span>
                    <span>{activity.category}</span>
                  </div>
                  <div className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg group-hover:bg-green-500 transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Activity
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Premium Activities */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span>Premium Activities</span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">Unlock with premium subscription</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {premiumActivities.map(activity => (
              <div key={activity.id} className="bg-gray-900/50 backdrop-blur border border-gray-800/50 rounded-xl overflow-hidden">
                <div className="h-40 relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music2 className="w-12 h-12 text-gray-700" />
                  </div>
                  {!isMember && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <span className="text-white text-xs font-medium">Premium Only</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-1 truncate">{activity.title}</h3>
                  <p className="text-gray-500 text-xs mb-3">{activity.artist} • {activity.duration}</p>
                  <button 
                    onClick={() => !isMember && router.push('/pricing')}
                    className={`w-full py-2 text-xs font-medium rounded-lg transition ${
                      isMember 
                        ? 'bg-green-600 text-white hover:bg-green-500' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {isMember ? '▶ Start' : 'Upgrade to Unlock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}