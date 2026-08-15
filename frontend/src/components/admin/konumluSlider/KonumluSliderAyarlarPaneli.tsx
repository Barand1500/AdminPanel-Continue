import { formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminAnahtarDugme } from '@/components/admin/ortak/AdminFormBilesenleri';
import type { KonumluSliderBolge, KonumluSliderConfig, KonumluSliderKayit } from '@/types/konumluSlider';
import { KONUMLU_SLIDER_KONUM_ETIKET } from '@/types/konumluSlider';
import { uid } from '@/types/widget';
import { ustAltKonumMu, yanKonumMu } from '@/utils/konumluSliderYerlesim';

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

export function SliderSlaytListesi({
  config,
  onChange,
}: {
  config: KonumluSliderConfig;
  onChange: (config: KonumluSliderConfig) => void;
}) {
  const butonGoster = config.gorunum.butonGoster;

  function slaytEkle() {
    onChange({
      ...config,
      slaytlar: [
        ...config.slaytlar,
        {
          id: uid(),
          gorselUrl: '',
          baslik: '',
          sira: config.slaytlar.length + 1,
          aktif: true,
        },
      ],
    });
  }

  function slaytGuncelle(id: string, parcalar: Partial<KonumluSliderConfig['slaytlar'][0]>) {
    onChange({
      ...config,
      slaytlar: config.slaytlar.map((s) => (s.id === id ? { ...s, ...parcalar } : s)),
    });
  }

  function slaytSil(id: string) {
    onChange({ ...config, slaytlar: config.slaytlar.filter((s) => s.id !== id) });
  }

  return (
    <div className="ap-slider-slaytlar">
      <div className="ap-slider-slayt-ust">
        <p className="ap-muted text-xs">{config.slaytlar.length} slayt</p>
        <button type="button" className="ap-slider-ekle-btn" onClick={slaytEkle}>
          + Slayt ekle
        </button>
      </div>

      {config.slaytlar.length === 0 && (
        <p className="ap-muted text-sm">Henüz slayt yok. Görsel eklemek için yukarıdaki düğmeyi kullanın.</p>
      )}

      {config.slaytlar.map((s, i) => (
        <div key={s.id} className="ap-slider-slayt-kart">
          <div className="ap-slider-slayt-kart-ust">
            <span>Slayt {i + 1}</span>
            <button type="button" className="ap-slider-slayt-sil" onClick={() => slaytSil(s.id)}>
              Kaldır
            </button>
          </div>
          <GorselAlan etiket="Görsel" deger={s.gorselUrl} onChange={(v) => slaytGuncelle(s.id, { gorselUrl: v })} />
          <input
            className={formInputSinifi}
            placeholder="Başlık (isteğe bağlı)"
            value={s.baslik ?? ''}
            onChange={(e) => slaytGuncelle(s.id, { baslik: e.target.value })}
          />
          {butonGoster && (
            <>
              <input
                className={formInputSinifi}
                placeholder="Buton metni"
                value={s.butonMetni ?? ''}
                onChange={(e) => slaytGuncelle(s.id, { butonMetni: e.target.value })}
              />
              <input
                className={formInputSinifi}
                placeholder="Buton linki"
                value={s.butonLink ?? ''}
                onChange={(e) => slaytGuncelle(s.id, { butonLink: e.target.value })}
              />
            </>
          )}
          <AdminAnahtarDugme
            acik={s.aktif}
            onDegistir={(v) => slaytGuncelle(s.id, { aktif: v })}
            etiket="Aktif"
          />
        </div>
      ))}
    </div>
  );
}

function GorunumPil<T extends string>({
  etiket,
  secenekler,
  deger,
  onDegistir,
}: {
  etiket: string;
  secenekler: { id: T; ad: string }[];
  deger: T;
  onDegistir: (v: T) => void;
}) {
  return (
    <div className="ap-slider-gorunum-satir-ayar">
      <span className="ap-slider-gorunum-etiket">{etiket}</span>
      <div className="ap-slider-piller" role="radiogroup" aria-label={etiket}>
        {secenekler.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={deger === s.id}
            className={`ap-slider-pil${deger === s.id ? ' ap-slider-pil--aktif' : ''}`}
            onClick={() => onDegistir(s.id)}
          >
            {s.ad}
          </button>
        ))}
      </div>
    </div>
  );
}

const BUTON_KONUMLARI: { id: KonumluSliderConfig['gorunum']['butonKonumu']; ad: string }[] = [
  { id: 'sol-ust', ad: 'Sol üst' },
  { id: 'orta-ust', ad: 'Orta üst' },
  { id: 'sag-ust', ad: 'Sağ üst' },
  { id: 'sol-alt', ad: 'Sol alt' },
  { id: 'orta-alt', ad: 'Orta alt' },
  { id: 'sag-alt', ad: 'Sağ alt' },
];

export function SliderGorunumAyarlari({
  config,
  onChange,
}: {
  config: KonumluSliderConfig;
  onChange: (config: KonumluSliderConfig) => void;
}) {
  const gorunum = config.gorunum;
  const ustAlt = ustAltKonumMu(config.yerlesim.tip);

  function guncelle(parcalar: Partial<KonumluSliderConfig>) {
    onChange({ ...config, ...parcalar });
  }

  function gorunumGuncelle(parcalar: Partial<KonumluSliderConfig['gorunum']>) {
    onChange({ ...config, gorunum: { ...gorunum, ...parcalar } });
  }

  return (
    <div className="ap-slider-gorunum">
      <div className="ap-slider-gorunum-grid">
        <GorunumPil
          etiket="Yön"
          deger={config.yon}
          onDegistir={(v) => guncelle({ yon: v })}
          secenekler={[
            { id: 'dikey', ad: 'Dikey' },
            { id: 'yatay', ad: 'Yatay' },
          ]}
        />
        <GorunumPil
          etiket="Katman"
          deger={gorunum.zIndex}
          onDegistir={(v) => gorunumGuncelle({ zIndex: v })}
          secenekler={[
            { id: 'alt', ad: 'Altta' },
            { id: 'ust', ad: 'Üstte' },
          ]}
        />
        <GorunumPil
          etiket="Sığdırma"
          deger={gorunum.gorselKirpma}
          onDegistir={(v) => gorunumGuncelle({ gorselKirpma: v })}
          secenekler={[
            { id: 'kapla', ad: 'Kapla' },
            { id: 'sigdir', ad: 'Sığdır' },
            { id: 'orijinal', ad: 'Orijinal' },
          ]}
        />
        {ustAlt && (
          <GorunumPil
            etiket="Boşluk"
            deger={(config.bosluk ?? 'orta') as 'kucuk' | 'orta' | 'buyuk'}
            onDegistir={(v) => guncelle({ bosluk: v })}
            secenekler={[
              { id: 'kucuk', ad: 'Küçük' },
              { id: 'orta', ad: 'Orta' },
              { id: 'buyuk', ad: 'Büyük' },
            ]}
          />
        )}
        <div className="ap-slider-gorunum-satir-ayar">
          <span className="ap-slider-gorunum-etiket">Köşe {gorunum.borderRadius}px</span>
          <input
            type="range"
            className="ap-slider-range"
            min={0}
            max={32}
            value={gorunum.borderRadius}
            onChange={(e) => gorunumGuncelle({ borderRadius: Number(e.target.value) })}
          />
        </div>
        {!gorunum.arkaplanTransparan && (
          <div className="ap-slider-gorunum-satir-ayar">
            <span className="ap-slider-gorunum-etiket">Renk</span>
            <input
              type="color"
              className="ap-slider-renk"
              value={gorunum.arkaplanRengi ?? '#f1f5f9'}
              onChange={(e) => gorunumGuncelle({ arkaplanRengi: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="ap-slider-gorunum-satir">
        <AdminAnahtarDugme
          acik={gorunum.arkaplanTransparan}
          onDegistir={(v) => gorunumGuncelle({ arkaplanTransparan: v })}
          etiket="Arkaplan transparan"
        />
        <AdminAnahtarDugme
          acik={gorunum.butonGoster}
          onDegistir={(v) => gorunumGuncelle({ butonGoster: v })}
          etiket="Slayt butonu"
        />
      </div>

      {gorunum.butonGoster && (
        <GorunumPil
          etiket="Buton"
          deger={gorunum.butonKonumu}
          onDegistir={(v) => gorunumGuncelle({ butonKonumu: v })}
          secenekler={BUTON_KONUMLARI}
        />
      )}
    </div>
  );
}
