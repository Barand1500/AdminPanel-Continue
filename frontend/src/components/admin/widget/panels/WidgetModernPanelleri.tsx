import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { EmojiSecici } from '@/components/form/EmojiSecici';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  configGuncelle,
  configOku,
  uid,
  type WidgetKarsilastirmaPaket,
  type WidgetKarsilastirmaSatiri,
  type WidgetMarkaLogosu,
  type WidgetSurecAdimi,
  type WidgetTimelineOgesi,
  type WidgetIkonKart,
} from '@/types/widget';
import { ListeSiralayici, SecimAlani } from './WidgetPanelOrtak';
import { FiltreEtiketYonetici } from './FiltreEtiketYonetici';
import { WidgetGorunumIcerikAlanlari } from './WidgetGorunumIcerikAlanlari';
import type { WidgetPanelProps } from './types';

export function ZamanCizelgesiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const timeline = cfg.timeline ?? [];
  return (
    <AdminFormBolumu baslik="Zaman Çizelgesi">
      <FormAlani etiket="Üst etiket"><input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <ListeSiralayici<WidgetTimelineOgesi>
        ogeler={timeline}
        onDegistir={(t) => onChange(configGuncelle(form, (c) => ({ ...c, timeline: t })))}
        yeniEkle={() => ({ id: uid(), tarih: '', baslik: '', aciklama: '' })}
        renderOge={(o, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={formInputSinifi} placeholder="Tarih (2018, Ocak 2024)" value={o.tarih} onChange={(e) => {
              const k = [...timeline]; k[i] = { ...o, tarih: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, timeline: k })));
            }} />
            <input className={formInputSinifi} placeholder="Başlık" value={o.baslik} onChange={(e) => {
              const k = [...timeline]; k[i] = { ...o, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, timeline: k })));
            }} />
            <textarea className={`${formInputSinifi} sm:col-span-2`} rows={2} placeholder="Açıklama" value={o.aciklama} onChange={(e) => {
              const k = [...timeline]; k[i] = { ...o, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, timeline: k })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function SurecAdimlariIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const adimlar = cfg.surecAdimlari ?? [];
  return (
    <AdminFormBolumu baslik="Süreç Adımları">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <ListeSiralayici<WidgetSurecAdimi>
        ogeler={adimlar}
        onDegistir={(a) => onChange(configGuncelle(form, (c) => ({ ...c, surecAdimlari: a })))}
        yeniEkle={() => ({ id: uid(), baslik: '', aciklama: '', ikon: '📌' })}
        renderOge={(a, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <EmojiSecici deger={a.ikon} onChange={(v) => {
              const k = [...adimlar]; k[i] = { ...a, ikon: v };
              onChange(configGuncelle(form, (c) => ({ ...c, surecAdimlari: k })));
            }} />
            <input className={formInputSinifi} placeholder="Başlık" value={a.baslik} onChange={(e) => {
              const k = [...adimlar]; k[i] = { ...a, baslik: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, surecAdimlari: k })));
            }} />
            <textarea className={`${formInputSinifi} sm:col-span-2`} rows={2} placeholder="Açıklama" value={a.aciklama} onChange={(e) => {
              const k = [...adimlar]; k[i] = { ...a, aciklama: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, surecAdimlari: k })));
            }} />
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function MarkaSeridiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const markalar = cfg.markalar ?? [];
  const gorunumTipi = cfg.gorunum?.gorunumTipi ?? 'logo-kayan';
  const istatistikMod = gorunumTipi === 'istatistik-kapsul';

  return (
    <AdminFormBolumu
      baslik="Marka / Partner Şeridi"
      aciklama={
        istatistikMod
          ? 'KPI kapsül şeridi — her satır bir istatistik'
          : gorunumTipi === 'egik-metin-seridi'
            ? 'Metin maddeleri eğik kayan bandda gösterilir'
            : 'Logolar yatay kayan şeritte gösterilir'
      }
    >
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      {!istatistikMod && (
        <SecimAlani
          etiket="Kaydırma hızı"
          deger={cfg.markaHizi ?? 'normal'}
          secenekler={[
            { id: 'yavas', etiket: 'Yavaş' },
            { id: 'normal', etiket: 'Normal' },
            { id: 'hizli', etiket: 'Hızlı' },
          ]}
          onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, markaHizi: v as 'yavas' | 'normal' | 'hizli' })))}
        />
      )}
      <ListeSiralayici<WidgetMarkaLogosu>
        ogeler={markalar}
        onDegistir={(m) => onChange(configGuncelle(form, (c) => ({ ...c, markalar: m })))}
        yeniEkle={() => ({ id: uid(), ad: '', gorselUrl: '', link: '' })}
        renderOge={(m, i) => (
          <div className="space-y-2">
            {!istatistikMod && (
              <GorselAlan etiket="Logo" deger={m.gorselUrl} onChange={(v) => {
                const k = [...markalar]; k[i] = { ...m, gorselUrl: v };
                onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
              }} />
            )}
            <input className={formInputSinifi} placeholder={istatistikMod ? 'Etiket (ör. Sipariş)' : 'Marka adı / metin'} value={m.ad} onChange={(e) => {
              const k = [...markalar]; k[i] = { ...m, ad: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
            }} />
            {istatistikMod && (
              <>
                <input className={formInputSinifi} placeholder="Değer (ör. 247)" value={m.deger ?? ''} onChange={(e) => {
                  const k = [...markalar]; k[i] = { ...m, deger: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
                }} />
                <input className={formInputSinifi} placeholder="Son ek (ör. K)" value={m.sonEk ?? ''} onChange={(e) => {
                  const k = [...markalar]; k[i] = { ...m, sonEk: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
                }} />
                <input className={formInputSinifi} placeholder="Trend (ör. ↑ %32)" value={m.trend ?? ''} onChange={(e) => {
                  const k = [...markalar]; k[i] = { ...m, trend: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
                }} />
                <input className={formInputSinifi} placeholder="Durum etiketi (ör. Aktif)" value={m.durumEtiketi ?? ''} onChange={(e) => {
                  const k = [...markalar]; k[i] = { ...m, durumEtiketi: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
                }} />
              </>
            )}
            {!istatistikMod && (
              <input className={formInputSinifi} placeholder="Link (opsiyonel)" value={m.link ?? ''} onChange={(e) => {
                const k = [...markalar]; k[i] = { ...m, link: e.target.value };
                onChange(configGuncelle(form, (c) => ({ ...c, markalar: k })));
              }} />
            )}
          </div>
        )}
      />
    </AdminFormBolumu>
  );
}

export function KarsilastirmaTablosuIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const paketler = cfg.karsilastirmaPaketler ?? [];
  const satirlar = cfg.karsilastirmaSatirlari ?? [];

  function hucreGuncelle(satirIndex: number, paketIndex: number, deger: string) {
    const k = satirlar.map((s) => ({ ...s, hucreler: [...s.hucreler] }));
    while (k[satirIndex].hucreler.length < paketler.length) k[satirIndex].hucreler.push('');
    k[satirIndex].hucreler[paketIndex] = deger;
    onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaSatirlari: k })));
  }

  return (
    <AdminFormBolumu baslik="Karşılaştırma Tablosu">
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <p className="ap-muted mb-2 text-xs font-semibold uppercase">Paket sütunları</p>
      <ListeSiralayici<WidgetKarsilastirmaPaket>
        ogeler={paketler}
        onDegistir={(p) => onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaPaketler: p })))}
        yeniEkle={() => ({ id: uid(), ad: '', fiyat: '', oneCikan: false })}
        renderOge={(p, i) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={formInputSinifi} placeholder="Paket adı" value={p.ad} onChange={(e) => {
              const k = [...paketler]; k[i] = { ...p, ad: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaPaketler: k })));
            }} />
            <input className={formInputSinifi} placeholder="Fiyat" value={p.fiyat} onChange={(e) => {
              const k = [...paketler]; k[i] = { ...p, fiyat: e.target.value };
              onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaPaketler: k })));
            }} />
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={p.oneCikan} onChange={(e) => {
                const k = [...paketler]; k[i] = { ...p, oneCikan: e.target.checked };
                onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaPaketler: k })));
              }} />
              Öne çıkan sütun
            </label>
          </div>
        )}
      />
      {paketler.length > 0 && (
        <>
          <p className="ap-muted mb-2 mt-4 text-xs font-semibold uppercase">Özellik satırları</p>
          <ListeSiralayici<WidgetKarsilastirmaSatiri>
            ogeler={satirlar}
            onDegistir={(s) => onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaSatirlari: s })))}
            yeniEkle={() => ({ id: uid(), ozellik: '', hucreler: paketler.map(() => '') })}
            renderOge={(s, i) => (
              <div className="space-y-2">
                <input className={formInputSinifi} placeholder="Özellik adı" value={s.ozellik} onChange={(e) => {
                  const k = [...satirlar]; k[i] = { ...s, ozellik: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, karsilastirmaSatirlari: k })));
                }} />
                <div className="grid gap-2 sm:grid-cols-3">
                  {paketler.map((p, pi) => (
                    <input key={p.id} className={formInputSinifi} placeholder={p.ad || `Sütun ${pi + 1}`} value={s.hucreler[pi] ?? ''} onChange={(e) => hucreGuncelle(i, pi, e.target.value)} />
                  ))}
                </div>
                <p className="ap-muted text-xs">Hücrede ✓, ✗ veya metin yazın</p>
              </div>
            )}
          />
        </>
      )}
    </AdminFormBolumu>
  );
}

export function GeriSayimIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Geri Sayım Kampanyası">
      <FormAlani etiket="Üst etiket"><input className={formInputSinifi} value={form.altBaslik} onChange={(e) => onChange({ ...form, altBaslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <FormAlani etiket="Bitiş tarihi" aciklama="ISO format: 2026-12-31T23:59">
        <input type="datetime-local" className={formInputSinifi} value={cfg.bitisTarihi?.slice(0, 16) ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, bitisTarihi: e.target.value ? new Date(e.target.value).toISOString() : '' })))} />
      </FormAlani>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="Buton metni"><input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} /></FormAlani>
        <FormAlani etiket="Buton link"><input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} /></FormAlani>
      </div>
    </AdminFormBolumu>
  );
}

export function VideoBannerIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Video Banner">
      <SecimAlani etiket="Video tipi" deger={cfg.videoTip ?? 'youtube'} secenekler={[{ id: 'youtube', etiket: 'YouTube' }, { id: 'dosya', etiket: 'Dosya URL' }]} onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, videoTip: v as 'youtube' | 'dosya' })))} />
      <FormAlani etiket="Video URL"><input className={formInputSinifi} value={cfg.videoUrl ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, videoUrl: e.target.value })))} placeholder="https://youtube.com/watch?v=..." /></FormAlani>
      <GorselAlan etiket="Poster görseli (opsiyonel)" deger={form.gorselUrl} onChange={(v) => onChange({ ...form, gorselUrl: v })} />
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormAlani etiket="Buton"><input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} /></FormAlani>
        <FormAlani etiket="Link"><input className={formInputSinifi} value={form.butonLink} onChange={(e) => onChange({ ...form, butonLink: e.target.value })} /></FormAlani>
      </div>
    </AdminFormBolumu>
  );
}

export function OncesiSonrasiIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Öncesi / Sonrası görselleri">
      <GorselAlan etiket="Önce görseli" deger={cfg.onceGorsel ?? ''} onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, onceGorsel: v })))} />
      <GorselAlan etiket="Sonra görseli" deger={cfg.sonraGorsel ?? ''} onChange={(v) => onChange(configGuncelle(form, (c) => ({ ...c, sonraGorsel: v })))} />
    </AdminFormBolumu>
    </>
  );
}

export function BultenKayitIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  return (
    <AdminFormBolumu baslik="Bülten Kayıt">
      <FormAlani etiket="Başlık"><input className={formInputSinifi} value={form.baslik} onChange={(e) => onChange({ ...form, baslik: e.target.value })} /></FormAlani>
      <FormAlani etiket="Açıklama"><textarea className={formInputSinifi} rows={2} value={form.aciklama} onChange={(e) => onChange({ ...form, aciklama: e.target.value })} /></FormAlani>
      <FormAlani etiket="E-posta placeholder"><input className={formInputSinifi} value={cfg.bultenPlaceholder ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, bultenPlaceholder: e.target.value })))} /></FormAlani>
      <FormAlani etiket="Buton metni"><input className={formInputSinifi} value={form.butonMetni} onChange={(e) => onChange({ ...form, butonMetni: e.target.value })} /></FormAlani>
      <FormAlani etiket="KVKK / bilgilendirme metni"><textarea className={formInputSinifi} rows={2} value={cfg.bultenKvkk ?? ''} onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, bultenKvkk: e.target.value })))} /></FormAlani>
    </AdminFormBolumu>
  );
}

export function UcretsizDenemeIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const ozellikler = cfg.ikonKartlar ?? [];
  const roller = cfg.rolSecenekleri ?? [];
  return (
    <>
      <WidgetGorunumIcerikAlanlari form={form} onChange={onChange} />
      <AdminFormBolumu baslik="Form Ayarları">
        <FormAlani etiket="Form slug (API)">
          <input
            className={formInputSinifi}
            placeholder="ucretsiz-deneme"
            value={cfg.formSlug ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, formSlug: e.target.value })))}
          />
        </FormAlani>
        <FormAlani etiket="KVKK / bilgilendirme metni">
          <textarea
            className={formInputSinifi}
            rows={2}
            value={cfg.bultenKvkk ?? ''}
            onChange={(e) => onChange(configGuncelle(form, (c) => ({ ...c, bultenKvkk: e.target.value })))}
          />
        </FormAlani>
      </AdminFormBolumu>
      <AdminFormBolumu baslik="Özellikler" aciklama="Sol taraftaki avantaj listesi (ikon + metin)">
        <ListeSiralayici<WidgetIkonKart>
          ogeler={ozellikler}
          onDegistir={(k) => onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: k })))}
          yeniEkle={() => ({ id: uid(), ikon: '🎧', metin: '' })}
          renderOge={(k, i) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={formInputSinifi}
                placeholder="İkon (emoji)"
                value={k.ikon}
                onChange={(e) => {
                  const kopya = [...ozellikler];
                  kopya[i] = { ...k, ikon: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }}
              />
              <input
                className={formInputSinifi}
                placeholder="Özellik metni"
                value={k.metin}
                onChange={(e) => {
                  const kopya = [...ozellikler];
                  kopya[i] = { ...k, metin: e.target.value };
                  onChange(configGuncelle(form, (c) => ({ ...c, ikonKartlar: kopya })));
                }}
              />
            </div>
          )}
        />
      </AdminFormBolumu>
      <AdminFormBolumu baslik="Rol Seçenekleri" aciklama="Formdaki 'İşinizdeki rolünüz' açılır listesi">
        <FiltreEtiketYonetici
          filtreler={roller}
          onChange={(r) => onChange(configGuncelle(form, (c) => ({ ...c, rolSecenekleri: r })))}
        />
      </AdminFormBolumu>
    </>
  );
}
