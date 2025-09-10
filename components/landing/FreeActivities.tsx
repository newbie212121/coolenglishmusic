// components/landing/FreeActivities.tsx
import Link from "next/link";
import Image from "next/image";

const SAMPLES = [
  {
    title: "Golden (Full Song)",
    caption: "Huntrix – Golden (Pop Full Song)",
    href: "https://d1uqdf1080xgw5.cloudfront.net/MUSICVIDEOS/POP/Huntrix-Golden/golden+index.html",
    img: "/samples/golden.jpg",
  },
  {
    title: "Elvis Edition (Clips Game)",
    caption: "Rock Song Clips Game",
    href: "https://d1uqdf1080xgw5.cloudfront.net/music+video+clips+game/Elvis+Edition/Elvis+index.html",
    img: "/samples/elvis.jpg",
  },
];

export default function FreeActivities() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Try free samples
          </h2>
          <Link
            href="/activities"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {SAMPLES.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group spotify-card overflow-hidden border border-neutral-800 hover:border-neutral-700 transition rounded-xl bg-neutral-900"
            >
              <div className="relative w-full h-56">
                <Image
                  src={s.img}
                  alt={s.caption}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-neutral-400">Free sample</div>
                <div className="mt-1 text-white font-semibold">{s.caption}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-black font-semibold spotify-green spotify-green-hover"
          >
            Get Premium ($2/mo)
          </Link>
        </div>
      </div>
    </section>
  );
}
