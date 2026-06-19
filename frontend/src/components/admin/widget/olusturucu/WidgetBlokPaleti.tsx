import { BLOK_PALET, type BlokIkonOgesi, type BlokTipi, type WidgetBlok } from '@/types/blokOlusturucu';
import { uid } from '@/types/widget';
import { formInputSinifi } from '@/components/form/FormAlani';

interface WidgetBlokPaletiProps {
  seciliBlok: WidgetBlok | null;
  hucreSecili: boolean;
  onParcaEkle: (tip: BlokTipi) => void;
  onBlokGuncelle: (blok: WidgetBlok) => void;
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
    const liste = ikonlar.map((o, i) => (i === index ? { ...o, ...parca } : o));
    onBlokGuncelle({ ...blok, ikonlar: liste });
  }

  function ikonEkle() {
    onBlokGuncelle({
      ...blok,
      ikonlar: [...ikonlar, { id: uid(), ikon: '✨', etiket: 'Yeni ikon' }],
    });
  }

  function ikonSil(index: number) {
    onBlokGuncelle({ ...blok, ikonlar: ikonlar.filter((_, i) => i !== index) });
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
            title="İkon (emoji)"
          />
          <input
            className={`${formInputSinifi} flex-1`}
            value={o.etiket}
            onChange={(e) => ikonGuncelle(i, { etiket: e.target.value })}
            placeholder="Etiket"
          />
          <button type="button" className="ap-olusturucu-blok-sil static" onClick={() => ikonSil(i)}>
            ×
          </button>
        </div>
      ))}
      <button type="button" className="ap-blok-mini-btn" onClick={ikonEkle}>
        + İkon ekle
      </button>
    </div>
  );
}

export function WidgetBlokPaleti({
  seciliBlok,
  hucreSecili,
  onParcaEkle,
  onBlokGuncelle,
}: WidgetBlokPaletiProps) {
  return (
    <aside className="ap-blok-palet">
      <p className="ap-blok-palet-baslik">Parçalar</p>
      <p className="ap-muted mb-3 text-xs">
        {hucreSecili ? 'Parçaya tıklayarak hücreye ekleyin.' : 'Önce ortadaki bir hücreyi seçin.'}
      </p>
      <div className="ap-blok-palet-liste">
        {BLOK_PALET.map((p) => (
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

      {seciliBlok && (
        <div className="ap-blok-duzenle">
          <p className="ap-blok-palet-baslik mt-4">Seçili parça</p>
          {(seciliBlok.tip === 'baslik' || seciliBlok.tip === 'metin' || seciliBlok.tip === 'gorsel') && (
            <label className="ap-blok-alan">
              <span className="ap-muted text-xs">{seciliBlok.tip === 'gorsel' ? 'Alt metin' : 'Metin'}</span>
              <textarea
                className={`${formInputSinifi} min-h-[72px]`}
                value={seciliBlok.metin ?? ''}
                onChange={(e) => onBlokGuncelle({ ...seciliBlok, metin: e.target.value })}
              />
            </label>
          )}
          {seciliBlok.tip === 'gorsel' && (
            <label className="ap-blok-alan">
              <span className="ap-muted text-xs">Görsel URL</span>
              <input
                className={formInputSinifi}
                value={seciliBlok.gorselUrl ?? ''}
                onChange={(e) => onBlokGuncelle({ ...seciliBlok, gorselUrl: e.target.value })}
                placeholder="https://..."
              />
            </label>
          )}
          {seciliBlok.tip === 'kart' && (
            <>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Kart başlığı</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.kartBaslik ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, kartBaslik: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Açıklama</span>
                <textarea
                  className={`${formInputSinifi} min-h-[60px]`}
                  value={seciliBlok.kartMetin ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, kartMetin: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Görsel URL (opsiyonel)</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.kartGorselUrl ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, kartGorselUrl: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Link</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.kartLink ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, kartLink: e.target.value })}
                />
              </label>
            </>
          )}
          {seciliBlok.tip === 'ikon_grup' && (
            <IkonGrupEditor blok={seciliBlok} onBlokGuncelle={onBlokGuncelle} />
          )}
          {seciliBlok.tip === 'combobox' && (
            <>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Etiket</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.comboboxEtiket ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, comboboxEtiket: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Seçenekler (her satır bir seçenek)</span>
                <textarea
                  className={`${formInputSinifi} min-h-[80px]`}
                  value={(seciliBlok.secenekler ?? []).join('\n')}
                  onChange={(e) => {
                    const secenekler = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                    onBlokGuncelle({
                      ...seciliBlok,
                      secenekler,
                      seciliSecenek: secenekler.includes(seciliBlok.seciliSecenek ?? '')
                        ? seciliBlok.seciliSecenek
                        : secenekler[0],
                    });
                  }}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Varsayılan seçim</span>
                <select
                  className={formInputSinifi}
                  value={seciliBlok.seciliSecenek ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, seciliSecenek: e.target.value })}
                >
                  {(seciliBlok.secenekler ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {seciliBlok.tip === 'toggle' && (
            <>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Etiket</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.toggleEtiket ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, toggleEtiket: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan ap-blok-toggle-satir">
                <span className="ap-muted text-xs">Varsayılan açık</span>
                <input
                  type="checkbox"
                  checked={seciliBlok.toggleAcik ?? false}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, toggleAcik: e.target.checked })}
                />
              </label>
            </>
          )}
          {seciliBlok.tip === 'tarih' && (
            <label className="ap-blok-alan">
              <span className="ap-muted text-xs">Tarih</span>
              <input
                type="date"
                className={formInputSinifi}
                value={seciliBlok.tarih ?? ''}
                onChange={(e) => onBlokGuncelle({ ...seciliBlok, tarih: e.target.value })}
              />
            </label>
          )}
          {seciliBlok.tip === 'buton' && (
            <>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Buton metni</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.butonMetni ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, butonMetni: e.target.value })}
                />
              </label>
              <label className="ap-blok-alan">
                <span className="ap-muted text-xs">Link</span>
                <input
                  className={formInputSinifi}
                  value={seciliBlok.butonLink ?? ''}
                  onChange={(e) => onBlokGuncelle({ ...seciliBlok, butonLink: e.target.value })}
                />
              </label>
            </>
          )}
          {seciliBlok.tip === 'yildiz' && (
            <label className="ap-blok-alan">
              <span className="ap-muted text-xs">Yıldız (1–5)</span>
              <input
                type="number"
                min={1}
                max={5}
                className={formInputSinifi}
                value={seciliBlok.yildiz ?? 5}
                onChange={(e) => onBlokGuncelle({ ...seciliBlok, yildiz: Number(e.target.value) })}
              />
            </label>
          )}
          {seciliBlok.tip === 'bosluk' && (
            <label className="ap-blok-alan">
              <span className="ap-muted text-xs">Boşluk (px)</span>
              <input
                type="number"
                min={4}
                max={120}
                className={formInputSinifi}
                value={seciliBlok.boslukPx ?? 16}
                onChange={(e) => onBlokGuncelle({ ...seciliBlok, boslukPx: Number(e.target.value) })}
              />
            </label>
          )}
        </div>
      )}
    </aside>
  );
}
