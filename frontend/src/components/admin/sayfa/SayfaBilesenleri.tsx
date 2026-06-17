import { useMemo, useState } from 'react';
import type { SayfaAcilisModu } from '@/types/site';
import { SayfaMenuOnizleme } from '@/components/admin/sayfa/SayfaMenuOnizleme';

const ACILIS_MODLARI: { id: SayfaAcilisModu; ad: string; aciklama: string }[] = [
  { id: 'normal', ad: 'Normal sayfa', aciklama: 'İletişim sayfası gibi tam sayfa olarak açılır' },
  { id: 'modal', ad: 'Modal pencere', aciklama: 'Menüye tıklanınca sayfa popup olarak açılır' },
  { id: 'yeni_sekme', ad: 'Yeni sekme', aciklama: 'Tarayıcıda yeni sekmede açılır' },
];
import type { AdminSayfa, SayfaFormDegeri } from '@/features/admin/sayfaApi';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { IcerikHtmlEditoru } from '@/components/form/IcerikHtmlEditoru';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
  AdminSekmeler,
  slugUret,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  altSayfaSayisi,
  sayfaAgaciOlustur,
  ustSayfaBul,
  ustSayfaSecenekleri,
} from '@/utils/sayfaAgaci';
import { idString } from '@/utils/idKarsilastir';

type EditorSekme = 'icerik' | 'seo' | 'ayarlar' | 'alt-sayfa';

interface SayfaListesiPanelProps {
  sayfalar: AdminSayfa[];
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
  onYeniSayfa?: () => void;
  onAltSayfaEkle?: (ustSayfa: AdminSayfa) => void;
}

function SayfaListeSatiri({
  sayfa,
  seciliId,
  onSec,
  girinti = 0,
  altSayfa = false,
}: {
  sayfa: AdminSayfa;
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
  girinti?: number;
  altSayfa?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSec(sayfa)}
      className={`ap-liste-oge mb-1 ${seciliId === sayfa.id ? 'ap-liste-oge-secili' : ''} ${altSayfa ? 'ap-sayfa-alt-oge' : ''}`}
      style={girinti > 0 ? { marginLeft: `${girinti * 12}px` } : undefined}
    >
      <div className="flex items-center gap-1.5">
        {altSayfa && <span className="ap-sayfa-alt-cizgi" aria-hidden />}
        <p className="ap-liste-oge-baslik">{sayfa.baslik}</p>
      </div>
      <p className="ap-liste-oge-alt">/{sayfa.slug}</p>
      <div className="ap-liste-oge-etiketler">
        {sayfa.yayinda ? (
          <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
        ) : (
          <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
        )}
        {sayfa.menudeGoster && !altSayfa && <AdminDurumEtiketi tur="menu">Menüde</AdminDurumEtiketi>}
        {altSayfa && <AdminDurumEtiketi tur="bilgi">Alt sayfa</AdminDurumEtiketi>}
      </div>
    </button>
  );
}

export function SayfaListesiPanel({
  sayfalar,
  seciliId,
  onSec,
  onYeniSayfa,
  onAltSayfaEkle,
}: SayfaListesiPanelProps) {
  const [arama, setArama] = useState('');
  const [daraltildi, setDaraltildi] = useState<Record<string, boolean>>({});

  const agac = useMemo(() => sayfaAgaciOlustur(sayfalar), [sayfalar]);

  const filtreliAgac = useMemo(() => {
    const q = arama.toLowerCase().trim();
    if (!q) return agac;

    return agac
      .map((dugum) => {
        const kokEslesir =
          dugum.sayfa.baslik.toLowerCase().includes(q) ||
          dugum.sayfa.slug.toLowerCase().includes(q);
        const altEslesen = dugum.altSayfalar.filter(
          (s) => s.baslik.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
        );
        if (kokEslesir) return { ...dugum, altSayfalar: altEslesen.length ? altEslesen : dugum.altSayfalar };
        if (altEslesen.length) return { ...dugum, altSayfalar: altEslesen };
        return null;
      })
      .filter((d): d is (typeof agac)[number] => d != null);
  }, [agac, arama]);

  const seciliSayfa = seciliId ? sayfalar.find((s) => s.id === seciliId) : undefined;
  const altSayfaEklenebilir = seciliSayfa && !seciliSayfa.ustSayfaId;

  function toggleDugum(id: string) {
    setDaraltildi((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <aside className="ap-sidebar-panel">
      {(onYeniSayfa || altSayfaEklenebilir) && (
        <div className="ap-sayfa-aksiyon-cubugu">
          {onYeniSayfa && (
            <button type="button" className="ap-sayfa-aksiyon-btn ap-sayfa-aksiyon-yeni" onClick={onYeniSayfa}>
              Yeni Sayfa
            </button>
          )}
          {altSayfaEklenebilir && onAltSayfaEkle && seciliSayfa && (
            <button
              type="button"
              className="ap-sayfa-aksiyon-btn ap-sayfa-aksiyon-alt"
              onClick={() => onAltSayfaEkle(seciliSayfa)}
            >
              Alt Sayfa
            </button>
          )}
        </div>
      )}
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Sayfa Listesi</h2>
          <p className="ap-muted text-xs">{sayfalar.length} sayfa</p>
        </div>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Başlık veya slug ara..." />
      <div className="ap-scroll ap-sidebar-icerik">
        {filtreliAgac.length === 0 ? (
          <AdminBosDurum
            ikon="📄"
            baslik={arama ? 'Sonuç yok' : 'Henüz sayfa yok'}
            aciklama={arama ? 'Farklı bir arama deneyin' : 'Alt bardan Yeni Ekle ile başlayın'}
          />
        ) : (
          filtreliAgac.map((dugum) => {
            const altSayi = dugum.altSayfalar.length;
            const kapali = daraltildi[dugum.sayfa.id];

            return (
              <div key={dugum.sayfa.id} className="ap-sayfa-agac-dugum">
                <div className="flex items-stretch gap-0.5">
                  {altSayi > 0 ? (
                    <button
                      type="button"
                      className="ap-sayfa-agac-toggle"
                      aria-label={kapali ? 'Alt sayfaları aç' : 'Alt sayfaları kapat'}
                      onClick={() => toggleDugum(dugum.sayfa.id)}
                    >
                      {kapali ? '▸' : '▾'}
                    </button>
                  ) : (
                    <span className="ap-sayfa-agac-toggle ap-sayfa-agac-toggle-bos" />
                  )}
                  <div className="min-w-0 flex-1">
                    <SayfaListeSatiri sayfa={dugum.sayfa} seciliId={seciliId} onSec={onSec} />
                  </div>
                </div>
                {altSayi > 0 && !kapali && (
                  <div className="ap-sayfa-agac-altlar">
                    {dugum.altSayfalar.map((alt) => (
                      <SayfaListeSatiri
                        key={alt.id}
                        sayfa={alt}
                        seciliId={seciliId}
                        onSec={onSec}
                        girinti={2}
                        altSayfa
                      />
                    ))}
                  </div>
                )}
                {altSayi > 0 && (
                  <p className="ap-sayfa-agac-etiket ap-muted px-2 pb-1 text-[10px]">
                    {altSayi} alt sayfa
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

interface SayfaEditorPanelProps {
  form: SayfaFormDegeri;
  seciliId: string | null;
  slugManuel: boolean;
  sayfalar: AdminSayfa[];
  onChange: (form: SayfaFormDegeri) => void;
  onSlugManuelChange: (v: boolean) => void;
  onAltSayfaEkle?: (ustSayfa: AdminSayfa) => void;
  onSayfaSec?: (sayfa: AdminSayfa) => void;
}

export function SayfaEditorPanel({
  form,
  seciliId,
  slugManuel,
  sayfalar,
  onChange,
  onSlugManuelChange,
  onAltSayfaEkle,
  onSayfaSec,
}: SayfaEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('icerik');
  const ustSecenekler = ustSayfaSecenekleri(sayfalar, seciliId);
  const ustSayfa = ustSayfaBul(sayfalar, form.ustSayfaId);
  const altSayi = seciliId ? altSayfaSayisi(sayfalar, seciliId) : 0;
  const seciliSayfa = seciliId ? sayfalar.find((s) => s.id === seciliId) : undefined;
  const altSayfaEklenebilir = !!seciliSayfa && !seciliSayfa.ustSayfaId;
  const altSayfalar = useMemo(
    () =>
      seciliId
        ? sayfalar
            .filter((s) => s.ustSayfaId && idString(s.ustSayfaId) === idString(seciliId))
            .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'))
        : [],
    [sayfalar, seciliId]
  );

  const sekmeler = useMemo((): { id: EditorSekme; etiket: string; ikon: string }[] => {
    const liste: { id: EditorSekme; etiket: string; ikon: string }[] = [
      { id: 'icerik', etiket: 'İçerik', ikon: '📝' },
      { id: 'seo', etiket: 'SEO', ikon: '🔍' },
      { id: 'ayarlar', etiket: 'Ayarlar', ikon: '⚙️' },
    ];
    if (altSayfaEklenebilir) {
      liste.push({ id: 'alt-sayfa', etiket: 'Alt Sayfalar', ikon: '📂' });
    }
    return liste;
  }, [altSayfaEklenebilir]);

  function altSayfaEkleBaslat() {
    if (!seciliSayfa || !onAltSayfaEkle) return;
    onAltSayfaEkle(seciliSayfa);
    setSekme('icerik');
  }

  function baslikDegistir(baslik: string) {
    const guncel = { ...form, baslik };
    if (!slugManuel && !seciliId) {
      guncel.slug = slugUret(baslik);
    }
    onChange(guncel);
  }

  return (
    <div className="ap-editor-panel">
      <div className="ap-editor-baslik">
        <div>
          <h2 className="ap-heading text-base font-semibold">
            {seciliId ? 'Sayfa Düzenle' : form.ustSayfaId ? 'Yeni Alt Sayfa' : 'Yeni Sayfa'}
          </h2>
          <p className="ap-muted text-xs">
            {ustSayfa
              ? `Kategori: ${ustSayfa.baslik} · /${form.slug || '...'}`
              : seciliId
                ? `Düzenleniyor: /${form.slug || '...'}`
                : 'Boş sayfa şablonu'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.yayinda ? (
            <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
          ) : (
            <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
          )}
          {form.ustSayfaId && <AdminDurumEtiketi tur="bilgi">Alt sayfa</AdminDurumEtiketi>}
          {altSayi > 0 && (
            <AdminDurumEtiketi tur="menu">{altSayi} alt sayfa</AdminDurumEtiketi>
          )}
        </div>
      </div>

      <AdminSekmeler aktif={sekme} onDegistir={setSekme} sekmeler={sekmeler} />

      <div className="ap-editor-icerik">
        {sekme === 'icerik' && (
          <>
            <AdminFormBolumu baslik="Temel Bilgiler" aciklama="Sayfa başlığı ve URL yolu">
              <FormAlani etiket="Başlık" aciklama="Ziyaretçi ve menüde görünecek ad">
                <input
                  className={formInputSinifi}
                  value={form.baslik}
                  onChange={(e) => baslikDegistir(e.target.value)}
                  placeholder="Örnek: Hakkımızda"
                  required
                />
              </FormAlani>
              <FormAlani
                etiket="Slug (URL)"
                aciklama={slugManuel ? 'Manuel düzenleme açık' : 'Başlıktan otomatik üretiliyor'}
              >
                <div className="flex gap-2">
                  <span className="ap-muted flex items-center rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)] px-3 text-sm">
                    /
                  </span>
                  <input
                    className={`${formInputSinifi} flex-1`}
                    value={form.slug}
                    onChange={(e) => {
                      onSlugManuelChange(true);
                      onChange({ ...form, slug: slugUret(e.target.value) });
                    }}
                    placeholder="hakkimizda"
                  />
                </div>
              </FormAlani>
            </AdminFormBolumu>

            <AdminFormBolumu baslik="İçerik" aciklama="Görsel editör veya HTML kodu ile sayfa içeriği oluşturun">
              <IcerikHtmlEditoru
                deger={form.icerik}
                onChange={(icerik) => onChange({ ...form, icerik })}
                placeholder="Sayfa içeriğinizi yazın..."
              />
            </AdminFormBolumu>

            <GorselAlan
              etiket="Kapak Görseli"
              aciklama="Opsiyonel üst görsel — URL veya bilgisayardan yükleyin"
              deger={form.kapakGorsel}
              onChange={(v) => onChange({ ...form, kapakGorsel: v })}
            />
          </>
        )}

        {sekme === 'seo' && (
          <AdminFormBolumu baslik="Arama Motoru" aciklama="Google ve sosyal paylasim meta verileri">
            <FormAlani etiket="SEO Başlık" aciklama="Tarayıcı sekmesinde görünür (max ~60 karakter)">
              <input
                className={formInputSinifi}
                value={form.seoTitle}
                onChange={(e) => onChange({ ...form, seoTitle: e.target.value })}
                placeholder={form.baslik || 'Sayfa başlığı'}
              />
            </FormAlani>
            <FormAlani etiket="Meta Açıklama" aciklama="Arama sonuçlarında görünen özet">
              <textarea
                className={formInputSinifi}
                rows={3}
                value={form.seoDesc}
                onChange={(e) => onChange({ ...form, seoDesc: e.target.value })}
                placeholder="Kısa açıklama..."
              />
            </FormAlani>
          </AdminFormBolumu>
        )}

        {sekme === 'ayarlar' && (
          <>
            <AdminFormBolumu baslik="Sayfa Açılış Modu" aciklama="Menüden tıklandığında sayfanın nasıl açılacağını belirleyin">
              <FormAlani etiket="Açılış şekli">
                <select
                  className={formSelectSinifi}
                  value={form.acilisModu}
                  onChange={(e) => onChange({ ...form, acilisModu: e.target.value as SayfaAcilisModu })}
                >
                  {ACILIS_MODLARI.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad}
                    </option>
                  ))}
                </select>
              </FormAlani>
              <p className="ap-muted text-xs">
                {ACILIS_MODLARI.find((m) => m.id === form.acilisModu)?.aciklama}
              </p>
            </AdminFormBolumu>

            <AdminFormBolumu baslik="Yayın ve Menü">
              <FormAlani etiket="Üst sayfa">
                <select
                  className={formSelectSinifi}
                  value={form.ustSayfaId ?? ''}
                  disabled={altSayi > 0}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      ustSayfaId: e.target.value || null,
                      menudeGoster: true,
                    })
                  }
                >
                  <option value="">Ana menü (üst seviye)</option>
                  {ustSecenekler.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.baslik}
                    </option>
                  ))}
                </select>
              </FormAlani>
              {ustSayfa && (
                <p className="ap-muted text-xs">
                  {ustSayfa.baslik} altında listelenir
                </p>
              )}
              <div className="ap-switch-grup">
                <AdminAnahtarDugme
                  etiket="Yayında"
                  acik={form.yayinda}
                  onDegistir={(v) => onChange({ ...form, yayinda: v })}
                />
                <AdminAnahtarDugme
                  etiket={form.ustSayfaId ? 'Alt menüde göster' : 'Menüde göster'}
                  acik={form.menudeGoster}
                  onDegistir={(v) => onChange({ ...form, menudeGoster: v })}
                />
              </div>
              <FormAlani
                etiket="Sıra"
                aciklama={
                  form.ustSayfaId
                    ? 'Üst sayfa altındaki sıralama (küçük = önce)'
                    : 'Ana menü sırası (küçük = önce)'
                }
              >
                <input
                  type="number"
                  min={0}
                  className={`${formInputSinifi} max-w-[120px]`}
                  value={form.sira}
                  onChange={(e) => onChange({ ...form, sira: Number(e.target.value) })}
                />
              </FormAlani>
            </AdminFormBolumu>
          </>
        )}

        {sekme === 'alt-sayfa' && altSayfaEklenebilir && seciliSayfa && (
          <>
            <AdminFormBolumu
              baslik="Menü Önizleme"
              aciklama="Ana menüde dropdown olarak görünecek alt sayfalar"
            >
              <SayfaMenuOnizleme sayfalar={sayfalar} vurguluUstId={seciliId} />
            </AdminFormBolumu>

            <AdminFormBolumu
              baslik="Alt Sayfalar"
              aciklama={`${seciliSayfa.baslik} menüsü altındaki sayfalar`}
            >
              {altSayfalar.length === 0 ? (
                <p className="ap-muted text-sm">Henüz alt sayfa eklenmedi.</p>
              ) : (
                <ul className="ap-sayfa-alt-liste space-y-2">
                  {altSayfalar.map((alt) => (
                    <li key={alt.id}>
                      <button
                        type="button"
                        className="ap-sayfa-alt-liste-oge w-full text-left"
                        onClick={() => onSayfaSec?.(alt)}
                      >
                        <span className="ap-heading text-sm font-medium">{alt.baslik}</span>
                        <span className="ap-muted block text-xs">/{alt.slug}</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {alt.yayinda ? (
                            <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                          ) : (
                            <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                          )}
                          {alt.menudeGoster && (
                            <AdminDurumEtiketi tur="menu">Menüde</AdminDurumEtiketi>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                className="ap-btn ap-btn-birincil mt-4 text-sm"
                onClick={altSayfaEkleBaslat}
              >
                + Yeni Alt Sayfa Ekle
              </button>

              <p className="ap-muted mt-3 text-xs">
                Alt sayfalar kaydedilip yayınlandığında ve &quot;Alt menüde göster&quot; açıkken üst
                sayfa menüsünde dropdown olarak listelenir.
              </p>
            </AdminFormBolumu>
          </>
        )}
      </div>
    </div>
  );
}

export function sayfadanForm(s: AdminSayfa): SayfaFormDegeri {
  return {
    baslik: s.baslik,
    slug: s.slug,
    icerik: s.icerik,
    kapakGorsel: s.kapakGorsel ?? '',
    seoTitle: s.seoTitle ?? '',
    seoDesc: s.seoDesc ?? '',
    yayinda: s.yayinda,
    menudeGoster: s.menudeGoster,
    sira: s.sira,
    acilisModu: s.acilisModu ?? 'normal',
    ustSayfaId: s.ustSayfaId ?? null,
  };
}

export const bosSayfaForm: SayfaFormDegeri = {
  baslik: '',
  slug: '',
  icerik: '',
  kapakGorsel: '',
  seoTitle: '',
  seoDesc: '',
  yayinda: false,
  menudeGoster: true,
  sira: 0,
  acilisModu: 'normal',
  ustSayfaId: null,
};

export function altSayfaFormu(ustSayfa: AdminSayfa, mevcutAltSayi: number): SayfaFormDegeri {
  return {
    ...bosSayfaForm,
    ustSayfaId: ustSayfa.id,
    sira: mevcutAltSayi,
    menudeGoster: true,
    yayinda: false,
  };
}
