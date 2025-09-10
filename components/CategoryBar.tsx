type Props = {
  category: "full" | "clips";
  setCategory: (c: "full" | "clips") => void;
  sub: string;
  setSub: (s: string) => void;
};

const SUBS = ["pop", "rock", "country", "hiphop"];

export default function CategoryBar({ category, setCategory, sub, setSub }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-xl border overflow-hidden">
        <button
          className={`px-3 py-1.5 text-sm ${category==="full" ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
          onClick={() => setCategory("full")}
        >Full Songs</button>
        <button
          className={`px-3 py-1.5 text-sm ${category==="clips" ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
          onClick={() => setCategory("clips")}
        >Song Clips</button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Genre:</span>
        <div className="flex gap-2">
          {SUBS.map(s => (
            <button key={s}
              className={`px-3 py-1.5 rounded-lg border ${sub===s ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50"}`}
              onClick={() => setSub(s)}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
