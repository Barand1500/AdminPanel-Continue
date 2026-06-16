import {
  BLOG_GORUNUM_KONUM_ETIKET,
  type BlogAyarlari,
  type BlogGorunumKonum,
} from '@/types/blog';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { formInputSinifi } from '@/components/form/FormAlani';

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label className={`ap-toggle-kart ${acik ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
      <div>
        <p className="ap-heading text-sm font-semibold">{etiket}</p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}

interface BlogGorunumPanelProps {
  ayarlar: BlogAyarlari;
  onDegistir: (ayarlar: BlogAyarlari) => void;
}

export function BlogGorunumPanel({ ayarlar, onDegistir }: BlogGorunumPanelProps) {
  const guncelle = (parca: Partial<BlogAyarlari>) => onDegistir({ ...ayarlar, ...parca });

  return (
    <AdminPanelKarti
      baslik="Görünüm Ayarları"
      altBaslik="Blog'un sitede nerede görüneceğini seçin — Kaydet ile uygulanır"
    >
      <div className="space-y-3">
        <ToggleSatir
          etiket="Header menüsünde göster"
          aciklama="Yalnızca varsayılan menüde Blog linki eklenir. Özel üst menü kullanıyorsanız /blog linkini kendiniz ekleyin."
          acik={ayarlar.headerMenu}
          onDegistir={(headerMenu) => guncelle({ headerMenu })}
        />
        <ToggleSatir
          etiket="Ana sayfada göster"
          aciklama="Öne çıkan ve son yazıların önizleme bandı"
          acik={ayarlar.anaSayfa}
          onDegistir={(anaSayfa) => guncelle({ anaSayfa })}
        />
        {ayarlar.anaSayfa && (
          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">Ana sayfa konumu</span>
            <select
              value={ayarlar.anaSayfaKonum}
              onChange={(e) => guncelle({ anaSayfaKonum: e.target.value as BlogGorunumKonum })}
              className={formInputSinifi}
            >
              {(Object.keys(BLOG_GORUNUM_KONUM_ETIKET) as BlogGorunumKonum[]).map((k) => (
                <option key={k} value={k}>
                  {BLOG_GORUNUM_KONUM_ETIKET[k]}
                </option>
              ))}
            </select>
          </label>
        )}
        <ToggleSatir
          etiket="Hizmetler alanında göster"
          aciklama="Hizmet kartları stilinde blog bandı (ilk hizmet widget'ından önce)"
          acik={ayarlar.hizmetlerAlani}
          onDegistir={(hizmetlerAlani) => guncelle({ hizmetlerAlani })}
        />
        <label className="block">
          <span className="ap-muted mb-1 block text-xs font-medium">Ana sayfa önizleme adedi</span>
          <input
            type="number"
            min={2}
            max={12}
            value={ayarlar.listeAdet}
            onChange={(e) =>
              guncelle({
                listeAdet: Math.min(12, Math.max(2, Number(e.target.value) || 3)),
              })
            }
            className={`${formInputSinifi} w-24`}
          />
        </label>
      </div>
    </AdminPanelKarti>
  );
}
