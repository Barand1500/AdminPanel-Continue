import { useMemo, useState } from 'react';
import type { AdminForm } from '@/features/admin/formApi';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';
import {
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
} from '@/components/admin/ortak/AdminFormBilesenleri';

interface FormListePanelProps {
  formlar: AdminForm[];
  seciliId: string | null;
  onSec: (form: AdminForm) => void;
}

function formIkonu(f: AdminForm): string {
  const tip = f.ayarlarJson?.gorunumTipi;
  if (tip === 'yuzucu' || tip === 'modal' || tip === 'sabit-alt') return '💬';
  return '📋';
}

export function FormListePanel({ formlar, seciliId, onSec }: FormListePanelProps) {
  const [arama, setArama] = useState('');

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    if (!q) return formlar;
    return formlar.filter(
      (f) =>
        f.ad.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        (f.aciklama ?? '').toLowerCase().includes(q)
    );
  }, [formlar, arama]);

  return (
    <aside className="ap-sidebar-panel ap-form-sidebar">
      <div className="ap-sidebar-baslik">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="ap-heading text-sm font-semibold">Formlar</h2>
            <p className="ap-muted text-xs">{formlar.length} kayıt</p>
          </div>
          {filtreli.length !== formlar.length && (
            <span className="ap-form-filtre-badge">{filtreli.length}</span>
          )}
        </div>
        <div className="mt-3">
          <AdminAramaKutusu
            deger={arama}
            onChange={setArama}
            placeholder="Form adı veya slug ara..."
          />
        </div>
      </div>

      <div className="ap-sidebar-icerik ap-scroll ap-form-sidebar-icerik">
        {formlar.length === 0 ? (
          <AdminBosDurum
            ikon="📝"
            baslik="Henüz form yok"
            aciklama="Alt bardan Yeni Ekle ile ilk formunuzu oluşturun."
          />
        ) : filtreli.length === 0 ? (
          <p className="ap-muted px-2 py-6 text-center text-sm">Arama sonucu bulunamadı.</p>
        ) : (
          <ul className="space-y-1.5">
            {filtreli.map((f) => {
              const gorunum =
                GORUNUM_TIPLERI.find((g) => g.id === f.ayarlarJson?.gorunumTipi)?.ad ?? 'Sayfa İçi';
              const gonderimSayisi = f._count?.gonderimler ?? 0;
              const secili = seciliId === f.id;

              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => onSec(f)}
                    className={`ap-form-liste-oge ${secili ? 'ap-form-liste-oge-secili' : ''}`}
                  >
                    <div className="ap-form-liste-ikon" aria-hidden>
                      {formIkonu(f)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="ap-liste-oge-baslik line-clamp-2">{f.ad}</p>
                      <p className="ap-liste-oge-alt mt-0.5">/form/{f.slug}</p>
                      <div className="ap-liste-oge-etiketler">
                        {f.aktif ? (
                          <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                        ) : (
                          <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                        )}
                        <AdminDurumEtiketi tur="bilgi">{f.alanlarJson.length} alan</AdminDurumEtiketi>
                        <AdminDurumEtiketi tur="menu">{gorunum}</AdminDurumEtiketi>
                        {gonderimSayisi > 0 && (
                          <AdminDurumEtiketi tur="aktif">{gonderimSayisi} gönderim</AdminDurumEtiketi>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
