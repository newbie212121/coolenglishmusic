// components/landing/FreeActivities.tsx
import Link from "next/link";
import Image from "next/image";

const SAMPLES = [ /* ... */ ]; // Keep your SAMPLES array

export default function FreeActivities() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">
            Try Our Free Activities
          </h2>
          <p className="text-neutral-400 mt-2">
            Get a taste of our interactive music samples with these free exercises.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {SAMPLES.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className="group spotify-card">
              <div className="relative w-full h-56 overflow-hidden rounded-xl">
                <Image src={s.img} alt={s.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-400 text-black font-semibold">FREE</span>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-black/50 backdrop-blur-sm text-white">{s.title.includes('Pop') ? 'Pop' : 'Rock'}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-white font-semibold">{s.title}</div>
                <p className="text-neutral-400 text-sm mt-1">{s.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}