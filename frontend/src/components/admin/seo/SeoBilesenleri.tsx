import { useMemo, useState } from 'react';
import type { SeoGenelForm, SeoKayit } from '@/features/admin/seoApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

export type SeoSekmeId = 'genel' | 'kategori' | 'sabit-sayfa';

export const SEO_SEKMELER: { id: SeoSekmeId; ad: string }[] = [
  { id: 'genel', ad: 'Genel' },
  { id: 'kategori', ad: 'Kategori' },
  { id: 'sabit-sayfa', ad: 'Sabit Sayfa' },
];

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export function SeoSekmeCubugu({
  aktif,
  onDegistir,
  sayilar,
}: {
  aktif: SeoSekmeId;
  onDegistir: (id: SeoSekmeId) => void;
  sayilar?: Partial<Record<SeoSekmeId, number>>;
}) {
  return (
    <div className="ap-seo-sekmeler">
      {SEO_SEKMELER.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onDegistir(s.id)}
          className={`ap-seo-sekme ${aktif === s.id ? 'ap-seo-sekme-aktif' : ''}`}
        >
          {s.ad}
          {sayilar?.[s.id] != null && (
            <span className="ap-seo-sekme-sayi">{sayilar[s.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
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
        <div className="space-y-4">
          <FormAlani etiket="Site Başlığı (Title)" aciklama="Tarayıcı sekmesi ve arama sonuçları">
            <input
              className={formInputSinifi}
              value={form.seoBaslik}
              onChange={(e) => onChange({ ...form, seoBaslik: e.target.value })}
              placeholder="Örn. Güzel Teknoloji | Akıllı Alışveriş"
            />
            <KarakterSayaci uzunluk={form.seoBaslik.length} limit={TITLE_LIMIT} etiket="Title" />
          </FormAlani>
          <FormAlani etiket="Meta Açıklama" aciklama="Arama sonuçlarında görünen özet">
            <textarea
              className={formInputSinifi}
              rows={4}
              value={form.seoAciklama}
              onChange={(e) => onChange({ ...form, seoAciklama: e.target.value })}
              placeholder="Siteyi kısa ve çekici şekilde tanımlayın..."
            />
            <KarakterSayaci uzunluk={form.seoAciklama.length} limit={DESC_LIMIT} etiket="Description" />
          </FormAlani>
          <FormAlani etiket="Anahtar Kelimeler" aciklama="Virgülle ayırın (opsiyonel)">
            <input
              className={formInputSinifi}
              value={form.seoAnahtar}
              onChange={(e) => onChange({ ...form, seoAnahtar: e.target.value })}
              placeholder="teknoloji, e-ticaret, online alışveriş"
            />
          </FormAlani>
          <GorselAlan
            etiket="OG Görsel"
            aciklama="Sosyal medya paylaşımlarında kullanılır"
            deger={form.ogGorselUrl}
            onChange={(v) => onChange({ ...form, ogGorselUrl: v })}
            onizlemeSinifi="h-20 w-36 rounded-lg object-cover border border-[var(--ap-border)]"
          />
        </div>
      </AdminPanelKarti>
      <SeoSerpOnizleme
        baslik={form.seoBaslik}
        aciklama={form.seoAciklama}
        url="siteniz.com"
      />
    </div>
  );
}

interface SeoMetaTabloProps {
  kayitlar: SeoKayit[];
  kirliIdler: Set<string>;
  kaydediliyorId: string | null;
  onDegistir: (id: string, alan: 'seoTitle' | 'seoDesc', deger: string) => void;
  onKaydet: (id: string) => void;
}

export function SeoMetaTablo({
  kayitlar,
  kirliIdler,
  kaydediliyorId,
  onDegistir,
  onKaydet,
}: SeoMetaTabloProps) {
  const [arama, setArama] = useState('');
  const [sayfaBoyutu, setSayfaBoyutu] = useState(10);
  const [sayfa, setSayfa] = useState(0);

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return kayitlar;
    return kayitlar.filter(
      (k) =>
        k.etiket.toLowerCase().includes(q) ||
        k.url.toLowerCase().includes(q) ||
        (k.seoTitle ?? '').toLowerCase().includes(q) ||
        (k.seoDesc ?? '').toLowerCase().includes(q)
    );
  }, [kayitlar, arama]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / sayfaBoyutu));
  const gosterilen = filtreli.slice(sayfa * sayfaBoyutu, (sayfa + 1) * sayfaBoyutu);

  const eksikSayisi = kayitlar.filter((k) => !k.seoTitle?.trim() || !k.seoDesc?.trim()).length;
  const tamSayisi = kayitlar.length - eksikSayisi;

  return (
    <div className="ap-seo-tablo-wrap">
      <div className="ap-seo-tablo-ozet">
        <div className="ap-seo-ozet-kart">
          <span className="ap-seo-ozet-deger">{kayitlar.length}</span>
          <span className="ap-seo-ozet-etiket">Toplam URL</span>
        </div>
        <div className="ap-seo-ozet-kart ap-seo-ozet-yesil">
          <span className="ap-seo-ozet-deger">{tamSayisi}</span>
          <span className="ap-seo-ozet-etiket">SEO Tam</span>
        </div>
        <div className="ap-seo-ozet-kart ap-seo-ozet-amber">
          <span className="ap-seo-ozet-deger">{eksikSayisi}</span>
          <span className="ap-seo-ozet-etiket">Eksik</span>
        </div>
      </div>

      <div className="ap-seo-tablo-ust">
        <label className="ap-seo-sayfa-sec flex items-center gap-2 text-sm ap-muted">
          <select
            className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-1.5 text-sm"
            value={sayfaBoyutu}
            onChange={(e) => {
              setSayfaBoyutu(Number(e.target.value));
              setSayfa(0);
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} kayıt
              </option>
            ))}
          </select>
        </label>
        <div className="ap-arama ap-seo-arama">
          <div className="ap-arama-input-wrap">
            <span className="ap-arama-ikon">🔍</span>
            <input
              className={`${formInputSinifi} ap-arama-input`}
              placeholder="URL, başlık veya açıklama ara..."
              value={arama}
              onChange={(e) => {
                setArama(e.target.value);
                setSayfa(0);
              }}
            />
          </div>
        </div>
      </div>

      {filtreli.length === 0 ? (
        <p className="ap-muted py-12 text-center text-sm">Bu sekmede düzenlenecek kayıt yok.</p>
      ) : (
        <>
          <div className="ap-seo-tablo-scroll">
            <table className="ap-seo-tablo">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="w-14" />
                </tr>
              </thead>
              <tbody>
                {gosterilen.map((k) => {
                  const kirli = kirliIdler.has(k.id);
                  const kaydediliyor = kaydediliyorId === k.id;
                  const titleEksik = !k.seoTitle?.trim();
                  const descEksik = !k.seoDesc?.trim();
                  return (
                    <tr key={k.id} className={kirli ? 'ap-seo-satir-kirli' : ''}>
                      <td>
                        <a
                          href={k.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ap-seo-url-link"
                          title={k.etiket}
                        >
                          <span className="ap-seo-url-ikon" aria-hidden>
                            🏠
                          </span>
                          <span className="ap-seo-url-metin">{k.url}</span>
                        </a>
                        {(titleEksik || descEksik) && (
                          <span className="ap-seo-eksik-etiket">Eksik SEO</span>
                        )}
                      </td>
                      <td>
                        <input
                          className="ap-seo-hucre-input"
                          value={k.seoTitle ?? ''}
                          onChange={(e) => onDegistir(k.id, 'seoTitle', e.target.value)}
                          placeholder={k.etiket}
                        />
                        <KarakterSayaci
                          uzunluk={(k.seoTitle ?? '').length}
                          limit={TITLE_LIMIT}
                          etiket="T"
                        />
                      </td>
                      <td>
                        <textarea
                          className="ap-seo-hucre-textarea"
                          rows={2}
                          value={k.seoDesc ?? ''}
                          onChange={(e) => onDegistir(k.id, 'seoDesc', e.target.value)}
                          placeholder="Description"
                        />
                        <KarakterSayaci
                          uzunluk={(k.seoDesc ?? '').length}
                          limit={DESC_LIMIT}
                          etiket="D"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => onKaydet(k.id)}
                          disabled={!kirli || kaydediliyor}
                          className="ap-seo-kaydet-btn"
                          title={kirli ? 'Kaydet' : 'Değişiklik yok'}
                        >
                          {kaydediliyor ? '…' : '+'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {toplamSayfa > 1 && (
            <div className="ap-seo-sayfalama">
              <button
                type="button"
                disabled={sayfa === 0}
                onClick={() => setSayfa((p) => p - 1)}
                className="ap-seo-sayfa-btn"
              >
                Önceki
              </button>
              <span className="ap-muted text-sm">
                {sayfa + 1} / {toplamSayfa}
              </span>
              <button
                type="button"
                disabled={sayfa >= toplamSayfa - 1}
                onClick={() => setSayfa((p) => p + 1)}
                className="ap-seo-sayfa-btn"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
