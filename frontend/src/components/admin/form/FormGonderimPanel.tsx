import type { FormGonderim } from '@/features/admin/formApi';
import { AdminBosDurum } from '@/components/admin/ortak/AdminFormBilesenleri';

interface FormGonderimPanelProps {
  gonderimler: FormGonderim[];
  seciliId: string | null;
  onOkundu: (id: string) => void;
  onSil: (id: string) => void;
}

export function FormGonderimPanel({ gonderimler, seciliId, onOkundu, onSil }: FormGonderimPanelProps) {
  const okunmamis = gonderimler.filter((g) => !g.okundu).length;

  return (
    <div className="ap-form-gonderim-panel">
      <div className="ap-form-gonderim-baslik">
        <div>
          <h3 className="ap-heading text-sm font-semibold">Gönderimler</h3>
          <p className="ap-muted text-xs">
            {seciliId
              ? okunmamis > 0
                ? `${okunmamis} yeni gönderim`
                : `${gonderimler.length} kayıt`
              : 'Form seçin'}
          </p>
        </div>
        {okunmamis > 0 && <span className="ap-form-yeni-rozet">{okunmamis} YENİ</span>}
      </div>

      <div className="ap-form-gonderim-icerik ap-scroll">
        {!seciliId ? (
          <AdminBosDurum
            ikon="📬"
            baslik="Form seçilmedi"
            aciklama="Gönderimleri görmek için soldan bir form seçin."
          />
        ) : gonderimler.length === 0 ? (
          <AdminBosDurum
            ikon="📭"
            baslik="Henüz gönderim yok"
            aciklama="Bu forma henüz ziyaretçi başvurusu gelmedi."
          />
        ) : (
          <div className="space-y-2.5">
            {gonderimler.map((g) => (
              <article
                key={g.id}
                className={`ap-form-gonderim-kart ${!g.okundu ? 'ap-form-gonderim-yeni' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <time className="ap-muted text-xs" dateTime={g.olusturma}>
                    {new Date(g.olusturma).toLocaleString('tr-TR')}
                  </time>
                  {!g.okundu && <span className="ap-form-yeni-rozet">YENİ</span>}
                </div>
                <dl className="ap-form-gonderim-veri mt-3">
                  {Object.entries(g.veriJson).map(([anahtar, deger]) => (
                    <div key={anahtar} className="ap-form-gonderim-satir">
                      <dt>{anahtar}</dt>
                      <dd>{String(deger)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="ap-form-gonderim-aksiyonlar">
                  {!g.okundu && (
                    <button type="button" onClick={() => onOkundu(g.id)} className="ap-link-btn text-xs">
                      Okundu işaretle
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSil(g.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Sil
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
