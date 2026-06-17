import { useCallback, useEffect, useState } from 'react';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminModulKabuk, AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { UstSekmeCubugu } from '@/components/admin/UstSekmeCubugu';
import type { AdminSekme } from '@/types/admin';
import {
  VARSAYILAN_SEKME_AYARLARI,
  sekmeAyarlariKaydet,
  sekmeAyarlariOku,
  type SekmePanelAyarlari,
} from '@/utils/sekmePanelAyarlari';

const ORNEK_SEKMELER: AdminSekme[] = [
  { id: 'o1', modulId: 'dashboard', baslik: 'Dashboard' },
  { id: 'o2', modulId: 'sayfalar', baslik: 'Sayfalar' },
  { id: 'o3', modulId: 'hero', baslik: 'Hero Yönetimi' },
];

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-[var(--ap-border)] p-3">
      <div>
        <p className="ap-heading text-sm font-medium">{etiket}</p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}

export function SekmeYonetimiSayfasi() {
  const [ayarlar, setAyarlar] = useState<SekmePanelAyarlari>(() => sekmeAyarlariOku());
  const [ornekAktif, setOrnekAktif] = useState('o1');

  const kaydet = useCallback(() => {
    sekmeAyarlariKaydet(ayarlar);
    window.dispatchEvent(new CustomEvent('ap-sekme-ayarlari-guncellendi'));
  }, [ayarlar]);

  useModulAksiyonlari({ kaydet }, { kaydet: true });

  useEffect(() => {
    const handler = () => setAyarlar(sekmeAyarlariOku());
    window.addEventListener('ap-sekme-ayarlari-guncellendi', handler);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', handler);
  }, []);

  return (
    <AdminModulKabuk
      baslik="Sekme Yönetimi"
      aciklama="Üst sekme çubuğunun boyutunu, önizlemesini, gruplama ve yan yana görünüm davranışını ayarlayın."
      onizleGoster={false}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminPanelKarti baslik="Sekme Ayarları" altBaslik="Değişiklikler Kaydet ile uygulanır">
          <div className="space-y-4">
            <div>
              <p className="ap-heading mb-2 text-sm font-medium">Sekme görünümü</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'ikon-isim', ad: 'İkon + İsim' },
                    { id: 'isim', ad: 'Sadece İsim' },
                    { id: 'ikon', ad: 'Sadece İkon' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAyarlar((a) => ({ ...a, sekmeGorunumModu: m.id }))}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      ayarlar.sekmeGorunumModu === m.id
                        ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
                    }`}
                  >
                    {m.ad}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="ap-heading mb-2 text-sm font-medium">Varsayılan açılış</p>
              <select
                className="w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
                value={ayarlar.varsayilanAcilis}
                onChange={(e) =>
                  setAyarlar((a) => ({
                    ...a,
                    varsayilanAcilis: e.target.value as SekmePanelAyarlari['varsayilanAcilis'],
                  }))
                }
              >
                <option value="tek-sekme">Aynı modül için mevcut sekmeyi kullan</option>
                <option value="yeni-sekme">Her seferinde yeni sekme aç</option>
              </select>
            </div>

            <div>
              <p className="ap-heading mb-2 text-sm font-medium">Sekme boyutu</p>
              <div className="flex flex-wrap gap-2">
                {(['kucuk', 'orta', 'buyuk'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setAyarlar((a) => ({ ...a, sekmeYukseklik: b }))}
                    className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                      ayarlar.sekmeYukseklik === b
                        ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
                    }`}
                  >
                    {b === 'kucuk' ? 'Küçük' : b === 'buyuk' ? 'Büyük' : 'Orta'}
                  </button>
                ))}
              </div>
            </div>

            <ToggleSatir
              etiket="Üzerine gelince önizleme"
              aciklama="Sekme üzerine gelindiğinde modül adı tooltip gösterilir"
              acik={ayarlar.hoverOnizleme}
              onDegistir={(hoverOnizleme) => setAyarlar((a) => ({ ...a, hoverOnizleme }))}
            />
            <ToggleSatir
              etiket="Yan yana açılabilir"
              aciklama="Gruplanmış sekmeler içerik alanında yan yana gösterilir"
              acik={ayarlar.yanYanaAcilabilir}
              onDegistir={(yanYanaAcilabilir) => setAyarlar((a) => ({ ...a, yanYanaAcilabilir }))}
            />
            <ToggleSatir
              etiket="Sürükleyerek pencereye ayır"
              aciklama="Sekmeyi aşağı sürükleyerek yüzen pencere olarak açar"
              acik={ayarlar.surukleAyirPencere}
              onDegistir={(surukleAyirPencere) => setAyarlar((a) => ({ ...a, surukleAyirPencere }))}
            />

            <ToggleSatir
              etiket="Sekmelerde arama"
              aciklama="Üst sekme çubuğunda modül arama alanı gösterilir"
              acik={ayarlar.sekmeAramaAktif}
              onDegistir={(sekmeAramaAktif) => setAyarlar((a) => ({ ...a, sekmeAramaAktif }))}
            />

            {ayarlar.sekmeAramaAktif && (
              <div>
                <p className="ap-heading mb-2 text-sm font-medium">Arama görünümü</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'ikon', ad: 'Sadece ikon (Windows tarzı)' },
                      { id: 'input', ad: 'Arama kutusu' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setAyarlar((a) => ({ ...a, sekmeAramaGorunum: m.id }))}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        ayarlar.sekmeAramaGorunum === m.id
                          ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                          : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
                      }`}
                    >
                      {m.ad}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="ap-heading mb-2 text-sm font-medium">Grup davranışı</p>
              <select
                className="w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
                value={ayarlar.grupDavranisi}
                onChange={(e) =>
                  setAyarlar((a) => ({
                    ...a,
                    grupDavranisi: e.target.value as SekmePanelAyarlari['grupDavranisi'],
                  }))
                }
              >
                <option value="yan-yana">Yan yana (split)</option>
                <option value="ustuste">Üst üste (sekme grubu)</option>
              </select>
            </div>

            <div>
              <p className="ap-heading mb-2 text-sm font-medium">Birleştirme modu</p>
              <select
                className="w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
                value={ayarlar.birlestirmeModu}
                onChange={(e) =>
                  setAyarlar((a) => ({
                    ...a,
                    birlestirmeModu: e.target.value as SekmePanelAyarlari['birlestirmeModu'],
                  }))
                }
              >
                <option value="otomatik">Otomatik (ortaya sürükleyince birleştir)</option>
                <option value="manuel">Manuel (sadece kenarlardan taşı)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setAyarlar({ ...VARSAYILAN_SEKME_AYARLARI })}
              className="text-xs text-blue-400 hover:underline"
            >
              Varsayılana sıfırla
            </button>
          </div>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Canlı Önizleme" altBaslik="Ayarların sekme görünümüne etkisi">
          <div
            className="ap-sekme-onizleme-alan rounded-lg border border-[var(--ap-border)] bg-[var(--ap-header-bg)] p-2"
            style={{
              ['--ap-tab-height' as string]:
                ayarlar.sekmeYukseklik === 'kucuk' ? '1.75rem' : ayarlar.sekmeYukseklik === 'buyuk' ? '2.5rem' : '2rem',
              ['--ap-tab-font-size' as string]:
                ayarlar.sekmeYukseklik === 'kucuk' ? '0.6875rem' : ayarlar.sekmeYukseklik === 'buyuk' ? '0.875rem' : '0.75rem',
            }}
          >
            <UstSekmeCubugu
              sekmeler={ORNEK_SEKMELER}
              aktifSekmeId={ornekAktif}
              onSekmeSec={setOrnekAktif}
              onSekmeKapat={() => {}}
              onSekmeTasi={() => {}}
              onSekmeBirlestir={() => {}}
              sekmeAyarlari={ayarlar}
              onModulSec={() => {}}
            />
          </div>
          <p className="ap-muted mt-3 text-xs">
            Boyut: <strong>{ayarlar.sekmeYukseklik}</strong> · Görünüm:{' '}
            <strong>{ayarlar.sekmeGorunumModu}</strong> · Önizleme:{' '}
            <strong>{ayarlar.hoverOnizleme ? 'Açık' : 'Kapalı'}</strong> · Grup:{' '}
            <strong>{ayarlar.grupDavranisi}</strong> · Arama:{' '}
            <strong>
              {ayarlar.sekmeAramaAktif
                ? ayarlar.sekmeAramaGorunum === 'ikon'
                  ? 'İkon'
                  : 'Kutu'
                : 'Kapalı'}
            </strong>
          </p>
        </AdminPanelKarti>
      </div>
    </AdminModulKabuk>
  );
}
