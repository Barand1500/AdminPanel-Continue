import { useCallback, useState } from 'react';
import type { HeaderAyarlari, KurTipi, ParaBirimiKaydi } from '@/types/header';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { tcmbKurOnizle } from '@/features/admin/kurApi';

const KUR_TIPLERI: { id: KurTipi; ad: string }[] = [
  { id: 'doviz_alis', ad: 'Döviz Alış' },
  { id: 'doviz_satis', ad: 'Döviz Satış' },
  { id: 'efektif_alis', ad: 'Efektif Alış' },
  { id: 'efektif_satis', ad: 'Efektif Satış' },
];

interface ParaBirimiYonetimiProps {
  kurlar: ParaBirimiKaydi[];
  sonKurGuncelleme?: string | null;
  onChange: (kurlar: ParaBirimiKaydi[], sonKurGuncelleme?: string | null) => void;
}

function yeniId() {
  return `kur-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ParaBirimiYonetimi({ kurlar, sonKurGuncelleme, onChange }: ParaBirimiYonetimiProps) {
  const [yeni, setYeni] = useState({
    ad: '',
    kod: '',
    sembol: '',
    kaynak: 'tcmb' as 'manuel' | 'tcmb',
    kurTipi: 'doviz_satis' as KurTipi,
    manuelKur: '',
  });
  const [tcmbDurum, setTcmbDurum] = useState<{ mesaj: string; basarili: boolean } | null>(null);
  const [kontrolEdiliyor, setKontrolEdiliyor] = useState(false);

  const sirali = [...kurlar].sort((a, b) => a.sira - b.sira);

  const guncelle = useCallback(
    (liste: ParaBirimiKaydi[]) => onChange(liste, sonKurGuncelleme ?? null),
    [onChange, sonKurGuncelleme]
  );

  const tcmbKontrol = async () => {
    if (!yeni.kod.trim()) return;
    setKontrolEdiliyor(true);
    setTcmbDurum(null);
    try {
      const sonuc = await tcmbKurOnizle(yeni.kod, yeni.kurTipi);
      setTcmbDurum({ mesaj: sonuc.mesaj, basarili: sonuc.var });
    } catch {
      setTcmbDurum({ mesaj: 'TCMB kontrolü başarısız', basarili: false });
    } finally {
      setKontrolEdiliyor(false);
    }
  };

  const ekle = () => {
    if (!yeni.ad.trim() || !yeni.kod.trim() || !yeni.sembol.trim()) return;
    const kayit: ParaBirimiKaydi = {
      id: yeniId(),
      ad: yeni.ad.trim(),
      kod: yeni.kod.trim().toUpperCase(),
      sembol: yeni.sembol.trim(),
      kaynak: yeni.kaynak,
      kurTipi: yeni.kaynak === 'tcmb' ? yeni.kurTipi : undefined,
      manuelKur: yeni.kaynak === 'manuel' ? parseFloat(yeni.manuelKur) || 1 : undefined,
      sira: kurlar.length,
    };
    guncelle([...kurlar, kayit]);
    setYeni({ ad: '', kod: '', sembol: '', kaynak: 'tcmb', kurTipi: 'doviz_satis', manuelKur: '' });
    setTcmbDurum(null);
  };

  const sil = (id: string) => {
    const kayit = kurlar.find((k) => k.id === id);
    if (kayit?.sabit) return;
    guncelle(kurlar.filter((k) => k.id !== id));
  };

  const kurGoster = (k: ParaBirimiKaydi) => {
    if (k.kod === 'TRY') return '1,0000';
    const deger = k.guncelKur ?? k.manuelKur;
    if (deger == null) return '—';
    return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  return (
    <div className="space-y-4">
      {sonKurGuncelleme && (
        <p className="ap-muted text-xs">
          Son güncelleme: {new Date(sonKurGuncelleme).toLocaleString('tr-TR')}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--ap-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--ap-border)] bg-[var(--ap-input-bg)] text-left text-xs uppercase tracking-wide text-[var(--ap-muted)]">
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Kod</th>
              <th className="px-3 py-2">Sembol</th>
              <th className="px-3 py-2">Kaynak</th>
              <th className="px-3 py-2">Kur</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {sirali.map((k) => (
              <tr key={k.id} className="border-b border-[var(--ap-border)] last:border-0">
                <td className="px-3 py-2">{k.ad}</td>
                <td className="px-3 py-2 font-mono text-xs">{k.kod}</td>
                <td className="px-3 py-2">{k.sembol}</td>
                <td className="px-3 py-2 text-xs">
                  {k.kaynak === 'tcmb' ? `TCMB (${k.kurTipi ?? 'doviz_satis'})` : 'Manuel'}
                </td>
                <td className="px-3 py-2 font-semibold">{kurGoster(k)}</td>
                <td className="px-3 py-2 text-right">
                  {!k.sabit && (
                    <button
                      type="button"
                      onClick={() => sil(k.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-dashed border-[var(--ap-border)] p-4">
        <p className="ap-heading mb-3 text-sm font-semibold">Yeni para birimi</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormAlani etiket="Ad">
            <input className={formInputSinifi} value={yeni.ad} onChange={(e) => setYeni({ ...yeni, ad: e.target.value })} placeholder="Dolar" />
          </FormAlani>
          <FormAlani etiket="Kısa ad (kod)">
            <input className={formInputSinifi} value={yeni.kod} onChange={(e) => setYeni({ ...yeni, kod: e.target.value.toUpperCase() })} placeholder="USD" />
          </FormAlani>
          <FormAlani etiket="Sembol">
            <input className={formInputSinifi} value={yeni.sembol} onChange={(e) => setYeni({ ...yeni, sembol: e.target.value })} placeholder="$" />
          </FormAlani>
          <FormAlani etiket="Kur kaynağı">
            <select
              className={formInputSinifi}
              value={yeni.kaynak}
              onChange={(e) => setYeni({ ...yeni, kaynak: e.target.value as 'manuel' | 'tcmb' })}
            >
              <option value="tcmb">TCMB API</option>
              <option value="manuel">Manuel</option>
            </select>
          </FormAlani>
          {yeni.kaynak === 'tcmb' ? (
            <FormAlani etiket="Kur türü">
              <select
                className={formInputSinifi}
                value={yeni.kurTipi}
                onChange={(e) => setYeni({ ...yeni, kurTipi: e.target.value as KurTipi })}
              >
                {KUR_TIPLERI.map((t) => (
                  <option key={t.id} value={t.id}>{t.ad}</option>
                ))}
              </select>
            </FormAlani>
          ) : (
            <FormAlani etiket="Manuel kur">
              <input
                type="number"
                step="0.0001"
                className={formInputSinifi}
                value={yeni.manuelKur}
                onChange={(e) => setYeni({ ...yeni, manuelKur: e.target.value })}
                placeholder="46.1688"
              />
            </FormAlani>
          )}
        </div>

        {yeni.kaynak === 'tcmb' && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void tcmbKontrol()}
              disabled={kontrolEdiliyor || !yeni.kod.trim()}
              className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--ap-hover)]"
            >
              {kontrolEdiliyor ? 'Kontrol ediliyor...' : 'TCMB önizle'}
            </button>
            {tcmbDurum && (
              <span className={`text-xs ${tcmbDurum.basarili ? 'text-green-600' : 'text-red-500'}`}>
                {tcmbDurum.mesaj}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={ekle}
          className="mt-4 rounded-lg bg-[var(--ap-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Para birimi ekle
        </button>
      </div>
    </div>
  );
}

export type { HeaderAyarlari };
