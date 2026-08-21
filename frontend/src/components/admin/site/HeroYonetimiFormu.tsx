import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { GorselAlan } from '@/components/form/GorselAlan';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import {
  AdminModulKabuk,
  BildirimKutusu,
  HataDurumu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import {
  AdminAnahtarDugme,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  AdminPilSekme,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { AdminFlatIkon } from '@/components/admin/ortak/AdminFlatIkon';
import { SayfaIkonSecici } from '@/components/admin/sayfa/SayfaIkonSecici';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import {
  HERO_BUTON_AKSIYONLARI,
  HERO_BUTON_KONUMLARI,
  HERO_GORSEL_KIRPMA,
  HERO_GORSEL_ODAK,
  HERO_STILLER,
  HERO_TAM_EKRAN_BUTON_RENK,
  HERO_TAM_EKRAN_BUTON_YAZI,
  HERO_VARSAYILAN_BUTON_RENK,
  HERO_VARSAYILAN_BUTON_YAZI,
  HERO_VARSAYILAN_GECIS_SN,
  bosHeroSlide,
  heroAyarlariBirlestir,
  heroGorselObjectSinifi,
  heroGorselSinifi,
  type HeroAyarlari,
  type HeroButonAksiyon,
  type HeroKart,
  type HeroSlide,
} from '@/types/hero';

type Gorunum = 'liste' | 'editor' | 'kartlar';

function ListeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function YeniIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DuzenlemeIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function KartIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function gecerliHex(deger: string, varsayilan: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(deger) ? deger : varsayilan;
}

function stilAdi(id: HeroSlide['stil']) {
  return HERO_STILLER.find((s) => s.id === id)?.ad ?? id;
}

function PilGrup<T extends string>({
  secenekler,
  secili,
  onSec,
}: {
  secenekler: { id: T; ad: string }[];
  secili: T;
  onSec: (id: T) => void;
}) {
  return (
    <div className="ap-hero-piller">
      {secenekler.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSec(s.id)}
          className={`ap-hero-pil${secili === s.id ? ' ap-hero-pil--aktif' : ''}`}
        >
          {s.ad}
        </button>
      ))}
    </div>
  );
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
    <label className="ap-hero-renk">
      <span>{etiket}</span>
      <input type="color" value={picker} onChange={(e) => onChange(e.target.value)} title={etiket} />
      <input
        type="text"
        value={deger}
        onChange={(e) => onChange(e.target.value)}
        className={`${formInputSinifi} ap-hero-renk-hex`}
        placeholder={varsayilan}
      />
    </label>
  );
}

function HeroOnizlemeIcerik({ hero, seciliSlide }: { hero: HeroAyarlari; seciliSlide: HeroSlide | null }) {
  const onizlenecek =
    seciliSlide?.gorselUrl ? seciliSlide : hero.sliderlar.find((s) => s.aktif && s.gorselUrl) ?? null;
  const gorselSrc = onizlenecek?.gorselUrl ? medyaTamUrl(onizlenecek.gorselUrl) : '';
  const kartSayisi = hero.kartlarAktif ? hero.kartlar.length : 0;
  const tamEkranOnizleme = onizlenecek?.stil === 'tam-ekran';

  return (
    <div className="ap-hero-oniz">
      {onizlenecek && gorselSrc ? (
        <div className={`ap-hero-oniz-sahne${tamEkranOnizleme ? ' ap-hero-oniz-sahne--dikey' : ''}`}>
          <img
            src={gorselSrc}
            alt=""
            className={heroGorselSinifi(onizlenecek.gorselKirpma, onizlenecek.gorselOdak)}
          />
          <div className={`ap-hero-oniz-perde${tamEkranOnizleme ? ' ap-hero-oniz-perde--tam' : ''}`} />
          <div className={`ap-hero-oniz-metin${tamEkranOnizleme ? ' ap-hero-oniz-metin--tam' : ''}`}>
            {onizlenecek.altBaslik && <p className="ap-hero-oniz-alt">{onizlenecek.altBaslik}</p>}
            {onizlenecek.baslik && <p className="ap-hero-oniz-baslik">{onizlenecek.baslik}</p>}
            {onizlenecek.baslikVurgu && <p className="ap-hero-oniz-vurgu">{onizlenecek.baslikVurgu}</p>}
            {onizlenecek.aciklama && <p className="ap-hero-oniz-aciklama">{onizlenecek.aciklama}</p>}
            {onizlenecek.butonAktif && onizlenecek.butonMetni && (
              <span
                className="ap-hero-oniz-btn"
                style={{
                  backgroundColor: gecerliHex(
                    onizlenecek.butonRenk,
                    tamEkranOnizleme ? HERO_TAM_EKRAN_BUTON_RENK : HERO_VARSAYILAN_BUTON_RENK
                  ),
                  color: gecerliHex(
                    onizlenecek.butonYaziRenk,
                    tamEkranOnizleme ? HERO_TAM_EKRAN_BUTON_YAZI : HERO_VARSAYILAN_BUTON_YAZI
                  ),
                }}
              >
                {onizlenecek.butonMetni}
              </span>
            )}
          </div>
          {!onizlenecek.aktif && <span className="ap-hero-oniz-rozet">Kapalı</span>}
        </div>
      ) : (
        <div className="ap-hero-oniz-bos">Görsel yükleyin</div>
      )}

      {hero.kartlarAktif && hero.kartlar.length > 0 && (
        <div className={`ap-hero-oniz-kartlar ap-hero-oniz-kartlar--${Math.min(kartSayisi, 4)}`}>
          {hero.kartlar.map((k) => (
            <div key={k.id} className="ap-hero-oniz-kart">
              <span>{k.ikon}</span>
              <div>
                <p>{k.baslik}</p>
                <small>{k.aciklama}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroOnizlemeModal({
  acik,
  hero,
  seciliSlide,
  onKapat,
}: {
  acik: boolean;
  hero: HeroAyarlari;
  seciliSlide: HeroSlide | null;
  onKapat: () => void;
}) {
  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="hero-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-hero-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="hero-onizleme-baslik" className="ap-admin-modal-baslik">
              Hero önizleme
            </h2>
            <p className="ap-admin-modal-alt">Ana sayfa banner görünümü</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-hero-oniz-govde">
          <HeroOnizlemeIcerik hero={hero} seciliSlide={seciliSlide} />
        </div>
      </div>
    </div>
  );
}

function SlideDuzenlemeForm({
  slide,
  siraNo,
  slideGuncelle,
}: {
  slide: HeroSlide;
  siraNo: number;
  slideGuncelle: (id: string, parca: Partial<HeroSlide>) => void;
}) {
  const tamEkran = slide.stil === 'tam-ekran';

  return (
    <div className="ap-editor-panel ap-hero-editor">
      <div className="ap-hero-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Slider {siraNo}</h2>
          <p className="ap-muted text-xs">{stilAdi(slide.stil)}</p>
        </div>
        <div className={`ap-hero-aktif-anahtar${slide.aktif ? ' ap-hero-aktif-anahtar--acik' : ''}`}>
          <AdminAnahtarDugme
            etiket="Aktif"
            acik={slide.aktif}
            onDegistir={(aktif) => slideGuncelle(slide.id, { aktif })}
          />
        </div>
      </div>

      <div className="ap-hero-editor-govde">
        <AdminFormBolumu baslik="Görsel ve stil">
          <div className="ap-hero-gorsel-stil">
            <div className="ap-hero-arka-plan">
              <GorselAlan
                etiket="Arka plan"
                deger={slide.gorselUrl}
                onChange={(v) => slideGuncelle(slide.id, { gorselUrl: v })}
                onizlemeSinifi={`ap-hero-gorsel-onizleme ${heroGorselObjectSinifi(slide.gorselKirpma, slide.gorselOdak)}`}
              />
            </div>
            <div className="ap-hero-stil-gruplar">
              <FormAlani etiket="Stil">
                <PilGrup
                  secenekler={HERO_STILLER.map((s) => ({ id: s.id, ad: s.ad }))}
                  secili={slide.stil}
                  onSec={(id) => {
                    const parca: Partial<HeroSlide> = { stil: id };
                    if (id === 'tam-ekran' && slide.stil !== 'tam-ekran') {
                      parca.butonRenk = HERO_TAM_EKRAN_BUTON_RENK;
                      parca.butonYaziRenk = HERO_TAM_EKRAN_BUTON_YAZI;
                      parca.saatGoster = true;
                    }
                    slideGuncelle(slide.id, parca);
                  }}
                />
              </FormAlani>
              <FormAlani etiket="Sığdırma">
                <PilGrup
                  secenekler={HERO_GORSEL_KIRPMA.map((s) => ({ id: s.id, ad: s.ad }))}
                  secili={slide.gorselKirpma ?? 'kapla'}
                  onSec={(id) => slideGuncelle(slide.id, { gorselKirpma: id })}
                />
              </FormAlani>
              {(slide.gorselKirpma ?? 'kapla') !== 'doldur' && (
                <FormAlani etiket="Odak">
                  <PilGrup
                    secenekler={HERO_GORSEL_ODAK}
                    secili={slide.gorselOdak ?? 'merkez'}
                    onSec={(id) => slideGuncelle(slide.id, { gorselOdak: id })}
                  />
                </FormAlani>
              )}
            </div>
          </div>
        </AdminFormBolumu>

        <AdminFormBolumu baslik="Metin">
          <div className="ap-hero-form-grid">
            <FormAlani etiket={tamEkran ? 'Başlık satırları' : 'Başlık'}>
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
            <FormAlani etiket={tamEkran ? 'Turuncu vurgu' : 'Alt başlık'}>
              <input
                className={formInputSinifi}
                value={tamEkran ? slide.baslikVurgu ?? '' : slide.altBaslik}
                onChange={(e) =>
                  slideGuncelle(
                    slide.id,
                    tamEkran ? { baslikVurgu: e.target.value } : { altBaslik: e.target.value }
                  )
                }
                placeholder={tamEkran ? 'Yönetin.' : 'Üst etiket'}
              />
            </FormAlani>
          </div>
          {tamEkran && (
            <FormAlani etiket="Üst etiket">
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
              placeholder="Kısa açıklama"
            />
          </FormAlani>
          {tamEkran && (
            <AdminAnahtarDugme
              etiket="Sol altta saat"
              acik={slide.saatGoster !== false}
              onDegistir={(saatGoster) => slideGuncelle(slide.id, { saatGoster })}
            />
          )}
        </AdminFormBolumu>

        <AdminFormBolumu baslik="Buton">
          <AdminAnahtarDugme
            etiket={tamEkran ? 'Birincil buton' : 'Buton göster'}
            acik={slide.butonAktif}
            onDegistir={(butonAktif) => slideGuncelle(slide.id, { butonAktif })}
          />
          {slide.butonAktif && (
            <>
              <div className="ap-hero-form-grid">
                <FormAlani etiket="Metin">
                  <input
                    className={formInputSinifi}
                    value={slide.butonMetni}
                    onChange={(e) => slideGuncelle(slide.id, { butonMetni: e.target.value })}
                    placeholder={tamEkran ? 'Özellikleri Keşfet' : 'Hemen İncele'}
                  />
                </FormAlani>
                <FormAlani etiket="Link">
                  <input
                    className={formInputSinifi}
                    value={slide.butonLink}
                    onChange={(e) => slideGuncelle(slide.id, { butonLink: e.target.value })}
                    placeholder="/hizmetler"
                  />
                </FormAlani>
              </div>
              <div className="ap-hero-form-grid">
                {!tamEkran && (
                  <FormAlani etiket="Konum">
                    <div className="ap-hero-konum">
                      {HERO_BUTON_KONUMLARI.map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          title={k.id}
                          onClick={() => slideGuncelle(slide.id, { butonKonum: k.id })}
                          className={`ap-hero-konum-oge${slide.butonKonum === k.id ? ' ap-hero-konum-oge--aktif' : ''}`}
                        >
                          {k.etiket}
                        </button>
                      ))}
                    </div>
                  </FormAlani>
                )}
                <FormAlani etiket="Tıklayınca">
                  <PilGrup
                    secenekler={HERO_BUTON_AKSIYONLARI.map((s) => ({ id: s.id, ad: s.ad }))}
                    secili={slide.butonAksiyon ?? 'ayni-sekme'}
                    onSec={(id) => slideGuncelle(slide.id, { butonAksiyon: id as HeroButonAksiyon })}
                  />
                </FormAlani>
              </div>
              <div className="ap-hero-form-grid">
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
            </>
          )}

          {tamEkran && (
            <>
              <AdminAnahtarDugme
                etiket="İkincil link"
                acik={slide.ikinciButonAktif ?? false}
                onDegistir={(ikinciButonAktif) => slideGuncelle(slide.id, { ikinciButonAktif })}
              />
              {slide.ikinciButonAktif && (
                <div className="ap-hero-form-grid">
                  <FormAlani etiket="Link metni">
                    <input
                      className={formInputSinifi}
                      value={slide.ikinciButonMetni ?? ''}
                      onChange={(e) => slideGuncelle(slide.id, { ikinciButonMetni: e.target.value })}
                      placeholder="İletişime Geç"
                    />
                  </FormAlani>
                  <FormAlani etiket="Adres">
                    <input
                      className={formInputSinifi}
                      value={slide.ikinciButonLink ?? ''}
                      onChange={(e) => slideGuncelle(slide.id, { ikinciButonLink: e.target.value })}
                      placeholder="/iletisim"
                    />
                  </FormAlani>
                </div>
              )}
            </>
          )}
        </AdminFormBolumu>
      </div>
    </div>
  );
}

export function HeroYonetimiFormu() {
  const { ayarlar, yukleniyor, hata, kaydediliyor, kaydet, alanGuncelle } = useSiteAyarlariYonetimi();
  const hero = useMemo(() => heroAyarlariBirlestir(ayarlar?.heroJson), [ayarlar?.heroJson]);
  const [gorunum, setGorunum] = useState<Gorunum>('liste');
  const [seciliSlideId, setSeciliSlideId] = useState<string | null>(null);
  const [gecisMetin, setGecisMetin] = useState('6');
  const [onizlemeAcik, setOnizlemeAcik] = useState(false);

  useEffect(() => {
    setGecisMetin(String(hero.gecisSuresiSn));
  }, [hero.gecisSuresiSn]);

  const seciliSlide = hero.sliderlar.find((s) => s.id === seciliSlideId) ?? null;

  const heroGuncelle = useCallback(
    (guncel: HeroAyarlari) => alanGuncelle('heroJson', guncel),
    [alanGuncelle]
  );

  const slideGuncelle = useCallback(
    (id: string, parca: Partial<HeroSlide>) => {
      heroGuncelle({
        ...hero,
        sliderlar: hero.sliderlar.map((s) => (s.id === id ? { ...s, ...parca } : s)),
      });
    },
    [hero, heroGuncelle]
  );

  const slideEkle = useCallback(() => {
    const yeni = bosHeroSlide(hero.sliderlar.length);
    heroGuncelle({ ...hero, sliderlar: [...hero.sliderlar, yeni] });
    setSeciliSlideId(yeni.id);
    setGorunum('editor');
  }, [hero, heroGuncelle]);

  const slideSil = useCallback(() => {
    if (!seciliSlideId || !confirm('Bu slider silinsin mi?')) return;
    const kalan = hero.sliderlar.filter((s) => s.id !== seciliSlideId);
    heroGuncelle({ ...hero, sliderlar: kalan.map((s, i) => ({ ...s, sira: i })) });
    setSeciliSlideId(kalan[0]?.id ?? null);
    setGorunum('liste');
  }, [hero, heroGuncelle, seciliSlideId]);

  const duzenlemeyeGit = useCallback(() => {
    if (!seciliSlideId) return;
    setGorunum('editor');
  }, [seciliSlideId]);

  const kartGuncelle = (id: string, parca: Partial<HeroKart>) => {
    heroGuncelle({
      ...hero,
      kartlar: hero.kartlar.map((k) => (k.id === id ? { ...k, ...parca } : k)),
    });
  };

  const kartEkle = () => {
    heroGuncelle({
      ...hero,
      kartlar: [
        ...hero.kartlar,
        {
          id: `k-${Date.now()}`,
          ikon: '⭐',
          baslik: 'Yeni Özellik',
          aciklama: 'Kısa açıklama',
          link: '',
          sira: hero.kartlar.length,
        },
      ],
    });
  };

  const kartSil = (id: string) => {
    if (hero.kartlar.length <= 1) return;
    heroGuncelle({
      ...hero,
      kartlar: hero.kartlar.filter((k) => k.id !== id).map((k, i) => ({ ...k, sira: i })),
    });
  };

  useModulAksiyonlari(
    {
      kaydet,
      ekle: slideEkle,
      sil: slideSil,
      duzenle: duzenlemeyeGit,
      onizle: () => setOnizlemeAcik(true),
    },
    {
      kaydet: !kaydediliyor,
      ekle: gorunum !== 'kartlar',
      sil: gorunum !== 'kartlar' && !!seciliSlideId && !kaydediliyor,
      duzenle: gorunum === 'liste' && !!seciliSlideId && !kaydediliyor,
      onizle: true,
    }
  );

  function gorunumDegistir(id: Gorunum) {
    if (id === gorunum) return;
    if (id === 'liste' || id === 'kartlar') {
      setGorunum(id);
      return;
    }
    slideEkle();
  }

  function gecisYaz(raw: string) {
    setGecisMetin(raw);
    const n = Number(raw);
    if (raw !== '' && !Number.isNaN(n) && n >= 2 && n <= 60) {
      heroGuncelle({ ...hero, gecisSuresiSn: n });
    }
  }

  function gecisBlur() {
    const n = Number(gecisMetin);
    if (gecisMetin === '' || Number.isNaN(n) || n < 2) {
      setGecisMetin(String(HERO_VARSAYILAN_GECIS_SN));
      heroGuncelle({ ...hero, gecisSuresiSn: HERO_VARSAYILAN_GECIS_SN });
      return;
    }
    const v = Math.min(60, Math.max(2, n));
    setGecisMetin(String(v));
    heroGuncelle({ ...hero, gecisSuresiSn: v });
  }

  const editorEtiket = gorunum === 'editor' && seciliSlide ? 'Düzenleme' : 'Yeni Slider';

  if (yukleniyor) {
    return (
      <AdminModulKabuk onizleGoster={false}>
        <YukleniyorDurumu mesaj="Hero ayarları yükleniyor..." />
      </AdminModulKabuk>
    );
  }
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  return (
    <AdminModulKabuk
      onizleGoster={false}
      ustIcerik={
        <AdminPilSekme
          sekmeler={[
            { id: 'liste', etiket: 'Slider Listesi', ikon: <ListeIkon /> },
            {
              id: 'editor',
              etiket: editorEtiket,
              ikon: gorunum === 'editor' && seciliSlide ? <DuzenlemeIkon /> : <YeniIkon />,
            },
            { id: 'kartlar', etiket: 'Güven Kartları', ikon: <KartIkon /> },
          ]}
          aktif={gorunum}
          onDegistir={gorunumDegistir}
        />
      }
    >
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      {gorunum === 'liste' && (
        <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
          <div className="ap-sidebar-baslik">
            <div>
              <h2 className="ap-heading text-sm font-semibold">Hero sliderlar</h2>
              <p className="ap-muted text-xs">{hero.sliderlar.length} kayıt</p>
            </div>
            <label className="ap-hero-gecis">
              <span>Geçiş</span>
              <input
                type="number"
                min={2}
                max={60}
                className={formInputSinifi}
                value={gecisMetin}
                onChange={(e) => gecisYaz(e.target.value)}
                onBlur={gecisBlur}
              />
              <span>sn</span>
            </label>
          </div>
          <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
            {hero.sliderlar.length === 0 ? (
              <AdminBosDurum
                ikon={<AdminFlatIkon ad="hero" boyut={28} />}
                baslik="Henüz slider yok"
                aciklama="Üstten Yeni Slider ile başlayın"
              />
            ) : (
              hero.sliderlar.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ap-liste-oge ap-hero-liste-oge${seciliSlideId === s.id ? ' ap-liste-oge-secili' : ''}`}
                  onClick={() => setSeciliSlideId(s.id)}
                  onDoubleClick={() => {
                    setSeciliSlideId(s.id);
                    setGorunum('editor');
                  }}
                  title="Düzenlemek için çift tıklayın"
                >
                  {s.gorselUrl ? (
                    <img src={medyaTamUrl(s.gorselUrl)} alt="" className="ap-hero-liste-kapak" />
                  ) : (
                    <span className="ap-hero-liste-kapak ap-hero-liste-kapak--bos text-[0px]" aria-hidden>
                      <AdminFlatIkon ad="hero" boyut={20} />
                      🏠
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="ap-liste-oge-baslik">{s.baslik.trim() || `Slider ${i + 1}`}</span>
                    <span className="ap-liste-oge-alt">{stilAdi(s.stil)}</span>
                    <span className="ap-liste-oge-etiketler mt-1.5">
                      {s.aktif ? (
                        <AdminDurumEtiketi tur="yayinda">Aktif</AdminDurumEtiketi>
                      ) : (
                        <AdminDurumEtiketi tur="pasif">Kapalı</AdminDurumEtiketi>
                      )}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>
      )}

      {gorunum === 'editor' && seciliSlide && (
        <SlideDuzenlemeForm
          slide={seciliSlide}
          siraNo={hero.sliderlar.findIndex((s) => s.id === seciliSlide.id) + 1}
          slideGuncelle={slideGuncelle}
        />
      )}

      {gorunum === 'kartlar' && (
        <div className="ap-editor-panel ap-hero-kartlar">
          <div className="ap-hero-editor-ust">
            <div>
              <h2 className="ap-heading text-sm font-semibold">Güven kartları</h2>
              <p className="ap-muted text-xs">Slider altındaki ikonlu kutular</p>
            </div>
            <div className={`ap-hero-aktif-anahtar${hero.kartlarAktif ? ' ap-hero-aktif-anahtar--acik' : ''}`}>
              <AdminAnahtarDugme
                etiket="Göster"
                acik={hero.kartlarAktif}
                onDegistir={(kartlarAktif) => heroGuncelle({ ...hero, kartlarAktif })}
              />
            </div>
          </div>
          {hero.kartlarAktif && (
            <div className="ap-hero-kart-liste">
              {hero.kartlar.map((kart) => (
                <div key={kart.id} className="ap-hero-kart-satir">
                  <SayfaIkonSecici ikon={kart.ikon} onChange={(ikon) => kartGuncelle(kart.id, { ikon })} />
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
                  <input
                    className={formInputSinifi}
                    value={kart.link ?? ''}
                    onChange={(e) => kartGuncelle(kart.id, { link: e.target.value })}
                    placeholder="Link"
                  />
                  <button
                    type="button"
                    onClick={() => kartSil(kart.id)}
                    disabled={hero.kartlar.length <= 1}
                    className="ap-hero-kart-sil"
                  >
                    Sil
                  </button>
                </div>
              ))}
              <button type="button" onClick={kartEkle} className="ap-hero-kart-ekle">
                + Kart ekle
              </button>
            </div>
          )}
        </div>
      )}

      <HeroOnizlemeModal
        acik={onizlemeAcik}
        hero={hero}
        seciliSlide={seciliSlide}
        onKapat={() => setOnizlemeAcik(false)}
      />
    </AdminModulKabuk>
  );
}
