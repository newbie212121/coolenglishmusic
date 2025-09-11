import Link from "next/link";

export default function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Flexible Pricing
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-lg">
            Unlock unlimited access to our growing library of interactive music activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly */}
          <div className="spotify-card p-8 border border-neutral-800 hover:border-neutral-700 transition-all rounded-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-5xl font-extrabold text-white mb-2">
                $2<span className="text-xl text-neutral-400">/month</span>
              </div>
              <p className="text-neutral-400">Perfect for trying things out</p>
            </div>
            <ul className="space-y-3 text-neutral-300 mb-8">
              <Feature>Unlimited Activity Access</Feature>
              <Feature>Weekly New Content</Feature>
              <Feature>All Music Genres</Feature>
              <Feature>Priority Support</Feature>
            </ul>
            {/* 👇 This button was missing and has been added */}
            <Link
              href="/login"
              className="w-full inline-block text-center border border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:bg-white/5 py-3 rounded-full transition"
            >
              Choose Monthly
            </Link>
          </div>

          {/* Annual */}
          <div className="spotify-card p-8 border-2 border-emerald-400 relative hover:border-emerald-300 transition-all rounded-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                ✨ Best Value
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Annual</h3>
              <div className="text-5xl font-extrabold text-white mb-1">
                $15<span className="text-xl text-neutral-400">/year</span>
              </div>
              <p className="text-emerald-400 font-semibold mb-1">Save 37%</p>
              <p className="text-neutral-400">Just $1.25 per month</p>
            </div>
            <ul className="space-y-3 text-neutral-300 mb-8">
              <Feature>Everything in Monthly</Feature>
              <Feature>Save 37% compared to monthly</Feature>
              <Feature>Early Access to New Features</Feature>
              <Feature>Downloadable Resources</Feature>
            </ul>
            <Link
              href="/login"
              className="w-full inline-block text-center spotify-green spotify-green-hover text-black font-semibold py-3 rounded-full transition"
              aria-label="Choose Annual plan"
            >
              👑 Go Annual
            </Link>
          </div>
        </div>

        <div className="text-center mt-14">
          <div className="spotify-card p-8 border border-neutral-800 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/90">
              <Pill>👩‍🏫 Perfect for Teachers</Pill>
              <Pill>🎶 Engaging for Students</Pill>
              <Pill>⚡ Updated Weekly</Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-flex w-5 h-5 rounded-full bg-emerald-400 items-center justify-center text-black text-[11px]">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2">{children}</span>;
}