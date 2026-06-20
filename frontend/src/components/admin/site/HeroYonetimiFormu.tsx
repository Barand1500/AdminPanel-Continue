import { useMemo, useState, useEffect } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useSiteYonetimiAksiyonlari } from '@/hooks/useSiteYonetimiAksiyonlari';
import { GorselAlan } from '@/components/form/GorselAlan';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { LinkYoluAlani } from '@/components/form/LinkYoluAlani';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import {
  AdminPanelKarti,
  BildirimKutusu,
  HataDurumu,
  ModulBaslik,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import {
  HERO_BUTON_AKSIYONLARI,
  HERO_BUTON_KONUMLARI,
  HERO_STILLER,
  HERO_TAM_EKRAN_BUTON_RENK,
  HERO_TAM_EKRAN_BUTON_YAZI,
  HERO_VARSAYILAN_BUTON_RENK,
  HERO_VARSAYILAN_BUTON_YAZI,
  HERO_VARSAYILAN_GECIS_SN,
  bosHeroSlide,
  heroAyarlariBirlestir,
  type HeroAyarlari,
  type HeroButonAksiyon,
  type HeroKart,
  type HeroSlide,
} from '@/types/hero';

function gecerliHex(deger: string, varsayilan: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(deger) ? deger : varsayilan;
}

function KompaktRenkSatir({
  etiket,
  deger,
  varsayilan,
  onChange,
}: {
  etiket: string;
  deger: string;
  varsayilan: string;
  onChange: (v: string) => void;
}) {
  const picker = gecerliHex(deger, varsayilan);
  return (
    <div className="flex items-center gap-2">
      <span className="w-[5.5rem] shrink-0 text-xs font-medium text-[var(--ap-text-muted)]">{etiket}</span>
      <input
        type="color"
        value={picker}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 shrink-0 cursor-pointer rounded border border-[var(--ap-border)] bg-transparent p-0.5"
        title={etiket}
      />
      <input
        type="text"
        value={deger}
        onChange={(e) => onChange(e.target.value)}
        className={`${formInputSinifi} min-w-0 flex-1 py-1.5 text-xs`}
        placeholder={varsayilan}
      />
    </div>
  );
}

function HeroOnizleme({ hero, seciliSlide }: { hero: HeroAyarlari; seciliSlide: HeroSlide | null }) {
  const onizlenecek =
    seciliSlide?.gorselUrl
      ? seciliSlide
      : hero.sliderlar.find((s) => s.aktif && s.gorselUrl) ?? null;

  const gorselSrc = onizlenecek?.gorselUrl ? medyaTamUrl(onizlenecek.gorselUrl) : '';

  const kartSayisi = hero.kartlarAktif ? hero.kartlar.length : 0;
  const kartKolon =
    kartSayisi <= 1
      ? 'grid-cols-1 justify-items-center'
      : kartSayisi === 2
        ? 'grid-cols-2 justify-items-center'
        : kartSayisi === 3
          ? 'grid-cols-3 justify-items-center'
          : 'grid-cols-2 sm:grid-cols-4 justify-items-center';

  const tamEkranOnizleme = onizlenecek?.stil === 'tam-ekran';

  return (
    <div className="xl:sticky xl:top-4">
      <AdminPanelKarti baslik="Önizleme" altBaslik="Seçili slider ve kartlar">
        <div className="overflow-hidden rounded-xl border border-[var(--ap-border)] bg-[var(--ap-input-bg)]">
          {onizlenecek && gorselSrc ? (
            <div className={`relative w-full bg-slate-900 ${tamEkranOnizleme ? 'aspect-[9/16] sm:aspect-[16/10]' : 'aspect-[16/9]'}`}>
              <img
                src={gorselSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className={`absolute inset-0 ${tamEkranOnizleme ? 'bg-black/50' : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'}`} />
              <div
                className={`absolute inset-0 flex p-3 ${
                  tamEkranOnizleme ? 'items-center justify-start' : 'flex-col justify-end'
                }`}
              >
                {tamEkranOnizleme ? (
                  <div className="max-w-[85%]">
                    {onizlenecek.altBaslik && (
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-white/70">{onizlenecek.altBaslik}</p>
                    )}
                    {onizlenecek.baslik && (
                      <p className="mt-1 whitespace-pre-line text-sm font-bold leading-tight text-white">{onizlenecek.baslik}</p>
                    )}
                    {onizlenecek.baslikVurgu && (
                      <p className="text-sm font-bold text-orange-400">{onizlenecek.baslikVurgu}</p>
                    )}
                    {onizlenecek.aciklama && (
                      <p className="mt-1 line-clamp-2 text-[10px] text-white/80">{onizlenecek.aciklama}</p>
                    )}
                    {onizlenecek.butonAktif && onizlenecek.butonMetni && (
                      <span
                        className="mt-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold shadow"
                        style={{
                          backgroundColor: gecerliHex(onizlenecek.butonRenk, HERO_TAM_EKRAN_BUTON_RENK),
                          color: gecerliHex(onizlenecek.butonYaziRenk, HERO_TAM_EKRAN_BUTON_YAZI),
                        }}
                      >
                        {onizlenecek.butonMetni} →
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {onizlenecek.altBaslik && (
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-200">{onizlenecek.altBaslik}</p>
                    )}
                    {onizlenecek.baslik && (
                      <p className="line-clamp-2 text-sm font-bold text-white">{onizlenecek.baslik}</p>
                    )}
                    {onizlenecek.butonAktif && onizlenecek.butonMetni && (
                      <span
                        className="mt-2 inline-flex w-fit rounded px-2.5 py-1 text-[10px] font-semibold shadow"
                        style={{
                          backgroundColor: gecerliHex(onizlenecek.butonRenk, HERO_VARSAYILAN_BUTON_RENK),
                          color: gecerliHex(onizlenecek.butonYaziRenk, HERO_VARSAYILAN_BUTON_YAZI),
                        }}
                      >
                        {onizlenecek.butonMetni}
                      </span>
                    )}
                  </>
                )}
              </div>
              {!onizlenecek.aktif && (
                <span className="absolute right-2 top-2 rounded bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                  Kapalı
                </span>
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/9] flex-col items-center justify-center bg-gradient-to-br from-violet-500/10 to-slate-800/30 p-4 text-center">
              <span className="text-3xl opacity-50">🏠</span>
              <p className="ap-muted mt-2 text-xs">Görsel yükleyin</p>
            </div>
          )}

          {hero.kartlarAktif && hero.kartlar.length > 0 && (
            <div className={`grid gap-2 border-t border-[var(--ap-border)] p-2.5 ${kartKolon}`}>
              {hero.kartlar.map((k) => (
                <div key={k.id} className="flex min-w-0 items-center gap-1.5 rounded-md bg-[var(--ap-surface)] p-1.5">
                  <span className="shrink-0 text-base leading-none">{k.ikon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold text-[var(--ap-text)]">{k.baslik}</p>
                    <p className="truncate text-[9px] text-[var(--ap-text-muted)]">{k.aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hero.sliderlar.filter((s) => s.aktif && s.gorselUrl).length > 1 && (
            <p className="border-t border-[var(--ap-border)] px-3 py-2 text-center text-[10px] text-[var(--ap-text-muted)]">
              Geçiş: {hero.gecisSuresiSn} sn
            </p>
          )}
        </div>
      </AdminPanelKarti>
    </div>
  );
}
function SecimKartlari<T extends string>({
  secenekler,
  secili,
  onSec,
}: {
  secenekler: { id: T; ad: string; aciklama?: string }[];
  secili: T;
  onSec: (id: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {secenekler.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSec(s.id)}
          className={`ap-hero-secim-kart ${secili === s.id ? 'ap-hero-secim-kart-aktif' : ''}`}
        >
          <span className="font-semibold">{s.ad}</span>
          {s.aciklama && <span className="ap-muted mt-0.5 block text-xs">{s.aciklama}</span>}
        </button>
      ))}
    </div>
  );
}

function SlideDuzenlemeForm({
  slide,
  slideGuncelle,
  slideSil,
}: {
  slide: HeroSlide;
  slideGuncelle: (id: string, parca: Partial<HeroSlide>) => void;
  slideSil: (id: string) => void;
}) {
  const tamEkran = slide.stil === 'tam-ekran';

  return (
    <div className="space-y-4">
      <GorselAlan
        etiket="Arka Plan Görseli"
        deger={slide.gorselUrl}
        onChange={(v) => slideGuncelle(slide.id, { gorselUrl: v })}
        onizlemeSinifi="h-24 w-full max-w-md rounded-lg object-cover border border-[var(--ap-border)]"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormAlani etiket={tamEkran ? 'Başlık satırları' : 'Başlık'} aciklama={tamEkran ? 'Her satır için Enter kullanın' : undefined}>
          {tamEkran ? (
            <textarea
              className={formInputSinifi}
              rows={3}
              value={slide.baslik}
              onChange={(e) => slideGuncelle(slide.id, { baslik: e.target.value })}
              placeholder={'Tüm Süreçleri\nTek Ekrandan'}
            />
          ) : (
            <input
              className={formInputSinifi}
              value={slide.baslik}
              onChange={(e) => slideGuncelle(slide.id, { baslik: e.target.value })}
              placeholder="Ana başlık"
            />
          )}
        </FormAlani>
        <FormAlani etiket={tamEkran ? 'Turuncu vurgu' : 'Alt Başlık'} aciklama={tamEkran ? 'Son satır turuncu renkte gösterilir' : undefined}>
          {tamEkran ? (
            <input
              className={formInputSinifi}
              value={slide.baslikVurgu ?? ''}
              onChange={(e) => slideGuncelle(slide.id, { baslikVurgu: e.target.value })}
              placeholder="Yönetin."
            />
          ) : (
            <input
              className={formInputSinifi}
              value={slide.altBaslik}
              onChange={(e) => slideGuncelle(slide.id, { altBaslik: e.target.value })}
              placeholder="Üst etiket"
            />
          )}
        </FormAlani>
      </div>

      {tamEkran && (
        <FormAlani etiket="Üst etiket (opsiyonel)">
          <input
            className={formInputSinifi}
            value={slide.altBaslik}
            onChange={(e) => slideGuncelle(slide.id, { altBaslik: e.target.value })}
            placeholder="Kısa üst metin"
          />
        </FormAlani>
      )}

      <FormAlani etiket="Açıklama">
        <textarea
          className={formInputSinifi}
          rows={2}
          value={slide.aciklama}
          onChange={(e) => slideGuncelle(slide.id, { aciklama: e.target.value })}
        />
      </FormAlani>

      <FormAlani etiket="Slider Stili">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {HERO_STILLER.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                const parca: Partial<HeroSlide> = { stil: st.id };
                if (st.id === 'tam-ekran' && slide.stil !== 'tam-ekran') {
                  parca.butonRenk = HERO_TAM_EKRAN_BUTON_RENK;
                  parca.butonYaziRenk = HERO_TAM_EKRAN_BUTON_YAZI;
                  parca.saatGoster = true;
                }
                slideGuncelle(slide.id, parca);
              }}
              className={`rounded-lg border p-3 text-left text-sm transition ${
                slide.stil === st.id
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]/40'
              }`}
            >
              <span className="font-semibold">{st.ad}</span>
              <span className="ap-muted mt-0.5 block text-xs">{st.aciklama}</span>
            </button>
          ))}
        </div>
      </FormAlani>

      {tamEkran && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={slide.saatGoster !== false}
            onChange={(e) => slideGuncelle(slide.id, { saatGoster: e.target.checked })}
          />
          Sol altta saat ve tarih göster
        </label>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={slide.butonAktif}
          onChange={(e) => slideGuncelle(slide.id, { butonAktif: e.target.checked })}
        />
        {tamEkran ? 'Birincil buton göster' : 'Buton göster'}
      </label>

      {slide.butonAktif && (
        <div className="space-y-4 rounded-lg border border-dashed border-[var(--ap-border)] p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormAlani etiket="Buton Metni">
              <input
                className={formInputSinifi}
                value={slide.butonMetni}
                onChange={(e) => slideGuncelle(slide.id, { butonMetni: e.target.value })}
                placeholder={tamEkran ? 'Özellikleri Keşfet' : 'Hemen İncele'}
              />
            </FormAlani>
            <FormAlani etiket="Buton Linki">
              <input
                className={formInputSinifi}
                value={slide.butonLink}
                onChange={(e) => slideGuncelle(slide.id, { butonLink: e.target.value })}
                placeholder="/hizmetler veya https://..."
              />
            </FormAlani>
          </div>
          {!tamEkran && (
            <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
              <FormAlani etiket="Buton Konumu" aciklama="9 noktadan birini seçin">
                <div className="inline-grid grid-cols-3 gap-1.5 rounded-lg border border-[var(--ap-border)] p-2">
                  {HERO_BUTON_KONUMLARI.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      title={k.id}
                      onClick={() => slideGuncelle(slide.id, { butonKonum: k.id })}
                      className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                        slide.butonKonum === k.id
                          ? 'bg-[var(--ap-accent)] text-white'
                          : 'bg-[var(--ap-surface)] hover:bg-[var(--ap-hover)]'
                      }`}
                    >
                      {k.etiket}
                    </button>
                  ))}
                </div>
              </FormAlani>

              <FormAlani etiket="Butona tıklayınca" aciklama="Ziyaretçi butona tıkladığında ne olsun?">
                <SecimKartlari
                  secenekler={HERO_BUTON_AKSIYONLARI}
                  secili={slide.butonAksiyon ?? 'ayni-sekme'}
                  onSec={(id) => slideGuncelle(slide.id, { butonAksiyon: id as HeroButonAksiyon })}
                />
              </FormAlani>
            </div>
          )}

          {tamEkran && (
            <FormAlani etiket="Butona tıklayınca" aciklama="Ziyaretçi butona tıkladığında ne olsun?">
              <SecimKartlari
                secenekler={HERO_BUTON_AKSIYONLARI}
                secili={slide.butonAksiyon ?? 'ayni-sekme'}
                onSec={(id) => slideGuncelle(slide.id, { butonAksiyon: id as HeroButonAksiyon })}
              />
            </FormAlani>
          )}

          <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface)] p-3">
            <p className="mb-3 text-xs font-semibold text-[var(--ap-text)]">Buton Renkleri</p>
            <div className="space-y-3">
              <KompaktRenkSatir
                etiket="Arka plan"
                deger={slide.butonRenk}
                varsayilan={tamEkran ? HERO_TAM_EKRAN_BUTON_RENK : HERO_VARSAYILAN_BUTON_RENK}
                onChange={(v) => slideGuncelle(slide.id, { butonRenk: v })}
              />
              <KompaktRenkSatir
                etiket="Yazı"
                deger={slide.butonYaziRenk}
                varsayilan={tamEkran ? HERO_TAM_EKRAN_BUTON_YAZI : HERO_VARSAYILAN_BUTON_YAZI}
                onChange={(v) => slideGuncelle(slide.id, { butonYaziRenk: v })}
              />
            </div>
          </div>
        </div>
      )}

      {tamEkran && (
        <>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={slide.ikinciButonAktif ?? false}
              onChange={(e) => slideGuncelle(slide.id, { ikinciButonAktif: e.target.checked })}
            />
            İkincil metin linki göster
          </label>

          {slide.ikinciButonAktif && (
            <div className="space-y-4 rounded-lg border border-dashed border-[var(--ap-border)] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormAlani etiket="Link metni">
                  <input
                    className={formInputSinifi}
                    value={slide.ikinciButonMetni ?? ''}
                    onChange={(e) => slideGuncelle(slide.id, { ikinciButonMetni: e.target.value })}
                    placeholder="İletişime Geç"
                  />
                </FormAlani>
                <FormAlani etiket="Link adresi">
                  <input
                    className={formInputSinifi}
                    value={slide.ikinciButonLink ?? ''}
                    onChange={(e) => slideGuncelle(slide.id, { ikinciButonLink: e.target.value })}
                    placeholder="/iletisim"
                  />
                </FormAlani>
              </div>
              <FormAlani etiket="Linke tıklayınca">
                <SecimKartlari
                  secenekler={HERO_BUTON_AKSIYONLARI}
                  secili={slide.ikinciButonAksiyon ?? 'ayni-sekme'}
                  onSec={(id) => slideGuncelle(slide.id, { ikinciButonAksiyon: id as HeroButonAksiyon })}
                />
              </FormAlani>
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ap-border)] pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={slide.aktif}
            onChange={(e) => slideGuncelle(slide.id, { aktif: e.target.checked })}
          />
          Bu slider yayında
        </label>
        <button
          type="button"
          onClick={() => slideSil(slide.id)}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Sliderı Sil
        </button>
      </div>
    </div>
  );
}

export function HeroYonetimiFormu() {
  const { ayarlar, yukleniyor, hata, kaydediliyor, alanGuncelle } = useSiteAyarlariYonetimi();
  useSiteYonetimiAksiyonlari();

  const hero = useMemo(() => heroAyarlariBirlestir(ayarlar?.heroJson), [ayarlar?.heroJson]);
  const [seciliSlideId, setSeciliSlideId] = useState<string | null>(null);
  const [gecisMetin, setGecisMetin] = useState('6');

  useEffect(() => {
    setGecisMetin(String(hero.gecisSuresiSn));
  }, [hero.gecisSuresiSn]);

  useEffect(() => {
    if (!seciliSlideId && hero.sliderlar.length > 0) {
      setSeciliSlideId(hero.sliderlar[0].id);
    }
  }, [hero.sliderlar, seciliSlideId]);

  const seciliSlide = hero.sliderlar.find((s) => s.id === seciliSlideId) ?? hero.sliderlar[0] ?? null;

  const heroGuncelle = (guncel: HeroAyarlari) => {
    alanGuncelle('heroJson', guncel);
  };

  const slideGuncelle = (id: string, parca: Partial<HeroSlide>) => {
    heroGuncelle({
      ...hero,
      sliderlar: hero.sliderlar.map((s) => (s.id === id ? { ...s, ...parca } : s)),
    });
  };

  const slideEkle = () => {
    const yeni = bosHeroSlide(hero.sliderlar.length);
    heroGuncelle({ ...hero, sliderlar: [...hero.sliderlar, yeni] });
    setSeciliSlideId(yeni.id);
  };

  const slideSil = (id: string) => {
    if (!confirm('Bu slider silinsin mi?')) return;
    const kalan = hero.sliderlar.filter((s) => s.id !== id);
    heroGuncelle({ ...hero, sliderlar: kalan.map((s, i) => ({ ...s, sira: i })) });
    setSeciliSlideId(kalan[0]?.id ?? null);
  };

  const kartGuncelle = (id: string, parca: Partial<HeroKart>) => {
    heroGuncelle({
      ...hero,
      kartlar: hero.kartlar.map((k) => (k.id === id ? { ...k, ...parca } : k)),
    });
  };

  const kartEkle = () => {
    const yeni: HeroKart = {
      id: `k-${Date.now()}`,
      ikon: '⭐',
      baslik: 'Yeni Özellik',
      aciklama: 'Kısa açıklama',
      link: '',
      sira: hero.kartlar.length,
    };
    heroGuncelle({ ...hero, kartlar: [...hero.kartlar, yeni] });
  };

  const kartSil = (id: string) => {
    if (hero.kartlar.length <= 1) return;
    heroGuncelle({
      ...hero,
      kartlar: hero.kartlar.filter((k) => k.id !== id).map((k, i) => ({ ...k, sira: i })),
    });
  };

  if (yukleniyor) return <YukleniyorDurumu mesaj="Hero ayarları yükleniyor..." />;
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  return (
    <div className="ap-hero-yonetimi space-y-6">
      <ModulBaslik
        baslik="Hero Yönetimi"
        aciklama="Ana sayfa slider ve güven kartlarını düzenleyin."
      />

      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <AdminPanelKarti baslik="Sliderlar" altBaslik="Görseller sırayla ana sayfada döner">
            <div className="ap-hero-ust-ayar grid gap-4 sm:grid-cols-2">
              <FormAlani etiket="Geçiş Süresi" aciklama="İki slide arası bekleme">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={2}
                    max={60}
                    className={formInputSinifi}
                    value={gecisMetin}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setGecisMetin(raw);
                      const n = Number(raw);
                      if (raw !== '' && !Number.isNaN(n) && n >= 2 && n <= 60) {
                        heroGuncelle({ ...hero, gecisSuresiSn: n });
                      }
                    }}
                    onBlur={() => {
                      const n = Number(gecisMetin);
                      if (gecisMetin === '' || Number.isNaN(n) || n < 2) {
                        setGecisMetin(String(HERO_VARSAYILAN_GECIS_SN));
                        heroGuncelle({ ...hero, gecisSuresiSn: HERO_VARSAYILAN_GECIS_SN });
                        return;
                      }
                      const v = Math.min(60, Math.max(2, n));
                      setGecisMetin(String(v));
                      heroGuncelle({ ...hero, gecisSuresiSn: v });
                    }}
                  />
                  <span className="ap-muted shrink-0 text-sm">saniye</span>
                </div>
              </FormAlani>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-b border-[var(--ap-border)] pb-4">
              {hero.sliderlar.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeciliSlideId(s.id)}
                  className={`ap-hero-slide-sekme ${seciliSlide?.id === s.id ? 'ap-hero-slide-sekme-aktif' : ''}`}
                >
                  Slider {i + 1}
                  {!s.aktif && <span className="ml-1 opacity-60">(kapalı)</span>}
                </button>
              ))}
              <button type="button" onClick={slideEkle} className="ap-link-btn rounded-lg px-3 py-1.5 text-sm">
                + Yeni Slider
              </button>
            </div>

            {seciliSlide ? (
              <div className="ap-hero-duzenleme-kart mt-4 rounded-xl border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-4 sm:p-5">
                <p className="ap-heading mb-4 text-sm font-semibold">Slider Düzenleme</p>
                <SlideDuzenlemeForm slide={seciliSlide} slideGuncelle={slideGuncelle} slideSil={slideSil} />
              </div>
            ) : (
              <p className="ap-muted mt-4 text-sm">Henüz slider yok. &quot;+ Yeni Slider&quot; ile ekleyin.</p>
            )}
          </AdminPanelKarti>

          {/* Güven kartları */}
          <AdminPanelKarti baslik="Güven Kartları" altBaslik="Slider altındaki ikonlu kutular">
            <label className="ap-toggle-kart ap-toggle-yesil mb-4 flex cursor-pointer items-center justify-between">
              <div>
                <span className="ap-heading block text-sm font-semibold">Kartları Göster</span>
                <span className="ap-muted text-xs">Kapalıyken sitede görünmez</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hero.kartlarAktif}
                onClick={() => heroGuncelle({ ...hero, kartlarAktif: !hero.kartlarAktif })}
                className={`ap-toggle ${hero.kartlarAktif ? 'ap-toggle-on' : ''}`}
              >
                <span className="ap-toggle-thumb" />
              </button>
            </label>

            {hero.kartlarAktif && (
              <div className="space-y-3">
                {hero.kartlar.map((kart) => (
                  <div
                    key={kart.id}
                    className="space-y-3 rounded-lg border border-[var(--ap-border)] p-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-[3rem_1fr_1fr_auto]">
                      <input
                        className={`${formInputSinifi} text-center text-xl`}
                        value={kart.ikon}
                        onChange={(e) => kartGuncelle(kart.id, { ikon: e.target.value })}
                        title="Emoji / ikon"
                        maxLength={4}
                      />
                      <input
                        className={formInputSinifi}
                        value={kart.baslik}
                        onChange={(e) => kartGuncelle(kart.id, { baslik: e.target.value })}
                        placeholder="Başlık"
                      />
                      <input
                        className={formInputSinifi}
                        value={kart.aciklama}
                        onChange={(e) => kartGuncelle(kart.id, { aciklama: e.target.value })}
                        placeholder="Açıklama"
                      />
                      <button
                        type="button"
                        onClick={() => kartSil(kart.id)}
                        disabled={hero.kartlar.length <= 1}
                        className="text-sm text-red-400 disabled:opacity-30"
                      >
                        Sil
                      </button>
                    </div>
                    <FormAlani etiket="Link (opsiyonel)">
                      <LinkYoluAlani
                        deger={kart.link ?? ''}
                        onChange={(link) => kartGuncelle(kart.id, { link })}
                        placeholder="/hizmetler veya https://..."
                      />
                    </FormAlani>
                  </div>
                ))}
                <button type="button" onClick={kartEkle} className="ap-link-btn text-sm">
                  + Kart Ekle
                </button>
              </div>
            )}
          </AdminPanelKarti>
        </div>

        <HeroOnizleme hero={hero} seciliSlide={seciliSlide} />
      </div>
    </div>
  );
}
