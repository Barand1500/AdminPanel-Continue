import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminBildirimleriGetir,
  adminBildirimleriTumunuOkundu,
  type AdminBildirim,
} from '@/features/admin/bildirimApi';

function zamanFormat(iso: string) {
  const tarih = new Date(iso);
  const fark = Date.now() - tarih.getTime();
  const dk = Math.floor(fark / 60000);
  if (dk < 1) return 'Az önce';
  if (dk < 60) return `${dk} dk önce`;
  const saat = Math.floor(dk / 60);
  if (saat < 24) return `${saat} sa önce`;
  return tarih.toLocaleDateString('tr-TR');
}

interface BildirimPaneliProps {
  acik: boolean;
  onKapat: () => void;
}

export function BildirimPaneli({ acik, onKapat }: BildirimPaneliProps) {
  const navigate = useNavigate();
  const [bildirimler, setBildirimler] = useState<AdminBildirim[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const veri = await adminBildirimleriGetir();
      setBildirimler(veri.bildirimler);
    } catch {
      setBildirimler([]);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    if (acik) void yukle();
  }, [acik, yukle]);

  async function tumunuOkundu() {
    await adminBildirimleriTumunuOkundu();
    await yukle();
  }

  function tikla(b: AdminBildirim) {
    if (b.link) navigate(b.link);
    onKapat();
  }

  if (!acik) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 z-40" aria-label="Bildirim panelini kapat" onClick={onKapat} />
      <div className="ap-bildirim-paneli fixed bottom-14 right-3 z-50 flex w-80 max-h-[min(420px,70vh)] flex-col overflow-hidden rounded-xl border border-slate-600 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Bildirimler</h3>
          <button
            type="button"
            className="text-xs text-blue-400 hover:underline"
            onClick={() => void tumunuOkundu()}
          >
            Tümünü okundu işaretle
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {yukleniyor && <p className="p-4 text-sm text-slate-400">Yükleniyor...</p>}
          {!yukleniyor && bildirimler.length === 0 && (
            <p className="p-4 text-sm text-slate-400">Henüz bildirim yok.</p>
          )}
          {bildirimler.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => tikla(b)}
              className={`flex w-full flex-col gap-0.5 border-b border-slate-800 px-4 py-3 text-left transition hover:bg-slate-800/60 ${
                !b.okundu ? 'bg-blue-950/30' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white">{b.baslik}</span>
                {!b.okundu && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />}
              </div>
              <span className="text-xs text-slate-400">{b.mesaj}</span>
              <span className="text-[10px] text-slate-500">{zamanFormat(b.olusturma)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function useBildirimSayaci(pollingMs = 60_000) {
  const [okunmamisSayi, setOkunmamisSayi] = useState(0);

  const yenile = useCallback(async () => {
    try {
      const veri = await adminBildirimleriGetir();
      setOkunmamisSayi(veri.okunmamisSayi);
    } catch {
      setOkunmamisSayi(0);
    }
  }, []);

  useEffect(() => {
    void yenile();
    const timer = setInterval(() => void yenile(), pollingMs);
    return () => clearInterval(timer);
  }, [yenile, pollingMs]);

  return { okunmamisSayi, yenile };
}
