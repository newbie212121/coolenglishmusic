// pages/activities.tsx
"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Activity = {
  id: number;
  title: string;
  genre: "Pop" | "Rock" | "Country" | "Hip Hop";
  category: "Full Songs" | "Song Clips";
  premium: boolean;
  duration: number;
  thumb?: string;
  href?: string;
};

// FREE on landing: Golden & Elvis clips
const allActivities: Activity[] = [
  { id: 1, title: "Golden (Song Clip)", genre: "Pop", category: "Song Clips", premium: false, duration: 8 },
  { id: 2, title: "Elvis Presley (Song Clip)", genre: "Rock", category: "Song Clips", premium: false, duration: 7 },
  { id: 3, title: "Bohemian Rhapsody", genre: "Rock", category: "Full Songs", premium: true, duration: 15 },
  { id: 4, title: "Old Town Road", genre: "Hip Hop", category: "Song Clips", premium: true, duration: 12 },
  { id: 5, title: "Hotel California", genre: "Rock", category: "Full Songs", premium: true, duration: 18 },
  { id: 6, title: "Billie Jean", genre: "Pop", category: "Full Songs", premium: true, duration: 9 },
];

export default function ActivitiesPage() {
  const { isMember } = useAuth();
  const [cat, setCat] = useState<"All" | "Full Songs" | "Song Clips">("All");
  const [genre, setGenre] = useState<"All" | Activity["genre"]>("All");

  const filtered = useMemo(() => {
    return allActivities.filter((a) => {
      const catOk = cat === "All" || a.category === cat;
      const genOk = genre === "All" || a.genre === genre;
      return catOk && genOk;
    });
  }, [cat, genre]);

  const free = filtered.filter((a) => !a.premium);
  const premium = filtered.filter((a) => a.premium);

  return (
    <main className="bg-[#0b1220] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Music Activities</h1>
          {isMember ? (
            <a href="/#" onClick={(e)=>e.preventDefault()} className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
              Dashboard
            </a>
          ) : (
            <a href="/pricing" className="px-4 py-2 rounded-full bg-green-500 text-black hover:bg-green-400">
              Upgrade to Premium
            </a>
          )}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-[#121821] p-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-400 mr-2">Category</span>
            {(["All","Full Songs","Song Clips"] as const).map(x => (
              <button
                key={x}
                onClick={() => setCat(x)}
                className={`px-3 py-1 rounded-full text-sm ${cat===x ? "bg-green-600 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
              >
                {x}
              </button>
            ))}

            <span className="text-gray-400 ml-6 mr-2">Genre</span>
            {(["All","Pop","Rock","Country","Hip Hop"] as const).map(x => (
              <button
                key={x}
                onClick={() => setGenre(x as any)}
                className={`px-3 py-1 rounded-full text-sm ${genre===x ? "bg-green-600 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        {/* Free section */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-green-400">●</span>
          <h2 className="text-xl font-semibold">Free Activities</h2>
          <span className="text-gray-400 text-sm">Try these activities at no cost</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {free.length ? free.map(a => (
            <Card key={a.id} a={a} locked={false} />
          )) : <Empty />}
        </div>

        {/* Premium section */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-yellow-400">●</span>
          <h2 className="text-xl font-semibold">Premium Activities</h2>
          <span className="text-gray-400 text-sm">Unlock with premium subscription</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {premium.length ? premium.map(a => (
            <Card key={a.id} a={a} locked={!isMember} />
          )) : <Empty />}
        </div>
      </div>
    </main>
  );
}

function Card({ a, locked }: { a: Activity; locked: boolean }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#121821] p-4 ${locked ? "opacity-60" : ""}`}>
      <div className="h-40 mb-3 rounded-lg bg-gradient-to-br from-gray-700/40 to-gray-900/40 grid place-items-center">
        <span className="text-gray-400">Artwork</span>
      </div>
      <h3 className="font-semibold">{a.title}</h3>
      <p className="text-gray-400 text-sm">{a.genre} • {a.duration} minutes</p>
      <button
        disabled={locked}
        className={`mt-4 w-full py-2 rounded-full font-semibold ${locked ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-green-500 text-black hover:bg-green-400"}`}
      >
        {locked ? "Premium Only" : "Start Activity"}
      </button>
    </div>
  );
}

function Empty() {
  return <div className="text-gray-400">No activities match your filters.</div>;
}
