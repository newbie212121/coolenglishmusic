// components/landing/ActivitiesSection.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Activity = {
  title: string;
  caption: string;
  img?: string;
  href?: string;
  genre: "Pop" | "Rock" | "Country" | "Hip-Hop";
  category: "Full Songs" | "Song Clips";
  premium?: boolean;
};

const FREE: Activity[] = [
  { title: "Golden", caption: "Pop Full Song", href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html", img: "/samples/golden.jpg", genre: "Pop", category: "Full Songs" },
  { title: "Elvis Edition", caption: "Rock Clips Game", href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html", img: "/samples/elvis.jpg", genre: "Rock", category: "Song Clips" },
];
const PREMIUM: Activity[] = [
  { title: "Hip Hop Storytelling", caption: "Narrative techniques & rhythm.", premium: true, img: "/samples/hiphop.jpg", genre: "Hip-Hop", category: "Song Clips" },
  { title: "Pop Pronunciation", caption: "Modern pop for connected speech.", premium: true, img: "/samples/pop.jpg", genre: "Pop", category: "Song Clips" },
];
const ALL_ACTIVITIES = [...FREE, ...PREMIUM];
const CATEGORIES = ["All Activities", "Full Songs", "Song Clips"];
const GENRES = ["All Genres", "Pop", "Rock", "Country", "Hip-Hop"];

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
          <p className="text-neutral-400 mt-2">Filter activities or browse the full library below.</p>
        </header>

        <div className="spotify-card p-4 mb-10">
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <div className="text-neutral-400 text-sm mb-2">Category</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => <FilterButton key={c} label={c} active={category === c} onClick={() => setCategory(c)} />)}
              </div>
            </div>
            <div>
              <div className="text-neutral-400 text-sm mb-2">Genre</div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => <FilterButton key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />)}
              </div>
            </div>
          </div>
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

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm transition ${active ? 'bg-emerald-400 text-black font-semibold' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
      {label}
    </button>
  );
}

function CardBase({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return <div className={`group spotify-card overflow-hidden ${className}`}>{children}</div>;
}

function CardImage({ activity }: { activity: Activity }) {
    return (
        <div className="relative w-full h-44 overflow-hidden rounded-t-xl">
            {activity.img && <Image src={activity.img} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
    );
}

function CardContent({ activity }: { activity: Activity }) {
    return (
        <div className="p-4">
            <div className="text-white font-semibold">{activity.title}</div>
            <p className="text-neutral-400 text-sm mt-1">{activity.caption}</p>
        </div>
    );
}

function FreeCard({ activity }: { activity: Activity }) {
  return (
    <a href={activity.href} target="_blank" rel="noopener noreferrer">
        <CardBase>
            <CardImage activity={activity} />
            <CardContent activity={activity} />
        </CardBase>
    </a>
  );
}

function PremiumCard({ activity }: { activity: Activity }) {
  return (
    <Link href="/login">
        <CardBase>
            <CardImage activity={activity} />
            <CardContent activity={activity} />
        </CardBase>
    </Link>
  );
}