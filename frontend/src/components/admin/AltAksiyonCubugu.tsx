import { useEffect, useRef, useState, type DragEvent, type RefObject } from 'react';
import type { AksiyonButonu } from '@/types/admin';
import { GorevCubuguTray } from './GorevCubuguTray';
import { SaatTakvimWidget } from './SaatTakvimWidget';
import { CubukModulArama } from './CubukModulArama';
import { AdminModulIkonu } from './AdminModulIkonu';
import { IconChecklist, IconHelpCircle, IconStar, IconX, IconGripVertical, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { modulRehberBul } from '@/data/adminModulRehberleri';
import { modulBul } from '@/data/adminMenuYapisi';
import { BildirimPaneli, useBildirimSayaci } from './BildirimPaneli';
import { LogPaneli } from './LogPaneli';
import { YedeklemeHizliPaneli } from './YedeklemeHizliPaneli';
import { useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { useAdminTema } from '@/contexts/AdminTemaContext';
import { useAuth } from '@/contexts/AuthContext';
import { kisayolAyarlariOku } from '@/utils/kisayolAyarlari';
import {
  AksiyonCubuguPanelProvider,
  AksiyonCubuguUstCizgiSlot,
  useAksiyonCubuguPanelAcik,
  useAksiyonCubuguPanelSync,
} from './aksiyon-cubugu/AksiyonCubuguPanelContext';

interface AltAksiyonCubuguProps {
  aksiyonlar: AksiyonButonu[];
  onAksiyon?: (id: string) => void;
  onModulAc?: (modulId: string) => void;
  focusModulId?: string;
  onRehberAc?: () => void;
}

type AcikPanel = 'bildirim' | 'log' | 'yedek' | 'favoriler' | null;

function AltAksiyonCubuguGovde({
  footerRef,
  aksiyonlar,
  onAksiyon,
  onModulAc,
  focusModulId = 'dashboard',
  onRehberAc,
}: AltAksiyonCubuguProps & { footerRef: RefObject<HTMLElement | null> }) {
  const panelAcik = useAksiyonCubuguPanelAcik();
  const rehber = modulRehberBul(focusModulId);
  const rehberKisayolu = kisayolAyarlariOku().rehber;
  const [acikPanel, setAcikPanel] = useState<AcikPanel>(null);
  const { okunmamisSayi, yenile } = useBildirimSayaci();
  const { aksiyonGeriBildirim } = useAdminAksiyon();
  const { temaDegistir, koyuMu } = useAdminTema();
  const { kullanici, hizliErisimKaydet } = useAuth();
  const kayitliFavoriler = kullanici?.tercihler?.dashboardHizliErisim ?? [];
  const [favoriler, setFavoriler] = useState<string[]>(kayitliFavoriler);
  const [suruklenenFavoriId, setSuruklenenFavoriId] = useState<string | null>(null);
  const [hedefFavoriId, setHedefFavoriId] = useState<string | null>(null);
  const favoriPanelRef = useRef<HTMLDivElement>(null);

  useAksiyonCubuguPanelSync(acikPanel === 'favoriler', favoriPanelRef);

  useEffect(() => setFavoriler(kayitliFavoriler), [kullanici?.tercihler?.dashboardHizliErisim]);

  const favoriMi = favoriler.includes(focusModulId);
  async function favorileriKaydet(yeni: string[]) {
    setFavoriler(yeni);
    try {
      await hizliErisimKaydet(yeni);
    } catch {
      setFavoriler(kayitliFavoriler);
    }
  }

  function favoriDegistir(modulId = focusModulId) {
    void favorileriKaydet(favoriler.includes(modulId) ? favoriler.filter((id) => id !== modulId) : [...favoriler, modulId]);
  }

  function favoriTasi(modulId: string, yon: -1 | 1) {
    const kaynak = favoriler.indexOf(modulId);
    const hedef = kaynak + yon;
    if (kaynak < 0 || hedef < 0 || hedef >= favoriler.length) return;
    const yeni = [...favoriler];
    [yeni[kaynak], yeni[hedef]] = [yeni[hedef], yeni[kaynak]];
    void favorileriKaydet(yeni);
  }

  function favoriBirak(kaynakId: string, hedefId: string) {
    if (kaynakId === hedefId) return;
    const yeni = [...favoriler];
    const kaynak = yeni.indexOf(kaynakId);
    const hedef = yeni.indexOf(hedefId);
    if (kaynak < 0 || hedef < 0) return;
    yeni.splice(kaynak, 1);
    yeni.splice(hedef, 0, kaynakId);
    void favorileriKaydet(yeni);
  }

  const favoriModulleri = favoriler.map((id) => modulBul(id)).filter((modul): modul is NonNullable<typeof modul> => Boolean(modul));

  function panelAc(panel: AcikPanel) {
    setAcikPanel((onceki) => (onceki === panel ? null : panel));
    if (panel === 'bildirim') void yenile();
  }

  return (
    <footer
      ref={footerRef}
      className={`ap-footer ap-gorev-cubugu flex h-12 shrink-0 items-center gap-2 px-3${panelAcik || acikPanel === 'favoriler' ? ' ap-gorev-cubugu--panel-acik' : ''}`}
      data-ap-kesif="aksiyon-cubugu"
    >
      <AksiyonCubuguUstCizgiSlot footerRef={footerRef} />
      <div className="ap-aksiyon-cubugu-sol flex min-w-0 flex-1 self-stretch items-stretch gap-0 overflow-x-auto">
        {aksiyonlar.map((aksiyon) => {
          const geriBildirim =
            aksiyonGeriBildirim?.aksiyonId === aksiyon.id ? aksiyonGeriBildirim : null;
          const etiket = geriBildirim?.mesaj ?? aksiyon.etiket;

          return (
            <button
              key={aksiyon.id}
              type="button"
              disabled={!aksiyon.aktif && !geriBildirim}
              onClick={() => onAksiyon?.(aksiyon.id)}
              className={`ap-aksiyon-btn shrink-0 whitespace-nowrap text-sm font-medium ${
                geriBildirim?.tur === 'basari'
                  ? 'ap-aksiyon-basari'
                  : geriBildirim?.tur === 'hata'
                    ? 'ap-aksiyon-hata'
                    : !aksiyon.aktif
                      ? 'ap-aksiyon-pasif cursor-not-allowed opacity-40'
                      : aksiyon.birincil
                        ? 'ap-aksiyon-birincil'
                        : 'ap-aksiyon-aktif'
              }`}
            >
              <span className="ap-aksiyon-harf">
                <span className="ap-aksiyon-harf-normal">{etiket}</span>
                <span className="ap-aksiyon-harf-vurgu" aria-hidden>{etiket}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="ap-aksiyon-cubugu-sag relative flex shrink-0 items-center gap-2 border-l border-[var(--ap-border)] pl-3">
        {onModulAc && (
          <div className="ap-aksiyon-arama-wrap">
            <CubukModulArama onModulSec={(modul) => onModulAc(modul.id)} />
          </div>
        )}
        <div className="ap-favori-sayfalar-wrap">
          <button
            type="button"
            onClick={() => {
              panelAc('favoriler');
            }}
            className={`ap-tray-ikon ${favoriMi || acikPanel === 'favoriler' ? 'ap-tray-ikon-aktif' : ''}`}
            title="Favori sayfalar"
            aria-label="Favori sayfalar"
          >
            <IconStar size={17} stroke={1.8} fill={favoriMi ? 'currentColor' : 'none'} aria-hidden />
          </button>
          {acikPanel === 'favoriler' && (
            <div ref={favoriPanelRef} className="ap-aksiyon-acilir-panel ap-favori-panel ap-favori-panel--kenarlik-anim" role="dialog" aria-label="Favoriler">
              <div className="ap-aksiyon-acilir-baslik ap-favori-panel-baslik">
                <h3>Favori Sayfalar</h3>
                <div className="flex items-center gap-2">
                  <span className="ap-muted text-xs">{favoriler.length}</span>
                  <button type="button" className="ap-aksiyon-panel-kapat" onClick={() => setAcikPanel(null)} aria-label="Favorileri kapat"><IconX size={15} /></button>
                </div>
              </div>
              {modulBul(focusModulId) && (
                <div className="ap-aksiyon-favori-aktif">
                  <AdminModulIkonu modulId={focusModulId} boyut={16} />
                  <span className="min-w-0 flex-1 truncate">{modulBul(focusModulId)?.baslik}</span>
                  <button type="button" className={`ap-favori-yildiz${favoriMi ? ' ap-favori-yildiz--aktif' : ''}`} onClick={() => favoriDegistir()} title={favoriMi ? 'Favorilerden çıkar' : 'Favorilere ekle'} aria-label={favoriMi ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
                    <IconStar size={16} stroke={1.8} fill={favoriMi ? 'currentColor' : 'none'} aria-hidden />
                  </button>
                </div>
              )}
              <p className="ap-favori-liste-baslik">Favoriler</p>
              <div className="ap-aksiyon-acilir-icerik ap-favori-liste">
                {favoriModulleri.length === 0 ? <p className="ap-favori-bos">Henüz favori yok. Üstteki yıldız ile ekleyin.</p> : (
                  <ul className="ap-favori-liste-ul">
                    {favoriModulleri.map((modul, index) => (
                      <li
                        key={modul.id}
                        draggable
                        className={`ap-favori-satir${suruklenenFavoriId === modul.id ? ' ap-favori-satir--surukleniyor' : ''}${hedefFavoriId === modul.id && suruklenenFavoriId !== modul.id ? ' ap-favori-satir--hedef' : ''}`}
                        onDragStart={(event: DragEvent<HTMLLIElement>) => { setSuruklenenFavoriId(modul.id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', modul.id); }}
                        onDragOver={(event: DragEvent<HTMLLIElement>) => { event.preventDefault(); setHedefFavoriId(modul.id); }}
                        onDrop={(event: DragEvent<HTMLLIElement>) => { event.preventDefault(); favoriBirak(event.dataTransfer.getData('text/plain') || suruklenenFavoriId || '', modul.id); setSuruklenenFavoriId(null); setHedefFavoriId(null); }}
                        onDragEnd={() => { setSuruklenenFavoriId(null); setHedefFavoriId(null); }}
                      >
                        <span className="ap-favori-surukle" aria-hidden><IconGripVertical size={14} /></span>
                        <button type="button" className="ap-favori-satir-ac" onClick={() => { onModulAc?.(modul.id); setAcikPanel(null); }}>
                          <AdminModulIkonu modulId={modul.id} boyut={15} />
                          <span className="ap-favori-satir-ad">{modul.baslik}</span>
                        </button>
                        <span className="ap-favori-sira">
                          <button type="button" className="ap-favori-sira-btn" disabled={index === 0} onClick={() => favoriTasi(modul.id, -1)} aria-label={`${modul.baslik} yukarı`}><IconChevronUp size={10} /></button>
                          <button type="button" className="ap-favori-sira-btn" disabled={index === favoriModulleri.length - 1} onClick={() => favoriTasi(modul.id, 1)} aria-label={`${modul.baslik} aşağı`}><IconChevronDown size={10} /></button>
                        </span>
                        <button type="button" className="ap-favori-yildiz ap-favori-yildiz--aktif ap-favori-yildiz--kucuk" onClick={() => favoriDegistir(modul.id)} title="Favorilerden çıkar" aria-label={`${modul.baslik} favorilerden çıkar`}><IconStar size={14} fill="currentColor" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onModulAc?.('yapilacaklar')}
          className="ap-tray-ikon relative"
          title="Yapılacaklar"
          aria-label="Yapılacaklar"
        >
          <IconChecklist size={17} stroke={1.8} aria-hidden />
        </button>
        <button
          type="button"
          onClick={temaDegistir}
          className="ap-tray-ikon ap-tema-degistir-btn"
          title={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
          aria-label={koyuMu ? 'Gündüz moduna geç' : 'Gece moduna geç'}
        >
          {koyuMu ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 14.5A8.5 8.5 0 1114.5 3a6.5 6.5 0 006.5 11.5z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onRehberAc}
          className="ap-tray-ikon"
          title={`${rehber.baslik} — Rehber (${rehberKisayolu})`}
          aria-label="Sayfa rehberini aç"
        >
          <IconHelpCircle size={17} stroke={1.8} aria-hidden />
        </button>
        <GorevCubuguTray
          logAcik={acikPanel === 'log'}
          yedekAcik={acikPanel === 'yedek'}
          onLogToggle={() => panelAc('log')}
          onYedekToggle={() => panelAc('yedek')}
        />
        <button
          type="button"
          className={`ap-tray-ikon ap-tray-bildirim-btn relative ${acikPanel === 'bildirim' ? 'ap-tray-ikon-aktif' : ''}`}
          title="Bildirimler"
          aria-label="Bildirimler"
          onClick={() => panelAc('bildirim')}
          data-ap-kesif="bildirim-tray"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.59 1.4L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>
          {okunmamisSayi > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {okunmamisSayi > 9 ? '9+' : okunmamisSayi}
            </span>
          )}
        </button>
        <BildirimPaneli
          acik={acikPanel === 'bildirim'}
          onKapat={() => setAcikPanel(null)}
          onGuncelle={yenile}
        />
        <LogPaneli
          acik={acikPanel === 'log'}
          onKapat={() => setAcikPanel(null)}
          onModulAc={onModulAc}
        />
        <YedeklemeHizliPaneli
          acik={acikPanel === 'yedek'}
          onKapat={() => setAcikPanel(null)}
          onModulAc={onModulAc}
        />
        <SaatTakvimWidget />
      </div>
    </footer>
  );
}

export function AltAksiyonCubugu(props: AltAksiyonCubuguProps) {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <AksiyonCubuguPanelProvider>
      <AltAksiyonCubuguGovde footerRef={footerRef} {...props} />
    </AksiyonCubuguPanelProvider>
  );
}
