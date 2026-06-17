import { useMemo, useState } from 'react';
import type { AdminBlog, BlogFormDegeri } from '@/features/admin/blogApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import { blogTarihFormatla } from '@/types/blog';
import {
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  AdminSekmeler,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';

type EditorSekme = 'icerik' | 'seo' | 'yayin';

interface BlogListesiProps {
  bloglar: AdminBlog[];
  seciliId: string | null;
  onSec: (blog: AdminBlog) => void;
}

export function BlogListesi({ bloglar, seciliId, onSec }: BlogListesiProps) {
  const [arama, setArama] = useState('');

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    if (!q) return bloglar;
    return bloglar.filter(
      (b) =>
        b.baslik.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.kategori ?? '').toLowerCase().includes(q) ||
        (b.yazar ?? '').toLowerCase().includes(q)
    );
  }, [bloglar, arama]);

  return (
    <aside className="ap-sidebar-panel ap-blog-sidebar">
      <div className="ap-sidebar-baslik">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="ap-heading text-sm font-semibold">Yazılar</h2>
            <p className="ap-muted text-xs">{bloglar.length} kayıt</p>
          </div>
          {filtreli.length !== bloglar.length && (
            <span className="ap-blog-filtre-badge">{filtreli.length}</span>
          )}
        </div>
        <div className="mt-3">
          <AdminAramaKutusu
            deger={arama}
            onChange={setArama}
            placeholder="Başlık, slug veya kategori ara..."
          />
        </div>
      </div>

      <div className="ap-sidebar-icerik ap-scroll ap-blog-sidebar-icerik">
        {bloglar.length === 0 ? (
          <AdminBosDurum
            ikon="📰"
            baslik="Henüz yazı yok"
            aciklama="Alt bardan + ile yeni yazı oluşturabilirsiniz."
          />
        ) : filtreli.length === 0 ? (
          <p className="ap-muted px-2 py-6 text-center text-sm">Arama sonucu bulunamadı.</p>
        ) : (
          <ul className="space-y-1.5">
            {filtreli.map((b) => {
              const gorsel = b.kapakGorsel ? medyaTamUrl(b.kapakGorsel) : null;
              const secili = seciliId === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => onSec(b)}
                    className={`ap-blog-liste-oge ${secili ? 'ap-blog-liste-oge-secili' : ''}`}
                  >
                    <div className="ap-blog-liste-thumb">
                      {gorsel ? (
                        <img src={gorsel} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg opacity-60">📰</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="ap-liste-oge-baslik line-clamp-2">{b.baslik}</p>
                      <p className="ap-liste-oge-alt mt-0.5">/{b.slug}</p>
                      <div className="ap-liste-oge-etiketler">
                        {b.yayinda ? (
                          <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                        ) : (
                          <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                        )}
                        {b.oneCikan && <AdminDurumEtiketi tur="aktif">Öne Çıkan</AdminDurumEtiketi>}
                        {b.kategori && <AdminDurumEtiketi tur="bilgi">{b.kategori}</AdminDurumEtiketi>}
                      </div>
                      <p className="ap-muted mt-1 text-[10px]">{blogTarihFormatla(b.olusturma)}</p>
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

interface BlogDuzenleFormuProps {
  form: BlogFormDegeri;
  seciliId: string | null;
  onChange: (form: BlogFormDegeri) => void;
}

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

export function BlogDuzenleFormu({ form, seciliId, onChange }: BlogDuzenleFormuProps) {
  const [sekme, setSekme] = useState<EditorSekme>('icerik');

  return (
    <div className="ap-editor-panel ap-blog-editor">
      <div className="ap-editor-ust">
        <div className="ap-editor-baslik">
          <div>
            <h2 className="ap-heading text-base font-semibold">
              {seciliId ? 'Yazı Düzenle' : 'Yeni Yazı'}
            </h2>
            <p className="ap-muted text-xs">
              {form.slug ? `/blog/${form.slug}` : 'Kayıt sonrası slug oluşturulur'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.yayinda ? (
              <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
            ) : (
              <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
            )}
            {form.oneCikan && <AdminDurumEtiketi tur="aktif">Öne Çıkan</AdminDurumEtiketi>}
          </div>
        </div>

        <AdminSekmeler
          aktif={sekme}
          onDegistir={setSekme}
          sekmeler={[
            { id: 'icerik', etiket: 'İçerik', ikon: '📝' },
            { id: 'seo', etiket: 'SEO', ikon: '🔍' },
            { id: 'yayin', etiket: 'Yayın', ikon: '🚀' },
          ]}
        />
      </div>

      <div className="ap-editor-icerik">
        {sekme === 'icerik' && (
          <div className="space-y-5">
            <AdminFormBolumu baslik="Temel Bilgiler" aciklama="Başlık, URL ve kategori">
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
                  <input
                    className={formInputSinifi}
                    placeholder="yazi-url"
                    value={form.slug}
                    onChange={(e) => onChange({ ...form, slug: e.target.value })}
                  />
                </FormAlani>
                <FormAlani etiket="Kategori">
                  <input
                    className={formInputSinifi}
                    placeholder="Haber"
                    value={form.kategori}
                    onChange={(e) => onChange({ ...form, kategori: e.target.value })}
                  />
                </FormAlani>
              </div>
              <FormAlani etiket="Yazar">
                <input
                  className={formInputSinifi}
                  placeholder="Yazar adı"
                  value={form.yazar}
                  onChange={(e) => onChange({ ...form, yazar: e.target.value })}
                />
              </FormAlani>
            </AdminFormBolumu>

            <AdminFormBolumu baslik="İçerik" aciklama="Özet ve ana metin">
              <FormAlani etiket="Özet">
                <textarea
                  className={formInputSinifi}
                  rows={2}
                  placeholder="Kısa özet — liste kartlarında görünür"
                  value={form.ozet}
                  onChange={(e) => onChange({ ...form, ozet: e.target.value })}
                />
              </FormAlani>
              <FormAlani etiket="İçerik">
                <textarea
                  className={`${formInputSinifi} ap-blog-icerik-alan`}
                  rows={10}
                  placeholder="Yazı içeriği"
                  value={form.icerik}
                  onChange={(e) => onChange({ ...form, icerik: e.target.value })}
                />
              </FormAlani>
            </AdminFormBolumu>

            <AdminFormBolumu baslik="Kapak Görseli" aciklama="Liste ve detay sayfasında kullanılır">
              <GorselAlan
                etiket="Kapak Görseli"
                deger={form.kapakGorsel}
                onChange={(v) => onChange({ ...form, kapakGorsel: v })}
              />
            </AdminFormBolumu>
          </div>
        )}

        {sekme === 'seo' && (
          <AdminFormBolumu
            baslik="Arama Motoru"
            aciklama="Boş bırakılırsa başlık ve özet kullanılır"
          >
            <FormAlani etiket="SEO Başlık">
              <input
                className={formInputSinifi}
                placeholder={form.baslik || 'Sayfa başlığı'}
                value={form.seoTitle}
                onChange={(e) => onChange({ ...form, seoTitle: e.target.value })}
              />
            </FormAlani>
            <FormAlani etiket="SEO Açıklama">
              <textarea
                className={formInputSinifi}
                rows={3}
                placeholder={form.ozet || 'Kısa açıklama'}
                value={form.seoDesc}
                onChange={(e) => onChange({ ...form, seoDesc: e.target.value })}
              />
            </FormAlani>
          </AdminFormBolumu>
        )}

        {sekme === 'yayin' && (
          <AdminFormBolumu baslik="Yayın Durumu" aciklama="Görünürlük ve öne çıkarma">
            <ToggleSatir
              etiket="Yayında"
              aciklama="Açıkken yazı sitede görünür"
              acik={form.yayinda}
              onDegistir={(yayinda) => onChange({ ...form, yayinda })}
            />
            <ToggleSatir
              etiket="Öne çıkan"
              aciklama="Ana sayfa ve blog bandında öncelikli gösterilir"
              acik={form.oneCikan}
              onDegistir={(oneCikan) => onChange({ ...form, oneCikan })}
            />
          </AdminFormBolumu>
        )}
      </div>
    </div>
  );
}
