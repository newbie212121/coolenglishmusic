import Link from "next/link";
import Image from "next/image";

type Activity = {
  title: string;
  caption: string;
  img?: string;       // public/… path (optional for premium placeholders)
  href?: string;      // only for free
  genre: "Pop" | "Rock" | "Country" | "Hip-Hop";
  category: "Full Song" | "Song Clips";
  premium?: boolean;
  duration?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

const FREE: Activity[] = [
  {
    title: "Golden (Full Song)",
    caption: "Huntrix – Golden (Pop Full Song)",
    img: "/samples/golden.jpg",
    href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html",
    genre: "Pop",
    category: "Full Song",
    duration: "10 minutes",
    level: "Beginner",
  },
  {
    title: "Elvis Edition (Clips Game)",
    caption: "Rock Song Clips Game",
    img: "/samples/elvis.jpg",
    href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html",
    genre: "Rock",
    category: "Song Clips",
    duration: "15 minutes",
    level: "Intermediate",
  },
];

// Add/replace thumbnails later by dropping JPGs in /public/activities/ and setting img:"/activities/…"
const PREMIUM: Activity[] = [
  {
    title: "Hip Hop Storytelling",
    caption: "Narrative techniques & rhythm vocabulary through hip hop tracks.",
    genre: "Hip-Hop",
    category: "Song Clips",
    premium: true,
    duration: "12 minutes",
    level: "Intermediate",
  },
  {
    title: "Pop Pronunciation Practice",
    caption: "Modern pop songs for pronunciation & connected speech.",
    genre: "Pop",
    category: "Song Clips",
    premium: true,
    duration: "14 minutes",
    level: "Beginner",
  },
  {
    title: "Country Storytelling",
    caption: "American country music for sequencing & detail listening.",
    genre: "Country",
    category: "Full Song",
    premium: true,
    duration: "20 minutes",
    level: "Intermediate",
  },
  {
    title: "Rock Legends – Queen",
    caption: "Advanced comprehension with classic rock lyrics.",
    genre: "Rock",
    category: "Full Song",
    premium: true,
    duration: "25 minutes",
    level: "Advanced",
  },
];

export default function ActivitiesSection() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Music Activities
          </h1>
          <p className="text-neutral-400 mt-1">
            Enjoy unlimited access to all activities.
          </p>
        </header>

        {/* FREE */}
        <div className="flex items-center gap-2 mt-8 mb-4">
          <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
            <span>🆓</span> Free Activities
          </span>
          <span className="text-neutral-500 text-sm">Try these at no cost</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FREE.map((a) => (
            <FreeCard key={a.title} activity={a} />
          ))}
        </div>

        {/* PREMIUM */}
        <div className="flex items-center gap-2 mt-10 mb-4">
          <span className="inline-flex items-center gap-2 text-amber-400 font-semibold">
            <span>👑</span> Premium Activities
          </span>
          <span className="text-neutral-500 text-sm">Members only</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PREMIUM.map((a) => (
            <PremiumCard key={a.title} activity={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cards ---------- */

function GenreBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-800 border border-neutral-700 text-neutral-300">
      {children}
    </span>
  );
}

function MetaRow({
  duration,
  level,
}: {
  duration?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}) {
  if (!duration && !level) return null;
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
      <span>{duration}</span>
      <span>{level}</span>
    </div>
  );
}

function FreeCard({ activity }: { activity: Activity }) {
  return (
    <a
      href={activity.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group spotify-card overflow-hidden border border-neutral-800 hover:border-neutral-700 transition rounded-xl bg-neutral-900"
    >
      {/* image */}
      <div className="relative w-full h-44">
        {activity.img ? (
          <Image src={activity.img} alt={activity.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 to-blue-500/20" />
        )}
      </div>

      {/* body */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <GenreBadge>🆓 Free</GenreBadge>
          <div className="flex items-center gap-2">
            <GenreBadge>{activity.genre}</GenreBadge>
            <GenreBadge>{activity.category}</GenreBadge>
          </div>
        </div>
        <div className="mt-2 text-white font-semibold">{activity.title}</div>
        <p className="text-neutral-400 text-sm mt-1">{activity.caption}</p>
        <MetaRow duration={activity.duration} level={activity.level} />
        <div className="mt-3">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium spotify-green spotify-green-hover text-black">
            Start Activity <span>↗</span>
          </span>
        </div>
      </div>
    </a>
  );
}

function PremiumCard({ activity }: { activity: Activity }) {
  return (
    <div className="group spotify-card overflow-hidden border-2 border-amber-500/40 hover:border-amber-400/70 transition rounded-xl bg-neutral-900 relative">
      {/* lock overlay */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition" />

      {/* image */}
      <div className="relative w-full h-40">
        {activity.img ? (
          <Image src={activity.img} alt={activity.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-600/25 to-rose-500/20" />
        )}
        <div className="absolute top-2 left-2 z-20">
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-400 text-black font-semibold">
            Premium
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-4 relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GenreBadge>{activity.genre}</GenreBadge>
            <GenreBadge>{activity.category}</GenreBadge>
          </div>
        </div>
        <div className="mt-2 text-white font-semibold">{activity.title}</div>
        <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{activity.caption}</p>
        <MetaRow duration={activity.duration} level={activity.level} />

        {/* CTA -> send to login (Hosted UI) */}
        <div className="mt-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black transition"
            aria-label={`Unlock ${activity.title} with Premium`}
          >
            🔒 Unlock with Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
