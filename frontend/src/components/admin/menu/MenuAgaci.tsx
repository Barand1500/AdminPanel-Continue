import type { AdminSayfa } from '@/features/admin/sayfaApi';

interface MenuAgaciProps {
  sayfalar: AdminSayfa[];
  onToggleMenu: (id: string) => void;
  onYukari: (id: string) => void;
  onAsagi: (id: string) => void;
}

export function MenuAgaci({ sayfalar, onToggleMenu, onYukari, onAsagi }: MenuAgaciProps) {
  const menuSayfalar = [...sayfalar].sort((a, b) => a.sira - b.sira);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800">
      <div className="border-b border-slate-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Menü Yapısı</h2>
        <p className="text-xs text-slate-400">Sıra ve görünürlük ayarlayın, alt bardan Kaydet ile kaydedin</p>
      </div>

      <ul className="divide-y divide-slate-700">
        {menuSayfalar.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-slate-400">
            Önce Sayfalar modülünden sayfa ekleyin.
          </li>
        ) : (
          menuSayfalar.map((s, index) => (
            <li key={s.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => onYukari(s.id)} disabled={index === 0} className="text-xs text-slate-400 hover:text-white disabled:opacity-30">
                  ▲
                </button>
                <button type="button" onClick={() => onAsagi(s.id)} disabled={index === menuSayfalar.length - 1} className="text-xs text-slate-400 hover:text-white disabled:opacity-30">
                  ▼
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{s.baslik}</p>
                <p className="text-xs text-slate-500">/{s.slug}</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={s.menudeGoster} onChange={() => onToggleMenu(s.id)} />
                Menüde
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
