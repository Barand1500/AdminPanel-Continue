import {
  yeniFooterId,
  FOOTER_YUZUCU_TIP_ETIKET,
  type FooterAyarlari,
  type FooterYuzucuButon,
} from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';
import { EmojiIkonSecici } from './EmojiIkonSecici';

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

interface FooterYuzucuPanelProps {
  footer: FooterAyarlari;
  onDegistir: (footer: FooterAyarlari) => void;
}

export function FooterYuzucuPanel({ footer, onDegistir }: FooterYuzucuPanelProps) {
  const yuzucu = footer.yuzucuButonlar;
  const ogeler = [...yuzucu.ogeler].sort((a, b) => a.sira - b.sira);

  const ogeleriGuncelle = (yeniOgeler: FooterYuzucuButon[]) => {
    onDegistir({
      ...footer,
      yuzucuButonlar: { ...yuzucu, ogeler: yeniOgeler },
    });
  };

  const ogeGuncelle = (id: string, parca: Partial<FooterYuzucuButon>) => {
    ogeleriGuncelle(ogeler.map((o) => (o.id === id ? { ...o, ...parca } : o)));
  };

  return (
    <div className="space-y-3">
      <ToggleSatir
        etiket="Yüzen butonlar aktif"
        acik={yuzucu.aktif}
        onDegistir={(aktif) =>
          onDegistir({ ...footer, yuzucuButonlar: { ...yuzucu, aktif } })
        }
      />

      {yuzucu.aktif && (
        <div className="space-y-2">
          {ogeler.map((oge, i) => (
            <div
              key={oge.id}
              className="space-y-2 rounded-lg border border-[var(--ap-border)] p-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={oge.tip}
                  onChange={(e) =>
                    ogeGuncelle(oge.id, { tip: e.target.value as FooterYuzucuButon['tip'] })
                  }
                  className={`${formInputSinifi} w-auto min-w-[7rem] py-1.5 text-xs`}
                >
                  {(Object.keys(FOOTER_YUZUCU_TIP_ETIKET) as FooterYuzucuButon['tip'][]).map(
                    (tip) => (
                      <option key={tip} value={tip}>
                        {FOOTER_YUZUCU_TIP_ETIKET[tip]}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="text"
                  value={oge.baslik}
                  onChange={(e) => ogeGuncelle(oge.id, { baslik: e.target.value })}
                  className={`${formInputSinifi} min-w-0 flex-1 py-1.5 text-xs`}
                  placeholder="Başlık (tooltip)"
                />
                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={oge.aktif}
                    onChange={(e) => ogeGuncelle(oge.id, { aktif: e.target.checked })}
                  />
                  Aktif
                </label>
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => ogeleriGuncelle(siraTasi(ogeler, i, -1))}
                  className="text-xs disabled:opacity-40"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={i === ogeler.length - 1}
                  onClick={() => ogeleriGuncelle(siraTasi(ogeler, i, 1))}
                  className="text-xs disabled:opacity-40"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() =>
                    ogeleriGuncelle(ogeler.filter((o) => o.id !== oge.id).map((o, j) => ({ ...o, sira: j })))
                  }
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>

              {(oge.tip === 'link' || oge.tip === 'telefon' || oge.tip === 'whatsapp') && (
                <input
                  type="text"
                  value={oge.link}
                  onChange={(e) => ogeGuncelle(oge.id, { link: e.target.value })}
                  className={`${formInputSinifi} w-full py-1.5 text-xs`}
                  placeholder={
                    oge.tip === 'telefon'
                      ? 'Boş = site telefonu · tel:+90...'
                      : oge.tip === 'whatsapp'
                        ? 'Boş = site WhatsApp · https://wa.me/...'
                        : 'https://... veya /yol'
                  }
                />
              )}

              {oge.tip === 'link' && (
                <EmojiIkonSecici
                  deger={oge.ikon}
                  onDegistir={(ikon) => ogeGuncelle(oge.id, { ikon })}
                  oneriler={['🔗', '📧', '📞', '💬', '🛒', '⭐']}
                  etiket="İkon (opsiyonel)"
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              ogeleriGuncelle([
                ...ogeler,
                {
                  id: yeniFooterId(),
                  tip: 'link',
                  baslik: 'Yeni Buton',
                  link: '/iletisim',
                  ikon: '🔗',
                  aktif: true,
                  sira: ogeler.length,
                },
              ])
            }
            className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--ap-hover)]"
          >
            + Buton Ekle
          </button>
        </div>
      )}
    </div>
  );
}
