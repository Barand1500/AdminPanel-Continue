import { useCallback, useEffect, useState } from 'react';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminModulKabuk, AdminPanelKarti, BildirimKutusu } from '@/components/admin/ortak/AdminBilesenleri';
import {
  KISAYOL_ISLEMLERI,
  kisayolAyarlariKaydet,
  kisayolAyarlariOku,
  kisayolCakismaBul,
  tusKombinasyonuYakala,
  varsayilanKisayollar,
  type KisayolHaritasi,
  type KisayolIslemId,
} from '@/utils/kisayolAyarlari';

export function KisayolAyarlariSayfasi() {
  const [harita, setHarita] = useState<KisayolHaritasi>(() => kisayolAyarlariOku());
  const [dinlenen, setDinlenen] = useState<KisayolIslemId | null>(null);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const kaydet = useCallback(() => {
    setHata('');
    for (const islem of KISAYOL_ISLEMLERI) {
      const cakisma = kisayolCakismaBul(harita, islem.id, harita[islem.id]);
      if (cakisma) {
        const digerIslem = KISAYOL_ISLEMLERI.find((item) => item.id === cakisma);
        setHata(`“${harita[islem.id]}” kombinasyonu hem ${islem.etiket} hem ${digerIslem?.etiket} için atanmış.`);
        return;
      }
    }

    kisayolAyarlariKaydet(harita);
    window.dispatchEvent(new CustomEvent('ap-kisayol-ayarlari-guncellendi'));
    setBasari('Kısayol ayarları kaydedildi.');
  }, [harita]);

  useModulAksiyonlari({ kaydet }, { kaydet: true });

  useEffect(() => {
    if (!dinlenen) return;

    function tusDinle(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();

      const kombinasyon = tusKombinasyonuYakala(e);
      if (!kombinasyon || ['Ctrl', 'Alt', 'Shift'].includes(kombinasyon)) return;

      const islem = dinlenen;
      const cakisma = kisayolCakismaBul(harita, islem, kombinasyon);
      if (cakisma) {
        const digerIslem = KISAYOL_ISLEMLERI.find((item) => item.id === cakisma);
        setHata(`Bu kombinasyon zaten “${digerIslem?.etiket}” için kullanılıyor.`);
        setDinlenen(null);
        return;
      }

      setHarita((onceki) => ({ ...onceki, [islem]: kombinasyon }));
      setDinlenen(null);
      setHata('');
      setBasari(`“${KISAYOL_ISLEMLERI.find((item) => item.id === islem)?.etiket}” kısayolu güncellendi. Kaydet ile uygulayın.`);
    }

    window.addEventListener('keydown', tusDinle, true);
    return () => window.removeEventListener('keydown', tusDinle, true);
  }, [dinlenen, harita]);

  return (
    <AdminModulKabuk onizleGoster={false}>
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}

      <AdminPanelKarti baslik="Klavye Kısayolları" altBaslik="Tuş dinle ile yeni kombinasyon atayın">
        <p className="ap-muted mb-3 text-xs">Kısayol tercihleriniz bu tarayıcıda saklanır.</p>

        <div className="space-y-3">
          {KISAYOL_ISLEMLERI.map((islem) => (
            <div
              key={islem.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--ap-border)] p-3"
            >
              <div>
                <p className="ap-heading text-sm font-medium">{islem.etiket}</p>
                <p className="ap-muted text-xs">{islem.aciklama}</p>
              </div>

              <div className="flex items-center gap-2">
                <kbd className="rounded border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-1 font-mono text-xs">
                  {harita[islem.id]}
                </kbd>
                <button
                  type="button"
                  onClick={() => {
                    setDinlenen(islem.id);
                    setHata('');
                    setBasari('');
                  }}
                  className={`rounded border px-2 py-1 text-xs transition-colors ${
                    dinlenen === islem.id
                      ? 'border-amber-500 bg-amber-600 text-white'
                      : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
                  }`}
                >
                  {dinlenen === islem.id ? 'Tuşa basın...' : 'Tuş dinle'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setHarita(varsayilanKisayollar());
            setDinlenen(null);
            setHata('');
            setBasari('Varsayılan kısayollar yüklendi. Kaydet ile uygulayın.');
          }}
          className="mt-4 text-xs font-medium text-orange-500 hover:underline"
        >
          Varsayılana sıfırla
        </button>
      </AdminPanelKarti>
    </AdminModulKabuk>
  );
}
