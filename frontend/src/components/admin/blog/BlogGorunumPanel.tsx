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
  ikon,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  ikon: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label
      className={`ap-blog-gorunum-kart ${acik ? 'ap-blog-gorunum-kart-aktif' : ''}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="ap-blog-gorunum-ikon" aria-hidden>
          {ikon}
        </span>
        <div className="min-w-0">
          <p className="ap-heading text-sm font-semibold">{etiket}</p>
          {aciklama && <p className="ap-muted mt-0.5 text-xs leading-relaxed">{aciklama}</p>}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle shrink-0 ${acik ? 'ap-toggle-on' : ''}`}
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
      <div className="ap-blog-gorunum-grid">
        <ToggleSatir
          ikon="🔝"
          etiket="Header menüsünde göster"
          aciklama="Varsayılan menüde Blog linki eklenir. Özel üst menüde /blog linkini kendiniz ekleyin."
          acik={ayarlar.headerMenu}
          onDegistir={(headerMenu) => guncelle({ headerMenu })}
        />
        <ToggleSatir
          ikon="🏠"
          etiket="Ana sayfada göster"
          aciklama="Öne çıkan ve son yazıların önizleme bandı"
          acik={ayarlar.anaSayfa}
          onDegistir={(anaSayfa) => guncelle({ anaSayfa })}
        />
        <ToggleSatir
          ikon="🧩"
          etiket="Hizmetler alanında göster"
          aciklama="Hizmet kartları stilinde blog bandı"
          acik={ayarlar.hizmetlerAlani}
          onDegistir={(hizmetlerAlani) => guncelle({ hizmetlerAlani })}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {ayarlar.anaSayfa && (
          <label className="ap-blog-gorunum-alan block">
            <span className="ap-muted mb-1.5 block text-xs font-medium">Ana sayfa konumu</span>
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
        <label className="ap-blog-gorunum-alan block">
          <span className="ap-muted mb-1.5 block text-xs font-medium">Ana sayfa önizleme adedi</span>
          <div className="flex items-center gap-3">
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
            <span className="ap-muted text-xs">2–12 arası yazı</span>
          </div>
        </label>
      </div>
    </AdminPanelKarti>
  );
}
