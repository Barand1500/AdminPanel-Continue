import { useCallback, useEffect, useState } from 'react';
import type { FirsatFormDegeri, UrunFirsat } from '@/types/urunYonetimi';
import { firsatlariGetir, firsatGuncelle, firsatOlustur, firsatSil } from '@/features/admin/urunYonetimiApi';
import { adminUrunleriGetir, type AdminUrun } from '@/features/admin/urunApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminPanelKarti, BildirimKutusu, YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';

const bosForm: FirsatFormDegeri = {
  ad: '',
  aciklama: '',
  indirimYuzde: null,
  indirimTutar: null,
  baslangic: '',
  bitis: '',
  aktif: true,
  urunIds: [],
};

function tarihInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16);
}

export function FirsatYonetimiSekmesi() {
  const [firsatlar, setFirsatlar] = useState<UrunFirsat[]>([]);
  const [urunler, setUrunler] = useState<AdminUrun[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [form, setForm] = useState<FirsatFormDegeri>(bosForm);
  const [urunArama, setUrunArama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const [f, u] = await Promise.all([firsatlariGetir(), adminUrunleriGetir()]);
      setFirsatlar(f);
      setUrunler(u);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Veriler alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    void yukle();
  }, [yukle]);

  const filtreliUrunler = urunler.filter((u) => {
    const q = urunArama.trim().toLowerCase();
    return !q || u.ad.toLowerCase().includes(q);
  });

  function firsatSec(f: UrunFirsat) {
    setSeciliId(f.id);
    setForm({
      ad: f.ad,
      aciklama: f.aciklama ?? '',
      indirimYuzde: f.indirimYuzde,
      indirimTutar: f.indirimTutar,
      baslangic: tarihInput(f.baslangic),
      bitis: tarihInput(f.bitis),
      aktif: f.aktif,
      urunIds: f.urunIds,
    });
    setHata('');
    setBasari('');
  }

  const yeniBaslat = useCallback(() => {
    setSeciliId(null);
    setForm(bosForm);
    setHata('');
    setBasari('');
  }, []);

  const olustur = useCallback(async () => {
    if (seciliId) return;
    if (!form.ad.trim()) {
      setHata('Fırsat adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await firsatOlustur(form);
      setBasari('Fırsat eklendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, yukle]);

  const guncelle = useCallback(async () => {
    if (!seciliId) return;
    if (!form.ad.trim()) {
      setHata('Fırsat adı zorunludur');
      return;
    }
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      await firsatGuncelle(seciliId, form);
      setBasari('Fırsat güncellendi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, seciliId, yeniBaslat, yukle]);

  const silHandler = useCallback(async () => {
    if (!seciliId || !confirm('Bu fırsatı silmek istediğinize emin misiniz?')) return;
    setKaydediliyor(true);
    try {
      await firsatSil(seciliId);
      setBasari('Fırsat silindi.');
      yeniBaslat();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Silme başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [seciliId, yeniBaslat, yukle]);

  useModulAksiyonlari(
    {
      kaydet: olustur,
      guncelle,
      ekle: yeniBaslat,
      sil: silHandler,
    },
    {
      kaydet: !kaydediliyor && !seciliId,
      guncelle: !kaydediliyor && !!seciliId,
      ekle: true,
      sil: !!seciliId && !kaydediliyor,
    }
  );

  function urunToggle(id: string) {
    setForm((prev) => ({
      ...prev,
      urunIds: prev.urunIds.includes(id) ? prev.urunIds.filter((x) => x !== id) : [...prev.urunIds, id],
    }));
  }

  if (yukleniyor) return <YukleniyorDurumu mesaj="Fırsatlar yükleniyor..." />;

  return (
    <div className="space-y-4">
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="İşlem yapılıyor..." tur="bilgi" />}

      <div className="ap-split-layout">
        <AdminPanelKarti baslik={`Fırsatlar (${firsatlar.length})`}>
          {firsatlar.length === 0 ? (
            <p className="ap-muted text-sm">Henüz fırsat yok.</p>
          ) : (
            <ul className="ap-liste max-h-[480px] overflow-y-auto">
              {firsatlar.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => firsatSec(f)}
                    className={`ap-liste-oge ${seciliId === f.id ? 'ap-liste-oge-secili' : ''}`}
                  >
                    <span className="font-medium">{f.ad}</span>
                    <span className="ap-muted mt-0.5 block text-xs">
                      {f.urunIds.length} ürün
                      {f.indirimYuzde != null && ` · %${f.indirimYuzde}`}
                      {f.indirimTutar != null && ` · ${f.indirimTutar} ₺`}
                    </span>
                    {!f.aktif && <span className="ap-etiket ap-etiket-pasif mt-1">Pasif</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminPanelKarti>

        <AdminPanelKarti baslik={seciliId ? 'Fırsat Düzenle' : 'Yeni Fırsat'}>
          <div className="space-y-4">
            <FormAlani etiket="Fırsat Adı">
              <input
                className={formInputSinifi}
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                placeholder="Örn. Yaz İndirimi"
              />
            </FormAlani>
            <FormAlani etiket="Açıklama">
              <textarea
                className={formInputSinifi}
                rows={2}
                value={form.aciklama}
                onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
              />
            </FormAlani>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormAlani etiket="İndirim %">
                <input
                  className={formInputSinifi}
                  type="number"
                  min={0}
                  max={100}
                  value={form.indirimYuzde ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, indirimYuzde: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </FormAlani>
              <FormAlani etiket="İndirim Tutarı (₺)">
                <input
                  className={formInputSinifi}
                  type="number"
                  min={0}
                  value={form.indirimTutar ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, indirimTutar: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </FormAlani>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormAlani etiket="Başlangıç">
                <input
                  className={formInputSinifi}
                  type="datetime-local"
                  value={form.baslangic}
                  onChange={(e) => setForm({ ...form, baslangic: e.target.value })}
                />
              </FormAlani>
              <FormAlani etiket="Bitiş">
                <input
                  className={formInputSinifi}
                  type="datetime-local"
                  value={form.bitis}
                  onChange={(e) => setForm({ ...form, bitis: e.target.value })}
                />
              </FormAlani>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              Aktif
            </label>

            <div className="ap-form-bolum">
              <div className="ap-form-bolum-baslik">
                <p className="ap-heading text-sm font-semibold">Ürün Seçimi ({form.urunIds.length})</p>
              </div>
              <div className="ap-form-bolum-icerik">
                <input
                  className={formInputSinifi}
                  placeholder="Ürün ara..."
                  value={urunArama}
                  onChange={(e) => setUrunArama(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filtreliUrunler.map((u) => (
                    <label key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[var(--ap-hover)]">
                      <input
                        type="checkbox"
                        checked={form.urunIds.includes(u.id)}
                        onChange={() => urunToggle(u.id)}
                      />
                      <span>{u.ad}</span>
                      <span className="ap-muted text-xs ml-auto">{u.fiyat.toLocaleString('tr-TR')} ₺</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AdminPanelKarti>
      </div>
    </div>
  );
}
