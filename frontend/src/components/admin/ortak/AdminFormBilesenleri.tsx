import { useState, type ReactNode } from 'react';
import { formInputSinifi } from '@/components/form/FormAlani';

export function AdminIstatistikKarti({
  etiket,
  deger,
  ikon,
  vurgu,
}: {
  etiket: string;
  deger: number | string;
  ikon: string;
  vurgu?: 'yesil' | 'mavi' | 'amber' | 'gri';
}) {
  const vurguSinif = {
    yesil: 'ap-stat-yesil',
    mavi: 'ap-stat-mavi',
    amber: 'ap-stat-amber',
    gri: 'ap-stat-gri',
  }[vurgu ?? 'gri'];

  return (
    <div className={`ap-stat-kart ${vurguSinif}`}>
      <span className="ap-stat-ikon">{ikon}</span>
      <div>
        <p className="ap-stat-deger">{deger}</p>
        <p className="ap-stat-etiket">{etiket}</p>
      </div>
    </div>
  );
}

export function AdminSekmeler<T extends string>({
  sekmeler,
  aktif,
  onDegistir,
}: {
  sekmeler: { id: T; etiket: string; ikon?: string }[];
  aktif: T;
  onDegistir: (id: T) => void;
}) {
  return (
    <div className="ap-sekme-cubugu">
      {sekmeler.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onDegistir(s.id)}
          className={`ap-sekme ${aktif === s.id ? 'ap-sekme-aktif' : ''}`}
        >
          {s.ikon && <span>{s.ikon}</span>}
          {s.etiket}
        </button>
      ))}
    </div>
  );
}

export function AdminPilSekme<T extends string>({
  sekmeler,
  aktif,
  onDegistir,
}: {
  sekmeler: { id: T; etiket: string; ikon?: ReactNode }[];
  aktif: T;
  onDegistir: (id: T) => void;
}) {
  return (
    <div className="ap-pil-sekme" role="tablist">
      {sekmeler.map((s) => {
        const secili = aktif === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={secili}
            onClick={() => onDegistir(s.id)}
            className={`ap-pil-sekme-oge ${secili ? 'ap-pil-sekme-oge-aktif' : ''}`}
          >
            {s.ikon && <span className="ap-pil-sekme-ikon">{s.ikon}</span>}
            {s.etiket}
          </button>
        );
      })}
    </div>
  );
}

export function AdminDurumEtiketi({
  tur,
  children,
}: {
  tur: 'yayinda' | 'taslak' | 'menu' | 'pasif' | 'aktif' | 'bilgi';
  children: ReactNode;
}) {
  return <span className={`ap-etiket ap-etiket-${tur}`}>{children}</span>;
}

export function AdminAramaKutusu({
  deger,
  onChange,
  placeholder = 'Ara...',
}: {
  deger: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="ap-arama">
      <div className="ap-arama-input-wrap">
        <span className="ap-arama-ikon">🔍</span>
        <input
          type="search"
          value={deger}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${formInputSinifi} ap-arama-input`}
        />
      </div>
    </div>
  );
}

export function AdminBosDurum({
  ikon,
  baslik,
  aciklama,
}: {
  ikon: string;
  baslik: string;
  aciklama: string;
}) {
  return (
    <div className="ap-bos-durum">
      <span className="ap-bos-ikon">{ikon}</span>
      <p className="ap-heading font-medium">{baslik}</p>
      <p className="ap-muted mt-1 text-sm">{aciklama}</p>
    </div>
  );
}

export function AdminFormBolumu({
  baslik,
  aciklama,
  children,
  akordeon = false,
  varsayilanAcik = true,
}: {
  baslik: string;
  aciklama?: string;
  children: ReactNode;
  akordeon?: boolean;
  varsayilanAcik?: boolean;
}) {
  const [acik, setAcik] = useState(varsayilanAcik);
  const govdeAcik = !akordeon || acik;

  return (
    <section className={`ap-form-bolum${akordeon ? ' ap-form-bolum--akordeon' : ''}`}>
      {akordeon ? (
        <button
          type="button"
          className="ap-form-bolum-baslik ap-form-bolum-akordeon-tus"
          aria-expanded={acik}
          onClick={() => setAcik((v) => !v)}
        >
          <span>
            <span className="ap-heading block text-sm font-semibold">{baslik}</span>
            {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
          </span>
          <span className="ap-form-bolum-akordeon-ok" aria-hidden>
            {acik ? '▾' : '▸'}
          </span>
        </button>
      ) : (
        <div className="ap-form-bolum-baslik">
          <h3 className="ap-heading text-sm font-semibold">{baslik}</h3>
          {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
        </div>
      )}
      {govdeAcik && <div className="ap-form-bolum-icerik">{children}</div>}
    </section>
  );
}

export function AdminAnahtarDugme({
  acik,
  onDegistir,
  etiket,
}: {
  acik: boolean;
  onDegistir: (v: boolean) => void;
  etiket: string;
}) {
  return (
    <div className="ap-switch flex shrink-0 items-center gap-2">
      <span className="ap-switch-etiket">{etiket}</span>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        aria-label={etiket}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDegistir(!acik);
        }}
        className={`ap-switch-track ${acik ? 'ap-switch-acik' : ''}`}
      >
        <span className="ap-switch-thumb" />
      </button>
    </div>
  );
}

/** Tip galerisi ile düzenleme arasında kaydırmalı iki ekran. */
export function AdminIkiEkranSlider({
  aktif,
  birinci,
  ikinci,
}: {
  aktif: 'bir' | 'iki';
  birinci: ReactNode;
  ikinci: ReactNode;
}) {
  return (
    <div className="ap-iki-ekran">
      <div className={`ap-iki-ekran-ray${aktif === 'iki' ? ' ap-iki-ekran-ray--iki' : ''}`}>
        <div className="ap-iki-ekran-sayfa" aria-hidden={aktif !== 'bir'} inert={aktif !== 'bir' ? true : undefined}>
          {birinci}
        </div>
        <div className="ap-iki-ekran-sayfa" aria-hidden={aktif !== 'iki'} inert={aktif !== 'iki' ? true : undefined}>
          {ikinci}
        </div>
      </div>
    </div>
  );
}

export function slugUret(baslik: string): string {
  const harita: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return baslik
    .trim()
    .split('')
    .map((c) => harita[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
