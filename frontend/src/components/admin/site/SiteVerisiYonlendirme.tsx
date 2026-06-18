import { Link } from 'react-router-dom';

/** Footer/header gibi modüllerde site geneli verinin nereden düzenleneceğini gösterir */
export function SiteVerisiYonlendirme({
  baslik = 'Site geneli veri',
  aciklama,
  linkMetin = 'Site Ayarları',
  linkTo = '/gt-admin/site-ayarlari',
}: {
  baslik?: string;
  aciklama: string;
  linkMetin?: string;
  linkTo?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-4">
      <p className="ap-heading text-sm font-semibold">{baslik}</p>
      <p className="ap-muted mt-1 text-xs leading-relaxed">{aciklama}</p>
      <Link
        to={linkTo}
        className="mt-2 inline-block text-xs font-semibold text-[var(--ap-accent)] hover:underline"
      >
        {linkMetin} →
      </Link>
    </div>
  );
}

function BosDeger({ etiket }: { etiket: string }) {
  return (
    <span className="ap-muted text-xs italic">
      {etiket} girilmemiş
    </span>
  );
}

export function IletisimOzetSatirlari({
  adres,
  telefon,
  email,
  whatsapp,
}: {
  adres?: string | null;
  telefon?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}) {
  const satirlar = [
    { etiket: 'Adres', deger: adres },
    { etiket: 'Telefon', deger: telefon },
    { etiket: 'E-posta', deger: email },
    { etiket: 'WhatsApp', deger: whatsapp },
  ];

  return (
    <ul className="mt-3 space-y-2 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface)] p-3 text-sm">
      {satirlar.map((s) => (
        <li key={s.etiket} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
          <span className="ap-muted w-24 shrink-0 text-xs font-medium uppercase tracking-wide">{s.etiket}</span>
          {s.deger ? (
            <span className="ap-heading break-words">{s.deger}</span>
          ) : (
            <BosDeger etiket={s.etiket} />
          )}
        </li>
      ))}
    </ul>
  );
}
