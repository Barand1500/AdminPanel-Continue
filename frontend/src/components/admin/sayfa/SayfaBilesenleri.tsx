import { useMemo, useState } from 'react';
import type { AdminSayfa, SayfaFormDegeri } from '@/features/admin/sayfaApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
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

type EditorSekme = 'icerik' | 'seo' | 'ayarlar';

interface SayfaListesiPanelProps {
  sayfalar: AdminSayfa[];
  seciliId: string | null;
  onSec: (sayfa: AdminSayfa) => void;
}

export function SayfaListesiPanel({ sayfalar, seciliId, onSec }: SayfaListesiPanelProps) {
  const [arama, setArama] = useState('');

  const filtreli = useMemo(() => {
    const q = arama.toLowerCase().trim();
    if (!q) return sayfalar;
    return sayfalar.filter(
      (s) =>
        s.baslik.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );
  }, [sayfalar, arama]);

  return (
    <aside className="ap-sidebar-panel">
      <div className="ap-sidebar-baslik">
        <h2 className="ap-heading text-sm font-semibold">Sayfa Listesi</h2>
        <p className="ap-muted text-xs">{sayfalar.length} sayfa</p>
      </div>
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Başlık veya slug ara..." />
      <div className="ap-scroll ap-sidebar-icerik">
        {filtreli.length === 0 ? (
          <AdminBosDurum
            ikon="📄"
            baslik={arama ? 'Sonuç yok' : 'Henüz sayfa yok'}
            aciklama={arama ? 'Farklı bir arama deneyin' : 'Alt bardan Yeni Ekle ile başlayın'}
          />
        ) : (
          filtreli.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSec(s)}
              className={`ap-liste-oge mb-1 ${seciliId === s.id ? 'ap-liste-oge-secili' : ''}`}
            >
              <p className="ap-liste-oge-baslik">{s.baslik}</p>
              <p className="ap-liste-oge-alt">/{s.slug}</p>
              <div className="ap-liste-oge-etiketler">
                {s.yayinda ? (
                  <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                ) : (
                  <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                )}
                {s.menudeGoster && <AdminDurumEtiketi tur="menu">Menüde</AdminDurumEtiketi>}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

interface SayfaEditorPanelProps {
  form: SayfaFormDegeri;
  seciliId: string | null;
  slugManuel: boolean;
  onChange: (form: SayfaFormDegeri) => void;
  onSlugManuelChange: (v: boolean) => void;
}

export function SayfaEditorPanel({
  form,
  seciliId,
  slugManuel,
  onChange,
  onSlugManuelChange,
}: SayfaEditorPanelProps) {
  const [sekme, setSekme] = useState<EditorSekme>('icerik');

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
            {seciliId ? 'Sayfa Düzenle' : 'Yeni Sayfa'}
          </h2>
          <p className="ap-muted text-xs">
            {seciliId ? `Düzenleniyor: /${form.slug || '...'}` : 'Boş sayfa şablonu'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.yayinda ? (
            <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
          ) : (
            <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
          )}
        </div>
      </div>

      <AdminSekmeler
        aktif={sekme}
        onDegistir={setSekme}
        sekmeler={[
          { id: 'icerik', etiket: 'İçerik', ikon: '📝' },
          { id: 'seo', etiket: 'SEO', ikon: '🔍' },
          { id: 'ayarlar', etiket: 'Ayarlar', ikon: '⚙️' },
        ]}
      />

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
          <AdminFormBolumu baslik="Yayın ve Menü" aciklama="Görünürlük ve sıralama ayarları">
            <div className="ap-switch-grup">
              <AdminAnahtarDugme
                etiket="Yayında"
                acik={form.yayinda}
                onDegistir={(v) => onChange({ ...form, yayinda: v })}
              />
              <AdminAnahtarDugme
                etiket="Menüde göster"
                acik={form.menudeGoster}
                onDegistir={(v) => onChange({ ...form, menudeGoster: v })}
              />
            </div>
            <FormAlani etiket="Sıra" aciklama="Menü ve listeleme sırası (küçük = önce)">
              <input
                type="number"
                min={0}
                className={`${formInputSinifi} max-w-[120px]`}
                value={form.sira}
                onChange={(e) => onChange({ ...form, sira: Number(e.target.value) })}
              />
            </FormAlani>
          </AdminFormBolumu>
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
};
