// components/landing/FreeActivities.tsx
import Image from "next/image";

// Define a type for our sample activities
type Sample = {
  title: string;
  caption: string;
  href: string;
  img: string;
};

// Your data for the free samples
const SAMPLES: Sample[] = [
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
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Try Our Free Activities</h2>
          <p className="text-neutral-400 mt-2">
            Get a taste of our interactive music samples with these free exercises.
          </p>
        </header>
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {SAMPLES.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className="group spotify-card">
              <div className="relative w-full h-56 overflow-hidden rounded-xl">
                <Image src={s.img} alt={s.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
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