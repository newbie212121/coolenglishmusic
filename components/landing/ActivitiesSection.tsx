// components/landing/ActivitiesSection.tsx
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// (Keep the 'Activity' type definition you already have)
type Activity = { /* ... */ }; 
const FREE: Activity[] = [ /* ... */ ];
const PREMIUM: Activity[] = [ /* ... */ ];
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Music Activities
          </h1>
          <p className="text-neutral-400 mt-2">
            Enjoy unlimited access to all premium content with a membership.
          </p>
        </header>

        {/* FILTERS */}
        <div className="spotify-card p-4 mb-10">
          <div className="text-white font-semibold mb-3">Filter Activities</div>
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

        {/* Filtered Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.map((a) => a.premium ? <PremiumCard key={a.title} activity={a} /> : <FreeCard key={a.title} activity={a} />)}
        </div>
      </div>
    </section>
  );
}

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm transition ${active ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
      {label}
    </button>
  );
}

// (Keep your updated FreeCard and PremiumCard components from the previous file)
function FreeCard({ activity }: { activity: Activity }) { /* ... */ }
function PremiumCard({ activity }: { activity: Activity }) { /* ... */ }