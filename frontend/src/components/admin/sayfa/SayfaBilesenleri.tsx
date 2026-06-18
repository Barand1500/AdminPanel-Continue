import { useMemo, useState } from 'react';
import type { AltMenuGorunum, AltMenuTetikleyici, SayfaAcilisModu } from '@/types/site';
import { SayfaMenuOnizleme } from '@/components/admin/sayfa/SayfaMenuOnizleme';

const ACILIS_MODLARI: { id: SayfaAcilisModu; ad: string; aciklama: string }[] = [
  { id: 'normal', ad: 'Normal sayfa', aciklama: 'İletişim sayfası gibi tam sayfa olarak açılır' },
  { id: 'modal', ad: 'Modal pencere', aciklama: 'Menüye tıklanınca sayfa popup olarak açılır' },
  { id: 'yeni_sekme', ad: 'Yeni sekme', aciklama: 'Tarayıcıda yeni sekmede açılır' },
];

const ALT_MENU_GORUNUM: { id: AltMenuGorunum; ad: string; aciklama: string }[] = [
  { id: 'dikey', ad: 'Dikey liste', aciklama: 'Alt sayfalar aşağı doğru dropdown olarak listelenir' },
  { id: 'yatay', ad: 'Yatay şerit', aciklama: 'Alt sayfalar yan yana menü şeridinde gösterilir' },
];

const ALT_MENU_TETIK: { id: AltMenuTetikleyici; ad: string }[] = [
  { id: 'hover', ad: 'Üzerine gelince (hover)' },
  { id: 'tikla', ad: 'Tıklayınca açılsın' },
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
  dogrudanAltSayfalar,
  sayfaAgaciOlustur,
  type SayfaAgacDugumu,
  sayfaIcerikVar,
  sayfaSegmentSlug,
  sayfaTamSlugOlustur,
  ustSayfaBul,
  ustSayfaSecenekleri,
} from '@/utils/sayfaAgaci';

type EditorSekme = 'icerik' | 'seo' | 'ayarlar' | 'alt-sayfa';

interface SayfaListesiPanelProps {
  sayfalar: AdminSayfa[];
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
  onSirala?: (sayfaId: string, yon: 'yukari' | 'asagi') => void;
  islemde?: boolean;
}

function SayfaSiraTuslari({
  ilk,
  son,
  islemde,
  onYukari,
  onAsagi,
}: {
  ilk: boolean;
  son: boolean;
  islemde?: boolean;
  onYukari: () => void;
  onAsagi: () => void;
}) {
  return (
    <div className="ap-sayfa-sira-tuslar">
      <button
        type="button"
        className="ap-sayfa-sira-tus"
        disabled={ilk || islemde}
        onClick={onYukari}
        aria-label="Yukarı taşı"
        title="Yukarı"
      >
        ↑
      </button>
      <button
        type="button"
        className="ap-sayfa-sira-tus"
        disabled={son || islemde}
        onClick={onAsagi}
        aria-label="Aşağı taşı"
        title="Aşağı"
      >
        ↓
      </button>
    </div>
  );
}

function SayfaListeSatiri({
  sayfa,
  seciliId,
  onSec,
  altSayfa = false,
  duzenlemeModu,
  ilk,
  son,
  onSirala,
  islemde,
}: {
  sayfa: AdminSayfa;
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
  altSayfa?: boolean;
  duzenlemeModu: boolean;
  ilk: boolean;
  son: boolean;
  onSirala?: (sayfaId: string, yon: 'yukari' | 'asagi') => void;
  islemde?: boolean;
}) {
  return (
    <div className="ap-sayfa-liste-satir min-w-0 flex-1">
      <div className="flex items-stretch gap-1">
        {duzenlemeModu && onSirala && (
          <SayfaSiraTuslari
            ilk={ilk}
            son={son}
            islemde={islemde}
            onYukari={() => onSirala(sayfa.id, 'yukari')}
            onAsagi={() => onSirala(sayfa.id, 'asagi')}
          />
        )}
        <button
          type="button"
          onClick={() => onSec(sayfa)}
          className={`ap-liste-oge mb-1 min-w-0 flex-1 text-left ${seciliId === sayfa.id ? 'ap-liste-oge-secili' : ''} ${
            altSayfa ? 'ap-sayfa-alt-oge' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {altSayfa && <span className="ap-sayfa-alt-cizgi shrink-0" aria-hidden />}
            <p className="ap-liste-oge-baslik truncate">{sayfa.baslik}</p>
          </div>
          <p className="ap-liste-oge-alt truncate">/{sayfa.slug}</p>
          <div className="ap-liste-oge-etiketler">
            {sayfa.yayinda ? (
              <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
            ) : (
              <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
            )}
            {sayfa.menudeGoster && <AdminDurumEtiketi tur="menu">Menüde</AdminDurumEtiketi>}
            {altSayfa && <AdminDurumEtiketi tur="bilgi">Alt</AdminDurumEtiketi>}
          </div>
        </button>
      </div>
    </div>
  );
}

function SayfaAgacDallari({
  dugumler,
  seciliId,
  onSec,
  daraltildi,
  onToggle,
  girinti = 0,
  duzenlemeModu,
  onSirala,
  islemde,
}: {
  dugumler: SayfaAgacDugumu[];
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
  daraltildi: Record<string, boolean>;
  onToggle: (id: string) => void;
  girinti?: number;
  duzenlemeModu: boolean;
  onSirala?: (sayfaId: string, yon: 'yukari' | 'asagi') => void;
  islemde?: boolean;
}) {
  return (
    <>
      {dugumler.map((dugum, index) => {
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
                  onClick={() => onToggle(dugum.sayfa.id)}
                >
                  {kapali ? '▸' : '▾'}
                </button>
              ) : (
                <span className="ap-sayfa-agac-toggle ap-sayfa-agac-toggle-bos" />
              )}
              <SayfaListeSatiri
                sayfa={dugum.sayfa}
                seciliId={seciliId}
                onSec={onSec}
                altSayfa={girinti > 0}
                duzenlemeModu={duzenlemeModu}
                ilk={index === 0}
                son={index === dugumler.length - 1}
                onSirala={onSirala}
                islemde={islemde}
              />
            </div>
            {altSayi > 0 && !kapali && (
              <div className="ap-sayfa-agac-altlar">
                <SayfaAgacDallari
                  dugumler={dugum.altSayfalar}
                  seciliId={seciliId}
                  onSec={onSec}
                  daraltildi={daraltildi}
                  onToggle={onToggle}
                  girinti={girinti + 1}
                  duzenlemeModu={duzenlemeModu}
                  onSirala={onSirala}
                  islemde={islemde}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function agacFiltrele(dugumler: SayfaAgacDugumu[], q: string): SayfaAgacDugumu[] {
  if (!q) return dugumler;

  return dugumler
    .map((dugum) => {
      const kokEslesir =
        dugum.sayfa.baslik.toLowerCase().includes(q) ||
        dugum.sayfa.slug.toLowerCase().includes(q);
      const altFiltre = agacFiltrele(dugum.altSayfalar, q);
      if (kokEslesir) return { ...dugum, altSayfalar: altFiltre.length ? altFiltre : dugum.altSayfalar };
      if (altFiltre.length) return { ...dugum, altSayfalar: altFiltre };
      return null;
    })
    .filter((d): d is SayfaAgacDugumu => d != null);
}

export function SayfaListesiPanel({
  sayfalar,
  seciliId,
  onSec,
  onSirala,
  islemde,
}: SayfaListesiPanelProps) {
  const [arama, setArama] = useState('');
  const [daraltildi, setDaraltildi] = useState<Record<string, boolean>>({});
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);

  const agac = useMemo(() => sayfaAgaciOlustur(sayfalar), [sayfalar]);
  const filtreliAgac = useMemo(() => {
    const q = arama.toLowerCase().trim();
    return q ? agacFiltrele(agac, q) : agac;
  }, [agac, arama]);

  const siralaAktif = duzenlemeModu && Boolean(onSirala) && !arama.trim();

  function toggleDugum(id: string) {
    setDaraltildi((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Sayfa Listesi</h2>
          <p className="ap-muted text-xs">{sayfalar.length} sayfa</p>
        </div>
        <button
          type="button"
          className={`ap-sayfa-duzenleme-modu-tus ${duzenlemeModu ? 'ap-sayfa-duzenleme-modu-tus-aktif' : ''}`}
          onClick={() => setDuzenlemeModu((v) => !v)}
          disabled={Boolean(arama.trim())}
          title={arama.trim() ? 'Arama varken düzenleme modu kapalı' : undefined}
        >
          {duzenlemeModu ? 'Bitti' : 'Sırala'}
        </button>
      </div>
      {duzenlemeModu && siralaAktif && (
        <p className="ap-muted mb-2 px-1 text-[11px] leading-snug">
          Aynı seviyedeki sayfaları ↑ ↓ ile sıralayın. Üst sayfa değiştirmek için Ayarlar sekmesini kullanın.
        </p>
      )}
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Başlık veya slug ara..." />
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {filtreliAgac.length === 0 ? (
          <AdminBosDurum
            ikon="📄"
            baslik={arama ? 'Sonuç yok' : 'Henüz sayfa yok'}
            aciklama={arama ? 'Farklı bir arama deneyin' : 'Alttaki Yeni Ekle ile başlayın'}
          />
        ) : (
          <SayfaAgacDallari
            dugumler={filtreliAgac}
            seciliId={seciliId}
            onSec={onSec}
            daraltildi={daraltildi}
            onToggle={toggleDugum}
            duzenlemeModu={siralaAktif}
            onSirala={onSirala}
            islemde={islemde}
          />
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
  onSirala?: (sayfaId: string, yon: 'yukari' | 'asagi') => void;
  islemde?: boolean;
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
  onSirala,
  islemde,
}: SayfaEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('icerik');
  const ustSayfa = ustSayfaBul(sayfalar, form.ustSayfaId);
  const altSayi = seciliId ? altSayfaSayisi(sayfalar, seciliId) : 0;
  const seciliSayfa = seciliId ? sayfalar.find((s) => s.id === seciliId) : undefined;
  const altSayfalar = seciliId ? dogrudanAltSayfalar(sayfalar, seciliId) : [];
  const altMenuAyarlariGoster = !!seciliId && altSayi >= 1;
  const segmentSlug = form.ustSayfaId
    ? sayfaSegmentSlug(form.slug || slugUret(form.baslik))
    : form.slug;

  const sekmeler = useMemo((): { id: EditorSekme; etiket: string; ikon: string }[] => {
    const liste: { id: EditorSekme; etiket: string; ikon: string }[] = [
      { id: 'icerik', etiket: 'İçerik', ikon: '📝' },
      { id: 'seo', etiket: 'SEO', ikon: '🔍' },
      { id: 'ayarlar', etiket: 'Ayarlar', ikon: '⚙️' },
    ];
    if (seciliId) {
      liste.push({ id: 'alt-sayfa', etiket: `Alt Sayfalar${altSayi ? ` (${altSayi})` : ''}`, ikon: '📂' });
    }
    return liste;
  }, [seciliId, altSayi]);

  function altSayfaEkleBaslat() {
    if (!seciliSayfa || !onAltSayfaEkle) return;
    onAltSayfaEkle(seciliSayfa);
    setSekme('icerik');
  }

  function baslikDegistir(baslik: string) {
    const guncel = { ...form, baslik };
    if (!slugManuel && !seciliId) {
      const segment = slugUret(baslik);
      guncel.slug = ustSayfa ? sayfaTamSlugOlustur(ustSayfa.slug, segment) : segment;
    }
    onChange(guncel);
  }

  function segmentDegistir(segment: string) {
    onSlugManuelChange(true);
    const temiz = slugUret(segment);
    onChange({
      ...form,
      slug: ustSayfa ? sayfaTamSlugOlustur(ustSayfa.slug, temiz) : temiz,
    });
  }

  function ustSayfaDegistir(yeniUstId: string) {
    const ust = yeniUstId ? ustSayfaBul(sayfalar, yeniUstId) : undefined;
    const segment = sayfaSegmentSlug(form.slug || slugUret(form.baslik));
    onSlugManuelChange(true);
    onChange({
      ...form,
      ustSayfaId: yeniUstId || null,
      slug: ust ? sayfaTamSlugOlustur(ust.slug, segment) : segment,
    });
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
              ? `Üst: ${ustSayfa.baslik} · /${form.slug || '...'}`
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
          {altSayi > 0 && <AdminDurumEtiketi tur="menu">{altSayi} alt sayfa</AdminDurumEtiketi>}
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
                aciklama={
                  ustSayfa
                    ? `Tam yol: /${form.slug || '...'}`
                    : slugManuel
                      ? 'Manuel düzenleme açık'
                      : 'Başlıktan otomatik üretiliyor'
                }
              >
                <div className="flex gap-2">
                  <span className="ap-muted flex items-center rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)] px-3 text-sm whitespace-nowrap">
                    /{ustSayfa ? `${ustSayfa.slug}/` : ''}
                  </span>
                  <input
                    className={`${formInputSinifi} flex-1`}
                    value={ustSayfa ? segmentSlug : form.slug}
                    onChange={(e) =>
                      ustSayfa ? segmentDegistir(e.target.value) : segmentDegistir(e.target.value)
                    }
                    placeholder={ustSayfa ? 'hakkimizda' : 'kurumsal'}
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
              {!sayfaIcerikVar(form.icerik) && altSayi > 0 && (
                <p className="ap-muted mt-2 text-xs">
                  İçerik boş bırakılırsa menüde tıklanınca yalnızca alt kategoriler gösterilir.
                </p>
              )}
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
          <AdminFormBolumu baslik="Arama Motoru" aciklama="Google ve sosyal paylaşım meta verileri">
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
            {altMenuAyarlariGoster && (
              <AdminFormBolumu
                baslik="Alt Menü Görünümü"
                aciklama="Bu sayfanın alt kategorileri ziyaretçi sitesinde böyle açılır. Değiştirdikten sonra Kaydet'e basın."
              >
                <FormAlani etiket="Düzen">
                  <div className="ap-sayfa-alt-menu-secim-grid">
                    {ALT_MENU_GORUNUM.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`ap-sayfa-alt-menu-secim ${form.altMenuGorunum === m.id ? 'ap-sayfa-alt-menu-secim-aktif' : ''}`}
                        onClick={() => onChange({ ...form, altMenuGorunum: m.id })}
                      >
                        <span className="ap-sayfa-alt-menu-secim-baslik">{m.ad}</span>
                        <span className="ap-muted text-xs">{m.aciklama}</span>
                      </button>
                    ))}
                  </div>
                </FormAlani>
                <FormAlani etiket="Açılış tetikleyici">
                  <div className="flex flex-wrap gap-2">
                    {ALT_MENU_TETIK.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          form.altMenuTetikleyici === m.id
                            ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                            : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
                        }`}
                        onClick={() => onChange({ ...form, altMenuTetikleyici: m.id })}
                      >
                        {m.ad}
                      </button>
                    ))}
                  </div>
                </FormAlani>
                <p className="ap-muted text-xs">
                  Şu an: <strong>{form.altMenuGorunum === 'yatay' ? 'Yatay' : 'Dikey'}</strong> ·{' '}
                  <strong>{form.altMenuTetikleyici === 'tikla' ? 'Tıklama' : 'Hover'}</strong>
                </p>
              </AdminFormBolumu>
            )}

            <AdminFormBolumu baslik="Yayın ve Menü">
            {seciliId && (
              <FormAlani
                etiket="Üst sayfa"
                aciklama="Sayfanın hangi kategori altında olduğunu seçin. Değiştirdikten sonra Kaydet'e basın — URL otomatik güncellenir."
              >
                <select
                  className={formSelectSinifi}
                  value={form.ustSayfaId ?? ''}
                  onChange={(e) => ustSayfaDegistir(e.target.value)}
                >
                  <option value="">— Ana menü (üst sayfa yok) —</option>
                  {ustSayfaSecenekleri(sayfalar, seciliId).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.baslik} (/{s.slug})
                    </option>
                  ))}
                </select>
              </FormAlani>
            )}
            <FormAlani etiket="Sayfa Açılış Modu" aciklama="Menüden tıklandığında sayfanın nasıl açılacağı">
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
            {ustSayfa && (
              <p className="ap-muted text-xs">
                Mevcut üst: <strong>{ustSayfa.baslik}</strong> · /{ustSayfa.slug}
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

        {sekme === 'alt-sayfa' && seciliSayfa && (
          <>
            <AdminFormBolumu baslik="Menü Önizleme" aciklama="Canlı sitede menüde böyle görünür">
              <SayfaMenuOnizleme sayfalar={sayfalar} vurguluUstId={seciliId} />
            </AdminFormBolumu>

            <AdminFormBolumu baslik="Alt Sayfalar" aciklama={`${seciliSayfa.baslik} altındaki sayfalar`}>
              {altSayfalar.length === 0 ? (
                <p className="ap-muted text-sm">Henüz alt sayfa eklenmedi.</p>
              ) : (
                <ul className="ap-sayfa-alt-liste space-y-2">
                  {altSayfalar.map((alt, index) => (
                    <li key={alt.id} className="ap-sayfa-alt-liste-satir">
                      {onSirala && (
                        <SayfaSiraTuslari
                          ilk={index === 0}
                          son={index === altSayfalar.length - 1}
                          islemde={islemde}
                          onYukari={() => onSirala(alt.id, 'yukari')}
                          onAsagi={() => onSirala(alt.id, 'asagi')}
                        />
                      )}
                      <button
                        type="button"
                        className="ap-sayfa-alt-liste-oge min-w-0 flex-1 text-left"
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
                          {alt.menudeGoster && <AdminDurumEtiketi tur="menu">Menüde</AdminDurumEtiketi>}
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
    altMenuGorunum: s.altMenuGorunum ?? 'dikey',
    altMenuTetikleyici: s.altMenuTetikleyici ?? 'hover',
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
  altMenuGorunum: 'dikey',
  altMenuTetikleyici: 'hover',
};

export function altSayfaFormu(ustSayfa: AdminSayfa, mevcutAltSayi: number): SayfaFormDegeri {
  return {
    ...bosSayfaForm,
    ustSayfaId: ustSayfa.id,
    sira: mevcutAltSayi,
    menudeGoster: true,
    yayinda: false,
    altMenuGorunum: ustSayfa.altMenuGorunum ?? 'dikey',
    altMenuTetikleyici: ustSayfa.altMenuTetikleyici ?? 'hover',
  };
}
