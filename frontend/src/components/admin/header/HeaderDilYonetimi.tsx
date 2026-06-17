import { useCallback, useRef, useState } from 'react';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import type { DilDestegiAyarlari, HeaderAyarlari } from '@/types/header';
import { VARSAYILAN_SITE_DILLERI } from '@/data/siteDilleri';
import { siteJsonIceAktar, SITE_VARSAYILAN_CEVIRILER } from '@/i18n/siteSozluk';

interface HeaderDilYonetimiProps {
  dilDestegi: DilDestegiAyarlari;
  onGuncelle: (parcalar: Partial<HeaderAyarlari>) => void;
}

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label className={`ap-toggle-kart ${acik ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
      <div>
        <p className="ap-heading text-sm font-semibold">{etiket}</p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}

export function HeaderDilYonetimi({ dilDestegi, onGuncelle }: HeaderDilYonetimiProps) {
  const [duzenlenenDil, setDuzenlenenDil] = useState(dilDestegi.varsayilanDil);
  const [modalAcik, setModalAcik] = useState(false);
  const [jsonMetin, setJsonMetin] = useState('');
  const [jsonHata, setJsonHata] = useState('');
  const [yeniKod, setYeniKod] = useState('');
  const [yeniAd, setYeniAd] = useState('');
  const [yeniBayrak, setYeniBayrak] = useState('🌐');
  const dosyaRef = useRef<HTMLInputElement>(null);

  const dilGuncelle = (guncel: DilDestegiAyarlari) => {
    onGuncelle({ dilDestegi: guncel });
  };

  const seciliDil = dilDestegi.diller.find((d) => d.kod === duzenlenenDil);
  const seciliDilAd = seciliDil?.ad ?? duzenlenenDil;

  const modalAc = useCallback(() => {
    const ozel = dilDestegi.ceviriler?.[duzenlenenDil] ?? {};
    const varsayilan = SITE_VARSAYILAN_CEVIRILER[duzenlenenDil] ?? SITE_VARSAYILAN_CEVIRILER.TR ?? {};
    const birlesik = { ...varsayilan, ...ozel };
    const sirali = Object.keys(birlesik)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = birlesik[k];
        return acc;
      }, {});
    setJsonMetin(JSON.stringify(sirali, null, 2));
    setJsonHata('');
    setModalAcik(true);
  }, [duzenlenenDil, dilDestegi.ceviriler]);

  const jsonKaydet = () => {
    try {
      const veri = siteJsonIceAktar(jsonMetin);
      dilGuncelle({
        ...dilDestegi,
        ceviriler: { ...(dilDestegi.ceviriler ?? {}), [duzenlenenDil]: veri },
      });
      setModalAcik(false);
    } catch (err) {
      setJsonHata(err instanceof Error ? err.message : 'JSON geçersiz');
    }
  };

  const dilEkle = () => {
    const kod = yeniKod.trim().toUpperCase();
    const ad = yeniAd.trim();
    if (!kod || !ad) return;
    if (dilDestegi.diller.some((d) => d.kod === kod)) return;
    const yeni = {
      kod,
      ad,
      bayrak: yeniBayrak.trim() || '🌐',
      aktif: true,
      sira: dilDestegi.diller.length,
    };
    dilGuncelle({
      ...dilDestegi,
      diller: [...dilDestegi.diller, yeni],
      ceviriler: {
        ...(dilDestegi.ceviriler ?? {}),
        [kod]: SITE_VARSAYILAN_CEVIRILER[kod] ?? {},
      },
    });
    setDuzenlenenDil(kod);
    setYeniKod('');
    setYeniAd('');
    setYeniBayrak('🌐');
  };

  return (
    <>
      <div className="space-y-5">
        <AdminPanelKarti baslik="Dil Desteği" altBaslik="Header dil seçici ve site çevirileri">
          <div className="space-y-4">
            <ToggleSatir
              etiket="Dil seçiciyi göster"
              acik={dilDestegi.aktif}
              onDegistir={(aktif) => dilGuncelle({ ...dilDestegi, aktif })}
            />
            <FormAlani etiket="Görünüm">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'kod', ad: 'Kod (TR, EN…)' },
                    { id: 'bayrak', ad: 'Bayraklı' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => dilGuncelle({ ...dilDestegi, gorunum: s.id })}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      dilDestegi.gorunum === s.id
                        ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)] text-white'
                        : 'border-[var(--ap-border)] ap-muted hover:bg-[var(--ap-hover)]'
                    }`}
                  >
                    {s.ad}
                  </button>
                ))}
              </div>
            </FormAlani>
          </div>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Diller & Çeviriler" altBaslik="Sistem ayarlarındaki çeviri mantığı">
          <div className="ap-sistem-dil-satir">
            <FormAlani etiket="Düzenlenen dil" aciklama="Çevirileri bu dil için düzenlersiniz">
              <div className="flex gap-2">
                <select
                  className={`${formSelectSinifi} flex-1`}
                  value={duzenlenenDil}
                  onChange={(e) => setDuzenlenenDil(e.target.value)}
                >
                  {dilDestegi.diller.map((d) => (
                    <option key={d.kod} value={d.kod}>
                      {d.bayrak} {d.ad} ({d.kod}){d.aktif ? '' : ' — kapalı'}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={modalAc} className="ap-sistem-cark-btn" title="Çeviri ayarları">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </button>
              </div>
            </FormAlani>
          </div>

          <div className="ap-sistem-dil-bilgi mt-4">
            <p className="text-sm font-medium text-[var(--ap-heading)]">
              Seçili dil: <span className="text-[var(--ap-accent)]">{seciliDilAd}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="ap-sistem-etiket">
                {Object.keys(dilDestegi.ceviriler?.[duzenlenenDil] ?? {}).length} özel çeviri
              </span>
              <span className="ap-sistem-etiket ap-sistem-etiket-vurgu">
                {dilDestegi.diller.filter((d) => d.aktif).length} aktif dil
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {dilDestegi.diller.map((d) => (
              <label
                key={d.kod}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--ap-border)] px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={d.aktif}
                  onChange={(e) => {
                    const diller = dilDestegi.diller.map((x) =>
                      x.kod === d.kod ? { ...x, aktif: e.target.checked } : x
                    );
                    dilGuncelle({ ...dilDestegi, diller });
                  }}
                />
                <span>{d.bayrak}</span>
                <span className="font-semibold">{d.kod}</span>
                <span className="ap-muted text-xs">{d.ad}</span>
              </label>
            ))}
          </div>

          <FormAlani etiket="Varsayılan dil">
            <select
              className={formInputSinifi}
              value={dilDestegi.varsayilanDil}
              onChange={(e) => dilGuncelle({ ...dilDestegi, varsayilanDil: e.target.value })}
            >
              {dilDestegi.diller.map((d) => (
                <option key={d.kod} value={d.kod}>
                  {d.kod} — {d.ad}
                </option>
              ))}
            </select>
          </FormAlani>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Yeni dil ekle">
          <div className="flex flex-wrap items-end gap-3">
            <FormAlani etiket="Kod">
              <input
                className={`${formInputSinifi} w-24 uppercase`}
                value={yeniKod}
                onChange={(e) => setYeniKod(e.target.value)}
                placeholder="FR"
                maxLength={6}
              />
            </FormAlani>
            <FormAlani etiket="Ad">
              <input
                className={formInputSinifi}
                value={yeniAd}
                onChange={(e) => setYeniAd(e.target.value)}
                placeholder="Français"
              />
            </FormAlani>
            <FormAlani etiket="Bayrak">
              <input
                className={`${formInputSinifi} w-16 text-center`}
                value={yeniBayrak}
                onChange={(e) => setYeniBayrak(e.target.value)}
                maxLength={4}
              />
            </FormAlani>
            <button type="button" onClick={dilEkle} className="ap-btn ap-btn-birincil text-sm">
              Dil Ekle
            </button>
          </div>
          <p className="ap-muted mt-2 text-xs">
            Şablon diller: {VARSAYILAN_SITE_DILLERI.map((d) => d.kod).join(', ')}
          </p>
        </AdminPanelKarti>
      </div>

      {modalAcik && (
        <div className="ap-sistem-modal-arka">
          <div className="ap-sistem-modal">
            <div className="ap-sistem-modal-baslik">
              <div>
                <h3 className="ap-heading text-base font-bold">Çeviri Ayarları — {seciliDilAd}</h3>
                <p className="ap-muted text-xs">Site metinleri JSON formatında (sayfa.{`{slug}`} anahtarları dahil)</p>
              </div>
              <button type="button" onClick={() => setModalAcik(false)} className="ap-sistem-modal-kapat">
                ✕
              </button>
            </div>

            <div className="ap-sistem-modal-aksiyonlar">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([jsonMetin], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `site-ceviri-${duzenlenenDil}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="ap-sistem-modal-btn"
              >
                📥 JSON İndir
              </button>
              <button
                type="button"
                onClick={() => dosyaRef.current?.click()}
                className="ap-sistem-modal-btn"
              >
                📤 JSON Yükle
              </button>
              <button
                type="button"
                onClick={() => {
                  const en = SITE_VARSAYILAN_CEVIRILER.EN ?? {};
                  setJsonMetin(JSON.stringify(en, null, 2));
                  setJsonHata('');
                }}
                className="ap-sistem-modal-btn"
              >
                🇬🇧 İngilizce Şablon
              </button>
              <button
                type="button"
                onClick={() => {
                  const { [duzenlenenDil]: _, ...kalan } = dilDestegi.ceviriler ?? {};
                  dilGuncelle({ ...dilDestegi, ceviriler: kalan });
                  const varsayilan =
                    SITE_VARSAYILAN_CEVIRILER[duzenlenenDil] ?? SITE_VARSAYILAN_CEVIRILER.TR ?? {};
                  setJsonMetin(JSON.stringify(varsayilan, null, 2));
                  setJsonHata('');
                }}
                className="ap-sistem-modal-btn ap-sistem-modal-btn-tehlike"
              >
                ↺ Sıfırla
              </button>
              <input
                ref={dosyaRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const dosya = e.target.files?.[0];
                  if (!dosya) return;
                  const okuyucu = new FileReader();
                  okuyucu.onload = () => {
                    setJsonMetin(String(okuyucu.result ?? ''));
                    setJsonHata('');
                  };
                  okuyucu.readAsText(dosya);
                  e.target.value = '';
                }}
              />
            </div>

            <textarea
              className="ap-sistem-json-editor"
              value={jsonMetin}
              onChange={(e) => {
                setJsonMetin(e.target.value);
                setJsonHata('');
              }}
              spellCheck={false}
            />

            {jsonHata && <p className="mt-2 text-xs text-red-400">{jsonHata}</p>}

            <div className="ap-sistem-modal-alt">
              <button type="button" onClick={() => setModalAcik(false)} className="ap-sistem-modal-btn">
                İptal
              </button>
              <button type="button" onClick={jsonKaydet} className="ap-sistem-modal-btn ap-sistem-modal-btn-birincil">
                Çevirileri Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
