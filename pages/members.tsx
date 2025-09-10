import { useEffect, useMemo, useState } from "react";
import { ACTIVITIES } from "@/data/activities";
import { auth, getLogoutUrl } from "@/lib/auth";

type Cat = "full" | "clips";
const GENRES = ["pop", "rock", "country", "hiphop"] as const;

export default function MembersPage() {
  const [token, setToken] = useState<string | null>(null);
  const [cat, setCat] = useState<Cat>("full");
  const [genre, setGenre] = useState<(typeof GENRES)[number]>("pop");
  const [query, setQuery] = useState("");

  useEffect(() => setToken(auth.getIdToken()), []);

  const items = useMemo(() => {
    return ACTIVITIES
      .filter(a => a.type === cat && a.sub === genre)
      .filter(a => (query ? a.title.toLowerCase().includes(query.toLowerCase()) : true));
  }, [cat, genre, query]);

  const openItem = (publicUrl?: string) => {
    if (publicUrl) {
      window.open(publicUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // Paid item (API to presign comes later)
    if (!token) {
      const go = confirm("This is a premium activity. Log in to unlock. Go to Pricing?");
      if (go) window.location.href = "/pricing";
      return;
    }
    alert("Premium item: after we wire the API, this will open with a short-lived S3 link.");
  };

  const logout = () => {
    auth.clear();
    window.location.href = getLogoutUrl();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      {/* sticky filter bar */}
      <div className="sticky top-14 z-30 bg-black/70 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: Category + Genres */}
          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              value={cat}
              onChange={(v) => setCat(v as Cat)}
              options={[
                { value: "full", label: "Full Songs" },
                { value: "clips", label: "Song Clips" },
              ]}
            />
            <div className="hidden md:block h-6 w-px bg-neutral-800" />
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={
                    "px-3 py-1.5 rounded-full text-sm border " +
                    (genre === g
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : "border-neutral-700 text-neutral-300 hover:border-neutral-500")
                  }
                >
                  {cap(g)}
                </button>
              ))}
            </div>
          </div>

          {/* Right: search + auth */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles…"
                className="w-full md:w-64 rounded-xl bg-neutral-900 text-neutral-200 placeholder:text-neutral-500
                           border border-neutral-700 focus:border-emerald-400 outline-none px-3 py-2"
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-neutral-500">⌘K</span>
            </div>

            {token ? (
              <button
                onClick={() => auth.logout()}
                className="px-3 py-2 rounded-xl border border-neutral-700 text-neutral-200 hover:bg-neutral-900"
              >
                Log out
              </button>
            ) : (
        <a
  href="/login"
  className="px-3 py-2 rounded-xl text-black font-semibold spotify-green spotify-green-hover hover:scale-[1.02] transition"
>
  Log in
</a>

            )}
          </div>
        </div>
      </div>

      {/* header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Members Library
        </h1>
        <p className="text-neutral-400 mt-2">
          {cap(cat)} • {cap(genre)}
          {query ? ` • “${query}”` : ""}
        </p>
      </section>

      {/* grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((a) => (
              <article
                key={a.id}
                className="spotify-card overflow-hidden card-hover group"
              >
                <div className="relative">
                  <img
                    src={a.cover}
                    alt={a.title}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span
                    className={
                      "absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full " +
                      (a.free
                        ? "bg-emerald-400 text-black"
                        : token
                        ? "bg-indigo-400 text-black"
                        : "bg-neutral-700 text-white")
                    }
                  >
                    {a.free ? "FREE" : token ? "PREMIUM" : "LOCKED"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    {cap(a.sub)} • {a.type === "full" ? "Full Song" : "Clip"}
                  </p>

                  <button
                    onClick={() => openItem(a.publicUrl)}
                    className="mt-4 w-full text-center rounded-xl py-2.5 font-semibold
                               bg-white/5 border border-neutral-700 text-neutral-200
                               hover:border-emerald-400 hover:text-white transition"
                  >
                    {a.free ? "Play Sample" : token ? "Open Activity" : "Unlock with Premium"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

function ToggleGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden border border-neutral-700">
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={
              "px-3 py-1.5 text-sm " +
              (active
                ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400"
                : "text-neutral-300 hover:bg-neutral-900")
            }
            style={i === 1 ? { borderLeftWidth: 1, borderLeftColor: "rgb(64 64 64)" } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="spotify-card p-12 text-center">
      <div className="text-5xl mb-3">🔎</div>
      <h3 className="text-white text-xl font-semibold">No activities found</h3>
      <p className="text-neutral-400 mt-1">
        Try a different genre or category, or clear your search.
      </p>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
