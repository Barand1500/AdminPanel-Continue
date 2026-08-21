import type { AdminKullanici, KullaniciFormDegeri } from '@/features/admin/kullaniciApi';
import { formInputSinifi } from '@/components/form/FormAlani';
import { AdminAnahtarDugme } from '@/components/admin/ortak/AdminFormBilesenleri';

export interface AtanabilirRol {
  kod: string;
  baslik: string;
}

interface KullaniciListesiProps {
  kullanicilar: AdminKullanici[];
  seciliId: string | null;
  rolBasliklari: Record<string, string>;
  onSec: (kullanici: AdminKullanici) => void;
}

export function KullaniciListesi({ kullanicilar, seciliId, rolBasliklari, onSec }: KullaniciListesiProps) {
  if (kullanicilar.length === 0) {
    return <p className="ap-muted py-4 text-sm">Henüz kullanıcı yok.</p>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-3" aria-label="Kullanıcılar">
      {kullanicilar.map((kullanici) => {
        const secili = seciliId === kullanici.id;
        const ilkHarf = (kullanici.ad || kullanici.email || '?').trim().charAt(0).toUpperCase();

        return (
          <li key={kullanici.id}>
            <button
              type="button"
              onClick={() => onSec(kullanici)}
              className={`flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition ${
                secili
                  ? 'border-[var(--ap-accent)] bg-[color-mix(in_srgb,var(--ap-accent)_12%,var(--ap-surface))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--ap-accent)_28%,transparent)_inset]'
                  : 'border-[var(--ap-border)] bg-[var(--ap-surface)] hover:border-[color-mix(in_srgb,var(--ap-accent)_48%,var(--ap-border))]'
              } ${!kullanici.aktif ? 'opacity-60' : ''}`}
              aria-pressed={secili}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ap-accent)] text-sm font-bold text-white shadow-sm">
                {ilkHarf}
              </span>
              <span className="ap-heading line-clamp-2 max-w-full text-xs font-semibold">{kullanici.ad}</span>
              <span className="ap-muted max-w-full truncate text-[10px]">{kullanici.email}</span>
              <span className="max-w-full truncate rounded-full bg-[color-mix(in_srgb,var(--ap-accent)_14%,var(--ap-surface))] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color-mix(in_srgb,var(--ap-accent)_82%,var(--ap-heading))]">
                {rolBasliklari[kullanici.rol] ?? kullanici.rol}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface KullaniciDuzenleFormuProps {
  form: KullaniciFormDegeri;
  seciliId: string | null;
  atanabilirRoller: AtanabilirRol[];
  onSifreDegisti: (degisti: boolean) => void;
  onChange: (form: KullaniciFormDegeri) => void;
}

export function KullaniciDuzenleFormu({
  form,
  seciliId,
  atanabilirRoller,
  onSifreDegisti,
  onChange,
}: KullaniciDuzenleFormuProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-[180px] flex-[1.35] flex-col gap-1">
        <span className="ap-muted text-xs font-medium">Ad Soyad <span className="text-red-400">*</span></span>
        <input
          className={formInputSinifi}
          value={form.ad}
          onChange={(event) => onChange({ ...form, ad: event.target.value })}
          required
          autoComplete="name"
        />
      </label>

      <label className="flex min-w-[190px] flex-[1.1] flex-col gap-1">
        <span className="ap-muted text-xs font-medium">E-posta <span className="text-red-400">*</span></span>
        <input
          className={formInputSinifi}
          type="email"
          value={form.email}
          onChange={(event) => onChange({ ...form, email: event.target.value })}
          required
          autoComplete="email"
        />
      </label>

      <label className="flex min-w-[170px] flex-1 flex-col gap-1">
        <span className="ap-muted text-xs font-medium">{seciliId ? 'Yeni Şifre' : 'Şifre'} {!seciliId && <span className="text-red-400">*</span>}</span>
        <input
          className={formInputSinifi}
          type="password"
          value={form.sifre}
          placeholder={seciliId ? 'Boş bırak = değişmez' : ''}
          onChange={(event) => {
            onChange({ ...form, sifre: event.target.value });
            onSifreDegisti(true);
          }}
          required={!seciliId}
          minLength={seciliId ? undefined : 6}
          autoComplete="new-password"
        />
      </label>

      <label className="flex min-w-[160px] flex-1 flex-col gap-1">
        <span className="ap-muted text-xs font-medium">Rol <span className="text-red-400">*</span></span>
        <select
          className={formInputSinifi}
          value={form.rol}
          onChange={(event) => onChange({ ...form, rol: event.target.value })}
        >
          <option value="">Seçiniz</option>
          {atanabilirRoller.map((rol) => (
            <option key={rol.kod} value={rol.kod}>{rol.baslik}</option>
          ))}
        </select>
      </label>

      <div className="flex min-w-[118px] flex-col gap-1">
        <span className="ap-muted text-xs font-medium">Durum</span>
        <div className="flex h-10 items-center justify-between rounded-lg border border-[var(--ap-border)] px-2">
          <AdminAnahtarDugme
            etiket={form.aktif ? 'Aktif' : 'Pasif'}
            acik={form.aktif}
            onDegistir={(aktif) => onChange({ ...form, aktif })}
          />
        </div>
      </div>
    </div>
  );
}
