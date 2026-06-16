import type { AdminMedya } from '@/features/admin/medyaApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';

interface MedyaGridProps {
  medyalar: AdminMedya[];
  seciliId: string | null;
  onSec: (id: string) => void;
}

export function MedyaGrid({ medyalar, seciliId, onSec }: MedyaGridProps) {
  if (medyalar.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-600 bg-slate-800/50 py-16 text-center">
        <p className="text-4xl">🖼️</p>
        <p className="mt-2 text-sm text-slate-400">Henüz medya yok. Dosya yükleyin veya URL ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {medyalar.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSec(m.id)}
          className={`group overflow-hidden rounded-lg border text-left transition ${
            seciliId === m.id ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-700 hover:border-slate-500'
          } bg-slate-800`}
        >
          <div className="aspect-square overflow-hidden bg-slate-900">
            <img src={medyaTamUrl(m.url)} alt={m.ad} className="h-full w-full object-cover" />
          </div>
          <div className="p-2">
            <p className="truncate text-xs font-medium text-white">{m.ad}</p>
            <p className="truncate text-[10px] text-slate-500">{m.url}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

interface MedyaYukleyiciProps {
  urlForm: { ad: string; url: string };
  yukleniyor: boolean;
  onUrlFormChange: (form: { ad: string; url: string }) => void;
  onDosyaSec: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MedyaYukleyici({ urlForm, yukleniyor, onUrlFormChange, onDosyaSec }: MedyaYukleyiciProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white">URL ile Ekle</h3>
        <p className="text-xs text-slate-400">Alt bardan Kaydet ile URL ekleyin</p>
        <input
          className="input-admin"
          placeholder="Medya adı"
          value={urlForm.ad}
          onChange={(e) => onUrlFormChange({ ...urlForm, ad: e.target.value })}
          required
        />
        <input
          className="input-admin"
          placeholder="https://..."
          value={urlForm.url}
          onChange={(e) => onUrlFormChange({ ...urlForm, url: e.target.value })}
          required
        />
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white">Dosya Yükle</h3>
        <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP — max 5MB</p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 py-8 hover:border-blue-500">
          <span className="text-2xl">📤</span>
          <span className="mt-2 text-sm text-slate-300">{yukleniyor ? 'Yükleniyor...' : 'Dosya seç'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={onDosyaSec} disabled={yukleniyor} />
        </label>
      </div>
    </div>
  );
}
