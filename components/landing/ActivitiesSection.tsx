// components/landing/ActivitiesSection.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Correct Activity Type Definition
type Activity = {
  title: string;
  caption: string;
  img?: string;
  href?: string;
  genre: "Pop" | "Rock" | "Country" | "Hip-Hop";
  category: "Full Songs" | "Song Clips";
  premium?: boolean;
  duration?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

// Data (assuming this is defined elsewhere or here)
const FREE: Activity[] = [
  { title: "Golden (Full Song)", caption: "Huntrix – Golden (Pop Full Song)", href: "...", img: "/samples/golden.jpg", genre: "Pop", category: "Full Songs", duration: "10 minutes", level: "Beginner" },
  { title: "Elvis Edition (Clips Game)", caption: "Rock Song Clips Game", href: "...", img: "/samples/elvis.jpg", genre: "Rock", category: "Song Clips", duration: "15 minutes", level: "Intermediate" },
];
const PREMIUM: Activity[] = [
  { title: "Hip Hop Storytelling", caption: "Narrative techniques & rhythm.", premium: true, img: "/samples/hiphop.jpg", genre: "Hip-Hop", category: "Song Clips", duration: "12 minutes", level: "Intermediate" },
  { title: "Pop Pronunciation Practice", caption: "Modern pop for connected speech.", premium: true, img: "/samples/pop.jpg", genre: "Pop", category: "Song Clips", duration: "14 minutes", level: "Beginner" },
  { title: "Country Storytelling", caption: "American country for sequencing.", premium: true, img: "/samples/country.jpg", genre: "Country", category: "Full Songs", duration: "20 minutes", level: "Intermediate" },
  { title: "Rock Legends – Queen", caption: "Advanced listening with classics.", premium: true, img: "/samples/rock.jpg", genre: "Rock", category: "Full Songs", duration: "25 minutes", level: "Advanced" },
];
const ALL_ACTIVITIES = [...FREE, ...PREMIUM];
const CATEGORIES = ["All Activities", "Full Songs", "Song Clips"];
const GENRES = ["All Genres", "Pop", "Rock", "Country", "Hip-Hop"];

// Main Component
export default function ActivitiesSection() {
  const [category, setCategory] = useState("All Activities");
  const [genre, setGenre] = useState("All Genres");

  const filteredActivities = ALL_ACTIVITIES.filter(a => 
    (category === "All Activities" || a.category === category) &&
    (genre === "All Genres" || a.genre === genre)
  );

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Music Activities</h1>
          <p className="text-neutral-400 mt-2">Enjoy unlimited access to all premium content with a membership.</p>
        </header>
        <div className="spotify-card p-4 mb-10">
            {/* Filter UI */}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => activity.premium ? 
            <PremiumCard key={activity.title} activity={activity} /> : 
            <FreeCard key={activity.title} activity={activity} />
          )}
        </div>
      </div>
    </section>
  );
}

// Sub-components that were missing
function FreeCard({ activity }: { activity: Activity }) {
  return (
    <a href={activity.href} target="_blank" rel="noopener noreferrer" className="group spotify-card">
      <div className="relative w-full h-44 overflow-hidden rounded-xl">
        {activity.img && <Image src={activity.img} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
      </div>
      <div className="p-4">
        <div className="text-white font-semibold">{activity.title}</div>
        <p className="text-neutral-400 text-sm mt-1">{activity.caption}</p>
      </div>
    </a>
  );
}

function PremiumCard({ activity }: { activity: Activity }) {
  return (
    <Link href="/login" className="group spotify-card">
      <div className="relative w-full h-44 overflow-hidden rounded-xl">
         {activity.img && <Image src={activity.img} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
         <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs bg-amber-400 text-black font-semibold">Premium</div>
      </div>
      <div className="p-4">
        <div className="text-white font-semibold">{activity.title}</div>
        <p className="text-neutral-400 text-sm mt-1">{activity.caption}</p>
      </div>
    </Link>
  );
}