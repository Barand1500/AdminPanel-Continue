import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UrunKategori, KategoriFormDegeri } from '@/types/urunYonetimi';
import {
  kategorileriGetir,
  kategoriGuncelle,
  kategoriOlustur,
  kategoriSil,
} from '@/features/admin/urunYonetimiApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

const bosForm: KategoriFormDegeri = {
  ad: '',
  slug: '',
  parentId: null,
  gorselUrl: '',
  ikon: null,
  gizli: false,
  aktif: true,
  sira: 0,
};

function kategoriDerinlik(kategoriler: UrunKategori[], id: string | null): number {
  if (!id) return 0;
  const k = kategoriler.find((x) => x.id === id);
  if (!k?.parentId) return 1;
  return 1 + kategoriDerinlik(kategoriler, k.parentId);
}

function ToggleSwitch({ acik, onDegistir, etiket }: { acik: boolean; onDegistir: (v: boolean) => void; etiket: string }) {
  return (
    <label className="ap-switch">
      <input type="checkbox" className="sr-only" checked={acik} onChange={(e) => onDegistir(e.target.checked)} />
      <span className={`ap-switch-track ${acik ? 'ap-switch-acik' : ''}`}>
        <span className="ap-switch-thumb" />
      </span>
      <span className="ap-switch-etiket">{etiket}</span>
    </label>
  );
}

export function KategoriYonetimiSekmesi() {
  const [kategoriler, setKategoriler] = useState<UrunKategori[]>([]);
  const [seciliParentId, setSeciliParentId] = useState<string | null>(null);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [form, setForm] = useState<KategoriFormDegeri>(bosForm);
  const [arama, setArama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      setKategoriler(await kategorileriGetir());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kategoriler alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const kokKategoriler = useMemo(
    () => kategoriler.filter((k) => !k.parentId).sort((a, b) => a.sira - b.sira || a.ad.localeCompare(b.ad, 'tr')),
    [kategoriler]
  );

  const altKategoriler = useMemo(() => {
    const q = arama.trim().toLowerCase();
    return kategoriler
      .filter((k) => k.parentId === seciliParentId)
      .filter((k) => !q || k.ad.toLowerCase().includes(q))
      .sort((a, b) => a.sira - b.sira || a.ad.localeCompare(b.ad, 'tr'));
  }, [kategoriler, seciliParentId, arama]);

  function kategoriSec(k: UrunKategori) {
    setSeciliId(k.id);
    setForm({
      ad: k.ad,
      slug: k.slug,
      parentId: k.parentId,
      gorselUrl: k.gorselUrl ?? '',
      ikon: k.ikon,
      gizli: k.gizli,
      aktif: k.aktif,
      sira: k.sira,
    });
    setHata('');
    setBasari('');
  }

  function yeniEkle() {
    const derinlik = kategoriDerinlik(kategoriler, seciliParentId);
    if (derinlik >= 3) {
      setHata('En fazla 3 seviye kategori oluşturulabilir');
      return;
    }
    setSeciliId(null);
    setForm({ ...bosForm, parentId: seciliParentId });
    setHata('');
    setBasari('');
  }

  async function olustur() {
    if (seciliId) return;
    if (!form.ad.trim()) {
      setHata('Kategori adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await kategoriOlustur(form);
      setBasari('Kategori eklendi.');
      setSeciliId(null);
      setForm({ ...bosForm, parentId: seciliParentId });
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  async function guncelle() {
    if (!seciliId) return;
    if (!form.ad.trim()) {
      setHata('Kategori adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await kategoriGuncelle(seciliId, form);
      setBasari('Kategori güncellendi.');
      setSeciliId(null);
      setForm({ ...bosForm, parentId: seciliParentId });
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniEkle,
      sil,
    },
    {
      kaydet: !kaydediliyor && !seciliId,
      guncelle: !kaydediliyor && !!seciliId,
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
    }
  );

  async function sil() {
    if (!seciliId || !confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await kategoriSil(seciliId);
      setBasari('Kategori silindi.');
      setSeciliId(null);
      setForm({ ...bosForm, parentId: seciliParentId });
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }

  function cocukVarMi(id: string) {
    return kategoriler.some((k) => k.parentId === id);
  }

  if (yukleniyor) return <YukleniyorDurumu mesaj="Kategoriler yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="ap-urun-split">
        <AdminPanelKarti baslik="Ana Kategoriler" altBaslik="3 seviyeli ağaç yapısı">
          <ul className="ap-liste">
            <li>
              <button
                type="button"
                onClick={() => {
                  setSeciliParentId(null);
                  setSeciliId(null);
                  setForm(bosForm);
                }}
                className={`ap-liste-oge ${seciliParentId === null && !seciliId ? 'ap-liste-oge-secili' : ''}`}
              >
                Tümü (Kök)
              </button>
            </li>
            {kokKategoriler.map((k) => (
              <li key={k.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSeciliParentId(k.id);
                    kategoriSec(k);
                  }}
                  className={`ap-liste-oge ${seciliParentId === k.id ? 'ap-liste-oge-secili' : ''}`}
                >
                  <span className="font-medium">{k.ad}</span>
                  {cocukVarMi(k.id) && <span className="ap-muted mt-0.5 block text-xs">Alt kategoriler var</span>}
                </button>
                {seciliParentId === k.id &&
                  kategoriler
                    .filter((c) => c.parentId === k.id)
                    .map((c2) => (
                      <button
                        key={c2.id}
                        type="button"
                        onClick={() => {
                          setSeciliParentId(c2.id);
                          kategoriSec(c2);
                        }}
                        className={`ap-liste-oge ml-4 ${seciliParentId === c2.id ? 'ap-liste-oge-secili' : ''}`}
                      >
                        <span className="text-sm">{c2.ad}</span>
                      </button>
                    ))}
              </li>
            ))}
          </ul>
        </AdminPanelKarti>

        <div className="space-y-4">
          <div className="ap-arama flex-1 min-w-[200px] !p-0">
              <span className="ap-arama-ikon !top-1/2 !-translate-y-1/2">🔍</span>
              <input
                className={`${formInputSinifi} ap-arama-input`}
                placeholder="Alt kategori ara..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
              />
            </div>

          <div className="ap-urun-kategori-grid">
            {altKategoriler.length === 0 ? (
              <p className="ap-muted col-span-full py-8 text-center text-sm">
                {seciliParentId ? 'Bu seviyede kategori yok. Alt bardan Yeni Ekle ile oluşturun.' : 'Sol panelden ana kategori seçin veya kök seviyede ekleyin.'}
              </p>
            ) : (
              altKategoriler.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => kategoriSec(k)}
                  className={`ap-urun-kategori-kart ${seciliId === k.id ? 'ap-urun-kategori-kart-secili' : ''}`}
                >
                  {k.gorselUrl ? (
                    <img src={k.gorselUrl} alt="" className="ap-urun-kategori-gorsel" />
                  ) : (
                    <div className="ap-urun-kategori-gorsel ap-urun-kategori-gorsel-bos">📁</div>
                  )}
                  <span className="ap-urun-kategori-ad">{k.ad}</span>
                  <span className="ap-urun-kategori-etiketler">
                    {k.gizli && <span className="ap-etiket ap-etiket-gri">Gizli</span>}
                    {!k.aktif && <span className="ap-etiket ap-etiket-pasif">Pasif</span>}
                    {k.aktif && !k.gizli && <span className="ap-etiket ap-etiket-aktif">Aktif</span>}
                  </span>
                </button>
              ))
            )}
          </div>

          {(seciliId || form.ad || form.parentId !== undefined) && (
            <AdminPanelKarti baslik={seciliId ? 'Kategori Düzenle' : 'Yeni Kategori'}>
              <div className="space-y-4">
                <FormAlani etiket="Kategori Adı">
                  <input
                    className={formInputSinifi}
                    value={form.ad}
                    onChange={(e) => setForm({ ...form, ad: e.target.value })}
                    placeholder="Kategori adı"
                  />
                </FormAlani>
                <FormAlani etiket="Slug" aciklama="Boş bırakılırsa otomatik oluşturulur">
                  <input
                    className={formInputSinifi}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="kategori-slug"
                  />
                </FormAlani>
                <GorselAlan
                  etiket="Kategori Görseli"
                  deger={form.gorselUrl}
                  onChange={(v) => setForm({ ...form, gorselUrl: v })}
                  onizlemeSinifi="h-16 w-16 rounded-lg object-cover border border-[var(--ap-border)]"
                />
                <FormAlani etiket="Sıra">
                  <input
                    className={formInputSinifi}
                    type="number"
                    min={0}
                    value={form.sira}
                    onChange={(e) => setForm({ ...form, sira: Number(e.target.value) || 0 })}
                  />
                </FormAlani>
                <div className="ap-switch-grup">
                  <ToggleSwitch etiket="Gizli" acik={form.gizli} onDegistir={(gizli) => setForm({ ...form, gizli })} />
                  <ToggleSwitch etiket="Aktif" acik={form.aktif} onDegistir={(aktif) => setForm({ ...form, aktif })} />
                </div>
              </div>
            </AdminPanelKarti>
          )}
        </div>
      </div>
    </div>
  );
}
