import { useCallback, useEffect, useState } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { FooterLink } from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';
import { menuLinkGecerliMi, SABIT_HIZLI_LINKLER } from '@/utils/menuYardimci';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';

export interface FooterLinkFormDegeri {
  ad: string;
  link: string;
  yeniSekme: boolean;
}

interface FooterLinkModalProps {
  acik: boolean;
  onKapat: () => void;
  onKaydet: (deger: FooterLinkFormDegeri) => void;
  sayfalar: AdminSayfa[];
  duzenlenen?: FooterLink | null;
}

const bosForm: FooterLinkFormDegeri = { ad: '', link: '', yeniSekme: false };

export function FooterLinkModal({
  acik,
  onKapat,
  onKaydet,
  sayfalar,
  duzenlenen,
}: FooterLinkModalProps) {
  const [form, setForm] = useState<FooterLinkFormDegeri>(bosForm);
  const [hizliLink, setHizliLink] = useState('');
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!acik) return;
    if (duzenlenen) {
      setForm({ ad: duzenlenen.ad, link: duzenlenen.link, yeniSekme: duzenlenen.yeniSekme });
      setHizliLink('');
    } else {
      setForm(bosForm);
      setHizliLink('');
    }
    setHata('');
  }, [acik, duzenlenen]);

  const kapat = useCallback(() => onKapat(), [onKapat]);

  useEffect(() => {
    if (!acik) return;
    function tusHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        kapat();
      }
    }
    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tusHandler);
      document.body.style.overflow = '';
    };
  }, [acik, kapat]);

  if (!acik) return null;

  const hizliLinkSec = (deger: string) => {
    setHizliLink(deger);
    if (!deger) return;
    if (deger.startsWith('sayfa:')) {
      const sayfaId = deger.slice(6);
      const sayfa = sayfalar.find((s) => s.id === sayfaId);
      if (sayfa) {
        setForm({ ad: sayfa.baslik, link: sayfaYolunuBul(sayfa.slug), yeniSekme: false });
      }
      return;
    }
    const sabit = SABIT_HIZLI_LINKLER.find((s) => s.link === deger);
    if (sabit) setForm({ ad: sabit.ad, link: sabit.link, yeniSekme: false });
  };

  const gonder = () => {
    const ad = form.ad.trim();
    const link = form.link.trim();
    if (!ad) {
      setHata('Ad alanı zorunludur.');
      return;
    }
    if (!menuLinkGecerliMi(link)) {
      setHata('Geçerli bir link girin (/yol, https://... veya #anchor).');
      return;
    }
    onKaydet({ ...form, ad, link });
    kapat();
  };

  const yayindakiSayfalar = sayfalar.filter((s) => s.yayinda);

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="ap-admin-modal">
        <header className="ap-admin-modal-header">
          <h2 className="ap-heading text-base font-semibold">
            {duzenlenen ? 'Link Düzenle' : 'Link Ekle'}
          </h2>
          <button
            type="button"
            onClick={kapat}
            className="rounded-lg p-1.5 ap-muted transition hover:bg-[var(--ap-hover)]"
            aria-label="Kapat"
          >
            ✕
          </button>
        </header>

        <div className="ap-admin-modal-body space-y-4">
          {hata && <p className="ap-admin-modal-hata">{hata}</p>}

          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">Hızlı Link Bul</span>
            <select value={hizliLink} onChange={(e) => hizliLinkSec(e.target.value)} className={formInputSinifi}>
              <option value="">Seçiniz</option>
              <optgroup label="Sabit sayfalar">
                {SABIT_HIZLI_LINKLER.map((s) => (
                  <option key={s.link} value={s.link}>
                    {s.ad}
                  </option>
                ))}
              </optgroup>
              {yayindakiSayfalar.length > 0 && (
                <optgroup label="Yayında sayfalar">
                  {yayindakiSayfalar.map((s) => (
                    <option key={s.id} value={`sayfa:${s.id}`}>
                      {s.baslik}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>

          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">Ad</span>
            <input
              type="text"
              value={form.ad}
              onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
              className={formInputSinifi}
              placeholder="Link metni"
            />
          </label>

          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">Link</span>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              className={formInputSinifi}
              placeholder="/sayfa veya https://..."
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.yeniSekme}
              onChange={(e) => setForm((f) => ({ ...f, yeniSekme: e.target.checked }))}
              className="rounded border-[var(--ap-border)]"
            />
            <span className="text-sm">Yeni sekmede aç</span>
          </label>
        </div>

        <footer className="ap-admin-modal-footer">
          <button
            type="button"
            onClick={kapat}
            className="rounded-lg border border-[var(--ap-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--ap-hover)]"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={gonder}
            className="rounded-lg bg-[var(--ap-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {duzenlenen ? 'Güncelle' : 'Ekle'}
          </button>
        </footer>
      </div>
    </div>
  );
}
