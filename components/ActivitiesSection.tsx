// components/landing/ActivitiesSection.tsx
import Link from "next/link";

const SAMPLES = [
  {
    title: "Golden (Full Song)",
    caption: "Huntrix – Golden (Pop Full Song)",
    href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html",
    color: "bg-pink-100/60 text-pink-700",
  },
  {
    title: "Elvis Edition (Clips Game)",
    caption: "Rock Song Clips Game",
    href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html",
    color: "bg-indigo-100/60 text-indigo-700",
  },
];

const GENRES = ["Pop", "Rock", "Country", "Hip-Hop"];

export default function ActivitiesSection() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Try Free Activities
          </h1>
          <p className="text-neutral-400 mt-3">
            Open instantly — no login needed. Premium content is updated weekly.
          </p>

          {/* genre pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {GENRES.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-300"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* sample cards */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {SAMPLES.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group spotify-card overflow-hidden border border-neutral-800 hover:border-neutral-700 transition"
            >
              <div className={`h-48 md:h-56 flex items-center justify-center ${s.color}`}>
                <span className="text-xl md:text-2xl font-bold opacity-90">{s.title}</span>
              </div>
              <div className="p-4">
                <div className="text-sm text-neutral-400">Free sample</div>
                <div className="mt-1 text-white font-semibold">{s.caption}</div>
              </div>
            </a>
          ))}
        </div>

        {/* categories */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12">
          <Card
            title="Full Songs"
            text="Complete tracks with lyric gap-fills, sequencing, and comprehension."
          />
          <Card
            title="Song Clips"
            text="Short, snappy challenges like chorus match, rhyme race, and beat-the-hook."
          />
          <Card
            title="Genres"
            text="Pop, Rock, Country, and Hip-Hop — fresh sets rotate weekly."
          />
        </div>

        {/* CTA bar */}
        <div className="mt-14 text-center">
          <div className="spotify-card p-6 md:p-8 inline-flex flex-col md:flex-row items-center gap-4 border border-neutral-800">
            <span className="text-neutral-300">
              Want everything? Unlock all activities and weekly updates.
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-5 py-2 text-black font-semibold spotify-green spotify-green-hover"
              >
                Get Premium ($2/mo)
              </Link>
              <Link
                href="/members"
                className="rounded-full px-5 py-2 border border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:bg-white/5 transition"
              >
                Members Area
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="spotify-card border border-neutral-800 p-6">
      <div className="text-white font-semibold">{title}</div>
      <p className="text-neutral-400 mt-2">{text}</p>
    </div>
  );
}
