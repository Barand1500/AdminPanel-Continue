import { useRef, useState } from 'react';
import type { IkonSecimi } from '@/types/header';
import {
  grupPresets,
  HeaderPresetSvg,
  ozelIkonMu,
  varsayilanPresetId,
  type HeaderIkonGrubu,
} from '@/data/headerIkonPresets';
import { adminMedyaYukle, medyaTamUrl } from '@/features/admin/medyaApi';

interface IkonSeciciProps {
  etiket: string;
  aciklama?: string;
  grup: HeaderIkonGrubu;
  deger: IkonSecimi;
  onChange: (ikon: IkonSecimi) => void;
}

export function IkonSecici({ etiket, aciklama, grup, deger, onChange }: IkonSeciciProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const presets = grupPresets(grup);
  const ozel = ozelIkonMu(deger);

  const presetSec = (presetId: string) => {
    onChange({ tip: 'preset', presetId });
  };

  const ozelYukle = async (dosya: File) => {
    setYukleniyor(true);
    try {
      const medya = await adminMedyaYukle(dosya, `${grup}-ikon`);
      onChange({ tip: 'custom', customUrl: medyaTamUrl(medya.url) });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ap-border)] bg-white text-slate-600">
          {ozel && deger.customUrl ? (
            <img src={deger.customUrl} alt="" className="h-7 w-7 object-contain" />
          ) : (
            <HeaderPresetSvg presetId={deger.presetId ?? varsayilanPresetId(grup)} className="h-6 w-6" />
          )}
        </div>
        <div>
            <p className="ap-heading text-sm font-semibold">{etiket}</p>
            {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
          </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => presetSec(p.id)}
            className={`ap-sosyal-ikon-btn ${!ozel && deger.presetId === p.id ? 'ap-sosyal-ikon-btn-secili' : ''}`}
            title={p.ad}
          >
            <HeaderPresetSvg presetId={p.id} className="h-6 w-6" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`ap-sosyal-ikon-btn ${ozel ? 'ap-sosyal-ikon-btn-secili' : ''}`}
          title="Özel yükle"
          disabled={yukleniyor}
        >
          {yukleniyor ? '...' : '+'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.svg"
          className="hidden"
          onChange={(e) => {
            const dosya = e.target.files?.[0];
            if (dosya) void ozelYukle(dosya);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
