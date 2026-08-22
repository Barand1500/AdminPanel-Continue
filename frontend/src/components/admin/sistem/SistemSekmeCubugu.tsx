import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { SistemSekmeId } from '@/types/sistemAyarlari';
import { SISTEM_SEKMELER } from '@/types/sistemAyarlari';
import { AdminFlatIkon, type AdminFlatIkonAdi } from '@/components/admin/ortak/AdminFlatIkon';

const SEKME_IKONLARI: Record<SistemSekmeId, AdminFlatIkonAdi> = {
  genel: 'ayarlar', gorunum: 'ayar', bakim: 'araclar', sayfa404: 'belge', dil: 'dil', guvenlik: 'guvenlik', script: 'kod', eklentiler: 'puzzle', sagTik: 'fare',
};

export function SistemSekmeCubugu({ aktif, onDegistir }: { aktif: SistemSekmeId; onDegistir: (id: SistemSekmeId) => void }) {
  const listeRef = useRef<HTMLDivElement>(null);
  const oncekiAktifRef = useRef(aktif);
  const [gosterge, setGosterge] = useState({ sol: 0, genislik: 0 });
  const [gostergeKayiyor, setGostergeKayiyor] = useState(false);
  const [yon, setYon] = useState<'ileri' | 'geri'>('ileri');

  const gostergeyiGuncelle = useCallback(() => {
    const dugme = listeRef.current?.querySelector<HTMLButtonElement>(`[data-sistem-sekme="${aktif}"]`);
    if (dugme) setGosterge({ sol: dugme.offsetLeft, genislik: dugme.offsetWidth });
  }, [aktif]);

  useLayoutEffect(() => {
    gostergeyiGuncelle();
    const kok = listeRef.current;
    if (!kok || typeof ResizeObserver === 'undefined') return;
    const gozlemci = new ResizeObserver(gostergeyiGuncelle);
    gozlemci.observe(kok);
    return () => gozlemci.disconnect();
  }, [gostergeyiGuncelle]);

  useLayoutEffect(() => {
    if (oncekiAktifRef.current === aktif) return;
    setGostergeKayiyor(true);
    listeRef.current?.querySelector<HTMLButtonElement>(`[data-sistem-sekme="${aktif}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    const zamanlayici = window.setTimeout(() => setGostergeKayiyor(false), 480);
    oncekiAktifRef.current = aktif;
    return () => window.clearTimeout(zamanlayici);
  }, [aktif]);

  function sekmeTikla(id: SistemSekmeId) {
    if (id === aktif) return;
    const eski = SISTEM_SEKMELER.findIndex((sekme) => sekme.id === aktif);
    const yeni = SISTEM_SEKMELER.findIndex((sekme) => sekme.id === id);
    setYon(yeni > eski ? 'ileri' : 'geri');
    onDegistir(id);
  }

  return (
    <div className="ap-ayarlar-tur-sarmal">
      <div ref={listeRef} className="ap-ayarlar-tur-cubugu" role="tablist" aria-label="Sistem ayarları sekmeleri">
        <span className={`ap-ayarlar-tur-gosterge ${gostergeKayiyor ? 'ap-ayarlar-tur-gosterge--kayma' : ''} ap-ayarlar-tur-gosterge--${yon}`} aria-hidden style={{ transform: `translateX(${gosterge.sol}px)`, width: gosterge.genislik }} />
        {SISTEM_SEKMELER.map((sekme) => {
          const secili = aktif === sekme.id;
          return <button key={sekme.id} data-sistem-sekme={sekme.id} type="button" role="tab" aria-selected={secili} onClick={() => sekmeTikla(sekme.id)} className={`ap-ayarlar-tur-sekme ${secili ? 'ap-ayarlar-tur-sekme--aktif' : ''}`}>
            <span className="ap-ayarlar-tur-ikon"><AdminFlatIkon ad={SEKME_IKONLARI[sekme.id]} boyut={14} /></span>
            <span className="ap-ayarlar-tur-metin">{sekme.ad}</span>
          </button>;
        })}
      </div>
    </div>
  );
}

export function DurumAnahtari({ etiket, aciklama, acik, onChange, renk = 'yesil', ikon, devreDisi = false }: { etiket: string; aciklama?: string; acik: boolean; onChange: (v: boolean) => void; renk?: 'yesil' | 'turuncu' | 'mavi' | 'kirmizi'; ikon?: ReactNode; devreDisi?: boolean }) {
  return <div className={`ap-sistem-toggle ap-sistem-toggle-${renk} ${acik ? 'ap-sistem-toggle-aktif' : ''} ${devreDisi ? 'opacity-60' : ''}`}>
    <div className="flex min-w-0 flex-1 items-start gap-3">
      {ikon && <span className="ap-sistem-toggle-ikon">{typeof ikon === 'string' ? <AdminFlatIkon ad="ayar" boyut={18} /> : ikon}</span>}
      <div><span className="ap-heading block text-sm font-semibold">{etiket}</span>{aciklama && <span className="ap-muted mt-0.5 block text-xs leading-relaxed">{aciklama}</span>}</div>
    </div>
    <button type="button" role="switch" aria-checked={acik} aria-label={etiket} disabled={devreDisi} onClick={() => onChange(!acik)} className={`ap-toggle ${acik ? 'ap-toggle-on' : ''} ${renk === 'turuncu' ? 'ap-toggle-turuncu' : ''} ${devreDisi ? 'cursor-not-allowed' : ''}`}><span className="ap-toggle-thumb" /></button>
  </div>;
}
