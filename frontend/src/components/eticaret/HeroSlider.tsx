import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { HeroAyarlari, HeroButonAksiyon, HeroButonKonum, HeroSlide, HeroStil } from '@/types/hero';
import { heroAyarlariBirlestir } from '@/types/hero';

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
}: {
  metin: string;
  link: string;
  arkaPlan: string;
  yaziRenk: string;
  aksiyon?: HeroButonAksiyon;
  onModalAc?: () => void;
}) {
  const dis = link.startsWith('http');
  const stil = { backgroundColor: arkaPlan, color: yaziRenk };
  const sinif = 'inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90';

  if (aksiyon === 'modal') {
    return (
      <button type="button" onClick={onModalAc} className={sinif} style={stil}>
        {metin}
      </button>
    );
  }

  if (dis || aksiyon === 'yeni-sekme') {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={sinif} style={stil}>
        {metin}
      </a>
    );
  }
  return (
    <Link to={link} className={sinif} style={stil}>
      {metin}
    </Link>
  );
}

function SlideIcerik({ slide, onModalAc }: { slide: HeroSlide; onModalAc?: () => void }) {
  const stil: HeroStil = slide.stil ?? 'klasik';
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
  const modalSlide = slide.butonAksiyon === 'modal' ? slide : null;

  return (
    <>
    <section className="relative overflow-hidden bg-slate-900">
      <div className="relative h-[300px] sm:h-[400px] lg:h-[440px]">
        <img src={slide.gorselUrl} alt={slide.baslik || 'Slider'} className="h-full w-full object-cover" />
        <SlideIcerik slide={slide} onModalAc={() => setModalAcik(true)} />
      </div>

      {sliderlar.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setAktif((i) => (i - 1 + sliderlar.length) % sliderlar.length)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-lg shadow hover:bg-white"
            aria-label="Önceki"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setAktif((i) => (i + 1) % sliderlar.length)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-lg shadow hover:bg-white"
            aria-label="Sonraki"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {sliderlar.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAktif(i)}
                className={`h-2 rounded-full transition ${i === aktif ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>

    {modalAcik && modalSlide && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal
        onClick={() => setModalAcik(false)}
      >
        <div
          className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
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
