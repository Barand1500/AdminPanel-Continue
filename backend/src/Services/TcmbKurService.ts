export type KurTipi = 'doviz_alis' | 'doviz_satis' | 'efektif_alis' | 'efektif_satis';

const TCMB_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';

export const KUR_TIPI_ETIKET: Record<KurTipi, string> = {
  doviz_alis: 'Döviz Alış',
  doviz_satis: 'Döviz Satış',
  efektif_alis: 'Efektif Alış',
  efektif_satis: 'Efektif Satış',
};

const KUR_TIPI_ALAN: Record<KurTipi, string> = {
  doviz_alis: 'ForexBuying',
  doviz_satis: 'ForexSelling',
  efektif_alis: 'BanknoteBuying',
  efektif_satis: 'BanknoteSelling',
};

interface TcmbOnizleSonuc {
  var: boolean;
  kur?: number;
  mesaj: string;
}

let cache: { xml: string; zaman: number } | null = null;
const CACHE_MS = 15 * 60 * 1000;

async function tcmbXmlAl(): Promise<string> {
  const simdi = Date.now();
  if (cache && simdi - cache.zaman < CACHE_MS) return cache.xml;

  const yanit = await fetch(TCMB_URL, {
    headers: { Accept: 'application/xml,text/xml' },
  });
  if (!yanit.ok) throw new Error('TCMB kur verisi alinamadi');

  const xml = await yanit.text();
  cache = { xml, zaman: simdi };
  return xml;
}

function kurDegeriOku(xml: string, kod: string, kurTipi: KurTipi): number | null {
  const kodUpper = kod.toUpperCase();
  const regex = new RegExp(
    `<Currency[^>]*CurrencyCode="${kodUpper}"[^>]*>([\\s\\S]*?)<\\/Currency>`,
    'i'
  );
  const eslesme = xml.match(regex);
  if (!eslesme) return null;

  const blok = eslesme[1];
  const alan = KUR_TIPI_ALAN[kurTipi];
  const alanRegex = new RegExp(`<${alan}>([0-9.]+)<\\/${alan}>`, 'i');
  const alanEslesme = blok.match(alanRegex);
  if (!alanEslesme) return null;

  const deger = parseFloat(alanEslesme[1]);
  return Number.isFinite(deger) ? deger : null;
}

export class TcmbKurService {
  async onizle(kod: string, kurTipi: KurTipi): Promise<TcmbOnizleSonuc> {
    const temizKod = kod.trim().toUpperCase();
    if (!temizKod || temizKod === 'TRY') {
      return { var: false, mesaj: 'Böyle bir kur yok' };
    }

    try {
      const xml = await tcmbXmlAl();
      const kur = kurDegeriOku(xml, temizKod, kurTipi);
      if (kur === null) {
        return { var: false, mesaj: 'Böyle bir kur yok' };
      }

      const etiket = KUR_TIPI_ETIKET[kurTipi];
      const formatli = kur.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
      return {
        var: true,
        kur,
        mesaj: `TCMB ${etiket}: 1 ${temizKod} = ${formatli} ₺`,
      };
    } catch {
      return { var: false, mesaj: 'TCMB kur verisi su an alinamiyor' };
    }
  }

  async topluGuncelle(
    kayitlar: { kod: string; kurTipi: KurTipi }[]
  ): Promise<Map<string, number>> {
    const sonuc = new Map<string, number>();
    const xml = await tcmbXmlAl();

    for (const k of kayitlar) {
      const kur = kurDegeriOku(xml, k.kod, k.kurTipi);
      if (kur !== null) sonuc.set(k.kod.toUpperCase(), kur);
    }
    return sonuc;
  }
}
