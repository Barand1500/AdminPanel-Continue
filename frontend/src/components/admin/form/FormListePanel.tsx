import type { AdminForm } from '@/features/admin/formApi';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { GORUNUM_TIPLERI } from '@/types/formYonetimi';

interface FormListePanelProps {
  formlar: AdminForm[];
  seciliId: string | null;
  onSec: (form: AdminForm) => void;
}

export function FormListePanel({ formlar, seciliId, onSec }: FormListePanelProps) {
  return (
    <AdminPanelKarti baslik={`Formlar (${formlar.length})`} altBaslik="Düzenlemek için seçin">
      {formlar.length === 0 ? (
        <p className="ap-muted py-6 text-center text-sm">Henüz form yok. Alt bardan Yeni Ekle ile başlayın.</p>
      ) : (
        <ul className="ap-liste max-h-[560px] overflow-y-auto">
          {formlar.map((f) => {
            const gorunum = GORUNUM_TIPLERI.find((g) => g.id === f.ayarlarJson?.gorunumTipi)?.ad ?? 'Satır İçi';
            const okunmamis = f._count?.gonderimler ?? 0;
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onSec(f)}
                  className={`ap-form-liste-kart ${seciliId === f.id ? 'ap-form-liste-kart-secili' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm">{f.ad}</span>
                    <span className={`ap-etiket shrink-0 ${f.aktif ? 'ap-etiket-aktif' : 'ap-etiket-pasif'}`}>
                      {f.aktif ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                  <span className="ap-muted mt-1 block text-xs">/{f.slug}</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="ap-form-mini-etiket">{f.alanlarJson.length} alan</span>
                    <span className="ap-form-mini-etiket">{gorunum}</span>
                    {okunmamis > 0 && <span className="ap-form-mini-etiket ap-form-mini-etiket-vurgu">{okunmamis} gönderim</span>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminPanelKarti>
  );
}
