import type { KonumluSliderBolge, KonumluSliderConfig, KonumluSliderKayit } from '@/types/konumluSlider';
import {
  KONUMLU_SLIDER_BOSLUK_ETIKET,
  KONUMLU_SLIDER_KONUM_ETIKET,
} from '@/types/konumluSlider';
import { GorselAlan } from '@/components/form/GorselAlan';
import { uid } from '@/types/widget';
import { yanKonumMu, ustAltKonumMu } from '@/utils/konumluSliderYerlesim';

interface KonumluSliderAyarlarPaneliProps {
  config: KonumluSliderConfig;
  onChange: (config: KonumluSliderConfig) => void;
}

const formInput =
  'w-full rounded-xl border border-[var(--ap-border)] bg-[var(--ap-surface)] px-3 py-2 text-sm text-[var(--ap-text)] outline-none focus:border-[var(--ap-accent)]';

export function KonumluSliderAyarlarPaneli({ config, onChange }: KonumluSliderAyarlarPaneliProps) {
  const gorunum = config.gorunum;
  const ustAlt = ustAltKonumMu(config.yerlesim.tip);

  function guncelle(parcalar: Partial<KonumluSliderConfig>) {
    onChange({ ...config, ...parcalar });
  }

  function gorunumGuncelle(parcalar: Partial<KonumluSliderConfig['gorunum']>) {
    onChange({ ...config, gorunum: { ...gorunum, ...parcalar } });
  }

  function slaytEkle() {
    const yeni = {
      id: uid(),
      gorselUrl: '',
      baslik: '',
      sira: config.slaytlar.length + 1,
      aktif: true,
    };
    guncelle({ slaytlar: [...config.slaytlar, yeni] });
  }

  function slaytGuncelle(id: string, parcalar: Partial<KonumluSliderConfig['slaytlar'][0]>) {
    guncelle({
      slaytlar: config.slaytlar.map((s) => (s.id === id ? { ...s, ...parcalar } : s)),
    });
  }

  function slaytSil(id: string) {
    guncelle({ slaytlar: config.slaytlar.filter((s) => s.id !== id) });
  }

  return (
    <div className="ks-admin-ayarlar space-y-5">
      <section className="ks-admin-bolum">
        <h3 className="ks-admin-bolum-baslik">Yerleşim</h3>
        <p className="ks-admin-bolum-aciklama">
          {KONUMLU_SLIDER_KONUM_ETIKET[config.yerlesim.tip]} · {config.yerlesim.hedefWidgetIds.length} hedef
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="ks-admin-alan">
            <span>Yön</span>
            <select
              className={formInput}
              value={config.yon}
              onChange={(e) => guncelle({ yon: e.target.value as KonumluSliderConfig['yon'] })}
            >
              <option value="dikey">Dikey</option>
              <option value="yatay">Yatay</option>
            </select>
          </label>
          {ustAlt && (
            <label className="ks-admin-alan">
              <span>Widget arası boşluk</span>
              <select
                className={formInput}
                value={config.bosluk ?? 'orta'}
                onChange={(e) =>
                  guncelle({ bosluk: e.target.value as KonumluSliderConfig['bosluk'] })
                }
              >
                {Object.entries(KONUMLU_SLIDER_BOSLUK_ETIKET).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </section>

      <section className="ks-admin-bolum">
        <h3 className="ks-admin-bolum-baslik">Görünüm</h3>
        <div className="mt-3 space-y-3">
          <label className="ks-admin-alan">
            <span>Köşe yuvarlaklığı ({gorunum.borderRadius}px)</span>
            <input
              type="range"
              min={0}
              max={32}
              value={gorunum.borderRadius}
              onChange={(e) => gorunumGuncelle({ borderRadius: Number(e.target.value) })}
            />
          </label>

          <label className="ks-admin-switch">
            <input
              type="checkbox"
              checked={gorunum.arkaplanTransparan}
              onChange={(e) => gorunumGuncelle({ arkaplanTransparan: e.target.checked })}
            />
            <span>Arkaplan transparan</span>
          </label>

          {!gorunum.arkaplanTransparan && (
            <label className="ks-admin-alan">
              <span>Arkaplan rengi</span>
              <input
                type="color"
                className="h-10 w-full cursor-pointer rounded-lg border border-[var(--ap-border)]"
                value={gorunum.arkaplanRengi ?? '#f1f5f9'}
                onChange={(e) => gorunumGuncelle({ arkaplanRengi: e.target.value })}
              />
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="ks-admin-alan">
              <span>Katman (z-index)</span>
              <select
                className={formInput}
                value={gorunum.zIndex}
                onChange={(e) =>
                  gorunumGuncelle({ zIndex: e.target.value as KonumluSliderConfig['gorunum']['zIndex'] })
                }
              >
                <option value="alt">Altta (widget üstte)</option>
                <option value="ust">Üstte (slider önde)</option>
              </select>
            </label>
            <label className="ks-admin-alan">
              <span>Görsel sığdırma</span>
              <select
                className={formInput}
                value={gorunum.gorselKirpma}
                onChange={(e) =>
                  gorunumGuncelle({
                    gorselKirpma: e.target.value as KonumluSliderConfig['gorunum']['gorselKirpma'],
                  })
                }
              >
                <option value="kapla">Kapla</option>
                <option value="sigdir">Sığdır</option>
                <option value="orijinal">Orijinal</option>
              </select>
            </label>
          </div>

          <label className="ks-admin-switch">
            <input
              type="checkbox"
              checked={gorunum.butonGoster}
              onChange={(e) => gorunumGuncelle({ butonGoster: e.target.checked })}
            />
            <span>Slayt butonu göster</span>
          </label>

          {gorunum.butonGoster && (
            <label className="ks-admin-alan">
              <span>Buton konumu</span>
              <select
                className={formInput}
                value={gorunum.butonKonumu}
                onChange={(e) =>
                  gorunumGuncelle({
                    butonKonumu: e.target.value as KonumluSliderConfig['gorunum']['butonKonumu'],
                  })
                }
              >
                <option value="sol-alt">Sol alt</option>
                <option value="orta-alt">Orta alt</option>
                <option value="sag-alt">Sağ alt</option>
                <option value="sol-ust">Sol üst</option>
                <option value="orta-ust">Orta üst</option>
                <option value="sag-ust">Sağ üst</option>
              </select>
            </label>
          )}
        </div>
      </section>

      <section className="ks-admin-bolum">
        <div className="flex items-center justify-between gap-2">
          <h3 className="ks-admin-bolum-baslik">Slaytlar</h3>
          <button type="button" className="ks-admin-btn ks-admin-btn--ghost" onClick={slaytEkle}>
            + Slayt ekle
          </button>
        </div>
        <div className="mt-3 space-y-4">
          {config.slaytlar.length === 0 && (
            <p className="text-sm text-[var(--ap-muted)]">En az bir slayt görseli ekleyin.</p>
          )}
          {config.slaytlar.map((s, i) => (
            <div key={s.id} className="ks-admin-slayt-kart">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ap-muted)]">
                  Slayt {i + 1}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => slaytSil(s.id)}
                >
                  Sil
                </button>
              </div>
              <GorselAlan
                etiket="Görsel"
                deger={s.gorselUrl}
                onChange={(v) => slaytGuncelle(s.id, { gorselUrl: v })}
              />
              <input
                className={formInput}
                placeholder="Başlık (isteğe bağlı)"
                value={s.baslik ?? ''}
                onChange={(e) => slaytGuncelle(s.id, { baslik: e.target.value })}
              />
              {gorunum.butonGoster && (
                <>
                  <input
                    className={formInput}
                    placeholder="Buton metni"
                    value={s.butonMetni ?? ''}
                    onChange={(e) => slaytGuncelle(s.id, { butonMetni: e.target.value })}
                  />
                  <input
                    className={formInput}
                    placeholder="Buton linki"
                    value={s.butonLink ?? ''}
                    onChange={(e) => slaytGuncelle(s.id, { butonLink: e.target.value })}
                  />
                </>
              )}
              <label className="ks-admin-switch">
                <input
                  type="checkbox"
                  checked={s.aktif}
                  onChange={(e) => slaytGuncelle(s.id, { aktif: e.target.checked })}
                />
                <span>Aktif</span>
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function konumSecimOzeti(config: KonumluSliderConfig) {
  const tip = KONUMLU_SLIDER_KONUM_ETIKET[config.yerlesim.tip];
  if (yanKonumMu(config.yerlesim.tip)) {
    return `${tip} · ${config.yerlesim.hedefWidgetIds.length} bitişik widget`;
  }
  return tip;
}

export function sliderListeOzeti(slider: KonumluSliderKayit) {
  const cfg = slider.configJson;
  if (!cfg) return slider.ad;
  const slayt = cfg.slaytlar.filter((s) => s.aktif).length;
  return `${slider.ad} · ${konumSecimOzeti(cfg)} · ${slayt} slayt`;
}

export function bolgeEtiketi(bolge: KonumluSliderBolge) {
  const map: Record<string, string> = {
    header: 'Header',
    footer: 'Footer',
    sayfa_ustu: 'Sayfa üstü',
    sayfa_alti: 'Sayfa altı',
    header_alti: 'Header altı',
    slider_alti: 'Hero altı',
    icerik_alani: 'İçerik alanı',
    footer_ustu: 'Footer üstü',
  };
  return map[bolge] ?? bolge;
}
