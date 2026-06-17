import { useCallback, useRef, useState } from 'react';
import type { AdminMedya } from '@/features/admin/medyaApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';

interface MedyaGridProps {
  medyalar: AdminMedya[];
  seciliIds: string[];
  onSecToggle: (id: string) => void;
  onHepsiniSec?: () => void;
  onSecimiTemizle?: () => void;
}

export function MedyaGrid({ medyalar, seciliIds, onSecToggle, onHepsiniSec, onSecimiTemizle }: MedyaGridProps) {
  if (medyalar.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-600 bg-slate-800/50 py-16 text-center">
        <p className="text-4xl">🖼️</p>
        <p className="mt-2 text-sm text-slate-400">Henüz medya yok. Dosya yükleyin veya URL ekleyin.</p>
      </div>
    );
  }

  const seciliSet = new Set(seciliIds);
  const hepsiSecili = medyalar.length > 0 && seciliIds.length === medyalar.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-slate-600 px-2 py-0.5 hover:border-blue-500 hover:text-blue-400"
            onClick={hepsiSecili ? onSecimiTemizle : onHepsiniSec}
          >
            {hepsiSecili ? 'Seçimi temizle' : 'Tümünü seç'}
          </button>
          {seciliIds.length > 0 && <span>{seciliIds.length} öğe seçili</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {medyalar.map((m) => {
          const secili = seciliSet.has(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSecToggle(m.id)}
              className={`group overflow-hidden rounded-lg border text-left transition ${
                secili ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-700 hover:border-slate-500'
              } bg-slate-800`}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img src={medyaTamUrl(m.url)} alt={m.ad} className="h-full w-full object-cover" />
                <div
                  className={`pointer-events-none absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
                    secili ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-500 bg-black/40 text-slate-200'
                  }`}
                >
                  {secili ? '✓' : ''}
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-white">{m.ad}</p>
                <p className="truncate text-[10px] text-slate-500">{m.url}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface MedyaYukleyiciProps {
  urlForm: { ad: string; url: string };
  yukleniyor: boolean;
  yuklemeIlerleme?: { tamamlanan: number; toplam: number } | null;
  onUrlFormChange: (form: { ad: string; url: string }) => void;
  onDosyalarSec: (dosyalar: File[]) => void;
}

function dosyalariAyikla(liste: FileList | File[]): File[] {
  return Array.from(liste).filter((d) => d.type.startsWith('image/'));
}

export function MedyaYukleyici({
  urlForm,
  yukleniyor,
  yuklemeIlerleme,
  onUrlFormChange,
  onDosyalarSec,
}: MedyaYukleyiciProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [surukleniyor, setSurukleniyor] = useState(false);

  const dosyaGonder = useCallback(
    (liste: FileList | File[]) => {
      const dosyalar = dosyalariAyikla(liste);
      if (dosyalar.length === 0) return;
      onDosyalarSec(dosyalar);
    },
    [onDosyalarSec]
  );

  function surukleBirak(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSurukleniyor(false);
    if (yukleniyor) return;
    dosyaGonder(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div
        className={`ap-medya-toplu-alan ${surukleniyor ? 'ap-medya-toplu-alan-surukle' : ''} ${yukleniyor ? 'ap-medya-toplu-alan-pasif' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!yukleniyor) setSurukleniyor(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!yukleniyor) setSurukleniyor(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) setSurukleniyor(false);
        }}
        onDrop={surukleBirak}
      >
        <span className="ap-medya-toplu-ikon" aria-hidden>
          📤
        </span>
        <p className="ap-medya-toplu-baslik">
          {surukleniyor ? 'Dosyaları buraya bırakın' : 'Toplu görsel yükle'}
        </p>
        <p className="ap-medya-toplu-aciklama">
          Görselleri sürükleyip bırakın veya bilgisayarınızdan seçin. PNG, JPG, WEBP — dosya başına max 5MB.
        </p>
        <button
          type="button"
          className="ap-medya-toplu-dugme"
          disabled={yukleniyor}
          onClick={() => inputRef.current?.click()}
        >
          {yukleniyor ? 'Yükleniyor...' : 'Dosya Seç'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={yukleniyor}
          onChange={(e) => {
            if (e.target.files?.length) dosyaGonder(e.target.files);
            e.target.value = '';
          }}
        />
        {yuklemeIlerleme && yuklemeIlerleme.toplam > 0 && (
          <div className="ap-medya-toplu-ilerleme">
            <div className="ap-medya-toplu-ilerleme-cubuk">
              <div
                className="ap-medya-toplu-ilerleme-dolgu"
                style={{ width: `${(yuklemeIlerleme.tamamlanan / yuklemeIlerleme.toplam) * 100}%` }}
              />
            </div>
            <p className="ap-medya-toplu-ilerleme-metin">
              {yuklemeIlerleme.tamamlanan} / {yuklemeIlerleme.toplam} yüklendi
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white">URL ile Ekle</h3>
        <p className="mt-1 text-xs text-slate-400">Harici bir görsel bağlantısı eklemek için alanları doldurup alt bardan Kaydet kullanın.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
