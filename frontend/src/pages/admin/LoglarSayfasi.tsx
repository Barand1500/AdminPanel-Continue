import { useEffect, useState } from 'react';
import { adminLogApi, type AdminLogKayit } from '@/features/admin/adminSistemApi';

export function LoglarSayfasi() {
  const [loglar, setLoglar] = useState<AdminLogKayit[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [temizleniyor, setTemizleniyor] = useState(false);

  async function yukle() {
    setYukleniyor(true);
    setHata('');
    try {
      setLoglar(await adminLogApi.listele());
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Loglar alınamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    void yukle();
  }, []);

  async function temizle() {
    if (!confirm('Tüm log kayıtları silinecek. Emin misiniz?')) return;
    setTemizleniyor(true);
    try {
      await adminLogApi.temizle();
      await yukle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Temizleme başarısız');
    } finally {
      setTemizleniyor(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Log Takibi</h1>
          <p className="mt-1 text-sm text-slate-400">Admin panelinde yapılan işlemlerin kaydı</p>
        </div>
        <button
          type="button"
          onClick={() => void temizle()}
          disabled={temizleniyor || loglar.length === 0}
          className="rounded border border-red-500/50 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          {temizleniyor ? 'Temizleniyor...' : 'Logları Temizle'}
        </button>
      </div>

      {hata && <p className="mb-4 text-sm text-red-400">{hata}</p>}

      {yukleniyor ? (
        <p className="text-sm text-slate-400">Yükleniyor...</p>
      ) : loglar.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-600 py-16 text-center">
          <p className="text-4xl">📜</p>
          <p className="mt-2 text-sm text-slate-400">Henüz log kaydı yok.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">İşlem</th>
                <th className="px-4 py-3">Modül</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900/50">
              {loglar.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                    {new Date(log.olusturma).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{log.kullaniciEmail}</td>
                  <td className="px-4 py-3 text-white">{log.islem}</td>
                  <td className="px-4 py-3 text-slate-400">{log.modulId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
