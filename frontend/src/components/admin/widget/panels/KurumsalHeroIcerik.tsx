import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { LinkYoluAlani } from '@/components/form/LinkYoluAlani';
import { AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { configGuncelle, configOku } from '@/types/widget';
import {
  bosKurumsalHeroSlayt,
  KURUMSAL_HERO_VARSAYILAN_GECIS_SN,
  KURUMSAL_HERO_VARSAYILAN_OVERLAY,
  KURUMSAL_HERO_YUKSEKLIKLER,
  kurumsalHeroConfigOku,
  type KurumsalHeroSlayt,
} from '@/types/kurumsalHero';
import { ListeSiralayici, SecimAlani } from './WidgetPanelOrtak';
import type { WidgetPanelProps } from './types';

export function KurumsalHeroIcerik({ form, onChange }: WidgetPanelProps) {
  const cfg = configOku(form);
  const kh = kurumsalHeroConfigOku(cfg);
  const slaytlar = kh.slaytlar;

  const khGuncelle = (guncelle: (mevcut: typeof kh) => typeof kh) => {
    onChange(
      configGuncelle(form, (c) => ({
        ...c,
        kurumsalHero: guncelle(kurumsalHeroConfigOku(c)),
      }))
    );
  };

  const slaytGuncelle = (index: number, slayt: KurumsalHeroSlayt) => {
    const kopya = [...slaytlar];
    kopya[index] = slayt;
    khGuncelle((k) => ({ ...k, slaytlar: kopya }));
  };

  return (
    <>
      <AdminFormBolumu baslik="Kurumsal Hero Ayarları" aciklama="Vetahsilat tarzı header+slider birleşimi">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormAlani etiket="Geçiş süresi (sn)">
            <input
              type="number"
              min={2}
              max={30}
              className={formInputSinifi}
              value={kh.gecisSuresiSn}
              onChange={(e) =>
                khGuncelle((k) => ({
                  ...k,
                  gecisSuresiSn: Math.max(2, Number(e.target.value) || KURUMSAL_HERO_VARSAYILAN_GECIS_SN),
                }))
              }
            />
          </FormAlani>
          <SecimAlani
            etiket="Yükseklik"
            deger={kh.gorunum.yukseklik}
            secenekler={KURUMSAL_HERO_YUKSEKLIKLER.map((y) => ({ id: y.id, etiket: y.ad }))}
            onChange={(v) =>
              khGuncelle((k) => ({
                ...k,
                gorunum: { ...k.gorunum, yukseklik: v as typeof kh.gorunum.yukseklik },
              }))
            }
          />
          <FormAlani etiket="Overlay rengi">
            <input
              type="color"
              className="h-10 w-full cursor-pointer rounded border border-[var(--ap-border)]"
              value={kh.gorunum.overlayRenk || KURUMSAL_HERO_VARSAYILAN_OVERLAY}
              onChange={(e) =>
                khGuncelle((k) => ({
                  ...k,
                  gorunum: { ...k.gorunum, overlayRenk: e.target.value },
                }))
              }
            />
          </FormAlani>
          <FormAlani etiket={`Overlay opaklık (${Math.round(kh.gorunum.overlayOpaklik * 100)}%)`}>
            <input
              type="range"
              min={0.4}
              max={0.95}
              step={0.01}
              value={kh.gorunum.overlayOpaklik}
              onChange={(e) =>
                khGuncelle((k) => ({
                  ...k,
                  gorunum: { ...k.gorunum, overlayOpaklik: Number(e.target.value) },
                }))
              }
              className="w-full"
            />
          </FormAlani>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={kh.headerOverlay}
              onChange={(e) => khGuncelle((k) => ({ ...k, headerOverlay: e.target.checked }))}
            />
            Header slider üzerinde şeffaf dursun
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={kh.ustBantGoster}
              onChange={(e) => khGuncelle((k) => ({ ...k, ustBantGoster: e.target.checked }))}
            />
            Üst iletişim bandını göster
          </label>
        </div>
      </AdminFormBolumu>

      <AdminFormBolumu baslik="Slaytlar" aciklama="Arka plan görseli, metin ve butonlar">
        <ListeSiralayici<KurumsalHeroSlayt>
          ogeler={slaytlar}
          onDegistir={(yeni) => khGuncelle((k) => ({ ...k, slaytlar: yeni }))}
          yeniEkle={() => bosKurumsalHeroSlayt(slaytlar.length)}
          renderOge={(s, i) => (
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <GorselAlan
                  etiket="Arka plan görseli"
                  deger={s.arkaPlanUrl}
                  onChange={(v) => slaytGuncelle(i, { ...s, arkaPlanUrl: v })}
                />
                <GorselAlan
                  etiket="Ön plan görseli (opsiyonel)"
                  deger={s.onGorselUrl ?? ''}
                  onChange={(v) => slaytGuncelle(i, { ...s, onGorselUrl: v })}
                />
              </div>
              <input
                className={formInputSinifi}
                placeholder="Başlık"
                value={s.baslik}
                onChange={(e) => slaytGuncelle(i, { ...s, baslik: e.target.value })}
              />
              <textarea
                className={`${formInputSinifi} min-h-[80px]`}
                placeholder="Açıklama"
                rows={3}
                value={s.aciklama}
                onChange={(e) => slaytGuncelle(i, { ...s, aciklama: e.target.value })}
              />
              <div className="grid gap-2 rounded-lg border border-[var(--ap-border)] p-3 sm:grid-cols-2">
                <p className="sm:col-span-2 text-xs font-semibold text-[var(--ap-text-muted)]">Birincil buton</p>
                <input
                  className={formInputSinifi}
                  placeholder="Buton metni"
                  value={s.birincilButon?.metin ?? ''}
                  onChange={(e) =>
                    slaytGuncelle(i, {
                      ...s,
                      birincilButon: { ...s.birincilButon!, metin: e.target.value },
                    })
                  }
                />
                <FormAlani etiket="Birincil link">
                  <LinkYoluAlani
                    deger={s.birincilButon?.link ?? ''}
                    onChange={(v) =>
                      slaytGuncelle(i, {
                        ...s,
                        birincilButon: { ...s.birincilButon!, link: v },
                      })
                    }
                  />
                </FormAlani>
              </div>
              <div className="grid gap-2 rounded-lg border border-[var(--ap-border)] p-3 sm:grid-cols-2">
                <p className="sm:col-span-2 text-xs font-semibold text-[var(--ap-text-muted)]">İkincil buton</p>
                <input
                  className={formInputSinifi}
                  placeholder="Buton metni"
                  value={s.ikinciButon?.metin ?? ''}
                  onChange={(e) =>
                    slaytGuncelle(i, {
                      ...s,
                      ikinciButon: { ...(s.ikinciButon ?? { metin: '', link: '' }), metin: e.target.value },
                    })
                  }
                />
                <FormAlani etiket="İkincil link">
                  <LinkYoluAlani
                    deger={s.ikinciButon?.link ?? ''}
                    onChange={(v) =>
                      slaytGuncelle(i, {
                        ...s,
                        ikinciButon: { ...(s.ikinciButon ?? { metin: '', link: '' }), link: v },
                      })
                    }
                  />
                </FormAlani>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={s.aktif}
                  onChange={(e) => slaytGuncelle(i, { ...s, aktif: e.target.checked })}
                />
                Slayt aktif
              </label>
            </div>
          )}
        />
      </AdminFormBolumu>
    </>
  );
}
