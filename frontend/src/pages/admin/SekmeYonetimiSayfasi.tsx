import { useCallback, useEffect, useState } from 'react';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { AdminModulKabuk, AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import {
  VARSAYILAN_SEKME_AYARLARI,
  sekmeAyarlariKaydet,
  sekmeAyarlariOku,
  type SekmePanelAyarlari,
} from '@/utils/sekmePanelAyarlari';

const SECILI_BUTON_STILI = {
  borderColor: 'var(--ap-accent)',
  backgroundColor: 'color-mix(in srgb, var(--ap-accent) 16%, transparent)',
  color: 'var(--ap-accent)',
} as const;

function SecimButonu({
  children,
  secili,
  onClick,
  aciklama,
}: {
  children: React.ReactNode;
  secili: boolean;
  onClick: () => void;
  aciklama?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={secili ? SECILI_BUTON_STILI : undefined}
      className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-left text-sm transition-colors hover:bg-[var(--ap-hover)]"
    >
      <span className="block font-medium">{children}</span>
      {aciklama && <span className="ap-muted mt-0.5 block text-[11px] font-normal">{aciklama}</span>}
    </button>
  );
}

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  devreDisi = false,
  yakinda = false,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  devreDisi?: boolean;
  yakinda?: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border border-[var(--ap-border)] p-3 ${
        devreDisi ? 'opacity-55' : ''
      }`}
    >
      <div>
        <p className="ap-heading flex items-center gap-2 text-sm font-medium">
          {etiket}
          {yakinda && (
            <span className="rounded-full bg-[var(--ap-hover)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ap-text-muted)]">
              Yakında
            </span>
          )}
        </p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        disabled={devreDisi}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle shrink-0 ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </div>
  );
}

function BaslatMenuOnizleme({ tasarim }: { tasarim: 'klasik' | 'modern' }) {
  const modern = tasarim === 'modern';
  return (
    <span
      aria-hidden="true"
      className={`mb-3 flex h-[72px] overflow-hidden rounded-lg border border-[var(--ap-border)] ${
        modern ? 'bg-[var(--ap-surface-2)]' : 'bg-[var(--ap-header-bg)]'
      }`}
    >
      {modern ? (
        <>
          <span className="w-1/3 border-r border-[var(--ap-border)] p-2">
            <i className="mb-1.5 block h-2 w-3 rounded bg-[var(--ap-text-muted)]/50" />
            <i className="mb-1.5 block h-2 w-7 rounded bg-[var(--ap-text-muted)]/30" />
            <i className="block h-2 w-5 rounded bg-[var(--ap-text-muted)]/30" />
          </span>
          <span className="flex flex-1 items-center gap-2 bg-[var(--ap-input-bg)] p-3">
            <i className="h-6 w-6 rounded bg-[var(--ap-text-muted)]/35" />
            <i className="h-6 w-6 rounded bg-[var(--ap-text-muted)]/35" />
            <i className="h-6 w-6 rounded bg-[var(--ap-text-muted)]/35" />
          </span>
        </>
      ) : (
        <>
          <span className="w-[43%] border-r border-[var(--ap-border)] p-2">
            <i className="mb-1.5 block h-2 w-full rounded bg-[var(--ap-text-muted)]/40" />
            <i className="mb-1.5 block h-2 w-4/5 rounded bg-[var(--ap-text-muted)]/30" />
            <i className="mb-1.5 block h-2 w-3/5 rounded bg-[var(--ap-text-muted)]/30" />
            <i className="block h-2 w-4/5 rounded bg-[var(--ap-text-muted)]/30" />
          </span>
          <span className="flex-1 bg-[var(--ap-input-bg)]" />
        </>
      )}
    </span>
  );
}

export function SekmeYonetimiSayfasi() {
  const [ayarlar, setAyarlar] = useState<SekmePanelAyarlari>(() => sekmeAyarlariOku());

  const kaydet = useCallback(() => {
    sekmeAyarlariKaydet(ayarlar);
    window.dispatchEvent(new CustomEvent('ap-sekme-ayarlari-guncellendi'));
    if (ayarlar.websiteTamEkran && !document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
    if (!ayarlar.websiteTamEkran && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    }
  }, [ayarlar]);

  useModulAksiyonlari({ kaydet }, { kaydet: true });

  useEffect(() => {
    const ayarlariYukle = () => {
      const gelen = sekmeAyarlariOku();
      setAyarlar((onceki) => (JSON.stringify(onceki) === JSON.stringify(gelen) ? onceki : gelen));
    };
    window.addEventListener('ap-sekme-ayarlari-guncellendi', ayarlariYukle);
    return () => window.removeEventListener('ap-sekme-ayarlari-guncellendi', ayarlariYukle);
  }, []);

  useEffect(() => {
    sekmeAyarlariKaydet(ayarlar);
    window.dispatchEvent(new CustomEvent('ap-sekme-ayarlari-guncellendi'));
  }, [ayarlar]);

  return (
    <AdminModulKabuk
      baslik="Sekme Yönetimi"
      aciklama="Üst sekme çubuğunun görünümünü ve davranışını ayarlayın."
      onizleGoster={false}
    >
      <AdminPanelKarti baslik="Sekme Ayarları" altBaslik="Değişiklikler, Kaydet ile uygulanır">
        <div className="space-y-5">
          <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-2)]/35 p-3">
            <p className="ap-heading text-sm font-medium">Hızlı Bilgi</p>
            <p className="ap-muted mt-1 text-xs">
              Sekmeleri ortadan sürükleyip bırakınca yan yana açılır; kenara bırakırsanız sırası değişir.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border border-[var(--ap-border)] p-4">
              <h2 className="ap-heading mb-4 text-base font-semibold">Görünüm</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="ap-muted mb-2 text-xs">Sekme Görünümü</p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: 'ikon-isim', ad: 'İkon + isim' },
                        { id: 'isim', ad: 'Sadece isim' },
                        { id: 'ikon', ad: 'Sadece ikon' },
                      ] as const
                    ).map((secim) => (
                      <SecimButonu
                        key={secim.id}
                        secili={ayarlar.sekmeGorunumModu === secim.id}
                        onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeGorunumModu: secim.id }))}
                      >
                        {secim.ad}
                      </SecimButonu>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="ap-muted mb-2 text-xs">WebSite Görünümü Ayarı</p>
                  <div className="flex flex-wrap gap-2">
                    <SecimButonu
                      secili={ayarlar.websiteTamEkran}
                      onClick={() => setAyarlar((onceki) => ({ ...onceki, websiteTamEkran: true }))}
                      aciklama="F11 gibi — her açılışta"
                    >
                      Tam ekran
                    </SecimButonu>
                    <SecimButonu
                      secili={!ayarlar.websiteTamEkran}
                      onClick={() => setAyarlar((onceki) => ({ ...onceki, websiteTamEkran: false }))}
                      aciklama="Tarayıcı penceresi"
                    >
                      Normal
                    </SecimButonu>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="ap-muted mb-2 text-xs">Sekme Yerleşimi</p>
                <div className="flex flex-wrap gap-2">
                  <SecimButonu
                    secili={ayarlar.sekmeYerlesim === 'dikdortgen'}
                    onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeYerlesim: 'dikdortgen' }))}
                    aciklama="Üst çubukta yatay"
                  >
                    Dikdörtgen
                  </SecimButonu>
                  <SecimButonu
                    secili={ayarlar.sekmeYerlesim === 'kare'}
                    onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeYerlesim: 'kare' }))}
                    aciklama="Çoklu kutucuk kartı"
                  >
                    Kare
                  </SecimButonu>
                </div>
              </div>

              <div className="mt-4">
                <p className="ap-muted mb-2 text-xs">Sekme Boyutu</p>
                <div className="flex flex-wrap gap-2">
                  {(['kucuk', 'orta', 'buyuk'] as const).map((boyut) => (
                    <SecimButonu
                      key={boyut}
                      secili={ayarlar.sekmeYukseklik === boyut}
                      onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeYukseklik: boyut }))}
                    >
                      {boyut === 'kucuk' ? 'Küçük' : boyut === 'orta' ? 'Orta' : 'Büyük'}
                    </SecimButonu>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[var(--ap-border)] p-3">
                <p className="ap-muted mb-2 text-xs">Arama Görünümü</p>
                <div className="flex flex-wrap gap-2">
                  <SecimButonu
                    secili={ayarlar.sekmeAramaGorunum === 'ikon'}
                    onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeAramaGorunum: 'ikon' }))}
                  >
                    Sadece ikon (Windows tarzı)
                  </SecimButonu>
                  <SecimButonu
                    secili={ayarlar.sekmeAramaGorunum === 'input'}
                    onClick={() => setAyarlar((onceki) => ({ ...onceki, sekmeAramaGorunum: 'input' }))}
                  >
                    Arama kutusu
                  </SecimButonu>
                </div>
              </div>

              {ayarlar.baslatMenuTasarim === 'modern' && (
                <div className="mt-4 rounded-lg border border-dashed border-[var(--ap-border)] p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="ap-heading text-sm font-medium">Modern Başlat Menüsü</p>
                    <span style={SECILI_BUTON_STILI} className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase">
                      Modern mod
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="ap-muted mb-2 text-xs">Kategori Görünümü</p>
                      <div className="flex flex-wrap gap-2">
                        <SecimButonu
                          secili={ayarlar.baslatMenuKategoriGorunum === 'kare'}
                          onClick={() => setAyarlar((onceki) => ({ ...onceki, baslatMenuKategoriGorunum: 'kare' }))}
                        >
                          Kare kutular
                        </SecimButonu>
                        <SecimButonu
                          secili={ayarlar.baslatMenuKategoriGorunum === 'dikdortgen'}
                          onClick={() => setAyarlar((onceki) => ({ ...onceki, baslatMenuKategoriGorunum: 'dikdortgen' }))}
                        >
                          Uzun dikdörtgen
                        </SecimButonu>
                      </div>
                    </div>
                    <div>
                      <p className="ap-muted mb-2 text-xs">Modül Kutusu Boyutu</p>
                      <div className="flex flex-wrap gap-2">
                        {(['kucuk', 'orta', 'buyuk'] as const).map((boyut) => (
                          <SecimButonu
                            key={boyut}
                            secili={ayarlar.baslatMenuKutuBoyutu === boyut}
                            onClick={() => setAyarlar((onceki) => ({ ...onceki, baslatMenuKutuBoyutu: boyut }))}
                          >
                            {boyut === 'kucuk' ? 'Küçük' : boyut === 'orta' ? 'Orta' : 'Büyük (tam ekran)'}
                          </SecimButonu>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-[var(--ap-border)] p-4">
              <h2 className="ap-heading mb-4 text-base font-semibold">Davranış</h2>
              <label className="ap-muted block text-xs">
                Varsayılan açılış
                <select
                  className="ap-heading mt-2 w-full rounded-lg border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-3 py-2 text-sm"
                  value={ayarlar.varsayilanAcilis}
                  onChange={(event) =>
                    setAyarlar((onceki) => ({
                      ...onceki,
                      varsayilanAcilis: event.target.value as SekmePanelAyarlari['varsayilanAcilis'],
                    }))
                  }
                >
                  <option value="tek-sekme">Aynı modül için mevcut sekmeyi kullan</option>
                  <option value="yeni-sekme">Her seferinde yeni sekme aç</option>
                </select>
              </label>

              <div className="mt-3 space-y-3">
                <ToggleSatir
                  etiket="Üzerine gelince önizleme"
                  aciklama="Sekme üzerinde ekran görüntüsü önizlemesi"
                  acik={false}
                  devreDisi
                  yakinda
                  onDegistir={() => {}}
                />
                <ToggleSatir
                  etiket="Yan yana bölme (Chrome)"
                  aciklama="Birleştirilen sekmeleri iki panelde açar"
                  acik={ayarlar.yanYanaAcilabilir}
                  onDegistir={(yanYanaAcilabilir) => setAyarlar((onceki) => ({ ...onceki, yanYanaAcilabilir }))}
                />
                <ToggleSatir
                  etiket="Sürükleyerek pencereye ayır"
                  aciklama="Sekmeyi ayırıp pencereye taşır"
                  acik={ayarlar.surukleAyirPencere}
                  onDegistir={(surukleAyirPencere) => setAyarlar((onceki) => ({ ...onceki, surukleAyirPencere }))}
                />
                <ToggleSatir
                  etiket="Sekmelerde arama"
                  aciklama="Alt çubukta modül arama gösterir"
                  acik={ayarlar.sekmeAramaAktif}
                  onDegistir={(sekmeAramaAktif) => setAyarlar((onceki) => ({ ...onceki, sekmeAramaAktif }))}
                />
                <ToggleSatir
                  etiket="Sekme değiştirince otomatik kaydet"
                  aciklama="Geçişte aktif sekmedeki değişiklikleri kaydeder"
                  acik={ayarlar.sekmeGecisindeOtomatikKaydet}
                  onDegistir={(sekmeGecisindeOtomatikKaydet) =>
                    setAyarlar((onceki) => ({ ...onceki, sekmeGecisindeOtomatikKaydet }))
                  }
                />
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-[var(--ap-border)] p-4">
            <h2 className="ap-heading mb-4 text-base font-semibold">Başlat Menüsü</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  { id: 'klasik', baslik: 'Klasik', aciklama: 'Mevcut sol panel tasarımı' },
                  { id: 'modern', baslik: 'Modern', aciklama: 'Yenilenmiş kart ve arama düzeni' },
                ] as const
              ).map((tasarim) => {
                const secili = ayarlar.baslatMenuTasarim === tasarim.id;
                return (
                  <button
                    key={tasarim.id}
                    type="button"
                    onClick={() => setAyarlar((onceki) => ({ ...onceki, baslatMenuTasarim: tasarim.id }))}
                    style={secili ? SECILI_BUTON_STILI : undefined}
                    className="rounded-lg border border-[var(--ap-border)] p-3 text-left transition-colors hover:bg-[var(--ap-hover)]"
                  >
                    <BaslatMenuOnizleme tasarim={tasarim.id} />
                    <span className="ap-heading block text-sm font-semibold">{tasarim.baslik}</span>
                    <span className="ap-muted mt-0.5 block text-xs">{tasarim.aciklama}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setAyarlar({ ...VARSAYILAN_SEKME_AYARLARI })}
                className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs text-[var(--ap-accent)] transition-colors hover:bg-[var(--ap-hover)]"
              >
                Varsayılana sıfırla
              </button>
            </div>
          </section>
        </div>
      </AdminPanelKarti>
    </AdminModulKabuk>
  );
}
