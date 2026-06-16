import { useCallback, useEffect, useMemo, useState } from 'react';
import { GORUNUM_TIPLERI, type GorunumTipi } from '@/types/urunYonetimi';
import {
  adminUrunGuncelle,
  adminUrunOlustur,
  adminUrunleriGetir,
  urunFormdanDoldur,
  type AdminUrun,
  type UrunFormDegeri,
} from '@/features/admin/urunApi';
import {
  kategorileriGetir,
  markalariGetir,
  ozellikAgaciniGetir,
  rozetleriGetir,
  vitrinGetir,
  vitrinKaydet,
} from '@/features/admin/urunYonetimiApi';
import type { UrunKategori, UrunMarka, UrunOzellikSablon, UrunRozet } from '@/types/urunYonetimi';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import {
  AdminPanelKarti,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { AdminIstatistikKarti } from '@/components/admin/ortak/AdminFormBilesenleri';

const bosForm: UrunFormDegeri = {
  ad: '',
  fiyat: 0,
  aciklama: '',
  gorselUrl: '',
  kategori: '',
  kategoriId: null,
  markaId: null,
  rozetIds: [],
  gorunumTipi: 'grid',
  gorseller: [],
  ozellikDegerleri: [],
  yeni: true,
  cokSatan: false,
  stokta: true,
  aktif: true,
  sira: 0,
};

export function UrunListesiSekmesi() {
  const [urunler, setUrunler] = useState<AdminUrun[]>([]);
  const [kategoriler, setKategoriler] = useState<UrunKategori[]>([]);
  const [markalar, setMarkalar] = useState<UrunMarka[]>([]);
  const [rozetler, setRozetler] = useState<UrunRozet[]>([]);
  const [sablonlar, setSablonlar] = useState<UrunOzellikSablon[]>([]);
  const [varsayilanGorunum, setVarsayilanGorunum] = useState<GorunumTipi>('grid');
  const [form, setForm] = useState<UrunFormDegeri>(bosForm);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const tumOzellikler = useMemo(
    () =>
      sablonlar.flatMap((s) =>
        s.gruplar.flatMap((g) => g.ozellikler.map((o) => ({ ...o, grupAd: g.ad, sablonAd: s.ad })))
      ),
    [sablonlar]
  );

  const istatistik = useMemo(
    () => ({
      toplam: urunler.length,
      aktif: urunler.filter((u) => u.aktif !== false).length,
      yeni: urunler.filter((u) => u.yeni).length,
      cokSatan: urunler.filter((u) => u.cokSatan).length,
    }),
    [urunler]
  );

  async function yukle() {
    setYukleniyor(true);
    try {
      const [u, k, m, r, s, v] = await Promise.all([
        adminUrunleriGetir(),
        kategorileriGetir(),
        markalariGetir(),
        rozetleriGetir(),
        ozellikAgaciniGetir(),
        vitrinGetir(),
      ]);
      setUrunler(u);
      setKategoriler(k);
      setMarkalar(m);
      setRozetler(r.filter((x) => x.aktif));
      setSablonlar(s);
      setVarsayilanGorunum(v.varsayilanGorunum);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Liste alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setBasari('');
    setHata('');
  }, []);

  const olustur = useCallback(async () => {
    if (seciliId) return;
    if (!form.ad.trim()) {
      setHata('Ürün adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await adminUrunOlustur(form);
      setBasari('Yeni ürün eklendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  const guncelle = useCallback(async () => {
    if (!seciliId) return;
    if (!form.ad.trim()) {
      setHata('Ürün adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await adminUrunGuncelle(seciliId, form);
      setBasari('Ürün güncellendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  const yayinla = useCallback(async () => {
    const guncel = { ...form, aktif: true };
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      if (seciliId) await adminUrunGuncelle(seciliId, guncel);
      else await adminUrunOlustur(guncel);
      setBasari('Ürün yayına alındı.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yayınlama başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat]);

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniBaslat,
      yayinla,
      onizle: () => window.open('/urunler', '_blank'),
    },
    {
      kaydet: !kaydediliyor && !seciliId,
      guncelle: !kaydediliyor && !!seciliId,
      ekle: true,
      yayinla: !kaydediliyor,
      onizle: true,
    }
  );

  function urunSec(u: AdminUrun) {
    setSeciliId(u.id);
    setForm(urunFormdanDoldur(u));
    setBasari('');
    setHata('');
  }

  function rozetToggle(id: string) {
    setForm((prev) => ({
      ...prev,
      rozetIds: prev.rozetIds.includes(id) ? prev.rozetIds.filter((x) => x !== id) : [...prev.rozetIds, id],
    }));
  }

  function ozellikDegerGuncelle(ozellikId: string, deger: string) {
    setForm((prev) => {
      const mevcut = prev.ozellikDegerleri.filter((x) => x.ozellikId !== ozellikId);
      if (!deger.trim()) return { ...prev, ozellikDegerleri: mevcut };
      return { ...prev, ozellikDegerleri: [...mevcut, { ozellikId, deger }] };
    });
  }

  function ozellikDegerAl(ozellikId: string): string {
    return form.ozellikDegerleri.find((x) => x.ozellikId === ozellikId)?.deger ?? '';
  }

  async function vitrinGuncelle(tip: GorunumTipi) {
    setVarsayilanGorunum(tip);
    try {
      await vitrinKaydet({ varsayilanGorunum: tip });
      setBasari('Vitrin görünümü kaydedildi.');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Vitrin kaydedilemedi');
    }
  }

  function gorselEkle(url: string) {
    if (!url.trim()) return;
    setForm((prev) => ({ ...prev, gorseller: [...prev.gorseller, url] }));
  }

  function gorselKaldir(i: number) {
    setForm((prev) => ({ ...prev, gorseller: prev.gorseller.filter((_, idx) => idx !== i) }));
  }

  if (yukleniyor) return <YukleniyorDurumu mesaj="Ürünler yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <AdminPanelKarti baslik="Site Vitrin Görünümü" altBaslik="Ürün listesi sayfasındaki varsayılan görünüm">
        <div className="ap-urun-gorunum-grid">
          {GORUNUM_TIPLERI.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => void vitrinGuncelle(g.id)}
              className={`ap-widget-tip-kart ${varsayilanGorunum === g.id ? 'ap-widget-tip-kart-secili' : ''}`}
            >
              <span className="ap-widget-tip-ad">{g.ad}</span>
              <span className="ap-widget-tip-aciklama">{g.aciklama}</span>
            </button>
          ))}
        </div>
      </AdminPanelKarti>

      <div className="ap-stat-grid">
        <AdminIstatistikKarti etiket="Toplam" deger={istatistik.toplam} ikon="🛒" vurgu="mavi" />
        <AdminIstatistikKarti etiket="Aktif" deger={istatistik.aktif} ikon="✅" vurgu="yesil" />
        <AdminIstatistikKarti etiket="Yeni" deger={istatistik.yeni} ikon="✨" vurgu="amber" />
        <AdminIstatistikKarti etiket="Çok Satan" deger={istatistik.cokSatan} ikon="🔥" vurgu="gri" />
      </div>

      <div className="ap-split-layout">
        <AdminPanelKarti baslik={`Ürün Listesi (${urunler.length})`}>
          {urunler.length === 0 ? (
            <p className="ap-muted text-sm">Henüz ürün yok. Alt bardan Yeni Ekle ile başlayın.</p>
          ) : (
            <ul className="ap-liste max-h-[520px] overflow-y-auto">
              {urunler.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => urunSec(u)}
                    className={`ap-liste-oge ${seciliId === u.id ? 'ap-liste-oge-secili' : ''}`}
                  >
                    <span className="font-medium">{u.ad}</span>
                    <span className="ap-muted mt-0.5 block text-xs">
                      {u.fiyat.toLocaleString('tr-TR')} {u.paraBirimi}
                      {u.kategori && ` · ${u.kategori}`}
                    </span>
                    <span className="mt-1 flex gap-2 text-[10px]">
                      {u.yeni && <span className="text-amber-400">Yeni</span>}
                      {u.cokSatan && <span className="text-orange-400">Çok Satan</span>}
                      {u.aktif === false && <span className="text-slate-500">Pasif</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminPanelKarti>

        <AdminPanelKarti baslik={seciliId ? 'Ürün Düzenle' : 'Yeni Ürün'} altBaslik="Temel bilgiler, kategori, marka ve rozetler">
          <div className="space-y-4">
            <FormAlani etiket="Ürün Adı">
              <input
                className={formInputSinifi}
                placeholder="Ürün adı"
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                required
              />
            </FormAlani>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormAlani etiket="Fiyat">
                <input
                  className={formInputSinifi}
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.fiyat || ''}
                  onChange={(e) => setForm({ ...form, fiyat: Number(e.target.value) })}
                />
              </FormAlani>
              <FormAlani etiket="Sıra">
                <input
                  className={formInputSinifi}
                  type="number"
                  min={0}
                  value={form.sira}
                  onChange={(e) => setForm({ ...form, sira: Number(e.target.value) || 0 })}
                />
              </FormAlani>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormAlani etiket="Kategori">
                <select
                  className={formInputSinifi}
                  value={form.kategoriId ?? ''}
                  onChange={(e) => {
                    const k = kategoriler.find((x) => x.id === e.target.value);
                    setForm({
                      ...form,
                      kategoriId: e.target.value || null,
                      kategori: k?.ad ?? form.kategori,
                    });
                  }}
                >
                  <option value="">Seçiniz</option>
                  {kategoriler.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.ad}
                    </option>
                  ))}
                </select>
              </FormAlani>
              <FormAlani etiket="Marka">
                <select
                  className={formInputSinifi}
                  value={form.markaId ?? ''}
                  onChange={(e) => setForm({ ...form, markaId: e.target.value || null })}
                >
                  <option value="">Seçiniz</option>
                  {markalar.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad}
                    </option>
                  ))}
                </select>
              </FormAlani>
            </div>

            <FormAlani etiket="Rozetler">
              <div className="flex flex-wrap gap-2">
                {rozetler.length === 0 ? (
                  <span className="ap-muted text-xs">Henüz rozet yok. Rozetler sekmesinden ekleyin.</span>
                ) : (
                  rozetler.map((r) => (
                    <label
                      key={r.id}
                      className={`ap-urun-rozet-secim ${form.rozetIds.includes(r.id) ? 'ap-urun-rozet-secim-aktif' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={form.rozetIds.includes(r.id)}
                        onChange={() => rozetToggle(r.id)}
                      />
                      {r.ad}
                    </label>
                  ))
                )}
              </div>
            </FormAlani>

            <FormAlani etiket="Ürün Görünüm Tipi" aciklama="Bu ürünün kart stili">
              <div className="flex flex-wrap gap-2">
                {GORUNUM_TIPLERI.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setForm({ ...form, gorunumTipi: g.id })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      form.gorunumTipi === g.id
                        ? 'bg-[var(--ap-accent)] text-white'
                        : 'border border-[var(--ap-border)] text-[var(--ap-muted)]'
                    }`}
                  >
                    {g.ad}
                  </button>
                ))}
              </div>
            </FormAlani>

            <GorselAlan
              etiket="Ana Görsel"
              deger={form.gorselUrl}
              onChange={(v) => setForm({ ...form, gorselUrl: v })}
              onizlemeSinifi="h-20 w-20 rounded-lg object-cover border border-[var(--ap-border)]"
            />

            <FormAlani etiket="Ek Görseller">
              <GorselAlan
                etiket=""
                deger=""
                onChange={(v) => gorselEkle(v)}
                onizlemeSinifi="hidden"
              />
              {form.gorseller.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gorseller.map((url, i) => (
                    <div key={`${url}-${i}`} className="relative">
                      <img src={url} alt="" className="h-14 w-14 rounded object-cover border border-[var(--ap-border)]" />
                      <button
                        type="button"
                        onClick={() => gorselKaldir(i)}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormAlani>

            <FormAlani etiket="Açıklama">
              <textarea
                className={formInputSinifi}
                rows={3}
                value={form.aciklama}
                onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
              />
            </FormAlani>

            {tumOzellikler.length > 0 && (
              <div className="ap-form-bolum">
                <div className="ap-form-bolum-baslik">
                  <p className="ap-heading text-sm font-semibold">Özellik Değerleri</p>
                </div>
                <div className="ap-form-bolum-icerik">
                  {tumOzellikler.map((o) => (
                    <FormAlani key={o.id} etiket={o.ad} aciklama={`${o.sablonAd} · ${o.grupAd}`}>
                      <input
                        className={formInputSinifi}
                        value={ozellikDegerAl(o.id)}
                        onChange={(e) => ozellikDegerGuncelle(o.id, e.target.value)}
                        placeholder="Değer girin"
                      />
                    </FormAlani>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.yeni} onChange={(e) => setForm({ ...form, yeni: e.target.checked })} />
                Yeni
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.cokSatan} onChange={(e) => setForm({ ...form, cokSatan: e.target.checked })} />
                Çok Satan
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.stokta} onChange={(e) => setForm({ ...form, stokta: e.target.checked })} />
                Stokta
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
                Aktif
              </label>
            </div>
          </div>
        </AdminPanelKarti>
      </div>
    </div>
  );
}
