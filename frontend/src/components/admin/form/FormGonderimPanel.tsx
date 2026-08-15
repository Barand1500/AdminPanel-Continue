import type { AdminForm, FormGonderim } from '@/features/admin/formApi';
import { AdminBosDurum } from '@/components/admin/ortak/AdminFormBilesenleri';
import { formSelectSinifi } from '@/components/form/FormAlani';

interface FormGonderimPanelProps {
  formlar: AdminForm[];
  gonderimler: FormGonderim[];
  seciliId: string | null;
  onFormSec: (id: string) => void;
  onOkundu: (id: string) => void;
  onSil: (id: string) => void;
}

export function FormGonderimPanel({
  formlar,
  gonderimler,
  seciliId,
  onFormSec,
  onOkundu,
  onSil,
}: FormGonderimPanelProps) {
  const okunmamis = gonderimler.filter((g) => !g.okundu).length;
  const seciliForm = formlar.find((f) => f.id === seciliId) ?? null;

  return (
    <div className="ap-editor-panel ap-form-gonderim-panel">
      <div className="ap-form-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Gönderimler</h2>
          <p className="ap-muted text-xs">
            {seciliForm
              ? okunmamis > 0
                ? `${okunmamis} yeni · ${gonderimler.length} kayıt`
                : `${gonderimler.length} kayıt`
              : 'Görüntülemek için form seçin'}
          </p>
        </div>
        <div className="ap-form-gonderim-ust-sag">
          {okunmamis > 0 && <span className="ap-form-yeni-rozet">{okunmamis} yeni</span>}
          <select
            className={formSelectSinifi}
            value={seciliId ?? ''}
            onChange={(e) => onFormSec(e.target.value)}
          >
            <option value="">Form seçin</option>
            {formlar.map((f) => (
              <option key={f.id} value={f.id}>
                {f.ad}
                {(f._count?.gonderimler ?? 0) > 0 ? ` (${f._count?.gonderimler})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ap-form-gonderim-icerik ap-scroll">
        {!seciliId ? (
          <AdminBosDurum
            ikon="📬"
            baslik="Form seçilmedi"
            aciklama="Üstten bir form seçerek gelen başvuruları görün"
          />
        ) : gonderimler.length === 0 ? (
          <AdminBosDurum
            ikon="📭"
            baslik="Henüz gönderim yok"
            aciklama="Bu forma henüz ziyaretçi başvurusu gelmedi"
          />
        ) : (
          gonderimler.map((g) => (
            <article
              key={g.id}
              className={`ap-form-gonderim-kart${!g.okundu ? ' ap-form-gonderim-yeni' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <time className="ap-muted text-xs" dateTime={g.olusturma}>
                  {new Date(g.olusturma).toLocaleString('tr-TR')}
                </time>
                {!g.okundu && <span className="ap-form-yeni-rozet">Yeni</span>}
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
                  <button type="button" onClick={() => onOkundu(g.id)} className="ap-form-gonderim-tus">
                    Okundu
                  </button>
                )}
                <button type="button" onClick={() => onSil(g.id)} className="ap-form-gonderim-tus ap-form-gonderim-tus--sil">
                  Sil
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
