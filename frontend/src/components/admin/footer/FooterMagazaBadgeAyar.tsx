import { useRef, useState } from 'react';
import {
  MAGAZA_BADGE_ETIKET,
  MAGAZA_BADGE_STIL_ETIKET,
  MAGAZA_BADGE_STILLERI,
  MagazaBadgeSvg,
  type FooterMagazaBadge,
} from '@/data/footerMagazaBadgeleri';
import { LinkYoluAlani } from '@/components/form/LinkYoluAlani';
import { adminMedyaYukle, medyaTamUrl } from '@/features/admin/medyaApi';

function MagazaBadgeKarti({
  badge,
  onGuncelle,
}: {
  badge: FooterMagazaBadge;
  onGuncelle: (guncel: FooterMagazaBadge) => void;
}) {
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const ozelYukle = async (dosya: File) => {
    setYukleniyor(true);
    try {
      const medya = await adminMedyaYukle(dosya, `${badge.tip}-badge`);
      onGuncelle({
        ...badge,
        stil: 'ozel',
        ozelGorselUrl: medyaTamUrl(medya.url),
      });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="ap-sosyal-kart">
      <label className={`ap-toggle-kart mb-3 flex cursor-pointer items-center justify-between ${badge.aktif ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
        <div className="flex items-center gap-3">
          <MagazaBadgeSvg tip={badge.tip} stil={badge.stil === 'ozel' ? 'resmi-siyah' : badge.stil} className="h-9 w-auto" />
          <div>
            <p className="ap-heading text-sm font-semibold">{MAGAZA_BADGE_ETIKET[badge.tip]}</p>
            <p className="ap-muted text-xs">Mağaza rozeti</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={badge.aktif}
          onClick={() => onGuncelle({ ...badge, aktif: !badge.aktif })}
          className={`ap-toggle ${badge.aktif ? 'ap-toggle-on' : ''}`}
        >
          <span className="ap-toggle-thumb" />
        </button>
      </label>

      {badge.aktif && (
        <>
          <div className="ap-sosyal-ikon-secim">
            <p className="ap-muted mb-2 text-xs font-medium uppercase tracking-wide">Rozet stili</p>
            <div className="flex flex-wrap gap-2">
              {MAGAZA_BADGE_STILLERI.map((stil) => (
                <button
                  key={stil}
                  type="button"
                  onClick={() => onGuncelle({ ...badge, stil, ozelGorselUrl: undefined })}
                  className={`ap-sosyal-ikon-btn ${badge.stil === stil ? 'ap-sosyal-ikon-btn-secili' : ''}`}
                  title={MAGAZA_BADGE_STIL_ETIKET[stil]}
                >
                  <MagazaBadgeSvg tip={badge.tip} stil={stil} className="h-7 w-auto" />
                  <span className="text-[10px] text-[var(--ap-text-muted)]">{MAGAZA_BADGE_STIL_ETIKET[stil]}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => dosyaRef.current?.click()}
                disabled={yukleniyor}
                className={`ap-sosyal-ikon-btn ${badge.stil === 'ozel' ? 'ap-sosyal-ikon-btn-secili' : ''}`}
              >
                {badge.ozelGorselUrl ? (
                  <img src={badge.ozelGorselUrl} alt="" className="h-7 w-auto rounded object-contain" />
                ) : (
                  <span className="text-[10px]">{yukleniyor ? '...' : 'Özel'}</span>
                )}
              </button>
              <input
                ref={dosyaRef}
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={(e) => {
                  const dosya = e.target.files?.[0];
                  if (dosya) void ozelYukle(dosya);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="ap-muted mb-1.5 block text-xs font-medium">Mağaza linki</label>
            <LinkYoluAlani
              deger={badge.url}
              onChange={(url) => onGuncelle({ ...badge, url })}
              placeholder="https://apps.apple.com/... veya https://play.google.com/..."
            />
          </div>
        </>
      )}
    </div>
  );
}

export function FooterMagazaBadgeAyar({
  magazalar,
  onDegistir,
}: {
  magazalar: FooterMagazaBadge[];
  onDegistir: (magazalar: FooterMagazaBadge[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="ap-muted text-xs font-medium uppercase tracking-wide">Uygulama mağazası rozetleri</p>
      {magazalar.map((badge) => (
        <MagazaBadgeKarti
          key={badge.tip}
          badge={badge}
          onGuncelle={(guncel) =>
            onDegistir(magazalar.map((m) => (m.tip === badge.tip ? guncel : m)))
          }
        />
      ))}
    </div>
  );
}
