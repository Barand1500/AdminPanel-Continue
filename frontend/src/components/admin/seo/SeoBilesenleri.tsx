import { useMemo, useState } from 'react';
import type { SeoGenelForm, SeoKayit, SeoYonlendirme } from '@/features/admin/seoApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import {
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
} from '@/components/admin/ortak/AdminFormBilesenleri';

export type SeoSekmeId = 'genel' | 'kategori' | 'sabit-sayfa';

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export function hedefYonlendirmeleri(yonlendirmeler: SeoYonlendirme[], hedef: SeoKayit): SeoYonlendirme[] {
  return yonlendirmeler.filter((y) => !y.silindi && y.hedefId === hedef.id && y.hedefTip === hedef.tip);
}

function KarakterSayaci({ uzunluk, limit, etiket }: { uzunluk: number; limit: number; etiket: string }) {
  const oran = uzunluk / limit;
  const sinif =
    oran > 1 ? 'ap-seo-sayac-asim' : oran > 0.9 ? 'ap-seo-sayac-uyari' : 'ap-seo-sayac-iyi';
  return (
    <span className={`ap-seo-sayac ${sinif}`}>
      {etiket}: {uzunluk}/{limit}
    </span>
  );
}

export function SeoSerpOnizleme({
  baslik,
  aciklama,
  url,
}: {
  baslik: string;
  aciklama: string;
  url: string;
}) {
  const gorunenBaslik = baslik.trim() || 'Sayfa başlığı burada görünür';
  const gorunenAciklama =
    aciklama.trim() ||
    'Meta açıklama burada görünür. Arama sonuçlarında kullanıcıların göreceği kısa özet metni yazın.';
  const gorunenUrl = url || 'siteniz.com/sayfa-url';

  return (
    <div className="ap-seo-serp">
      <p className="ap-seo-serp-etiket">Google önizleme</p>
      <div className="ap-seo-serp-kart">
        <p className="ap-seo-serp-url">{gorunenUrl}</p>
        <p className="ap-seo-serp-baslik">{gorunenBaslik}</p>
        <p className="ap-seo-serp-aciklama">{gorunenAciklama}</p>
      </div>
    </div>
  );
}

export function SeoGenelPanel({
  form,
  onChange,
}: {
  form: SeoGenelForm;
  onChange: (form: SeoGenelForm) => void;
}) {
  return (
    <div className="ap-seo-genel-grid">
      <AdminPanelKarti baslik="Site Genel SEO" altBaslik="Anasayfa ve varsayılan meta bilgileri">
        <div className="ap-seo-form ap-seo-form--genel">
          <FormAlani etiket="Site Başlığı (Title)" aciklama="Tarayıcı sekmesi ve arama sonuçları">
            <input
              className={formInputSinifi}
              value={form.seoBaslik}
              onChange={(e) => onChange({ ...form, seoBaslik: e.target.value })}
              placeholder="Örn. Güzel Teknoloji | Akıllı Alışveriş"
            />
            <KarakterSayaci uzunluk={form.seoBaslik.length} limit={TITLE_LIMIT} etiket="Title" />
          </FormAlani>
          <FormAlani etiket="Anahtar Kelimeler" aciklama="Virgülle ayırın (opsiyonel)">
            <input
              className={formInputSinifi}
              value={form.seoAnahtar}
              onChange={(e) => onChange({ ...form, seoAnahtar: e.target.value })}
              placeholder="teknoloji, e-ticaret, online alışveriş"
            />
          </FormAlani>
          <FormAlani etiket="Meta Açıklama" aciklama="Arama sonuçlarında görünen özet">
            <textarea
              className={`${formInputSinifi} ap-seo-meta-alani`}
              rows={4}
              value={form.seoAciklama}
              onChange={(e) => onChange({ ...form, seoAciklama: e.target.value })}
              placeholder="Siteyi kısa ve çekici şekilde tanımlayın..."
            />
            <KarakterSayaci uzunluk={form.seoAciklama.length} limit={DESC_LIMIT} etiket="Description" />
          </FormAlani>
          <GorselAlan
            etiket="OG Görsel"
            aciklama="Sosyal medya paylaşımlarında kullanılır"
            deger={form.ogGorselUrl}
            onChange={(v) => onChange({ ...form, ogGorselUrl: v })}
            duzen="dikey"
            onizlemeSinifi="ap-seo-og-onizleme"
          />
        </div>
      </AdminPanelKarti>
      <SeoSerpOnizleme baslik={form.seoBaslik} aciklama={form.seoAciklama} url="siteniz.com" />
    </div>
  );
}

export function SeoUrlListesiPanel({
  kayitlar,
  yonlendirmeler,
  kirliIdler,
  kirliYonlendirmeIdler,
  seciliId,
  baslik,
  onSec,
}: {
  kayitlar: SeoKayit[];
  yonlendirmeler: SeoYonlendirme[];
  kirliIdler: Set<string>;
  kirliYonlendirmeIdler: Set<string>;
  seciliId: string | null;
  baslik: string;
  onSec: (kayit: SeoKayit) => void;
}) {
  const [arama, setArama] = useState('');

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return kayitlar;
    return kayitlar.filter((k) => {
      const alt = hedefYonlendirmeleri(yonlendirmeler, k);
      return (
        k.etiket.toLowerCase().includes(q) ||
        k.url.toLowerCase().includes(q) ||
        (k.seoTitle ?? '').toLowerCase().includes(q) ||
        (k.seoDesc ?? '').toLowerCase().includes(q) ||
        alt.some(
          (y) =>
            y.kaynakUrl.toLowerCase().includes(q) || (y.seoTitle ?? '').toLowerCase().includes(q)
        )
      );
    });
  }, [kayitlar, yonlendirmeler, arama]);

  const aktifYonlendirmeSayisi = yonlendirmeler.filter((y) => !y.silindi).length;
  const eksikSayisi = kayitlar.filter((k) => !k.seoTitle?.trim() || !k.seoDesc?.trim()).length;
  const tamSayisi = kayitlar.length - eksikSayisi;

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">{baslik}</h2>
          <p className="ap-muted text-xs">{kayitlar.length} URL</p>
        </div>
      </div>

      <div className="ap-seo-ozet">
        <div className="ap-seo-ozet-kart">
          <span className="ap-seo-ozet-deger">{tamSayisi}</span>
          <span className="ap-seo-ozet-etiket">SEO tam</span>
        </div>
        <div className="ap-seo-ozet-kart ap-seo-ozet-kart--uyari">
          <span className="ap-seo-ozet-deger">{eksikSayisi}</span>
          <span className="ap-seo-ozet-etiket">Eksik</span>
        </div>
        <div className="ap-seo-ozet-kart">
          <span className="ap-seo-ozet-deger">{aktifYonlendirmeSayisi}</span>
          <span className="ap-seo-ozet-etiket">301</span>
        </div>
      </div>

      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="URL, başlık veya açıklama ara..." />

      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {filtreli.length === 0 ? (
          <AdminBosDurum
            ikon="🔍"
            baslik={arama ? 'Sonuç yok' : 'Kayıt yok'}
            aciklama={arama ? 'Aramayı temizleyip tekrar deneyin' : 'Bu sekmede düzenlenecek URL yok'}
          />
        ) : (
          filtreli.map((k) => {
            const altlar = hedefYonlendirmeleri(yonlendirmeler, k);
            const eksik = !k.seoTitle?.trim() || !k.seoDesc?.trim();
            const kirli =
              kirliIdler.has(k.id) || altlar.some((y) => kirliYonlendirmeIdler.has(y.id));
            return (
              <button
                key={k.id}
                type="button"
                className={`ap-liste-oge ap-seo-liste-oge${seciliId === k.id ? ' ap-liste-oge-secili' : ''}${kirli ? ' ap-seo-liste-oge--kirli' : ''}`}
                onClick={() => onSec(k)}
              >
                <span className="min-w-0 flex-1">
                  <span className="ap-liste-oge-baslik">{k.etiket}</span>
                  <span className="ap-liste-oge-alt">{k.url}</span>
                  <span className="ap-liste-oge-etiketler mt-1.5">
                    {eksik ? (
                      <AdminDurumEtiketi tur="pasif">Eksik SEO</AdminDurumEtiketi>
                    ) : (
                      <AdminDurumEtiketi tur="yayinda">Tam</AdminDurumEtiketi>
                    )}
                    {altlar.length > 0 && (
                      <AdminDurumEtiketi tur="bilgi">{altlar.length} yönlendirme</AdminDurumEtiketi>
                    )}
                    {kirli && <AdminDurumEtiketi tur="menu">Kayıt edilmedi</AdminDurumEtiketi>}
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

export function SeoKayitEditorPanel({
  kayit,
  yonlendirmeler,
  seciliYonlendirmeId,
  onDegistir,
  onYonlendirmeDegistir,
  onYonlendirmeSec,
  onYonlendirmeSil,
}: {
  kayit: SeoKayit;
  yonlendirmeler: SeoYonlendirme[];
  seciliYonlendirmeId: string | null;
  onDegistir: (alan: 'seoTitle' | 'seoDesc', deger: string) => void;
  onYonlendirmeDegistir: (id: string, alan: 'seoTitle' | 'seoDesc', deger: string) => void;
  onYonlendirmeSec: (id: string) => void;
  onYonlendirmeSil: (id: string) => void;
}) {
  const altlar = hedefYonlendirmeleri(yonlendirmeler, kayit);

  return (
    <div className="ap-editor-panel ap-seo-editor">
      <div className="ap-seo-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">{kayit.etiket}</h2>
          <p className="ap-muted text-xs">{kayit.url}</p>
        </div>
      </div>

      <div className="ap-seo-editor-govde">
        <div>
          <AdminFormBolumu baslik="Meta bilgileri" aciklama="Arama sonuçlarında görünen başlık ve açıklama">
            <FormAlani etiket="Title">
              <input
                className={formInputSinifi}
                value={kayit.seoTitle ?? ''}
                onChange={(e) => onDegistir('seoTitle', e.target.value)}
                placeholder={kayit.etiket}
              />
              <KarakterSayaci uzunluk={(kayit.seoTitle ?? '').length} limit={TITLE_LIMIT} etiket="Title" />
            </FormAlani>
            <FormAlani etiket="Description">
              <textarea
                className={formInputSinifi}
                rows={4}
                value={kayit.seoDesc ?? ''}
                onChange={(e) => onDegistir('seoDesc', e.target.value)}
                placeholder="Arama sonuçlarında görünecek kısa özet"
              />
              <KarakterSayaci uzunluk={(kayit.seoDesc ?? '').length} limit={DESC_LIMIT} etiket="Description" />
            </FormAlani>
          </AdminFormBolumu>

          <AdminFormBolumu
            baslik="301 yönlendirmeler"
            aciklama="Eski adresi bu URL’ye yönlendirin. Yeni Ekle ile 301 ekleyin; satırı seçip Sil ile kaldırın."
          >
            {altlar.length === 0 ? (
              <p className="ap-muted text-sm">Bu URL için henüz yönlendirme yok.</p>
            ) : (
              <div className="ap-seo-301-liste">
                {altlar.map((y) => (
                  <div
                    key={y.id}
                    className={`ap-seo-301-kart${seciliYonlendirmeId === y.id ? ' ap-seo-301-kart--secili' : ''}`}
                  >
                    <button
                      type="button"
                      className="ap-seo-301-kart-sec"
                      onClick={() => onYonlendirmeSec(y.id)}
                    >
                      <span className="ap-seo-301-rozet">301</span>
                      <span className="ap-seo-301-kaynak">{y.kaynakUrl}</span>
                    </button>
                    <FormAlani etiket="Title">
                      <input
                        className={formInputSinifi}
                        value={y.seoTitle ?? ''}
                        onChange={(e) => onYonlendirmeDegistir(y.id, 'seoTitle', e.target.value)}
                        placeholder="Title"
                      />
                    </FormAlani>
                    <FormAlani etiket="Description">
                      <textarea
                        className={formInputSinifi}
                        rows={2}
                        value={y.seoDesc ?? ''}
                        onChange={(e) => onYonlendirmeDegistir(y.id, 'seoDesc', e.target.value)}
                        placeholder="Description"
                      />
                    </FormAlani>
                    <button
                      type="button"
                      className="ap-seo-301-sil"
                      onClick={() => onYonlendirmeSil(y.id)}
                    >
                      Yönlendirmeyi kaldır
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminFormBolumu>
        </div>

        <SeoSerpOnizleme
          baslik={kayit.seoTitle ?? ''}
          aciklama={kayit.seoDesc ?? ''}
          url={kayit.url}
        />
      </div>
    </div>
  );
}
