// components/landing/HeroSection.tsx
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-fuchsia-700/20 via-emerald-600/10 to-amber-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Cool English Music
          </h1>
          <p className="mt-4 text-neutral-300 text-lg">
            Interactive music activities for ESL teachers and students. New premium content weekly.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/activities"
              className="rounded-full px-5 py-2 border border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:bg-white/5 transition"
            >
              Try Free Samples
            </Link>
            <Link
              href="/login"
              className="rounded-full px-5 py-2 text-black font-semibold spotify-green spotify-green-hover"
            >
              Get Premium ($2/mo)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
