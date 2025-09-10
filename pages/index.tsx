// pages/index.tsx
import HeroSection from "@/components/landing/HeroSection";
import FreeActivities from "@/components/landing/FreeActivities";
import PricingSection from "@/components/landing/PricingSection";

export default function HomePage() {
  return (
    <main className="bg-black">
      {/* Hero */}
      <HeroSection />

      {/* Feature Icons row (inline) */}
      <section className="bg-neutral-950 border-y border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-3 text-center">
          <div className="spotify-card border border-neutral-800 p-6">
            <div className="text-3xl mb-2">🎵</div>
            <div className="text-white font-semibold">Interactive Activities</div>
            <p className="text-neutral-400 mt-2">
              Music-based games that improve listening, comprehension and vocabulary.
            </p>
          </div>
          <div className="spotify-card border border-neutral-800 p-6">
            <div className="text-3xl mb-2">👩‍🏫</div>
            <div className="text-white font-semibold">For Everyone</div>
            <p className="text-neutral-400 mt-2">
              Great for classrooms and self-study at any level.
            </p>
          </div>
          <div className="spotify-card border border-neutral-800 p-6">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-white font-semibold">Fresh Content</div>
            <p className="text-neutral-400 mt-2">
              New activities and songs added weekly.
            </p>
          </div>
        </div>
      </section>

      {/* Free Activities (your Golden + Elvis with images/links) */}
      <FreeActivities />

      {/* Pricing section */}
      <PricingSection />

      {/* Small benefits pill bar (inline) */}
      <section className="bg-black py-6">
        <div className="mx-auto max-w-5xl px-4 grid gap-3 sm:grid-cols-3">
          <Pill>👩‍🏫 Perfect for Teachers</Pill>
          <Pill>🎶 Engaging for Students</Pill>
          <Pill>🔁 Updated Weekly</Pill>
        </div>
      </section>
    </main>
  );
}

// simple inline pill
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="spotify-card border border-neutral-800 text-center px-4 py-3 rounded-xl text-neutral-200">
      {children}
    </div>
  );
}
