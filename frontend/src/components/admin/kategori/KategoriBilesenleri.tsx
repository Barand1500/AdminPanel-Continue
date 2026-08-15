import { useMemo, useState } from 'react';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import {
  AdminAnahtarDugme,
  AdminAramaKutusu,
  AdminBosDurum,
  AdminDurumEtiketi,
  AdminFormBolumu,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import type { NavKategoriFormDegeri, NavKategoriKayit } from '@/types/navKategori';
import { navKategoriUstSecenekleri } from '@/utils/navKategoriAgaci';

export const bosKategoriForm: NavKategoriFormDegeri = {
  baslik: '',
  slug: '',
  yol: '',
  gorselUrl: '',
  ikon: '',
  aktif: true,
  sira: 0,
  ustKategoriId: null,
};

export function kategoridenForm(k: NavKategoriKayit): NavKategoriFormDegeri {
  return {
    baslik: k.baslik,
    slug: k.slug,
    yol: k.yol ?? '',
    gorselUrl: k.gorselUrl ?? '',
    ikon: k.ikon ?? '',
    aktif: k.aktif,
    sira: k.sira,
    ustKategoriId: k.ustKategoriId,
  };
}

function kategoriAramaFiltre(kayitlar: NavKategoriKayit[], arama: string): NavKategoriKayit[] {
  const q = arama.trim().toLowerCase();
  if (!q) return kayitlar;

  const eslesen = new Set(
    kayitlar
      .filter((k) => k.baslik.toLowerCase().includes(q) || k.slug.toLowerCase().includes(q))
      .map((k) => k.id)
  );

  for (const id of [...eslesen]) {
    let mevcut = kayitlar.find((k) => k.id === id);
    while (mevcut?.ustKategoriId) {
      eslesen.add(mevcut.ustKategoriId);
      mevcut = kayitlar.find((k) => k.id === mevcut?.ustKategoriId);
    }
  }

  return kayitlar.filter((k) => eslesen.has(k.id));
}

function altSayisi(kayitlar: NavKategoriKayit[], id: string) {
  return kayitlar.filter((k) => k.ustKategoriId === id).length;
}

function KategoriAgacSatiri({
  kategori,
  kayitlar,
  seciliId,
  girinti,
  onSec,
}: {
  kategori: NavKategoriKayit;
  kayitlar: NavKategoriKayit[];
  seciliId: string | null;
  girinti: number;
  onSec: (k: NavKategoriKayit) => void;
}) {
  const alt = altSayisi(kayitlar, kategori.id);

  return (
    <button
      type="button"
      onClick={() => onSec(kategori)}
      className={`ap-liste-oge ap-kategori-liste-oge${seciliId === kategori.id ? ' ap-liste-oge-secili' : ''}${girinti > 0 ? ' ap-kategori-liste-oge--alt' : ''}`}
      style={girinti > 0 ? { marginLeft: `${girinti * 1.1}rem` } : undefined}
    >
      <span className="ap-kategori-liste-ikon" aria-hidden>
        {kategori.ikon || (girinti > 0 ? '↳' : '📂')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="ap-liste-oge-baslik">{kategori.baslik}</span>
        <span className="ap-liste-oge-alt">/{kategori.slug}</span>
        <span className="ap-liste-oge-etiketler mt-1.5">
          {kategori.aktif ? (
            <AdminDurumEtiketi tur="yayinda">Aktif</AdminDurumEtiketi>
          ) : (
            <AdminDurumEtiketi tur="pasif">Pasif</AdminDurumEtiketi>
          )}
          {girinti === 1 && <AdminDurumEtiketi tur="bilgi">Alt</AdminDurumEtiketi>}
          {girinti >= 2 && <AdminDurumEtiketi tur="bilgi">Alt-alt</AdminDurumEtiketi>}
          {alt > 0 && <AdminDurumEtiketi tur="menu">{alt} alt</AdminDurumEtiketi>}
        </span>
      </span>
    </button>
  );
}

function KategoriAgacListesi({
  kayitlar,
  ustId,
  seciliId,
  girinti,
  onSec,
}: {
  kayitlar: NavKategoriKayit[];
  ustId: string | null;
  seciliId: string | null;
  girinti: number;
  onSec: (k: NavKategoriKayit) => void;
}) {
  const cocuklar = kayitlar
    .filter((k) => (ustId ? k.ustKategoriId === ustId : !k.ustKategoriId))
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, 'tr'));

  return (
    <>
      {cocuklar.map((k) => (
        <div key={k.id}>
          <KategoriAgacSatiri
            kategori={k}
            kayitlar={kayitlar}
            seciliId={seciliId}
            girinti={girinti}
            onSec={onSec}
          />
          <KategoriAgacListesi
            kayitlar={kayitlar}
            ustId={k.id}
            seciliId={seciliId}
            girinti={girinti + 1}
            onSec={onSec}
          />
        </div>
      ))}
    </>
  );
}

export function KategoriListesiPanel({
  kategoriler,
  seciliId,
  menuAcik,
  menuKaydediliyor,
  onSec,
  onMenuToggle,
}: {
  kategoriler: NavKategoriKayit[];
  seciliId: string | null;
  menuAcik: boolean;
  menuKaydediliyor?: boolean;
  onSec: (k: NavKategoriKayit) => void;
  onMenuToggle: (acik: boolean) => void;
}) {
  const [arama, setArama] = useState('');
  const filtreli = useMemo(() => kategoriAramaFiltre(kategoriler, arama), [kategoriler, arama]);

  return (
    <aside className="ap-sidebar-panel ap-sayfa-liste-panel ap-sayfa-liste-panel--tam">
      <div className="ap-sidebar-baslik">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Kategori Listesi</h2>
          <p className="ap-muted text-xs">{kategoriler.length} kategori</p>
        </div>
        <AdminAnahtarDugme
          etiket="Menüde göster"
          acik={menuAcik}
          onDegistir={onMenuToggle}
        />
      </div>
      {menuKaydediliyor && <p className="ap-kategori-liste-not">Menü ayarı kaydediliyor…</p>}
      <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Ad veya slug ara..." />
      <div className="ap-sidebar-icerik ap-sayfa-liste-kaydir">
        {filtreli.length === 0 ? (
          <AdminBosDurum
            ikon="📂"
            baslik={arama ? 'Sonuç yok' : 'Henüz kategori yok'}
            aciklama={
              arama ? 'Aramayı temizleyip tekrar deneyin' : 'Üstten Yeni Kategori sekmesine geçerek başlayın'
            }
          />
        ) : (
          <KategoriAgacListesi
            kayitlar={filtreli}
            ustId={null}
            seciliId={seciliId}
            girinti={0}
            onSec={onSec}
          />
        )}
      </div>
    </aside>
  );
}

export function KategoriEditorPanel({
  form,
  seciliId,
  kategoriler,
  onChange,
}: {
  form: NavKategoriFormDegeri;
  seciliId: string | null;
  kategoriler: NavKategoriKayit[];
  onChange: (form: NavKategoriFormDegeri) => void;
}) {
  const ustSecenekleri = navKategoriUstSecenekleri(kategoriler, seciliId ?? undefined);
  const ust = form.ustKategoriId
    ? kategoriler.find((k) => k.id === form.ustKategoriId)
    : undefined;

  return (
    <div className="ap-editor-panel ap-kategori-editor">
      <div className="ap-kategori-editor-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">
            {seciliId ? 'Kategori düzenle' : form.ustKategoriId ? 'Yeni alt kategori' : 'Yeni kategori'}
          </h2>
          <p className="ap-muted text-xs">
            {ust ? `Üst: ${ust.baslik}` : 'Ana kategori · en fazla 3 seviye'}
          </p>
        </div>
        <div className="ap-kategori-editor-ust-sag">
          {form.ustKategoriId && <AdminDurumEtiketi tur="bilgi">Alt kategori</AdminDurumEtiketi>}
          <div className={`ap-kategori-aktif-anahtar${form.aktif ? ' ap-kategori-aktif-anahtar--acik' : ''}`}>
            <AdminAnahtarDugme
              etiket="Aktif"
              acik={form.aktif}
              onDegistir={(aktif) => onChange({ ...form, aktif })}
            />
          </div>
        </div>
      </div>

      <div className="ap-kategori-editor-govde">
        <AdminFormBolumu baslik="Bilgiler" aciklama="Pasif kategoriler sitede görünmez.">
          <div className="ap-kategori-form-grid">
            <div className="ap-kategori-ad-satir">
              <label className="ap-kategori-ad-hucre">
                <span>İkon</span>
                <input
                  className={`${formInputSinifi} ap-kategori-mini-input`}
                  value={form.ikon}
                  onChange={(e) => onChange({ ...form, ikon: e.target.value })}
                  placeholder="💻"
                />
              </label>
              <label className="ap-kategori-ad-hucre ap-kategori-ad-hucre--ad">
                <span>Kategori adı</span>
                <input
                  className={formInputSinifi}
                  value={form.baslik}
                  onChange={(e) => onChange({ ...form, baslik: e.target.value })}
                  placeholder="Örn: Bilgisayar"
                />
              </label>
              <label className="ap-kategori-ad-hucre">
                <span>Sıra</span>
                <input
                  type="number"
                  min={0}
                  className={`${formInputSinifi} ap-kategori-mini-input ap-kategori-sira-input`}
                  value={form.sira}
                  onChange={(e) => onChange({ ...form, sira: Number(e.target.value) || 0 })}
                />
              </label>
            </div>
            <FormAlani etiket="Slug">
              <input
                className={formInputSinifi}
                value={form.slug}
                onChange={(e) => onChange({ ...form, slug: e.target.value })}
                placeholder="Boş bırakılırsa otomatik oluşur"
              />
            </FormAlani>
            <FormAlani etiket="Link (yol)">
              <input
                className={formInputSinifi}
                value={form.yol}
                onChange={(e) => onChange({ ...form, yol: e.target.value })}
                placeholder="Boşsa /kategori-slug kullanılır"
              />
            </FormAlani>
            <FormAlani etiket="Üst kategori">
              <select
                className={formSelectSinifi}
                value={form.ustKategoriId ?? ''}
                onChange={(e) => onChange({ ...form, ustKategoriId: e.target.value || null })}
              >
                <option value="">— Ana kategori (üst yok) —</option>
                {ustSecenekleri.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.baslik}
                  </option>
                ))}
              </select>
            </FormAlani>
          </div>
        </AdminFormBolumu>

        <GorselAlan
          etiket="Kategori görseli"
          aciklama="Menü ve kategori kartlarında kullanılır"
          deger={form.gorselUrl}
          onChange={(v) => onChange({ ...form, gorselUrl: v })}
        />
      </div>
    </div>
  );
}
