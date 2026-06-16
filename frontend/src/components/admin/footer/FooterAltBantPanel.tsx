import {
  yeniFooterId,
  type FooterAyarlari,
  type FooterPazaryeriOgesi,
  type FooterRozet,
} from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';
import { EmojiMetinSatiri } from './EmojiIkonSecici';

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

function siraTasi<T extends { sira: number }>(dizi: T[], index: number, yon: -1 | 1): T[] {
  const hedef = index + yon;
  if (hedef < 0 || hedef >= dizi.length) return dizi;
  const kopya = [...dizi];
  [kopya[index], kopya[hedef]] = [kopya[hedef], kopya[index]];
  return kopya.map((o, i) => ({ ...o, sira: i }));
}

interface FooterAltBantPanelProps {
  footer: FooterAyarlari;
  onDegistir: (footer: FooterAyarlari) => void;
}

export function FooterAltBantPanel({ footer, onDegistir }: FooterAltBantPanelProps) {
  const pazaryeriGuncelle = (ogeler: FooterPazaryeriOgesi[]) => {
    onDegistir({ ...footer, pazaryeri: { ...footer.pazaryeri, ogeler } });
  };

  const rozetGuncelle = (rozetler: FooterRozet[]) => {
    onDegistir({ ...footer, guvenBandi: { ...footer.guvenBandi, rozetler } });
  };

  const pazaryeriOgeleri = [...footer.pazaryeri.ogeler].sort((a, b) => a.sira - b.sira);
  const rozetler = [...footer.guvenBandi.rozetler].sort((a, b) => a.sira - b.sira);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <ToggleSatir
          etiket="Pazaryeri bandı"
          aciklama="Hepsiburada, Trendyol vb. alt bant"
          acik={footer.pazaryeri.aktif}
          onDegistir={(aktif) =>
            onDegistir({ ...footer, pazaryeri: { ...footer.pazaryeri, aktif } })
          }
        />

        {footer.pazaryeri.aktif && (
          <div className="space-y-2">
            {pazaryeriOgeleri.map((oge, i) => (
              <div
                key={oge.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--ap-border)] p-2"
              >
                <input
                  type="text"
                  value={oge.ad}
                  onChange={(e) =>
                    pazaryeriGuncelle(
                      pazaryeriOgeleri.map((o) =>
                        o.id === oge.id ? { ...o, ad: e.target.value } : o
                      )
                    )
                  }
                  className={`${formInputSinifi} min-w-0 flex-1`}
                  placeholder="Ad"
                />
                <input
                  type="text"
                  value={oge.link}
                  onChange={(e) =>
                    pazaryeriGuncelle(
                      pazaryeriOgeleri.map((o) =>
                        o.id === oge.id ? { ...o, link: e.target.value } : o
                      )
                    )
                  }
                  className={`${formInputSinifi} min-w-0 flex-1`}
                  placeholder="Link (opsiyonel)"
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={oge.aktif}
                    onChange={(e) =>
                      pazaryeriGuncelle(
                        pazaryeriOgeleri.map((o) =>
                          o.id === oge.id ? { ...o, aktif: e.target.checked } : o
                        )
                      )
                    }
                  />
                  Aktif
                </label>
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => pazaryeriGuncelle(siraTasi(pazaryeriOgeleri, i, -1))}
                  className="text-xs disabled:opacity-40"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={i === pazaryeriOgeleri.length - 1}
                  onClick={() => pazaryeriGuncelle(siraTasi(pazaryeriOgeleri, i, 1))}
                  className="text-xs disabled:opacity-40"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() =>
                    pazaryeriGuncelle(pazaryeriOgeleri.filter((o) => o.id !== oge.id).map((o, j) => ({ ...o, sira: j })))
                  }
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                pazaryeriGuncelle([
                  ...pazaryeriOgeleri,
                  {
                    id: yeniFooterId(),
                    ad: 'Yeni Pazaryeri',
                    link: '',
                    aktif: true,
                    sira: pazaryeriOgeleri.length,
                  },
                ])
              }
              className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--ap-hover)]"
            >
              + Öğe Ekle
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <ToggleSatir
          etiket="Güven bandı"
          aciklama="SSL, 3DS rozetleri ve kur gösterimi"
          acik={footer.guvenBandi.aktif}
          onDegistir={(aktif) =>
            onDegistir({ ...footer, guvenBandi: { ...footer.guvenBandi, aktif } })
          }
        />

        {footer.guvenBandi.aktif && (
          <>
            <ToggleSatir
              etiket="Kurları göster"
              aciklama="Header'daki döviz kurları footer bandında görünür"
              acik={footer.guvenBandi.kurlarGoster}
              onDegistir={(kurlarGoster) =>
                onDegistir({
                  ...footer,
                  guvenBandi: { ...footer.guvenBandi, kurlarGoster },
                })
              }
            />

            <div className="space-y-2">
              {rozetler.map((rozet, i) => (
                <EmojiMetinSatiri
                  key={rozet.id}
                  ikon={rozet.ikon}
                  metin={rozet.metin}
                  onIkonDegistir={(ikon) =>
                    rozetGuncelle(rozetler.map((r) => (r.id === rozet.id ? { ...r, ikon } : r)))
                  }
                  onMetinDegistir={(metin) =>
                    rozetGuncelle(rozetler.map((r) => (r.id === rozet.id ? { ...r, metin } : r)))
                  }
                  oneriler={['🔒', '🛡️', '✓', '⭐', '💳', '🏅']}
                  sagAlan={
                    <>
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={rozet.aktif}
                          onChange={(e) =>
                            rozetGuncelle(
                              rozetler.map((r) =>
                                r.id === rozet.id ? { ...r, aktif: e.target.checked } : r
                              )
                            )
                          }
                        />
                        Aktif
                      </label>
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => rozetGuncelle(siraTasi(rozetler, i, -1))}
                        className="text-xs disabled:opacity-40"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={i === rozetler.length - 1}
                        onClick={() => rozetGuncelle(siraTasi(rozetler, i, 1))}
                        className="text-xs disabled:opacity-40"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          rozetGuncelle(
                            rozetler.filter((r) => r.id !== rozet.id).map((r, j) => ({ ...r, sira: j }))
                          )
                        }
                        className="text-xs text-red-500"
                      >
                        ✕
                      </button>
                    </>
                  }
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  rozetGuncelle([
                    ...rozetler,
                    {
                      id: yeniFooterId(),
                      ikon: '✓',
                      metin: 'Yeni Rozet',
                      aktif: true,
                      sira: rozetler.length,
                    },
                  ])
                }
                className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--ap-hover)]"
              >
                + Rozet Ekle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
