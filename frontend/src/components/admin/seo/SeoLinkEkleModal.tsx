import { useCallback, useEffect, useState } from 'react';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { seoUrlNormalize } from '@/features/admin/seoApi';

export interface SeoLinkFormDegeri {
  kaynakUrl: string;
  seoTitle: string;
  seoDesc: string;
  yonlendir301: boolean;
}

interface SeoLinkEkleModalProps {
  acik: boolean;
  hedefUrl: string;
  onKapat: () => void;
  onEkle: (deger: SeoLinkFormDegeri) => void;
}

const bosForm: SeoLinkFormDegeri = {
  kaynakUrl: '',
  seoTitle: '',
  seoDesc: '',
  yonlendir301: true,
};

export function SeoLinkEkleModal({ acik, hedefUrl, onKapat, onEkle }: SeoLinkEkleModalProps) {
  const [form, setForm] = useState<SeoLinkFormDegeri>(bosForm);
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!acik) return;
    setForm(bosForm);
    setHata('');
  }, [acik, hedefUrl]);

  const kapat = useCallback(() => onKapat(), [onKapat]);

  useEffect(() => {
    if (!acik) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kapat();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [acik, kapat]);

  function kaydet() {
    const url = seoUrlNormalize(form.kaynakUrl);
    if (!url || url === '/') {
      setHata('URL zorunludur');
      return;
    }
    if (!form.seoTitle.trim()) {
      setHata('Title zorunludur');
      return;
    }
    if (!form.yonlendir301) {
      setHata('301 yönlendirme aktif olmalıdır');
      return;
    }
    onEkle({
      ...form,
      kaynakUrl: url,
      seoTitle: form.seoTitle.trim(),
      seoDesc: form.seoDesc.trim(),
    });
    kapat();
  }

  if (!acik) return null;

  return (
    <div className="ap-admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="seo-link-modal-baslik">
      <div className="ap-admin-modal ap-seo-link-modal">
        <header className="ap-admin-modal-header">
          <h2 id="seo-link-modal-baslik" className="ap-heading text-base font-semibold">
            Link Ekle
          </h2>
          <button type="button" className="ap-admin-modal-kapat" onClick={kapat} aria-label="Kapat">
            ✕
          </button>
        </header>

        <div className="ap-admin-modal-body space-y-4">
          {hata && <p className="ap-admin-modal-hata">{hata}</p>}

          <p className="ap-muted text-xs">
            Hedef: <strong className="text-[var(--ap-heading)]">{hedefUrl}</strong>
          </p>

          <FormAlani etiket="URL *">
            <input
              className={formInputSinifi}
              value={form.kaynakUrl}
              onChange={(e) => setForm({ ...form, kaynakUrl: e.target.value })}
              placeholder="/eski-url-yolu"
            />
          </FormAlani>

          <FormAlani etiket="Title *">
            <input
              className={formInputSinifi}
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              placeholder="Sayfa başlığı"
            />
          </FormAlani>

          <FormAlani etiket="Description">
            <textarea
              className={formInputSinifi}
              rows={3}
              value={form.seoDesc}
              onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
              placeholder="Description giriniz."
            />
          </FormAlani>

          <label className={`ap-toggle-kart ${form.yonlendir301 ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
            <div>
              <p className="ap-heading text-sm font-semibold">301 Olarak Yönlendir</p>
              <p className="ap-muted text-xs">Eski URL kalıcı olarak hedef sayfaya yönlendirilir</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.yonlendir301}
              onClick={() => setForm({ ...form, yonlendir301: !form.yonlendir301 })}
              className={`ap-toggle ${form.yonlendir301 ? 'ap-toggle-on' : ''}`}
            >
              <span className="ap-toggle-thumb" />
            </button>
          </label>
        </div>

        <footer className="ap-admin-modal-footer">
          <button type="button" className="ap-btn ap-btn-ikincil" onClick={kapat}>
            Kapat
          </button>
          <button type="button" className="ap-btn ap-btn-birincil" onClick={kaydet}>
            Ekle
          </button>
        </footer>
      </div>
    </div>
  );
}
