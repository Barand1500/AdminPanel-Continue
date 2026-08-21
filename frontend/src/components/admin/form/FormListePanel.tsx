import { useMemo, useState, type ReactNode } from 'react';
import type { AdminForm } from '@/features/admin/formApi';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';
import {
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { AdminFlatIkon } from '@/components/admin/ortak/AdminFlatIkon';

type ListeFiltre = 'tumu' | 'yayinda' | 'taslak';

const LISTE_FILTRELER: { id: ListeFiltre; etiket: string }[] = [
  { id: 'tumu', etiket: 'Tümü' },
  { id: 'yayinda', etiket: 'Yayında' },
  { id: 'taslak', etiket: 'Taslak' },
];

interface FormListePanelProps {
  formlar: AdminForm[];
  seciliId: string | null;
  onSec: (form: AdminForm) => void;
}

function formIkonu(f: AdminForm): ReactNode {
  const tip = f.ayarlarJson?.gorunumTipi;
  if (tip === 'yuzucu' || tip === 'modal' || tip === 'sabit-alt') return <AdminFlatIkon ad="mesaj" boyut={20} />;
  return <AdminFlatIkon ad="belge" boyut={20} />;
}

export function FormListePanel({ formlar, seciliId, onSec }: FormListePanelProps) {
  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState<ListeFiltre>('tumu');

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return formlar.filter((f) => {
      if (filtre === 'yayinda' && !f.aktif) return false;
      if (filtre === 'taslak' && f.aktif) return false;
      if (!q) return true;
      return (
        f.ad.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        (f.aciklama ?? '').toLowerCase().includes(q)
      );
    });
  }, [formlar, arama, filtre]);

  const yayindaSayisi = formlar.filter((f) => f.aktif).length;
  const gonderimToplam = formlar.reduce((t, f) => t + (f._count?.gonderimler ?? 0), 0);

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Formlar</h2>
          <p className="ap-muted text-xs">
            {formlar.length} kayıt · {yayindaSayisi} yayında
            {gonderimToplam > 0 ? ` · ${gonderimToplam} gönderim` : ''}
          </p>
        </div>
        <div className="ap-form-filtre-piller">
          {LISTE_FILTRELER.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`ap-form-filtre-pil${filtre === f.id ? ' ap-form-filtre-pil--aktif' : ''}`}
              onClick={() => setFiltre(f.id)}
            >
              {f.etiket}
            </button>
          ))}
        </div>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Form adı veya slug ara..." />
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {formlar.length === 0 ? (
          <AdminBosDurum
            ikon={<AdminFlatIkon ad="belge" boyut={28} />}
            baslik="Henüz form yok"
            aciklama="Üstten Yeni Form ile başlayın"
          />
        ) : filtreli.length === 0 ? (
          <AdminBosDurum
            ikon={<AdminFlatIkon ad="arama" boyut={28} />}
            baslik="Sonuç yok"
            aciklama="Filtreyi veya aramayı temizleyip tekrar deneyin"
          />
        ) : (
          filtreli.map((f) => {
            const gorunum =
              GORUNUM_TIPLERI.find((g) => g.id === f.ayarlarJson?.gorunumTipi)?.ad ?? 'Sayfa İçi';
            const gonderimSayisi = f._count?.gonderimler ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                className={`ap-liste-oge ap-form-liste-oge${seciliId === f.id ? ' ap-liste-oge-secili' : ''}`}
                onClick={() => onSec(f)}
              >
                <span className="ap-form-liste-ikon" aria-hidden>
                  {formIkonu(f)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="ap-liste-oge-baslik">{f.ad}</span>
                  <span className="ap-liste-oge-alt">/form/{f.slug}</span>
                  <span className="ap-liste-oge-etiketler mt-1.5">
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
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
