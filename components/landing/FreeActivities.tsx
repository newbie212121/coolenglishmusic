// components/landing/FreeActivities.tsx
import Image from "next/image";
import { Play, Clock } from "lucide-react";

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

export default function FreeActivities() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Try Our Free Activities</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get a taste of our interactive music activities with these free samples.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {SAMPLES.map((activity) => (
            <a 
              key={activity.title} 
              href={activity.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group bg-gray-900/50 backdrop-blur border border-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all hover:border-gray-700 block"
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
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition">
                  {activity.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.duration}
                  </span>
                  <span>{activity.level}</span>
                  <span>{activity.category}</span>
                </div>
                
                <div className="w-full py-3 bg-green-600 text-white font-medium rounded-lg group-hover:bg-green-500 transition flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Activity
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}