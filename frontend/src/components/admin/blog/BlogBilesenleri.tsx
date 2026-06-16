import type { AdminBlog, BlogFormDegeri } from '@/features/admin/blogApi';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';

interface BlogListesiProps {
  bloglar: AdminBlog[];
  seciliId: string | null;
  onSec: (blog: AdminBlog) => void;
}

export function BlogListesi({ bloglar, seciliId, onSec }: BlogListesiProps) {
  return (
    <AdminPanelKarti baslik={`Yazılar (${bloglar.length})`}>
      {bloglar.length === 0 ? (
        <p className="ap-muted text-sm">Henüz yazı yok.</p>
      ) : (
        <ul className="ap-liste max-h-[520px] overflow-y-auto">
          {bloglar.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSec(b)}
                className={`ap-liste-oge ${seciliId === b.id ? 'ap-liste-oge-secili' : ''}`}
              >
                <span className="font-medium">{b.baslik}</span>
                {b.kategori && <span className="ap-muted ml-2 text-[10px]">{b.kategori}</span>}
                <span className="mt-1 flex gap-2 text-[10px]">
                  {b.yayinda && <span className="text-green-400">Yayında</span>}
                  {b.oneCikan && <span className="text-amber-400">Öne Çıkan</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminPanelKarti>
  );
}

interface BlogDuzenleFormuProps {
  form: BlogFormDegeri;
  seciliId: string | null;
  onChange: (form: BlogFormDegeri) => void;
}

export function BlogDuzenleFormu({ form, seciliId, onChange }: BlogDuzenleFormuProps) {
  return (
    <AdminPanelKarti baslik={seciliId ? 'Yazı Düzenle' : 'Yeni Yazı'} altBaslik="İçerik ve yayın ayarları">
      <div className="space-y-4">
        <FormAlani etiket="Başlık">
          <input
            className={formInputSinifi}
            placeholder="Yazı başlığı"
            value={form.baslik}
            onChange={(e) => onChange({ ...form, baslik: e.target.value })}
            required
          />
        </FormAlani>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormAlani etiket="Slug">
            <input className={formInputSinifi} placeholder="yazi-url" value={form.slug} onChange={(e) => onChange({ ...form, slug: e.target.value })} />
          </FormAlani>
          <FormAlani etiket="Kategori">
            <input className={formInputSinifi} placeholder="Haber" value={form.kategori} onChange={(e) => onChange({ ...form, kategori: e.target.value })} />
          </FormAlani>
        </div>
        <FormAlani etiket="Yazar">
          <input className={formInputSinifi} placeholder="Yazar adı" value={form.yazar} onChange={(e) => onChange({ ...form, yazar: e.target.value })} />
        </FormAlani>
        <FormAlani etiket="Özet">
          <textarea className={formInputSinifi} rows={2} placeholder="Kısa özet" value={form.ozet} onChange={(e) => onChange({ ...form, ozet: e.target.value })} />
        </FormAlani>
        <FormAlani etiket="İçerik">
          <textarea className={formInputSinifi} rows={8} placeholder="Yazı içeriği" value={form.icerik} onChange={(e) => onChange({ ...form, icerik: e.target.value })} />
        </FormAlani>
        <GorselAlan etiket="Kapak Görseli" deger={form.kapakGorsel} onChange={(v) => onChange({ ...form, kapakGorsel: v })} />
        <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.yayinda} onChange={(e) => onChange({ ...form, yayinda: e.target.checked })} />
            Yayında
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.oneCikan} onChange={(e) => onChange({ ...form, oneCikan: e.target.checked })} />
            Öne çıkan
          </label>
        </div>
      </div>
    </AdminPanelKarti>
  );
}
