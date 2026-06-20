import {
  BLOK_PALET,
  BLOK_PALET_KATEGORILERI,
  blokMinYukseklik,
  type BlokGorselGenislik,
  type BlokIkonOgesi,
  type BlokTipi,
  type WidgetBlok,
} from '@/types/blokOlusturucu';
import { uid } from '@/types/widget';
import { formInputSinifi } from '@/components/form/FormAlani';

interface WidgetBlokPaletiProps {
  seciliBlok: WidgetBlok | null;
  hucreSecili: boolean;
  parcaSayisi: 0 | 1 | 2 | 3 | 4;
  onOlusturucuSifirla: () => void;
  onParcaEkle: (tip: BlokTipi) => void;
  onBlokGuncelle: (blok: WidgetBlok) => void;
}

function GorselBoyutEditor({
  blok,
  onBlokGuncelle,
}: {
  blok: WidgetBlok;
  onBlokGuncelle: (blok: WidgetBlok) => void;
}) {
  const minH = blokMinYukseklik(blok.tip);

  return (
    <>
      <label className="ap-blok-alan">
        <span className="ap-muted text-xs">Yükseklik (px)</span>
        <input
          type="number"
          min={minH}
          max={600}
          className={formInputSinifi}
          value={blok.gorselYukseklikPx ?? ''}
          placeholder={String(minH)}
          onChange={(e) =>
            onBlokGuncelle({
              ...blok,
              gorselYukseklikPx: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </label>
      <label className="ap-blok-alan">
        <span className="ap-muted text-xs">Genişlik (px)</span>
        <input
          type="number"
          min={80}
          max={1200}
          className={formInputSinifi}
          value={blok.blokGenislikPx ?? ''}
          placeholder="Otomatik"
          onChange={(e) =>
            onBlokGuncelle({
              ...blok,
              blokGenislikPx: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </label>
      <label className="ap-blok-alan">
        <span className="ap-muted text-xs">Genişlik (oransal)</span>
        <select
          className={formInputSinifi}
          value={blok.gorselGenislik ?? 'tam'}
          onChange={(e) =>
            onBlokGuncelle({
              ...blok,
              gorselGenislik: e.target.value as BlokGorselGenislik,
              blokGenislikPx: undefined,
            })
          }
        >
          <option value="tam">Tam</option>
          <option value="uc_ceyrek">¾</option>
          <option value="yari">Yarı</option>
        </select>
      </label>
    </>
  );
}

function IkonGrupEditor({
  blok,
  onBlokGuncelle,
}: {
  blok: WidgetBlok;
  onBlokGuncelle: (blok: WidgetBlok) => void;
}) {
  const ikonlar = blok.ikonlar ?? [];

  function ikonGuncelle(index: number, parca: Partial<BlokIkonOgesi>) {
    onBlokGuncelle({ ...blok, ikonlar: ikonlar.map((o, i) => (i === index ? { ...o, ...parca } : o)) });
  }

  return (
    <div className="ap-blok-ikon-liste">
      {ikonlar.map((o, i) => (
        <div key={o.id} className="ap-blok-ikon-satir">
          <input
            className={`${formInputSinifi} w-10 text-center`}
            value={o.ikon}
            onChange={(e) => ikonGuncelle(i, { ikon: e.target.value })}
            maxLength={4}
          />
          <input
            className={`${formInputSinifi} flex-1`}
            value={o.etiket}
            onChange={(e) => ikonGuncelle(i, { etiket: e.target.value })}
          />
          <button
            type="button"
            className="ap-olusturucu-blok-sil static"
            onClick={() => onBlokGuncelle({ ...blok, ikonlar: ikonlar.filter((_, j) => j !== i) })}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ap-blok-mini-btn"
        onClick={() =>
          onBlokGuncelle({ ...blok, ikonlar: [...ikonlar, { id: uid(), ikon: '✨', etiket: 'Yeni' }] })
        }
      >
        + İkon ekle
      </button>
    </div>
  );
}

function SatirListesiEditor({
  blok,
  alan,
  onBlokGuncelle,
}: {
  blok: WidgetBlok;
  alan: 'listeSatirlari' | 'ozellikler';
  onBlokGuncelle: (blok: WidgetBlok) => void;
}) {
  const liste = (blok[alan] as string[] | undefined) ?? [];
  return (
    <label className="ap-blok-alan">
      <span className="ap-muted text-xs">Her satır bir madde</span>
      <textarea
        className={`${formInputSinifi} min-h-[80px]`}
        value={liste.join('\n')}
        onChange={(e) =>
          onBlokGuncelle({
            ...blok,
            [alan]: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
          })
        }
      />
    </label>
  );
}

function SeciliBlokEditor({
  blok,
  onBlokGuncelle,
}: {
  blok: WidgetBlok;
  onBlokGuncelle: (blok: WidgetBlok) => void;
}) {
  return (
    <div className="ap-blok-duzenle">
      <p className="ap-blok-palet-baslik mt-4">Seçili parça</p>
      <GorselBoyutEditor blok={blok} onBlokGuncelle={onBlokGuncelle} />

      {(blok.tip === 'baslik' || blok.tip === 'metin' || blok.tip === 'gorsel') && (
        <label className="ap-blok-alan">
          <span className="ap-muted text-xs">{blok.tip === 'gorsel' ? 'Alt metin' : 'Metin'}</span>
          <textarea
            className={`${formInputSinifi} min-h-[72px]`}
            value={blok.metin ?? ''}
            onChange={(e) => onBlokGuncelle({ ...blok, metin: e.target.value })}
          />
        </label>
      )}

      {blok.tip === 'gorsel' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Görsel URL</span>
            <input className={formInputSinifi} value={blok.gorselUrl ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, gorselUrl: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'video' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Video URL</span>
            <input className={formInputSinifi} value={blok.videoUrl ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, videoUrl: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Kapak görsel URL</span>
            <input className={formInputSinifi} value={blok.videoKapakUrl ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, videoKapakUrl: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'kart' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Kart başlığı</span>
            <input className={formInputSinifi} value={blok.kartBaslik ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, kartBaslik: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Açıklama</span>
            <textarea className={`${formInputSinifi} min-h-[60px]`} value={blok.kartMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, kartMetin: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Görsel URL</span>
            <input className={formInputSinifi} value={blok.kartGorselUrl ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, kartGorselUrl: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Link</span>
            <input className={formInputSinifi} value={blok.kartLink ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, kartLink: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'sayac' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Değer</span>
            <input type="number" className={formInputSinifi} value={blok.sayacDeger ?? 0} onChange={(e) => onBlokGuncelle({ ...blok, sayacDeger: Number(e.target.value) })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Son ek (+, % vb.)</span>
            <input className={formInputSinifi} value={blok.sayacSonEk ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, sayacSonEk: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Etiket</span>
            <input className={formInputSinifi} value={blok.sayacEtiket ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, sayacEtiket: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'fiyat' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Paket adı</span>
            <input className={formInputSinifi} value={blok.paketAd ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, paketAd: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Fiyat</span>
            <input className={formInputSinifi} value={blok.fiyatMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, fiyatMetin: e.target.value })} />
          </label>
          <SatirListesiEditor blok={blok} alan="ozellikler" onBlokGuncelle={onBlokGuncelle} />
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Buton metni</span>
            <input className={formInputSinifi} value={blok.butonMetni ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonMetni: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Buton link</span>
            <input className={formInputSinifi} value={blok.butonLink ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonLink: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'yorum_tek' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Yorum</span>
            <textarea className={`${formInputSinifi} min-h-[72px]`} value={blok.yorumMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, yorumMetin: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Ad</span>
            <input className={formInputSinifi} value={blok.yorumAd ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, yorumAd: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Firma / unvan</span>
            <input className={formInputSinifi} value={blok.yorumFirma ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, yorumFirma: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Yıldız (1–5)</span>
            <input type="number" min={1} max={5} className={formInputSinifi} value={blok.yildiz ?? 5} onChange={(e) => onBlokGuncelle({ ...blok, yildiz: Number(e.target.value) })} />
          </label>
        </>
      )}

      {blok.tip === 'link_satir' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">İkon</span>
            <input className={`${formInputSinifi} w-16`} value={blok.linkIkon ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, linkIkon: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Metin</span>
            <input className={formInputSinifi} value={blok.linkMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, linkMetin: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Link</span>
            <input className={formInputSinifi} value={blok.linkUrl ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, linkUrl: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'badge' && (
        <label className="ap-blok-alan">
          <span className="ap-muted text-xs">Rozet metni</span>
          <input className={formInputSinifi} value={blok.badgeMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, badgeMetin: e.target.value })} />
        </label>
      )}

      {blok.tip === 'liste' && <SatirListesiEditor blok={blok} alan="listeSatirlari" onBlokGuncelle={onBlokGuncelle} />}

      {blok.tip === 'cta_serit' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Metin</span>
            <input className={formInputSinifi} value={blok.ctaMetin ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, ctaMetin: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Buton metni</span>
            <input className={formInputSinifi} value={blok.butonMetni ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonMetni: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Buton link</span>
            <input className={formInputSinifi} value={blok.butonLink ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonLink: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'ikon_grup' && <IkonGrupEditor blok={blok} onBlokGuncelle={onBlokGuncelle} />}

      {blok.tip === 'combobox' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Etiket</span>
            <input className={formInputSinifi} value={blok.comboboxEtiket ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, comboboxEtiket: e.target.value })} />
          </label>
          <SatirListesiEditor
            blok={{ ...blok, listeSatirlari: blok.secenekler }}
            alan="listeSatirlari"
            onBlokGuncelle={(g) =>
              onBlokGuncelle({
                ...blok,
                secenekler: g.listeSatirlari,
                seciliSecenek: g.listeSatirlari?.includes(blok.seciliSecenek ?? '') ? blok.seciliSecenek : g.listeSatirlari?.[0],
              })
            }
          />
        </>
      )}

      {blok.tip === 'toggle' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Etiket</span>
            <input className={formInputSinifi} value={blok.toggleEtiket ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, toggleEtiket: e.target.value })} />
          </label>
          <label className="ap-blok-alan ap-blok-toggle-satir">
            <span className="ap-muted text-xs">Varsayılan açık</span>
            <input type="checkbox" checked={blok.toggleAcik ?? false} onChange={(e) => onBlokGuncelle({ ...blok, toggleAcik: e.target.checked })} />
          </label>
        </>
      )}

      {blok.tip === 'tarih' && (
        <label className="ap-blok-alan">
          <span className="ap-muted text-xs">Tarih</span>
          <input type="date" className={formInputSinifi} value={blok.tarih ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, tarih: e.target.value })} />
        </label>
      )}

      {blok.tip === 'buton' && (
        <>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Buton metni</span>
            <input className={formInputSinifi} value={blok.butonMetni ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonMetni: e.target.value })} />
          </label>
          <label className="ap-blok-alan">
            <span className="ap-muted text-xs">Link</span>
            <input className={formInputSinifi} value={blok.butonLink ?? ''} onChange={(e) => onBlokGuncelle({ ...blok, butonLink: e.target.value })} />
          </label>
        </>
      )}

      {blok.tip === 'yildiz' && (
        <label className="ap-blok-alan">
          <span className="ap-muted text-xs">Yıldız (1–5)</span>
          <input type="number" min={1} max={5} className={formInputSinifi} value={blok.yildiz ?? 5} onChange={(e) => onBlokGuncelle({ ...blok, yildiz: Number(e.target.value) })} />
        </label>
      )}

      {blok.tip === 'bosluk' && (
        <label className="ap-blok-alan">
          <span className="ap-muted text-xs">Boşluk (px)</span>
          <input type="number" min={4} max={120} className={formInputSinifi} value={blok.boslukPx ?? 16} onChange={(e) => onBlokGuncelle({ ...blok, boslukPx: Number(e.target.value) })} />
        </label>
      )}

      {blok.tip === 'ayirici' && (
        <p className="ap-muted text-xs">Yatay ayırıcı çizgi — ek ayar gerekmez.</p>
      )}

      {blok.tip === 'ayirici_dikey' && (
        <p className="ap-muted text-xs">Parçanın sağına dikey çizgi ekler (yan yana yerleşimde).</p>
      )}
    </div>
  );
}

export function WidgetBlokPaleti({
  seciliBlok,
  hucreSecili,
  parcaSayisi,
  onOlusturucuSifirla,
  onParcaEkle,
  onBlokGuncelle,
}: WidgetBlokPaletiProps) {
  return (
    <aside className="ap-blok-palet">
      <div className="ap-blok-palet-ust">
        <div className="ap-blok-palet-baslik-satir">
          <p className="ap-blok-palet-baslik">Parçalar</p>
          <button
            type="button"
            className="ap-blok-palet-temizle"
            disabled={parcaSayisi === 0}
            onClick={onOlusturucuSifirla}
          >
            Paneli Temizle
          </button>
        </div>
        <p className="ap-muted text-xs">
          {hucreSecili ? 'Parçaya tıklayarak hücreye ekleyin.' : 'Önce ortadaki bir hücreyi seçin.'}
        </p>
      </div>

      <div className="ap-scroll ap-blok-palet-scroll">
        {BLOK_PALET_KATEGORILERI.map((kat) => {
          const ogeler = BLOK_PALET.filter((p) => p.kategori === kat.id);
          if (ogeler.length === 0) return null;
          return (
            <div key={kat.id} className="ap-blok-palet-kategori">
              <p className="ap-blok-palet-kategori-baslik">{kat.etiket}</p>
              <div className="ap-blok-palet-liste">
                {ogeler.map((p) => (
                  <button
                    key={p.tip}
                    type="button"
                    className="ap-blok-palet-oge"
                    disabled={!hucreSecili}
                    onClick={() => onParcaEkle(p.tip)}
                  >
                    <span className="ap-blok-palet-ikon" aria-hidden>
                      {p.ikon}
                    </span>
                    <span>{p.etiket}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {seciliBlok && <SeciliBlokEditor blok={seciliBlok} onBlokGuncelle={onBlokGuncelle} />}
      </div>
    </aside>
  );
}
