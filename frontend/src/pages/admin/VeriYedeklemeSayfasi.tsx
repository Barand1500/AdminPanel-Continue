import { useEffect, useState } from 'react';
import { useYedekleme } from '@/hooks/useYedekleme';
import { adminYedekApi } from '@/features/admin/adminSistemApi';

function tarihFormat(iso: string) {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function tipEtiket(tip: string) {
  return tip === 'geri_yukle' ? 'Geri Yükleme' : 'İndirme';
}

export function VeriYedeklemeSayfasi() {
  const { varsayilanDosyaAdi, kayitlar, sonKayit, yukleniyor, hata, yenile } = useYedekleme();
  const [indirDosyaAdi, setIndirDosyaAdi] = useState('');
  const [geriDosyaAdi, setGeriDosyaAdi] = useState('');
  const [seciliDosya, setSeciliDosya] = useState<File | null>(null);
  const [indiriliyor, setIndiriliyor] = useState(false);
  const [yukleniyorGeri, setYukleniyorGeri] = useState(false);

  useEffect(() => {
    if (varsayilanDosyaAdi) {
      setIndirDosyaAdi(varsayilanDosyaAdi);
      setGeriDosyaAdi(varsayilanDosyaAdi);
    }
  }, [varsayilanDosyaAdi]);

  async function indirHandler() {
    setIndiriliyor(true);
    try {
      await adminYedekApi.indir(indirDosyaAdi.trim() || undefined);
      await yenile();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'İndirme başarısız');
    } finally {
      setIndiriliyor(false);
    }
  }

  async function geriYukleHandler() {
    if (!seciliDosya) {
      alert('Lütfen bir JSON dosyası seçin');
      return;
    }

    const onay = confirm(
      'Mevcut site verileri silinip seçilen yedek yüklenecek. Devam etmek istiyor musunuz?'
    );
    if (!onay) return;

    setYukleniyorGeri(true);
    try {
      await adminYedekApi.geriYukle(seciliDosya, geriDosyaAdi.trim() || seciliDosya.name);
      setSeciliDosya(null);
      await yenile();
      alert('Geri yükleme tamamlandı. Sayfayı yenilemeniz önerilir.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Geri yükleme başarısız');
    } finally {
      setYukleniyorGeri(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ap-heading text-xl font-bold">Veri Yedekleme</h1>
        <p className="ap-muted mt-1 text-sm">
          Site verilerini JSON olarak indirin veya daha önce alınan yedeği geri yükleyin.
        </p>
      </div>

      {sonKayit && (
        <div className="ap-card rounded-xl border px-4 py-3 text-sm">
          <span className="ap-muted">Son işlem: </span>
          <strong className="ap-heading">{sonKayit.kullaniciAd}</strong>
          <span className="ap-muted"> ({sonKayit.kullaniciEmail}) — </span>
          <span>{tipEtiket(sonKayit.tip)}</span>
          <span className="ap-muted"> — {tarihFormat(sonKayit.olusturma)}</span>
          <span className="ap-muted"> — {sonKayit.dosyaAdi}</span>
        </div>
      )}

      {hata && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {hata}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ap-card space-y-4 rounded-xl border p-5">
          <div>
            <h2 className="ap-heading text-lg font-semibold">Veri İndirme</h2>
            <p className="ap-muted mt-1 text-sm">Tüm site verisini JSON dosyası olarak indirin.</p>
          </div>

          <div>
            <label className="ap-muted mb-1 block text-sm">Dosya adı</label>
            <input
              type="text"
              value={indirDosyaAdi}
              onChange={(e) => setIndirDosyaAdi(e.target.value)}
              placeholder="site-adi-admin-2026-06-13.json"
              className="ap-input w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <p className="ap-muted mt-1 text-xs">Otomatik format: site-adi-admin-tarih.json</p>
          </div>

          <button
            type="button"
            disabled={indiriliyor || yukleniyor}
            onClick={() => void indirHandler()}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {indiriliyor ? 'İndiriliyor...' : 'JSON İndir'}
          </button>
        </section>

        <section className="ap-card space-y-4 rounded-xl border p-5">
          <div>
            <h2 className="ap-heading text-lg font-semibold">Veri Geri Yükleme</h2>
            <p className="ap-muted mt-1 text-sm">
              Daha önce indirilen .json yedeğini yükleyerek siteyi geri yükleyin.
            </p>
          </div>

          <div>
            <label className="ap-muted mb-1 block text-sm">Dosya adı (kayıt için)</label>
            <input
              type="text"
              value={geriDosyaAdi}
              onChange={(e) => setGeriDosyaAdi(e.target.value)}
              className="ap-input w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="ap-muted mb-1 block text-sm">JSON dosyası</label>
            <input
              type="file"
              accept=".json,application/json,text/plain"
              onChange={(e) => setSeciliDosya(e.target.files?.[0] ?? null)}
              className="ap-input w-full rounded border px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:text-white"
            />
            {seciliDosya && (
              <p className="ap-muted mt-1 text-xs">Seçili: {seciliDosya.name}</p>
            )}
          </div>

          <button
            type="button"
            disabled={yukleniyorGeri || !seciliDosya}
            onClick={() => void geriYukleHandler()}
            className="rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {yukleniyorGeri ? 'Yükleniyor...' : 'Geri Yükle'}
          </button>
        </section>
      </div>

      <section className="ap-card overflow-hidden rounded-xl border">
        <div className="border-b border-[var(--ap-border)] px-4 py-3">
          <h2 className="ap-heading font-semibold">Yedekleme Geçmişi</h2>
          <p className="ap-muted text-xs">Kim, ne zaman yedek aldı veya geri yükledi</p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--ap-border)] text-xs uppercase ap-muted">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Kullanıcı</th>
              <th className="px-4 py-3">İşlem</th>
              <th className="px-4 py-3">Dosya</th>
            </tr>
          </thead>
          <tbody>
            {yukleniyor ? (
              <tr>
                <td colSpan={4} className="ap-muted px-4 py-8 text-center">
                  Yükleniyor...
                </td>
              </tr>
            ) : kayitlar.length === 0 ? (
              <tr>
                <td colSpan={4} className="ap-muted px-4 py-8 text-center">
                  Henüz yedekleme kaydı yok.
                </td>
              </tr>
            ) : (
              kayitlar.map((k) => (
                <tr key={k.id} className="border-b border-[var(--ap-border)]/50 hover:bg-[var(--ap-hover)]">
                  <td className="whitespace-nowrap px-4 py-3">{tarihFormat(k.olusturma)}</td>
                  <td className="px-4 py-3">
                    <div className="ap-heading font-medium">{k.kullaniciAd}</div>
                    <div className="ap-muted text-xs">{k.kullaniciEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        k.tip === 'geri_yukle'
                          ? 'bg-amber-900/40 text-amber-300'
                          : 'bg-emerald-900/40 text-emerald-300'
                      }`}
                    >
                      {tipEtiket(k.tip)}
                    </span>
                  </td>
                  <td className="ap-muted px-4 py-3 font-mono text-xs">{k.dosyaAdi}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
