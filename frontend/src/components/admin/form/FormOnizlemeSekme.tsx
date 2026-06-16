import { useMemo, useState } from 'react';
import type { FormAlani, FormFormDegeri } from '@/features/admin/formApi';
import type { FormKosul } from '@/types/formYonetimi';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';

interface FormOnizlemeSekmeProps {
  form: FormFormDegeri;
}

function kosulSaglaniyor(kosul: FormKosul, degerler: Record<string, string>): boolean {
  const deger = degerler[kosul.alanId] ?? '';
  switch (kosul.operator) {
    case 'esit':
      return deger === (kosul.deger ?? '');
    case 'farkli':
      return deger !== (kosul.deger ?? '');
    case 'dolu':
      return deger.trim().length > 0;
    case 'bos':
      return deger.trim().length === 0;
    case 'icerir':
      return deger.toLowerCase().includes((kosul.deger ?? '').toLowerCase());
    default:
      return true;
  }
}

function alanGorunur(alan: FormAlani, degerler: Record<string, string>): boolean {
  if (!alan.kosullar?.length) return true;
  const sonuclar = alan.kosullar.map((k) => kosulSaglaniyor(k, degerler));
  return alan.kosulMantigi === 'veya' ? sonuclar.some(Boolean) : sonuclar.every(Boolean);
}

function OnizlemeAlani({
  alan,
  deger,
  onChange,
}: {
  alan: FormAlani;
  deger: string;
  onChange: (v: string) => void;
}) {
  const sinif =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800';

  if (alan.tip === 'textarea') {
    return (
      <textarea
        className={sinif}
        rows={3}
        placeholder={alan.placeholder}
        value={deger}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (alan.tip === 'select') {
    return (
      <select className={sinif} value={deger} onChange={(e) => onChange(e.target.value)}>
        <option value="">Seçiniz</option>
        {(alan.secenekler ?? []).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }
  if (alan.tip === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={deger === 'true'} onChange={(e) => onChange(e.target.checked ? 'true' : '')} />
        {alan.etiket}
      </label>
    );
  }
  if (alan.tip === 'radio') {
    return (
      <div className="space-y-1">
        {(alan.secenekler ?? []).map((s) => (
          <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name={alan.id} checked={deger === s} onChange={() => onChange(s)} />
            {s}
          </label>
        ))}
      </div>
    );
  }
  return (
    <input
      type={alan.tip === 'email' ? 'email' : alan.tip === 'tel' ? 'tel' : alan.tip === 'number' ? 'number' : alan.tip === 'date' ? 'date' : 'text'}
      className={sinif}
      placeholder={alan.placeholder}
      value={deger}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function FormOnizlemeSekme({ form }: FormOnizlemeSekmeProps) {
  const [degerler, setDegerler] = useState<Record<string, string>>({});
  const ayar = form.ayarlarJson;

  const gorunurAlanlar = useMemo(
    () => form.alanlarJson.filter((a) => alanGorunur(a, degerler)),
    [form.alanlarJson, degerler]
  );

  const genislikSinif =
    ayar.genislik === 'dar' ? 'max-w-md' : ayar.genislik === 'orta' ? 'max-w-xl' : 'max-w-2xl';

  const butonStil = ayar.butonRenk ? { backgroundColor: ayar.butonRenk } : undefined;
  const kartStil = ayar.arkaPlanRenk ? { backgroundColor: ayar.arkaPlanRenk } : undefined;

  return (
    <div className="space-y-4">
      <p className="ap-muted text-sm">
        Canlı önizleme — koşullu alanları test etmek için değer girin. Görünüm:{' '}
        <strong>{GORUNUM_TIPLERI.find((g) => g.id === ayar.gorunumTipi)?.ad}</strong>
      </p>

      <div className="ap-form-onizleme-cerceve">
        <div className={`ap-form-onizleme-kart mx-auto ${genislikSinif}`} style={kartStil}>
          {ayar.baslikGoster && (
            <h3 className="text-lg font-bold text-slate-800">{form.ad || 'Form Başlığı'}</h3>
          )}
          {ayar.aciklamaGoster && form.aciklama && (
            <p className="mt-1 text-sm text-slate-600">{form.aciklama}</p>
          )}

          <div className="mt-4 space-y-4">
            {gorunurAlanlar.length === 0 ? (
              <p className="text-sm text-slate-500">Görünür alan yok. Alan ekleyin veya koşulları kontrol edin.</p>
            ) : (
              gorunurAlanlar.map((alan) => (
                <div key={alan.id} className={alan.genislik === 'yarim' ? 'sm:inline-block sm:w-[calc(50%-0.5rem)] sm:mr-2' : ''}>
                  {alan.tip !== 'checkbox' && (
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {alan.etiket}
                      {alan.zorunlu && <span className="text-red-500"> *</span>}
                    </label>
                  )}
                  <OnizlemeAlani
                    alan={alan}
                    deger={degerler[alan.id] ?? ''}
                    onChange={(v) => setDegerler((prev) => ({ ...prev, [alan.id]: v }))}
                  />
                  {alan.yardimMetni && <p className="mt-1 text-xs text-slate-500">{alan.yardimMetni}</p>}
                </div>
              ))
            )}

            {ayar.kvkkOnayZorunlu && (
              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input type="checkbox" className="mt-0.5" />
                {ayar.kvkkMetni}
              </label>
            )}

            <button
              type="button"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={butonStil ?? { backgroundColor: 'var(--ap-accent)' }}
            >
              {ayar.gonderButonMetni || 'Gönder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
