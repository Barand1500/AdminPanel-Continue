import { useEffect, useMemo, useState } from 'react';
import type { AdminBlog, BlogFormDegeri } from '@/features/admin/blogApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import {
  BLOG_GORUNUM_KONUM_ETIKET,
  blogTarihFormatla,
  type BlogAyarlari,
  type BlogGorunumKonum,
} from '@/types/blog';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  slugUret,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { IcerikHtmlEditoru } from '@/components/form/IcerikHtmlEditoru';

export const bosBlogForm: BlogFormDegeri = {
  baslik: '',
  slug: '',
  ozet: '',
  icerik: '',
  kapakGorsel: '',
  yazar: '',
  kategori: '',
  yayinda: true,
  oneCikan: false,
  seoTitle: '',
  seoDesc: '',
};

export function blogdanForm(b: AdminBlog): BlogFormDegeri {
  return {
    baslik: b.baslik,
    slug: b.slug,
    ozet: b.ozet ?? '',
    icerik: b.icerik,
    kapakGorsel: b.kapakGorsel ?? '',
    yazar: b.yazar ?? '',
    kategori: b.kategori ?? '',
    yayinda: b.yayinda,
    oneCikan: b.oneCikan,
    seoTitle: b.seoTitle ?? '',
    seoDesc: b.seoDesc ?? '',
  };
}

type ListeFiltre = 'tumu' | 'yayinda' | 'taslak' | 'one-cikan';

const LISTE_FILTRELER: { id: ListeFiltre; etiket: string }[] = [
  { id: 'tumu', etiket: 'Tümü' },
  { id: 'yayinda', etiket: 'Yayında' },
  { id: 'taslak', etiket: 'Taslak' },
  { id: 'one-cikan', etiket: 'Öne çıkan' },
];

function htmlOzet(html: string, max = 220) {
  const t = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return '';
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export function BlogListesiPanel({
  bloglar,
  seciliId,
  onSec,
}: {
  bloglar: AdminBlog[];
  seciliId: string | null;
  onSec: (blog: AdminBlog) => void;
}) {
  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState<ListeFiltre>('tumu');

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return bloglar.filter((b) => {
      if (filtre === 'yayinda' && !b.yayinda) return false;
      if (filtre === 'taslak' && b.yayinda) return false;
      if (filtre === 'one-cikan' && !b.oneCikan) return false;
      if (!q) return true;
      return (
        b.baslik.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.kategori ?? '').toLowerCase().includes(q) ||
        (b.yazar ?? '').toLowerCase().includes(q)
      );
    });
  }, [bloglar, arama, filtre]);

  const yayindaSayisi = bloglar.filter((b) => b.yayinda).length;

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Yazılar</h2>
          <p className="ap-muted text-xs">
            {bloglar.length} kayıt · {yayindaSayisi} yayında
          </p>
        </div>
        <div className="ap-blog-filtre-piller">
          {LISTE_FILTRELER.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`ap-blog-filtre-pil${filtre === f.id ? ' ap-blog-filtre-pil--aktif' : ''}`}
              onClick={() => setFiltre(f.id)}
            >
              {f.etiket}
            </button>
          ))}
        </div>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Başlık, slug veya kategori ara..." />
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {bloglar.length === 0 ? (
          <AdminBosDurum
            ikon="📰"
            baslik="Henüz yazı yok"
            aciklama="Üstten Yeni Yazı ile başlayın"
          />
        ) : filtreli.length === 0 ? (
          <AdminBosDurum
            ikon="🔎"
            baslik="Sonuç yok"
            aciklama="Filtreyi veya aramayı temizleyip tekrar deneyin"
          />
        ) : (
          filtreli.map((b) => {
            const gorsel = b.kapakGorsel ? medyaTamUrl(b.kapakGorsel) : null;
            return (
              <button
                key={b.id}
                type="button"
                className={`ap-liste-oge ap-blog-liste-oge${seciliId === b.id ? ' ap-liste-oge-secili' : ''}`}
                onClick={() => onSec(b)}
              >
                {gorsel ? (
                  <img src={gorsel} alt="" className="ap-blog-liste-kapak" />
                ) : (
                  <span className="ap-blog-liste-kapak ap-blog-liste-kapak--bos" aria-hidden>
                    📰
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="ap-liste-oge-baslik">{b.baslik}</span>
                  <span className="ap-liste-oge-alt">/{b.slug}</span>
                  <span className="ap-liste-oge-etiketler mt-1.5">
                    {b.yayinda ? (
                      <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                    ) : (
                      <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                    )}
                    {b.oneCikan && <AdminDurumEtiketi tur="aktif">Öne çıkan</AdminDurumEtiketi>}
                    {b.kategori && <AdminDurumEtiketi tur="bilgi">{b.kategori}</AdminDurumEtiketi>}
                  </span>
                  <span className="ap-blog-liste-tarih">{blogTarihFormatla(b.olusturma)}</span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export function BlogEditorPanel({
  form,
  seciliId,
  onChange,
}: {
  form: BlogFormDegeri;
  seciliId: string | null;
  onChange: (form: BlogFormDegeri) => void;
}) {
  const [slugManuel, setSlugManuel] = useState(false);

  useEffect(() => {
    setSlugManuel(Boolean(seciliId));
  }, [seciliId]);

  function baslikYaz(baslik: string) {
    const guncel: BlogFormDegeri = { ...form, baslik };
    if (!slugManuel && !seciliId) guncel.slug = slugUret(baslik);
    onChange(guncel);
  }

  return (
    <div className="ap-editor-panel ap-blog-editor">
      <div className="ap-blog-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">{seciliId ? 'Yazı düzenle' : 'Yeni yazı'}</h2>
          <p className="ap-muted text-xs">
            {form.slug ? `/blog/${form.slug}` : 'Boş bırakılırsa slug otomatik oluşur'}
          </p>
        </div>
        <div className="ap-blog-editor-ust-sag">
          <AdminAnahtarDugme
            etiket="Öne çıkan"
            acik={form.oneCikan}
            onDegistir={(oneCikan) => onChange({ ...form, oneCikan })}
          />
          <div className={`ap-blog-yayin-anahtar${form.yayinda ? ' ap-blog-yayin-anahtar--acik' : ''}`}>
            <AdminAnahtarDugme
              etiket="Yayında"
              acik={form.yayinda}
              onDegistir={(yayinda) => onChange({ ...form, yayinda })}
            />
          </div>
        </div>
      </div>

      <div className="ap-blog-editor-govde">
        <AdminFormBolumu baslik="Yazı">
          <div className="ap-blog-ust-grid">
            <div className="ap-blog-kapak">
              <GorselAlan
                etiket="Kapak"
                deger={form.kapakGorsel}
                onChange={(kapakGorsel) => onChange({ ...form, kapakGorsel })}
                onizlemeSinifi="ap-blog-kapak-onizleme"
              />
            </div>
            <FormAlani etiket="Başlık">
              <div className="ap-blog-baslik-grup">
                <input
                  className={`${formInputSinifi} ap-blog-baslik-input`}
                  value={form.baslik}
                  onChange={(e) => baslikYaz(e.target.value)}
                  placeholder="Yazı başlığı"
                />
                <input
                  className={`${formInputSinifi} ap-blog-slug-input`}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuel(true);
                    onChange({ ...form, slug: e.target.value });
                  }}
                  placeholder="slug"
                  title="Slug"
                  aria-label="Slug"
                />
              </div>
            </FormAlani>
            <FormAlani etiket="Yazar">
              <input
                className={formInputSinifi}
                value={form.yazar}
                onChange={(e) => onChange({ ...form, yazar: e.target.value })}
                placeholder="Yazar adı"
              />
            </FormAlani>
            <FormAlani etiket="Kategori">
              <input
                className={formInputSinifi}
                value={form.kategori}
                onChange={(e) => onChange({ ...form, kategori: e.target.value })}
                placeholder="Haber, Duyuru…"
              />
            </FormAlani>
            <div className="ap-blog-ozet">
              <FormAlani etiket="Özet">
                <input
                  className={formInputSinifi}
                  value={form.ozet}
                  onChange={(e) => onChange({ ...form, ozet: e.target.value })}
                  placeholder="Liste kartlarında görünen kısa özet"
                />
              </FormAlani>
            </div>
          </div>

          <FormAlani etiket="İçerik">
            <IcerikHtmlEditoru
              deger={form.icerik}
              onChange={(icerik) => onChange({ ...form, icerik })}
              placeholder="Yazı içeriği"
            />
          </FormAlani>
        </AdminFormBolumu>

        <AdminFormBolumu
          baslik="SEO"
          aciklama="Boşsa başlık ve özet kullanılır"
          akordeon
          varsayilanAcik={false}
        >
          <div className="ap-blog-seo-satir">
            <FormAlani etiket="SEO başlık">
              <textarea
                className={`${formInputSinifi} ap-blog-seo-alan`}
                rows={3}
                value={form.seoTitle}
                onChange={(e) => onChange({ ...form, seoTitle: e.target.value })}
                placeholder={form.baslik || 'Boşsa yazı başlığı kullanılır'}
              />
            </FormAlani>
            <FormAlani etiket="SEO açıklama">
              <textarea
                className={`${formInputSinifi} ap-blog-seo-alan`}
                rows={3}
                value={form.seoDesc}
                onChange={(e) => onChange({ ...form, seoDesc: e.target.value })}
                placeholder={form.ozet || 'Boşsa özet kullanılır'}
              />
            </FormAlani>
          </div>
        </AdminFormBolumu>
      </div>
    </div>
  );
}

export function BlogGorunumPaneli({
  ayarlar,
  onDegistir,
}: {
  ayarlar: BlogAyarlari;
  onDegistir: (ayarlar: BlogAyarlari) => void;
}) {
  const guncelle = (parca: Partial<BlogAyarlari>) => onDegistir({ ...ayarlar, ...parca });

  return (
    <div className="ap-editor-panel ap-blog-gorunum">
      <div className="ap-blog-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Görünüm</h2>
          <p className="ap-muted text-xs">Blog’un sitede nerede duracağı — Kaydet ile uygulanır</p>
        </div>
      </div>
      <div className="ap-blog-editor-govde">
        <AdminFormBolumu baslik="Yerleşim">
          <div className="ap-blog-gorunum-satir">
            <AdminAnahtarDugme
              etiket="Header menüsü"
              acik={ayarlar.headerMenu}
              onDegistir={(headerMenu) => guncelle({ headerMenu })}
            />
            <AdminAnahtarDugme
              etiket="Ana sayfa"
              acik={ayarlar.anaSayfa}
              onDegistir={(anaSayfa) => guncelle({ anaSayfa })}
            />
            <AdminAnahtarDugme
              etiket="Hizmetler alanı"
              acik={ayarlar.hizmetlerAlani}
              onDegistir={(hizmetlerAlani) => guncelle({ hizmetlerAlani })}
            />
          </div>
          <div className="ap-blog-form-grid">
            {ayarlar.anaSayfa && (
              <FormAlani etiket="Ana sayfa konumu">
                <select
                  className={formSelectSinifi}
                  value={ayarlar.anaSayfaKonum}
                  onChange={(e) => guncelle({ anaSayfaKonum: e.target.value as BlogGorunumKonum })}
                >
                  {(Object.keys(BLOG_GORUNUM_KONUM_ETIKET) as BlogGorunumKonum[]).map((k) => (
                    <option key={k} value={k}>
                      {BLOG_GORUNUM_KONUM_ETIKET[k]}
                    </option>
                  ))}
                </select>
              </FormAlani>
            )}
            <FormAlani etiket="Önizleme adedi">
              <input
                type="number"
                min={2}
                max={12}
                className={formInputSinifi}
                value={ayarlar.listeAdet}
                onChange={(e) =>
                  guncelle({ listeAdet: Math.min(12, Math.max(2, Number(e.target.value) || 3)) })
                }
                placeholder="2–12"
              />
            </FormAlani>
          </div>
        </AdminFormBolumu>
      </div>
    </div>
  );
}

export function BlogOnizlemeModal({
  acik,
  form,
  tarih,
  onKapat,
}: {
  acik: boolean;
  form: BlogFormDegeri;
  tarih?: string;
  onKapat: () => void;
}) {
  useEffect(() => {
    if (!acik) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onKapat();
      }
    }
    document.addEventListener('keydown', tus);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tus);
      document.body.style.overflow = '';
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  const gorsel = form.kapakGorsel
    ? form.kapakGorsel.startsWith('http') || form.kapakGorsel.startsWith('data:')
      ? form.kapakGorsel
      : medyaTamUrl(form.kapakGorsel)
    : '';
  const ozet = form.ozet.trim() || htmlOzet(form.icerik);
  const tarihMetin = blogTarihFormatla(tarih || new Date().toISOString());

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="blog-onizleme-baslik">
      <button type="button" className="ap-admin-modal-backdrop" aria-label="Kapat" onClick={onKapat} />
      <div className="ap-admin-modal ap-admin-modal-genis ap-blog-oniz-modal">
        <header className="ap-admin-modal-header">
          <div>
            <h2 id="blog-onizleme-baslik" className="ap-admin-modal-baslik">
              Yazı önizleme
            </h2>
            <p className="ap-admin-modal-alt">Kapak, başlık ve özet kart görünümü</p>
          </div>
          <button type="button" className="ap-admin-modal-kapat" onClick={onKapat}>
            ✕ ESC
          </button>
        </header>
        <div className="ap-blog-oniz-govde">
          <article className="ap-blog-oniz-kart">
            <div className="ap-blog-oniz-kapak">
              {gorsel ? (
                <img src={gorsel} alt="" />
              ) : (
                <span className="ap-blog-oniz-kapak-bos">📰</span>
              )}
              {form.oneCikan && <span className="ap-blog-oniz-rozet">Öne çıkan</span>}
              {!form.yayinda && <span className="ap-blog-oniz-rozet ap-blog-oniz-rozet--taslak">Taslak</span>}
            </div>
            <div className="ap-blog-oniz-metin">
              <p className="ap-blog-oniz-meta">
                {form.kategori && <span>{form.kategori}</span>}
                <time>{tarihMetin}</time>
              </p>
              <h3>{form.baslik.trim() || 'Başlıksız yazı'}</h3>
              {ozet && <p>{ozet}</p>}
              {form.yazar && <small>{form.yazar}</small>}
              {form.slug && <span className="ap-blog-oniz-url">/blog/{form.slug}</span>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
