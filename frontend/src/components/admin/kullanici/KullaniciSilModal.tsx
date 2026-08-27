import { useCallback, useEffect } from 'react';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';
import type { AdminKullanici } from '@/features/admin/kullaniciApi';

interface KullaniciSilModalProps {
  kullanici: AdminKullanici | null;
  onKapat: () => void;
  onOnayla: () => void;
}

export function KullaniciSilModal({ kullanici, onKapat, onOnayla }: KullaniciSilModalProps) {
  const kapat = useCallback(() => onKapat(), [onKapat]);

  useEffect(() => {
    if (!kullanici) return;
    function tusHandler(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        kapat();
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        onOnayla();
      }
    }
    document.addEventListener('keydown', tusHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tusHandler);
      document.body.style.overflow = '';
    };
  }, [kullanici, kapat, onOnayla]);

  if (!kullanici) return null;

  return (
    <div className="ap-yap-modal-arka" role="presentation">
      <div className="erp-donen-cerceve erp-donen-cerceve-surekli">
        <span className="erp-donen-cerceve-iz" />
        <div className="erp-donen-cerceve-icerik">
          <div className="ap-yap-sil-modal" role="alertdialog" aria-modal="true" aria-labelledby="kullanici-sil-baslik">
            <header>
              <span className="ap-yap-sil-uyari"><IconAlertTriangle size={19} /></span>
              <h2 id="kullanici-sil-baslik">Bu kullanıcıyı silmek istiyor musunuz?</h2>
              <button type="button" onClick={kapat}>
                <IconX size={15} /> ESC
              </button>
            </header>
            <p>
              <strong>{kullanici.ad} ({kullanici.email})</strong> kalıcı olarak silinecektir.
              Bu işlem geri alınamaz.
            </p>
            <footer>
              <button type="button" onClick={kapat}>Vazgeç<small>(ESC)</small></button>
              <button type="button" onClick={onOnayla}>Evet, Sil<small>(ENTER)</small></button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
