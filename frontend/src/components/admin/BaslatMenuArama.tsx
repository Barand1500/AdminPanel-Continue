interface BaslatMenuAramaProps {
  deger: string;
  onDegistir: (deger: string) => void;
}

export function BaslatMenuArama({ deger, onDegistir }: BaslatMenuAramaProps) {
  return (
    <div className="px-4 pt-4">
      <input
        type="search"
        value={deger}
        onChange={(e) => onDegistir(e.target.value)}
        placeholder="Modül, sayfa, widget veya ayar ara..."
        className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
        autoFocus
      />
    </div>
  );
}
