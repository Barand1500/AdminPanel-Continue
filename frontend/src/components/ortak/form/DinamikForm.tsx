import { FormEvent, useMemo, useState } from 'react';
import type { FormAlani, FormAyarlar } from '@/types/formYonetimi';
import { ayarlariBirlestir } from '@/types/formYonetimi';
import { publicFormGonder } from '@/features/site/formApi';
import { alanGorunur, formDogrula, formVerisiOlustur } from '@/utils/formYardimci';

interface DinamikFormProps {
  slug: string;
  ad: string;
  aciklama?: string;
  alanlar: FormAlani[];
  ayarlar?: Partial<FormAyarlar> | null;
  /** Admin önizlemede slug henüz yoksa yerel test */
  onizlemeModu?: boolean;
  className?: string;
}

function FormAlaniGirdi({
  alan,
  deger,
  onChange,
}: {
  alan: FormAlani;
  deger: string;
  onChange: (v: string) => void;
}) {
  const sinif =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30';

  if (alan.tip === 'textarea') {
    return (
      <textarea
        className={sinif}
        rows={4}
        placeholder={alan.placeholder}
        value={deger}
        onChange={(e) => onChange(e.target.value)}
        required={alan.zorunlu}
      />
    );
  }
  if (alan.tip === 'select') {
    return (
      <select className={sinif} value={deger} onChange={(e) => onChange(e.target.value)} required={alan.zorunlu}>
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
        <input
          type="checkbox"
          checked={deger === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : '')}
          required={alan.zorunlu}
        />
        {alan.etiket}
      </label>
    );
  }
  if (alan.tip === 'radio') {
    return (
      <div className="space-y-1">
        {(alan.secenekler ?? []).map((s) => (
          <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name={alan.id} checked={deger === s} onChange={() => onChange(s)} required={alan.zorunlu} />
            {s}
          </label>
        ))}
      </div>
    );
  }

  const inputTip =
    alan.tip === 'email'
      ? 'email'
      : alan.tip === 'tel'
        ? 'tel'
        : alan.tip === 'number'
          ? 'number'
          : alan.tip === 'date'
            ? 'date'
            : 'text';

  return (
    <input
      type={inputTip}
      className={sinif}
      placeholder={alan.placeholder}
      value={deger}
      onChange={(e) => onChange(e.target.value)}
      required={alan.zorunlu}
    />
  );
}

export function DinamikForm({
  slug,
  ad,
  aciklama,
  alanlar,
  ayarlar: ayarHam,
  onizlemeModu = false,
  className = '',
}: DinamikFormProps) {
  const ayar = ayarlariBirlestir(ayarHam);
  const [degerler, setDegerler] = useState<Record<string, string>>({});
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState(false);

  const gorunurAlanlar = useMemo(
    () => alanlar.filter((a) => alanGorunur(a, degerler)),
    [alanlar, degerler]
  );

  const genislikSinif =
    ayar.genislik === 'dar' ? 'max-w-md' : ayar.genislik === 'orta' ? 'max-w-xl' : 'max-w-2xl';

  const butonStil = ayar.butonRenk ? { backgroundColor: ayar.butonRenk } : undefined;
  const kartStil = ayar.arkaPlanRenk ? { backgroundColor: ayar.arkaPlanRenk } : undefined;

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setHata('');
    setBasari(false);

    const dogrulama = formDogrula(alanlar, degerler, ayar, kvkkOnay);
    if (dogrulama) {
      setHata(dogrulama);
      return;
    }

    const veri = formVerisiOlustur(alanlar, degerler);
    if (Object.keys(veri).length === 0) {
      setHata('En az bir alan doldurulmalı');
      return;
    }

    if (onizlemeModu && !slug.trim()) {
      setBasari(true);
      setHata('');
      return;
    }

    setGonderiliyor(true);
    try {
      await publicFormGonder(slug, veri);
      setBasari(true);
      setDegerler({});
      setKvkkOnay(false);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Gönderim başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  if (basari && !hata) {
    return (
      <div className={`site-dinamik-form ${genislikSinif} mx-auto rounded-xl border border-green-200 bg-green-50 p-6 text-center ${className}`}>
        <p className="text-sm font-medium text-green-800">
          {onizlemeModu && !slug.trim()
            ? 'Önizleme: doğrulama geçti. Gerçek gönderim için formu kaydedin.'
            : ayar.basariMesaji || 'Mesajınız alındı.'}
        </p>
        <button
          type="button"
          className="mt-4 text-sm text-primary underline"
          onClick={() => setBasari(false)}
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={gonder}
      className={`site-dinamik-form ${genislikSinif} mx-auto rounded-xl border border-slate-200 p-6 shadow-sm ${className}`}
      style={kartStil}
    >
      {ayar.baslikGoster && <h3 className="text-lg font-bold text-slate-800">{ad || 'Form'}</h3>}
      {ayar.aciklamaGoster && aciklama && <p className="mt-1 text-sm text-slate-600">{aciklama}</p>}

      {hata && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {hata}
        </p>
      )}

      <div className="mt-4 space-y-4">
        {gorunurAlanlar.length === 0 ? (
          <p className="text-sm text-slate-500">Bu formda görünür alan yok.</p>
        ) : (
          gorunurAlanlar.map((alan) => (
            <div
              key={alan.id}
              className={alan.genislik === 'yarim' ? 'sm:inline-block sm:w-[calc(50%-0.5rem)] sm:align-top sm:mr-2' : ''}
            >
              {alan.tip !== 'checkbox' && (
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {alan.etiket}
                  {alan.zorunlu && <span className="text-red-500"> *</span>}
                </label>
              )}
              <FormAlaniGirdi
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
            <input
              type="checkbox"
              className="mt-0.5"
              checked={kvkkOnay}
              onChange={(e) => setKvkkOnay(e.target.checked)}
              required
            />
            {ayar.kvkkMetni}
          </label>
        )}

        <button
          type="submit"
          disabled={gonderiliyor}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={butonStil ?? { backgroundColor: 'var(--color-primary, #7c3aed)' }}
        >
          {gonderiliyor ? 'Gönderiliyor...' : ayar.gonderButonMetni || 'Gönder'}
        </button>
      </div>
    </form>
  );
}
