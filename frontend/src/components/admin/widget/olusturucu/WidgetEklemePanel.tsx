import { useMemo, useState } from 'react';
import type { AdminWidget, WidgetFormDegeri } from '@/types/admin';
import type { BlokDuzen, BlokTipi } from '@/types/blokOlusturucu';
import { configGuncelle, configOku } from '@/types/widget';
import { olusturucuOku } from '@/types/blokOlusturucu';
import type { WidgetBlok } from '@/types/blokOlusturucu';
import { yerlesimEtiketi } from '@/utils/widgetYerlesim';
import {
  bosOlusturucu,
  hucreleriOlustur,
  varsayilanBlok,
} from './blokOlusturucuYardimci';
import { WidgetGridTuval } from './WidgetGridTuval';
import { WidgetBlokPaleti } from './WidgetBlokPaleti';

interface WidgetEklemePanelProps {
  form: WidgetFormDegeri;
  onChange: (form: WidgetFormDegeri) => void;
  tumWidgetlar: AdminWidget[];
  mevcutWidgetId?: string | null;
  onGenelSekmesi?: () => void;
}

export function WidgetEklemePanel({
  form,
  onChange,
  tumWidgetlar,
  onGenelSekmesi,
}: WidgetEklemePanelProps) {
  const cfg = configOku(form);
  const olusturucu = olusturucuOku(cfg);
  const [aktifHucreId, setAktifHucreId] = useState<string | null>(null);
  const [seciliBlokId, setSeciliBlokId] = useState<string | null>(null);

  const widgetAdlari = useMemo(() => {
    const map = new Map<string, string>();
    for (const w of tumWidgetlar) map.set(w.id, w.ad);
    return map;
  }, [tumWidgetlar]);

  const yerlesim = cfg.yerlesim ?? { bolge: form.sayfaId ? 'sayfa_ustu' as const : 'icerik_alani' as const };
  const yerlesimMetni = yerlesimEtiketi(yerlesim, widgetAdlari);

  function olusturucuGuncelle(guncelle: typeof olusturucu) {
    onChange(configGuncelle(form, (c) => ({ ...c, olusturucu: guncelle })));
  }

  function parcaSayisiDegistir(sayi: 1 | 2 | 3 | 4) {
    const hucreler = hucreleriOlustur(sayi, olusturucu.hucreler);
    olusturucuGuncelle({ ...olusturucu, parcaSayisi: sayi, hucreler });
    if (aktifHucreId && !hucreler.some((h) => h.id === aktifHucreId)) {
      setAktifHucreId(hucreler[0]?.id ?? null);
    }
    setSeciliBlokId(null);
  }

  function duzenDegistir(duzen: BlokDuzen) {
    olusturucuGuncelle({ ...olusturucu, duzen });
  }

  function olusturucuSifirla() {
    olusturucuGuncelle(bosOlusturucu());
    setAktifHucreId(null);
    setSeciliBlokId(null);
  }

  function parcaEkle(tip: BlokTipi) {
    if (!aktifHucreId) return;
    const yeniBlok = varsayilanBlok(tip);
    const hucreler = olusturucu.hucreler.map((h) =>
      h.id === aktifHucreId ? { ...h, bloklar: [...h.bloklar, yeniBlok] } : h
    );
    olusturucuGuncelle({ ...olusturucu, hucreler });
    setSeciliBlokId(yeniBlok.id);
  }

  function blokGuncelle(guncelBlok: WidgetBlok) {
    const hucreler = olusturucu.hucreler.map((h) =>
      h.bloklar.some((b) => b.id === guncelBlok.id)
        ? { ...h, bloklar: h.bloklar.map((b) => (b.id === guncelBlok.id ? guncelBlok : b)) }
        : h
    );
    olusturucuGuncelle({ ...olusturucu, hucreler });
  }

  function blokSil(hucreId: string, blokId: string) {
    const hucreler = olusturucu.hucreler.map((h) =>
      h.id === hucreId ? { ...h, bloklar: h.bloklar.filter((b) => b.id !== blokId) } : h
    );
    olusturucuGuncelle({ ...olusturucu, hucreler });
    if (seciliBlokId === blokId) setSeciliBlokId(null);
  }

  const seciliBlok =
    seciliBlokId != null
      ? olusturucu.hucreler.flatMap((h) => h.bloklar).find((b) => b.id === seciliBlokId) ?? null
      : null;

  return (
    <div className="ap-widget-ekleme">
      <div className="ap-olusturucu-yerlesim-ozet">
        <span className="ap-muted text-xs">
          Yerleşim: <strong className="text-inherit">{yerlesimMetni}</strong>
          {form.sayfaId ? ' · Sayfa widgetı' : ' · Ana sayfa'}
        </span>
        {onGenelSekmesi && (
          <button type="button" className="ap-link-btn text-xs" onClick={onGenelSekmesi}>
            Genel sekmesinde düzenle
          </button>
        )}
      </div>

      <div className="ap-olusturucu-split">
        <div className="ap-olusturucu-orta">
          <WidgetGridTuval
            olusturucu={olusturucu}
            aktifHucreId={aktifHucreId}
            seciliBlokId={seciliBlokId}
            onHucreSec={(id) => {
              setAktifHucreId(id);
              setSeciliBlokId(null);
            }}
            onBlokSec={(_hucreId, blokId) => setSeciliBlokId(blokId)}
            onBlokSil={blokSil}
            onBlokGuncelle={blokGuncelle}
          />
        </div>
        <WidgetBlokPaleti
          seciliBlok={seciliBlok}
          hucreSecili={aktifHucreId != null}
          parcaSayisi={olusturucu.parcaSayisi}
          duzen={olusturucu.duzen}
          onParcaSayisi={parcaSayisiDegistir}
          onDuzen={duzenDegistir}
          onOlusturucuSifirla={olusturucuSifirla}
          onParcaEkle={parcaEkle}
          onBlokGuncelle={blokGuncelle}
        />
      </div>
    </div>
  );
}
