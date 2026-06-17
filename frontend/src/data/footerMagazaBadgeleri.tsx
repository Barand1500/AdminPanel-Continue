export type MagazaBadgeTipi = 'appstore' | 'playstore';
export type MagazaBadgeStili = 'resmi-siyah' | 'resmi-beyaz' | 'renkli' | 'minimal' | 'ozel';

export interface FooterMagazaBadge {
  tip: MagazaBadgeTipi;
  aktif: boolean;
  url: string;
  stil: MagazaBadgeStili;
  ozelGorselUrl?: string;
}

export const MAGAZA_BADGE_ETIKET: Record<MagazaBadgeTipi, string> = {
  appstore: 'App Store',
  playstore: 'Google Play',
};

export const MAGAZA_BADGE_STIL_ETIKET: Record<MagazaBadgeStili, string> = {
  'resmi-siyah': 'Resmi siyah',
  'resmi-beyaz': 'Resmi beyaz',
  renkli: 'Renkli',
  minimal: 'Sade ikon',
  ozel: 'Özel görsel',
};

export const MAGAZA_BADGE_STILLERI: MagazaBadgeStili[] = [
  'resmi-siyah',
  'resmi-beyaz',
  'renkli',
  'minimal',
];

export function varsayilanMagazaBadgeleri(): FooterMagazaBadge[] {
  return [
    { tip: 'appstore', aktif: false, url: '', stil: 'resmi-siyah' },
    { tip: 'playstore', aktif: false, url: '', stil: 'resmi-siyah' },
  ];
}

function magazaRenkleri(stil: MagazaBadgeStili, tip: MagazaBadgeTipi) {
  if (stil === 'resmi-beyaz') {
    return { zemin: '#ffffff', yazi: '#000000', kenar: '#e2e8f0', vurgu: tip === 'playstore' ? '#34a853' : '#000000' };
  }
  if (stil === 'renkli') {
    return tip === 'playstore'
      ? { zemin: '#01875f', yazi: '#ffffff', kenar: 'transparent', vurgu: '#ffffff' }
      : { zemin: 'linear-gradient(135deg,#555,#111)', yazi: '#ffffff', kenar: 'transparent', vurgu: '#ffffff' };
  }
  if (stil === 'minimal') {
    return { zemin: 'transparent', yazi: '#1e293b', kenar: '#cbd5e1', vurgu: tip === 'playstore' ? '#34a853' : '#000000' };
  }
  return { zemin: '#000000', yazi: '#ffffff', kenar: 'transparent', vurgu: '#ffffff' };
}

function AppleLogo({ fill }: { fill: string }) {
  return (
    <path
      fill={fill}
      d="M8.2 4.1c.4-.5 1.1-.9 1.7-.9.1.7-.2 1.4-.6 1.8-.4.5-1 .9-1.6.8-.1-.6.2-1.3.5-1.7zM7.6 5.2c-.9-.1-1.7.5-2.1.5s-1.1-.5-1.8-.5c-.9 0-1.8.5-2.3 1.3-1 1.7-.3 4.2.7 5.6.5.7 1.1 1.5 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.7 1.8-1.4c.6-.8.8-1.6.8-1.7-.1 0-1.6-.6-1.6-2.4 0-1.5 1.2-2.2 1.3-2.3-1-.7-2.3-.8-2.6-.8z"
    />
  );
}

function PlayLogo({ fill }: { fill: string }) {
  return (
    <path
      fill={fill}
      d="M3.5 2.2l9.5 5.5-9.5 5.5V2.2zm10.8 5.5l2.2 1.3-2.2 1.3V7.7z"
    />
  );
}

export function MagazaBadgeSvg({
  tip,
  stil,
  className = 'h-10 w-auto',
}: {
  tip: MagazaBadgeTipi;
  stil: MagazaBadgeStili;
  className?: string;
}) {
  const renk = magazaRenkleri(stil, tip);
  const gradientId = `magaza-${tip}-${stil}`;

  if (stil === 'minimal') {
    return (
      <svg className={className} viewBox="0 0 40 40" aria-hidden>
        <rect x="1" y="1" width="38" height="38" rx="8" fill={renk.zemin} stroke={renk.kenar} strokeWidth="1.5" />
        <g transform="translate(8 8) scale(1.1)">
          {tip === 'appstore' ? <AppleLogo fill={renk.vurgu} /> : <PlayLogo fill={renk.vurgu} />}
        </g>
      </svg>
    );
  }

  const zeminFill =
    stil === 'renkli' && tip === 'appstore' ? `url(#${gradientId})` : (renk.zemin as string);

  return (
    <svg className={className} viewBox="0 0 120 40" aria-hidden>
      {stil === 'renkli' && tip === 'appstore' && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#666" />
            <stop offset="100%" stopColor="#111" />
          </linearGradient>
        </defs>
      )}
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="39"
        rx="6"
        fill={zeminFill}
        stroke={renk.kenar !== 'transparent' ? renk.kenar : undefined}
      />
      <g transform="translate(10 8) scale(1.15)">
        {tip === 'appstore' ? <AppleLogo fill={renk.vurgu} /> : <PlayLogo fill={renk.vurgu} />}
      </g>
      {tip === 'appstore' ? (
        <>
          <text x="34" y="16" fill={renk.yazi} fontSize="7" fontFamily="system-ui,sans-serif">
            Download on the
          </text>
          <text x="34" y="28" fill={renk.yazi} fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">
            App Store
          </text>
        </>
      ) : (
        <>
          <text x="34" y="16" fill={renk.yazi} fontSize="7" fontFamily="system-ui,sans-serif">
            GET IT ON
          </text>
          <text x="34" y="28" fill={renk.yazi} fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">
            Google Play
          </text>
        </>
      )}
    </svg>
  );
}
