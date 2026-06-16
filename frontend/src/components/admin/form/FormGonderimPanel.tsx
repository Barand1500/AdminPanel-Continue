import type { FormGonderim } from '@/features/admin/formApi';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface FormGonderimPanelProps {
  gonderimler: FormGonderim[];
  seciliId: string | null;
  onOkundu: (id: string) => void;
  onSil: (id: string) => void;
}

export function FormGonderimPanel({ gonderimler, seciliId, onOkundu, onSil }: FormGonderimPanelProps) {
  const okunmamis = gonderimler.filter((g) => !g.okundu).length;

  return (
    <AdminPanelKarti
      baslik={`Gönderimler${okunmamis > 0 ? ` (${okunmamis} yeni)` : ''}`}
      altBaslik={seciliId ? 'Seçili forma ait' : 'Form seçin'}
    >
      {!seciliId ? (
        <p className="ap-muted py-8 text-center text-sm">Gönderimleri görmek için soldan bir form seçin.</p>
      ) : gonderimler.length === 0 ? (
        <p className="ap-muted py-8 text-center text-sm">Henüz gönderim yok.</p>
      ) : (
        <div className="max-h-[560px] space-y-2 overflow-y-auto">
          {gonderimler.map((g) => (
            <div
              key={g.id}
              className={`ap-form-gonderim-kart ${!g.okundu ? 'ap-form-gonderim-yeni' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="ap-muted text-xs">{new Date(g.olusturma).toLocaleString('tr-TR')}</span>
                {!g.okundu && <span className="ap-form-yeni-rozet">YENİ</span>}
              </div>
              <dl className="mt-2 space-y-1.5">
                {Object.entries(g.veriJson).map(([anahtar, deger]) => (
                  <div key={anahtar} className="text-sm">
                    <dt className="font-medium text-[var(--ap-muted)]">{anahtar}</dt>
                    <dd className="mt-0.5 break-words text-[var(--ap-text)]">{String(deger)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex gap-2 border-t border-[var(--ap-border)] pt-2">
                {!g.okundu && (
                  <button type="button" onClick={() => onOkundu(g.id)} className="ap-link-btn text-xs">
                    Okundu işaretle
                  </button>
                )}
                <button type="button" onClick={() => onSil(g.id)} className="text-xs text-red-400 hover:text-red-300">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPanelKarti>
  );
}
