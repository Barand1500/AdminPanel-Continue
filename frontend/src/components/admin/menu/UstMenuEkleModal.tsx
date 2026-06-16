import { useEffect, useCallback, useState } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { UstMenuOgesi } from '@/types/header';
import { AdminAnahtarDugme } from '@/components/admin/ortak/AdminFormBilesenleri';
import { formInputSinifi } from '@/components/form/FormAlani';
import {
  menuLinkGecerliMi,
  SABIT_HIZLI_LINKLER,
  yeniMenuId,
} from '@/utils/menuYardimci';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';

export interface UstMenuFormDegeri {
  ad: string;
  link: string;
  yeniSekme: boolean;
  sayfaId?: string;
}

interface UstMenuEkleModalProps {
  acik: boolean;
  onKapat: () => void;
  onKaydet: (deger: UstMenuFormDegeri) => void;
  sayfalar: AdminSayfa[];
  duzenlenen?: UstMenuOgesi | null;
}

const bosForm: UstMenuFormDegeri = {
  ad: '',
  link: '',
  yeniSekme: false,
};

export function UstMenuEkleModal({
  acik,
  onKapat,
  onKaydet,
  sayfalar,
  duzenlenen,
}: UstMenuEkleModalProps) {
  const [form, setForm] = useState<UstMenuFormDegeri>(bosForm);
  const [hizliLink, setHizliLink] = useState('');
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!acik) return;
    if (duzenlenen) {
      setForm({
        ad: duzenlenen.ad,
        link: duzenlenen.link,
        yeniSekme: duzenlenen.yeniSekme,
        sayfaId: duzenlenen.sayfaId,
      });
      setHizliLink(duzenlenen.sayfaId ? `sayfa:${duzenlenen.sayfaId}` : '');
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
        setForm({
          ad: sayfa.baslik,
          link: sayfaYolunuBul(sayfa.slug),
          yeniSekme: false,
          sayfaId: sayfa.id,
        });
      }
      return;
    }

    const sabit = SABIT_HIZLI_LINKLER.find((s) => s.link === deger);
    if (sabit) {
      const eslesen = sayfalar.find((s) => sayfaYolunuBul(s.slug) === sabit.link);
      setForm({
        ad: sabit.ad,
        link: sabit.link,
        yeniSekme: false,
        sayfaId: eslesen?.id,
      });
    }
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
            {duzenlenen ? 'Menü Düzenle' : 'Menü Ekle'}
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
            <select
              value={hizliLink}
              onChange={(e) => hizliLinkSec(e.target.value)}
              className={formInputSinifi}
            >
              <option value="">Seçiniz</option>
              <optgroup label="Sabit sayfalar">
                {SABIT_HIZLI_LINKLER.map((s) => (
                  <option key={s.link} value={s.link}>
                    {s.ad} ({s.link})
                  </option>
                ))}
              </optgroup>
              {yayindakiSayfalar.length > 0 && (
                <optgroup label="Yayındaki sayfalar">
                  {yayindakiSayfalar.map((s) => (
                    <option key={s.id} value={`sayfa:${s.id}`}>
                      {s.baslik} ({sayfaYolunuBul(s.slug)})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>

          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">
              Adı <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.ad}
              onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
              className={formInputSinifi}
              placeholder="Menüde görünecek metin"
            />
          </label>

          <label className="block">
            <span className="ap-muted mb-1 block text-xs font-medium">
              Link <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.link}
              onChange={(e) =>
                setForm((f) => ({ ...f, link: e.target.value, sayfaId: undefined }))
              }
              className={formInputSinifi}
              placeholder="/sayfa/hakkimizda veya https://..."
            />
            <p className="ap-muted mt-1 text-[11px]">
              Ödeme Bildirim Formu için sadece <code className="text-xs">#odemeBildirimFormu</code> yazınız.
            </p>
          </label>

          <AdminAnahtarDugme
            etiket="Yeni sekmede açılsın"
            acik={form.yeniSekme}
            onDegistir={(yeniSekme) => setForm((f) => ({ ...f, yeniSekme }))}
          />
        </div>

        <footer className="ap-admin-modal-footer">
          <button
            type="button"
            onClick={kapat}
            className="rounded-lg border border-[var(--ap-border)] px-4 py-2 text-sm font-medium ap-muted transition hover:bg-[var(--ap-hover)]"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={gonder}
            className="rounded-lg bg-[var(--ap-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Kaydet
          </button>
        </footer>
      </div>
    </div>
  );
}

export function yeniUstMenuOgesi(deger: UstMenuFormDegeri, sira: number): UstMenuOgesi {
  return {
    id: yeniMenuId(),
    ad: deger.ad,
    link: deger.link,
    yeniSekme: deger.yeniSekme,
    sira,
    sayfaId: deger.sayfaId,
  };
}
