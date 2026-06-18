interface SayfaBaslikGosterimiProps {
  baslik: string;
  ikon?: string | null;
  className?: string;
  ikonSinifi?: string;
}

export function SayfaBaslikGosterimi({
  baslik,
  ikon,
  className = '',
  ikonSinifi = 'sayfa-baslik-ikon',
}: SayfaBaslikGosterimiProps) {
  if (!ikon) {
    return <span className={className}>{baslik}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className={ikonSinifi} aria-hidden>
        {ikon}
      </span>
      <span>{baslik}</span>
    </span>
  );
}
