// components/landing/FreeActivities.tsx
import { Play, Clock } from "lucide-react";

// This data can be moved to a central file later
const SAMPLES = [
  {
    title: "Taylor Swift - Shake It Off",
    description: "Learn vocabulary and expressions from this upbeat pop song.",
    img: "/samples/taylor.jpg", // Make sure you have this image in your /public/samples folder
    href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html",
    duration: "15 minutes",
    level: "Intermediate",
    category: "Full Song",
    genre: "Pop",
  },
  {
    title: "Country Road Vocabulary",
    description: "Explore countryside vocabulary through classic country music clips.",
    img: "/samples/country-road.jpg", // Make sure you have this image in your /public/samples folder
    href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html",
    duration: "10 minutes",
    level: "Beginner",
    category: "Song Clips",
    genre: "Country",
  },
];

export default function FreeActivities() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Try Our Free Activities</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get a taste of our interactive music activities with these free samples.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {SAMPLES.map((activity) => (
            <a key={activity.title} href={activity.href} target="_blank" rel="noopener noreferrer" className="spotify-card rounded-2xl overflow-hidden card-hover group">
              <div className="relative">
                <img src={activity.img} alt={activity.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-green-400 text-black px-3 py-1 rounded-full text-sm font-semibold">FREE</span>
                  <span className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm">{activity.genre}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">{activity.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{activity.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{activity.duration}</span>
                    <span>{activity.level}</span>
                    <span>{activity.category}</span>
                  </div>
                </div>
                <div className="w-full spotify-green text-black font-semibold py-3 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" /> Start Activity
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}