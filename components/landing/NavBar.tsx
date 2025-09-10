import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-hero">
      {/* soft radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-80 w-80 translate-y-[-30%] rounded-full bg-gradient-to-tr from-emerald-400/20 via-sky-400/10 to-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-neutral-900/70 border border-neutral-800 rounded-full px-4 py-2 text-sm text-neutral-300 mb-8">
          <span className="text-emerald-400">✨</span>
          <span>Transform English Learning Through Music</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Cool English<br /><span className="gradient-text">Music</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 mt-6 max-w-3xl mx-auto">
          Interactive music activities that make English learning engaging and effective—perfect for teachers and students of all levels.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 mb-14">
          <Link href="/members" className="spotify-green spotify-green-hover text-black font-semibold px-8 py-3 text-lg rounded-full transform hover:scale-105 transition">
            ▶ Try Free Activities
          </Link>
          <Link href="/pricing" className="border border-neutral-700 text-white hover:bg-neutral-900 px-8 py-3 text-lg rounded-full transform hover:scale-105 transition">
            View Premium Plans →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Feature icon="🎵" title="Interactive Activities" text="Engaging exercises that boost listening and vocabulary." />
          <Feature icon="👥" title="For Everyone" text="Great for classrooms and self-study at any level." />
          <Feature icon="⚡" title="Fresh Content" text="New activities and songs added weekly." />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="group">
      <div className="spotify-card w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400">{text}</p>
    </div>
  );
}
