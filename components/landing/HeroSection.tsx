// components/landing/HeroSection.tsx
import Link from "next/link";
import { ArrowRight, Music, Users, Sparkles, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden spotify-darker">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 mb-8">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span>Transform English Learning Through Music</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Cool English<br />
            <span className="gradient-text">Music</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Interactive music activities that make English learning engaging and effective. Perfect for teachers and students of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/members" className="flex items-center spotify-green spotify-green-hover text-black font-semibold px-8 py-4 text-lg rounded-full transition-transform">
              <Play className="w-5 h-5 mr-2" />
              Try Free Activities
            </Link>
            <Link href="/pricing" className="flex items-center bg-transparent border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 px-8 py-4 text-lg rounded-full transition-all">
              View Premium Plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature icon={<Music className="w-10 h-10 text-green-400" />} title="Interactive Activities" text="Engaging music-based exercises that improve listening and expand vocabulary." />
          <Feature icon={<Users className="w-10 h-10 text-green-400" />} title="For Everyone" text="Resources designed for classroom instruction and individual learning." />
          <Feature icon={<Sparkles className="w-10 h-10 text-green-400" />} title="Fresh Content" text="New activities and songs added weekly to keep your learning experience dynamic." />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="text-center group">
      <div className="spotify-card w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{text}</p>
    </div>
  );
}