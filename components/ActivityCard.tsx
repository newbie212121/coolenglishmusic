type Props = { title: string; cover: string; onOpen: () => void; badge?: string };

export default function ActivityCard({ title, cover, onOpen, badge }: Props) {
  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200
                 hover:ring-blue-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      <div className="relative">
        <img src={cover} alt={title} className="w-full h-40 object-cover transition group-hover:scale-[1.02]" />
        {badge && (
          <span className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded-md bg-white/90 ring-1 ring-slate-200">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium leading-tight">{title}</div>
      </div>
    </button>
  );
}
