// pages/activities.tsx
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// Two real free activities (the same ones you show on home)
const FREE = [
  { id: "taylor-swift-shake-it-off", title: "Taylor Swift - Shake It Off", genre: "Pop", minutes: 15 },
  { id: "country-road-vocab", title: "Country Road Vocabulary", genre: "Country", minutes: 10 },
];

// Placeholder premium tiles (locked for non-members)
const PREMIUM = [
  { id: "queen-bohemian", title: "Bohemian Rhapsody", genre: "Rock", minutes: 15 },
  { id: "old-town-road", title: "Old Town Road", genre: "Hip Hop", minutes: 12 },
  { id: "hotel-california", title: "Hotel California", genre: "Rock", minutes: 18 },
  { id: "billie-jean", title: "Billie Jean", genre: "Pop", minutes: 9 },
];

function Tile({
  title,
  genre,
  minutes,
  locked,
}: {
  title: string;
  genre: string;
  minutes: number;
  locked?: boolean;
}) {
  return (
    <div className={`rounded-2xl bg-[#121418] border border-gray-800 p-4 ${locked ? "opacity-60" : ""}`}>
      <div className="h-40 w-full rounded-xl bg-[#0f1115] border border-gray-800 mb-3 flex items-center justify-center">
        {/* Replace with real artwork later */}
        <span className="text-gray-500 text-sm">Artwork</span>
      </div>
      <div className="text-white font-semibold">{title}</div>
      <div className="text-gray-400 text-sm">{genre} • {minutes} minutes</div>
      <button
        disabled={locked}
        className={`mt-3 w-full rounded-full py-2 text-sm font-semibold ${
          locked
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : "bg-green-500 text-black hover:bg-green-400"
        }`}
      >
        {locked ? "Premium Only" : "Start Activity"}
      </button>
    </div>
  );
}

export default function Activities() {
  const { isMember } = useAuth();

  // simple top filter bar (visual only for now)
  const Categories = useMemo(() => ["All Activities", "Full Songs", "Song Clips"], []);
  const Genres = useMemo(() => ["All Genres", "Pop", "Rock", "Country", "Hip Hop"], []);

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-24">
        {/* Top row: title + Upgrade / Dashboard */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Music Activities</h1>
          {isMember ? (
            <Link
              href="/members"
              className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl bg-[#0f1217] border border-gray-800 p-4 mb-8">
          <div className="text-gray-300 font-semibold mb-2">Filter Activities</div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="text-gray-400 mr-2">Category</div>
            {Categories.map((c, i) => (
              <span
                key={c}
                className={`px-3 py-1 rounded-full border ${
                  i === 0 ? "bg-green-500 text-black border-green-500" : "border-gray-700 text-gray-300"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-gray-400 mr-2">Genre</div>
            {Genres.map((g, i) => (
              <span
                key={g}
                className={`px-3 py-1 rounded-full border ${
                  i === 0 ? "bg-gray-800 text-white border-gray-700" : "border-gray-700 text-gray-300"
                }`}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Free Activities */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-green-600 flex items-center justify-center">✓</div>
            <div className="text-lg font-semibold">Free Activities</div>
            <div className="text-gray-400">Try these activities at no cost</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FREE.map((a) => (
              <Tile key={a.id} title={a.title} genre={a.genre} minutes={a.minutes} />
            ))}
          </div>
        </div>

        {/* Premium Activities */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-yellow-500 text-black font-bold flex items-center justify-center">
              ★
            </div>
            <div className="text-lg font-semibold">Premium Activities</div>
            <div className="text-gray-400">Unlock with premium subscription</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PREMIUM.map((a) => (
              <Tile
                key={a.id}
                title={a.title}
                genre={a.genre}
                minutes={a.minutes}
                locked={!isMember}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
