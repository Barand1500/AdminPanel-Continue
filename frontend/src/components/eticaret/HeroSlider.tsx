import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { HeroAyarlari, HeroButonAksiyon, HeroButonKonum, HeroSlide, HeroStil } from '@/types/hero';
import { heroAyarlariBirlestir, heroGorselSinifi } from '@/types/hero';

interface HeroSliderProps {
  heroJson?: HeroAyarlari | null;
}

const KONUM_GRID: Record<HeroButonKonum, string> = {
  'ust-sol': 'col-start-1 row-start-1 items-start justify-start',
  'ust-orta': 'col-start-2 row-start-1 items-start justify-center',
  'ust-sag': 'col-start-3 row-start-1 items-start justify-end',
  'orta-sol': 'col-start-1 row-start-2 items-center justify-start',
  'orta-orta': 'col-start-2 row-start-2 items-center justify-center',
  'orta-sag': 'col-start-3 row-start-2 items-center justify-end',
  'alt-sol': 'col-start-1 row-start-3 items-end justify-start',
  'alt-orta': 'col-start-2 row-start-3 items-end justify-center',
  'alt-sag': 'col-start-3 row-start-3 items-end justify-end',
};

function HeroButon({
  metin,
  link,
  arkaPlan,
  yaziRenk,
  aksiyon = 'ayni-sekme',
  onModalAc,
  sinif = 'inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90',
  okGoster = false,
}: {
  metin: string;
  link: string;
  arkaPlan: string;
  yaziRenk: string;
  aksiyon?: HeroButonAksiyon;
  onModalAc?: () => void;
  sinif?: string;
  okGoster?: boolean;
}) {
  const dis = link.startsWith('http');
  const stil = { backgroundColor: arkaPlan, color: yaziRenk };
  const icerik = (
    <>
      <span>{metin}</span>
      {okGoster ? <span aria-hidden className="ml-1.5">→</span> : null}
    </>
  );

  if (aksiyon === 'modal') {
    return (
      <button type="button" onClick={onModalAc} className={sinif} style={stil}>
        {icerik}
      </button>
    );
  }

  if (dis || aksiyon === 'yeni-sekme') {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={sinif} style={stil}>
        {icerik}
      </a>
    );
  }
  return (
    <Link to={link} className={sinif} style={stil}>
      {icerik}
    </Link>
  );
}

function HeroMetinLink({
  metin,
  link,
  aksiyon = 'ayni-sekme',
  onModalAc,
}: {
  metin: string;
  link: string;
  aksiyon?: HeroButonAksiyon;
  onModalAc?: () => void;
}) {
  const sinif = 'hero-tam-ekran-ikincil-link';

  if (aksiyon === 'modal') {
    return (
      <button type="button" onClick={onModalAc} className={sinif}>
        {metin}
      </button>
    );
  }

  if (link.startsWith('http') || aksiyon === 'yeni-sekme') {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={sinif}>
        {metin}
      </a>
    );
  }

  return (
    <Link to={link} className={sinif}>
      {metin}
    </Link>
  );
}

function HeroTamEkranBaslik({ baslik, vurgu }: { baslik: string; vurgu?: string }) {
  const satirlar = baslik.split('\n').map((s) => s.trim()).filter(Boolean);
  return (
    <h1 className="hero-tam-ekran-baslik">
      {satirlar.map((satir) => (
        <span key={satir} className="block">
          {satir}
        </span>
      ))}
      {vurgu?.trim() ? <span className="hero-tam-ekran-baslik-vurgu block">{vurgu}</span> : null}
    </h1>
  );
}

function HeroSaatWidget() {
  const [simdi, setSimdi] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setSimdi(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const saat = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(simdi);
  const tarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(simdi);

  return (
    <div className="hero-tam-ekran-saat" aria-live="polite">
      <p className="hero-tam-ekran-saat-saat">{saat}</p>
      <p className="hero-tam-ekran-saat-tarih">{tarih}</p>
    </div>
  );
}

function TamEkranSlideIcerik({ slide, onModalAc }: { slide: HeroSlide; onModalAc?: () => void }) {
  const aksiyon = slide.butonAksiyon ?? 'ayni-sekme';
  const ikinciAksiyon = slide.ikinciButonAksiyon ?? 'ayni-sekme';

  const birincilButon =
    slide.butonAktif && slide.butonMetni && slide.butonLink ? (
      <HeroButon
        metin={slide.butonMetni}
        link={slide.butonLink}
        arkaPlan={slide.butonRenk}
        yaziRenk={slide.butonYaziRenk}
        aksiyon={aksiyon}
        onModalAc={onModalAc}
        okGoster
        sinif="hero-tam-ekran-birincil-btn"
      />
    ) : null;

  const ikinciButon =
    slide.ikinciButonAktif && slide.ikinciButonMetni && slide.ikinciButonLink ? (
      <HeroMetinLink
        metin={slide.ikinciButonMetni}
        link={slide.ikinciButonLink}
        aksiyon={ikinciAksiyon}
        onModalAc={onModalAc}
      />
    ) : null;

  return (
    <div className="hero-tam-ekran-katman">
      <div className="hero-tam-ekran-overlay" aria-hidden />
      <div className="hero-tam-ekran-icerik">
        <div className="container-site">
          <div className="hero-tam-ekran-metin-blok">
            {slide.altBaslik?.trim() ? (
              <p className="hero-tam-ekran-ust-etiket">{slide.altBaslik}</p>
            ) : null}
            {(slide.baslik || slide.baslikVurgu) && (
              <HeroTamEkranBaslik baslik={slide.baslik} vurgu={slide.baslikVurgu} />
            )}
            {slide.aciklama?.trim() ? <p className="hero-tam-ekran-aciklama">{slide.aciklama}</p> : null}
            {(birincilButon || ikinciButon) && (
              <div className="hero-tam-ekran-cta">
                {birincilButon}
                {ikinciButon}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideIcerik({ slide, onModalAc }: { slide: HeroSlide; onModalAc?: () => void }) {
  const stil: HeroStil = slide.stil ?? 'klasik';

  if (stil === 'tam-ekran') {
    return <TamEkranSlideIcerik slide={slide} onModalAc={onModalAc} />;
  }

  const konum = slide.butonKonum ?? 'alt-sol';
  const aksiyon = slide.butonAksiyon ?? 'ayni-sekme';
  const metinBlok = (
    <div className={`flex max-w-xl flex-col gap-2 ${stil === 'ortalanmis' ? 'items-center text-center' : ''}`}>
      {slide.altBaslik && (
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-200 sm:text-sm">{slide.altBaslik}</p>
      )}
      {slide.baslik && <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{slide.baslik}</h2>}
      {slide.aciklama && <p className="text-sm text-violet-100/90 sm:text-base">{slide.aciklama}</p>}
    </div>
  );

  const buton =
    slide.butonAktif && slide.butonMetni && slide.butonLink ? (
      <HeroButon
        metin={slide.butonMetni}
        link={slide.butonLink}
        arkaPlan={slide.butonRenk}
        yaziRenk={slide.butonYaziRenk}
        aksiyon={aksiyon}
        onModalAc={onModalAc}
      />
    ) : null;

  if (stil === 'metin-solda') {
    return (
      <div className="absolute inset-0 flex">
        <div className="flex w-full max-w-lg flex-col justify-center gap-4 bg-gradient-to-r from-slate-900/90 to-slate-900/40 p-6 sm:p-10">
          {metinBlok}
          {buton && <div>{buton}</div>}
        </div>
      </div>
    );
  }

  if (stil === 'ortalanmis') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-6 text-center">
        {metinBlok}
        {buton && <div className="mt-4">{buton}</div>}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-4 sm:p-8">
      <div className={`col-span-3 row-span-3 flex p-2 ${KONUM_GRID[konum]}`}>
        <div className="flex max-w-lg flex-col gap-3">
          {(slide.baslik || slide.altBaslik || slide.aciklama) && (
            <div className="rounded-lg bg-black/40 p-4 backdrop-blur-sm">{metinBlok}</div>
          )}
          {buton}
        </div>
      </div>
    </div>
  );
}

function SliderNavigasyon({
  tamEkran,
  slide,
  sliderlar,
  aktif,
  onOnceki,
  onSonraki,
  onSec,
}: {
  tamEkran: boolean;
  slide: HeroSlide;
  sliderlar: HeroSlide[];
  aktif: number;
  onOnceki: () => void;
  onSonraki: () => void;
  onSec: (index: number) => void;
}) {
  if (sliderlar.length <= 1) return null;

  const okSinif = tamEkran ? 'hero-tam-ekran-ok' : 'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-lg shadow hover:bg-white';
  const solSinif = tamEkran ? `${okSinif} hero-tam-ekran-ok-sol` : `${okSinif} left-3`;
  const sagSinif = tamEkran ? `${okSinif} hero-tam-ekran-ok-sag` : `${okSinif} right-3`;

  const noktalar = (
    <div className={tamEkran ? 'hero-tam-ekran-noktalar' : 'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2'}>
      {sliderlar.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSec(i)}
          className={tamEkran ? `hero-tam-ekran-nokta ${i === aktif ? 'hero-tam-ekran-nokta-aktif' : ''}` : `h-2 rounded-full transition ${i === aktif ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );

  if (tamEkran) {
    return (
      <>
        <button type="button" onClick={onOnceki} className={solSinif} aria-label="Önceki">
          ‹
        </button>
        <button type="button" onClick={onSonraki} className={sagSinif} aria-label="Sonraki">
          ›
        </button>
        <div className="hero-tam-ekran-alt-sol">
          {slide.saatGoster !== false ? <HeroSaatWidget /> : null}
          {noktalar}
        </div>
      </>
    );
  }

  return (
    <>
      <button type="button" onClick={onOnceki} className={solSinif} aria-label="Önceki">
        ‹
      </button>
      <button type="button" onClick={onSonraki} className={sagSinif} aria-label="Sonraki">
        ›
      </button>
      {noktalar}
    </>
  );
}

export function HeroSlider({ heroJson }: HeroSliderProps) {
  const hero = heroAyarlariBirlestir(heroJson);
  const sliderlar = hero.sliderlar.filter((s) => s.aktif && s.gorselUrl);
  const [aktif, setAktif] = useState(0);
  const [modalAcik, setModalAcik] = useState(false);
  const sureMs = Math.max(2000, (hero.gecisSuresiSn ?? 6) * 1000);

  useEffect(() => {
    setAktif(0);
  }, [sliderlar.length]);

  useEffect(() => {
    if (sliderlar.length <= 1) return;
    const timer = setInterval(() => setAktif((i) => (i + 1) % sliderlar.length), sureMs);
    return () => clearInterval(timer);
  }, [sliderlar.length, sureMs]);

  if (sliderlar.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary/10 via-accent to-white">
        <div className="container-site flex min-h-[280px] flex-col items-center justify-center py-16 text-center sm:min-h-[360px]">
          <span className="text-6xl opacity-40">🏪</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">Mağazamız hazırlanıyor</h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Admin panelinden Hero Yönetimi ile slider ekleyebilirsiniz.
          </p>
        </div>
      </section>
    );
  }

  const slide = sliderlar[aktif];
  const tamEkran = slide.stil === 'tam-ekran';
  const modalSlide =
    slide.butonAksiyon === 'modal'
      ? slide
      : slide.ikinciButonAksiyon === 'modal' && slide.ikinciButonAktif
        ? slide
        : null;

  return (
    <>
      <section className={`relative overflow-hidden bg-slate-900 ${tamEkran ? 'hero-tam-ekran-bolum' : ''}`}>
        <div className={`relative ${tamEkran ? 'min-h-[100svh]' : 'h-[300px] sm:h-[400px] lg:h-[440px]'}`}>
          <img
            src={slide.gorselUrl}
            alt={slide.baslik || 'Slider'}
            className={heroGorselSinifi(slide.gorselKirpma, slide.gorselOdak)}
          />
          <SlideIcerik slide={slide} onModalAc={() => setModalAcik(true)} />
        </div>

        <SliderNavigasyon
          tamEkran={tamEkran}
          slide={slide}
          sliderlar={sliderlar}
          aktif={aktif}
          onOnceki={() => setAktif((i) => (i - 1 + sliderlar.length) % sliderlar.length)}
          onSonraki={() => setAktif((i) => (i + 1) % sliderlar.length)}
          onSec={setAktif}
        />
      </section>

      {modalAcik && modalSlide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal
          onClick={() => setModalAcik(false)}
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {modalSlide.baslik && <h3 className="text-xl font-bold text-slate-900">{modalSlide.baslik}</h3>}
            {modalSlide.aciklama && <p className="mt-2 text-sm text-slate-600">{modalSlide.aciklama}</p>}
            {modalSlide.butonLink && (
              <a
                href={modalSlide.butonLink}
                target={modalSlide.butonLink.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="mt-4 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {modalSlide.butonMetni || 'Devam et'}
              </a>
            )}
            <button
              type="button"
              onClick={() => setModalAcik(false)}
              className="mt-4 block text-sm text-slate-500 hover:text-slate-800"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
