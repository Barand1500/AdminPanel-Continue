import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { IconAlertTriangle, IconChevronLeft, IconChevronRight, IconStar, IconX } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  adminGorevGuncelle,
  adminGorevOlustur,
  adminGorevSil,
  adminGorevleriGetir,
  type AdminGorev,
  type AdminGorevGuncelleForm,
} from '@/features/admin/gorevApi';

type Gorev = AdminGorev;
type Ay = { y: number; m: number };
type EskiGorev = {
  id?: string;
  metin: string;
  tamamlandi: boolean;
  onemli: boolean;
  tarih: string | null;
  tarihBitis: string | null;
};

const ESKI_ANAHTAR = 'ap-aksiyon-yapilacaklar';
const GUNLER = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const KISA_AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const TATILLER = [['2026-01-01', 'Yılbaşı', '#38bdf8'], ['2026-03-20', 'Ramazan Bayramı', '#a855f7'], ['2026-04-23', '23 Nisan', '#ef4444'], ['2026-05-01', '1 Mayıs', '#f97316'], ['2026-05-19', '19 Mayıs', '#16a34a'], ['2026-05-27', 'Kurban Bayramı', '#06b6d4'], ['2026-07-15', '15 Temmuz', '#6366f1'], ['2026-08-30', '30 Ağustos', '#ec4899'], ['2026-10-29', '29 Ekim', '#dc2626']] as const;

const tarihKey = (y: number, m: number, g: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(g).padStart(2, '0')}`;
const tarihDegeri = (tarih: string) => new Date(`${tarih}T00:00:00`).getTime();
const kisaTarih = (tarih: string) => { const [, ay, gun] = tarih.split('-'); return `${Number(gun)} ${KISA_AYLAR[Number(ay) - 1]}`; };
const aradaMi = (tarih: string, bas: string | null, bit: string | null) => Boolean(bas && bit && tarihDegeri(tarih) >= tarihDegeri(bas) && tarihDegeri(tarih) <= tarihDegeri(bit));
const ayGunleri = (y: number, m: number) => { const bas = new Date(y, m, 1).getDay(); const son = new Date(y, m + 1, 0).getDate(); return Array.from({ length: Math.ceil((bas + son) / 7) * 7 }, (_, i) => i >= bas && i < bas + son ? i - bas + 1 : null); };
const basHarf = (ad: string) => ad.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toLocaleUpperCase('tr-TR') || '?';

function TarihSecici({ ay, degistir, bas, bit, sec, devreDisi = false }: { ay: Ay; degistir: (n: number) => void; bas: string | null; bit: string | null; sec: (tarih: string) => void; devreDisi?: boolean }) {
  return <fieldset className="ap-yap-tarih-secici"><legend>Tarih</legend><div className="ap-yap-tarih-ust"><button type="button" onClick={() => degistir(-1)} disabled={devreDisi}><IconChevronLeft size={17} /></button><strong>{AYLAR[ay.m]} {ay.y}</strong><button type="button" onClick={() => degistir(1)} disabled={devreDisi}><IconChevronRight size={17} /></button></div><div className="ap-yap-tarih-gunler">{GUNLER.map((gun) => <span key={gun}>{gun}</span>)}{ayGunleri(ay.y, ay.m).map((gun, index) => { if (!gun) return <span key={index} />; const tarih = tarihKey(ay.y, ay.m, gun); const uc = tarih === bas || tarih === bit; return <button key={tarih} type="button" onClick={() => sec(tarih)} disabled={devreDisi} className={`${uc ? 'ap-yap-tarih-secili' : ''}${aradaMi(tarih, bas, bit) ? ' ap-yap-tarih-aralik' : ''}`}>{gun}</button>; })}</div><small>Başlangıç ve bitiş gününü tıklayın veya sürükleyerek seçin.</small></fieldset>;
}

export function YapilacaklarSayfasi() {
  const { kullanici, yukleniyor: oturumYukleniyor } = useAuth();
  const [gorevler, setGorevler] = useState<Gorev[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const [islemKimligi, setIslemKimligi] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<'tumu' | 'aktif' | 'onemli' | 'tamamlandi'>('tumu');
  const [gorunum, setGorunum] = useState<'liste' | 'takvim'>('liste');
  const [modal, setModal] = useState(false);
  const [silinecek, setSilinecek] = useState<Gorev | null>(null);
  const [baslik, setBaslik] = useState('');
  const [bas, setBas] = useState<string | null>(null);
  const [bit, setBit] = useState<string | null>(null);
  const [onemli, setOnemli] = useState(false);
  const [ay, setAy] = useState<Ay>(() => ({ y: new Date().getFullYear(), m: new Date().getMonth() }));
  const profilAdi = kullanici?.ad ?? 'Demo Admin';
  const kullaniciId = kullanici?.id;

  useEffect(() => {
    if (oturumYukleniyor) return;
    if (!kullaniciId) {
      setGorevler([]);
      setYukleniyor(false);
      return;
    }

    let iptalEdildi = false;

    async function yukle(aktifKullaniciId: string) {
      setYukleniyor(true);
      setHata('');
      try {
        const sunucuGorevleri = await adminGorevleriGetir();
        if (iptalEdildi) return;
        setGorevler(sunucuGorevleri);

        const aktarim = await eskiGorevleriAktar(aktifKullaniciId);
        if (iptalEdildi) return;
        if (aktarim.eklenen.length) setGorevler([...sunucuGorevleri, ...aktarim.eklenen]);
        if (aktarim.hata) setHata(`Eski tarayıcı görevleri tam aktarılamadı: ${aktarim.hata.message}`);
      } catch (err) {
        if (!iptalEdildi) setHata(err instanceof Error ? err.message : 'Görevler alınamadı.');
      } finally {
        if (!iptalEdildi) setYukleniyor(false);
      }
    }

    void yukle(kullaniciId);
    return () => { iptalEdildi = true; };
  }, [kullaniciId, oturumYukleniyor, yenilemeSayaci]);

  const gorunen = useMemo(() => gorevler.filter((g) => filtre === 'aktif' ? !g.tamamlandi : filtre === 'onemli' ? g.onemli : filtre === 'tamamlandi' ? g.tamamlandi : true), [gorevler, filtre]);
  const ayDegistir = (delta: number) => setAy((onceki) => { const yeni = new Date(onceki.y, onceki.m + delta, 1); return { y: yeni.getFullYear(), m: yeni.getMonth() }; });
  const modalAc = () => { setBaslik(''); setBas(null); setBit(null); setOnemli(false); setHata(''); setModal(true); };
  const tarihSec = (tarih: string) => { if (!bas || bit) { setBas(tarih); setBit(null); } else if (tarihDegeri(tarih) < tarihDegeri(bas)) { setBit(bas); setBas(tarih); } else setBit(tarih); };
  const gorevTarihteMi = (gorev: Gorev, tarih: string) => Boolean(gorev.tarih && (gorev.tarihBitis ? aradaMi(tarih, gorev.tarih, gorev.tarihBitis) : gorev.tarih === tarih));

  async function ekle() {
    if (!baslik.trim() || islemKimligi) return;
    setIslemKimligi('yeni-gorev');
    setHata('');
    try {
      const gorev = await adminGorevOlustur({ metin: baslik, tamamlandi: false, onemli, tarih: bas, tarihBitis: bit });
      setGorevler((onceki) => [...onceki, gorev]);
      setModal(false);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Görev kaydedilemedi.');
    } finally {
      setIslemKimligi(null);
    }
  }

  async function gorevGuncelle(gorev: Gorev, degisiklik: AdminGorevGuncelleForm) {
    if (islemKimligi) return;
    setIslemKimligi(gorev.id);
    setHata('');
    try {
      const guncel = await adminGorevGuncelle(gorev.id, degisiklik);
      setGorevler((onceki) => onceki.map((x) => x.id === guncel.id ? guncel : x));
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Görev güncellenemedi.');
    } finally {
      setIslemKimligi(null);
    }
  }

  async function silOnayla() {
    if (!silinecek || islemKimligi) return;
    setIslemKimligi(silinecek.id);
    setHata('');
    try {
      await adminGorevSil(silinecek.id);
      setGorevler((onceki) => onceki.filter((g) => g.id !== silinecek.id));
      setSilinecek(null);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Görev silinemedi.');
    } finally {
      setIslemKimligi(null);
    }
  }

  const islemSuruyor = Boolean(islemKimligi);

  return <div className="ap-yapilacaklar">
    <aside><button className="ap-yap-gorev-ekle" type="button" onClick={modalAc} disabled={yukleniyor || islemSuruyor}>Görev Ekle</button>{([['tumu', '☰', 'Tümü'], ['aktif', '◉', 'Görevlerim'], ['onemli', '★', 'Önemli'], ['tamamlandi', '✓', 'Tamamlandı']] as const).map(([id, ikon, ad]) => <button key={id} type="button" className={filtre === id ? 'ap-yap-filtre aktif' : 'ap-yap-filtre'} onClick={() => setFiltre(id)}><span>{ikon}</span>{ad}</button>)}<div className="ap-yap-gorunum"><button type="button" className={gorunum === 'liste' ? 'aktif' : ''} onClick={() => setGorunum('liste')}>Liste</button><button type="button" className={gorunum === 'takvim' ? 'aktif' : ''} onClick={() => setGorunum('takvim')}>Takvim</button></div></aside>
    <main aria-busy={yukleniyor}>{hata && <div className="ap-bildirim ap-bildirim-hata" role="alert"><span>{hata}</span>{!yukleniyor && <button type="button" onClick={() => setYenilemeSayaci((onceki) => onceki + 1)}>Tekrar dene</button>}</div>}{yukleniyor ? <div className="ap-yap-bos"><p>Görevler yükleniyor...</p></div> : gorunum === 'liste' ? <><h1>Yapılacaklar</h1><p>{gorunen.length} görev</p>{gorunen.length === 0 ? <div className="ap-yap-bos"><p>Henüz görev yok.</p><button type="button" onClick={modalAc}>İlk görevi ekle</button></div> : <ul>{gorunen.map((g) => <li key={g.id}><input type="checkbox" checked={g.tamamlandi} disabled={islemSuruyor} onChange={() => void gorevGuncelle(g, { tamamlandi: !g.tamamlandi })} /><span className={g.tamamlandi ? 'tamamlandi' : ''}>{g.metin}</span><button className="ap-yap-gorev-yildiz" type="button" disabled={islemSuruyor} onClick={() => void gorevGuncelle(g, { onemli: !g.onemli })}><IconStar size={14} fill={g.onemli ? 'currentColor' : 'none'} /></button><small className="ap-yap-gorev-meta">{g.tarih ? `${kisaTarih(g.tarih)}${g.tarihBitis ? ` – ${kisaTarih(g.tarihBitis)}` : ''}` : 'Tarihsiz'}<span className="ap-yap-profil" title={profilAdi}>{basHarf(profilAdi)}</span></small><button className="ap-yap-gorev-sil" type="button" aria-label="Görevi sil" disabled={islemSuruyor} onClick={() => setSilinecek(g)}><IconX size={14} /></button></li>)}</ul>}</> : <div className="ap-yap-takvim"><header><button type="button" onClick={() => ayDegistir(-1)}><IconChevronLeft size={16} /></button><h1>{AYLAR[ay.m]} {ay.y}</h1><button type="button" onClick={() => ayDegistir(1)}><IconChevronRight size={16} /></button></header><div className="ap-yap-takvim-grid">{GUNLER.map((gun) => <strong key={gun}>{gun}</strong>)}{ayGunleri(ay.y, ay.m).map((gun, index) => { const tarih = gun ? tarihKey(ay.y, ay.m, gun) : ''; const tatil = TATILLER.find(([t]) => t === tarih); return <div key={index} className="ap-yap-takvim-hucre"><span>{gun ?? ''}</span>{tatil && <span className="ap-yap-tatil" style={{ '--ap-tatil-renk': tatil[2] } as CSSProperties}>{tatil[1]}</span>}{gorevler.filter((g) => gorevTarihteMi(g, tarih)).map((g) => <button key={g.id} type="button">{g.metin}</button>)}</div>; })}</div></div>}</main>
    {modal && <div className="ap-yap-modal-arka"><div className="erp-donen-cerceve erp-donen-cerceve-surekli ap-yap-modal-cerceve"><span className="erp-donen-cerceve-iz" /><div className="erp-donen-cerceve-icerik"><div className="ap-yap-modal"><header><div><h2>Yeni görev</h2><p>Tarih yoksa tarihsiz görevler arasında görünür.</p></div><button type="button" onClick={() => setModal(false)} disabled={islemSuruyor}><IconX size={18} /></button></header><fieldset className="ap-yap-gorev-alani"><legend>Görev <b>*</b></legend><input value={baslik} onChange={(e) => setBaslik(e.target.value)} disabled={islemSuruyor} autoFocus /></fieldset><TarihSecici ay={ay} degistir={ayDegistir} bas={bas} bit={bit} sec={tarihSec} devreDisi={islemSuruyor} /><fieldset className="ap-yap-onemli"><legend>Önemli</legend><label><input type="checkbox" checked={onemli} disabled={islemSuruyor} onChange={(e) => setOnemli(e.target.checked)} /><IconStar size={15} fill={onemli ? 'currentColor' : 'none'} /> {onemli ? 'Önemli' : 'Önemli değil'}</label></fieldset><footer><button type="button" onClick={() => setModal(false)} disabled={islemSuruyor}>Kapat</button><button type="button" className="kaydet" onClick={() => void ekle()} disabled={islemSuruyor || !baslik.trim()}>{islemKimligi === 'yeni-gorev' ? 'Kaydediliyor...' : 'Kaydet'}</button></footer></div></div></div></div>}
    {silinecek && <div className="ap-yap-modal-arka"><div className="ap-yap-sil-modal" role="alertdialog" aria-modal="true" aria-labelledby="sil-baslik"><header><span className="ap-yap-sil-uyari"><IconAlertTriangle size={19} /></span><h2 id="sil-baslik">Bu görevi silmek istiyor musunuz?</h2><button type="button" onClick={() => setSilinecek(null)} disabled={islemSuruyor}><IconX size={15} /> ESC</button></header><p><strong>{silinecek.metin}</strong> kalıcı olarak silinecektir. Bu işlem geri alınamaz.</p><footer><button type="button" onClick={() => setSilinecek(null)} disabled={islemSuruyor}>Vazgeç<small>(ESC)</small></button><button type="button" onClick={() => void silOnayla()} disabled={islemSuruyor}>{islemKimligi === silinecek.id ? 'Siliniyor...' : 'Evet, Sil'}<small>(ENTER)</small></button></footer></div></div>}
  </div>;
}

async function eskiGorevleriAktar(kullaniciId: string): Promise<{ eklenen: Gorev[]; hata: Error | null }> {
  const eskiGorevler = eskiGorevleriOku();
  if (!eskiGorevler.length) return { eklenen: [], hata: null };

  const aktarimAnahtari = eskiAktarimAnahtari(kullaniciId);
  const aktarilanKimlikler = aktarilanKimlikleriOku(aktarimAnahtari);
  const eklenen: Gorev[] = [];

  try {
    for (const [sira, eskiGorev] of eskiGorevler.entries()) {
      const kimlik = eskiGorevKimligi(eskiGorev, sira);
      if (aktarilanKimlikler.has(kimlik)) continue;

      const gorev = await adminGorevOlustur({
        metin: eskiGorev.metin,
        tamamlandi: eskiGorev.tamamlandi,
        onemli: eskiGorev.onemli,
        tarih: eskiGorev.tarih,
        tarihBitis: eskiGorev.tarihBitis,
      });
      eklenen.push(gorev);
      aktarilanKimlikler.add(kimlik);
      aktarilanKimlikleriKaydet(aktarimAnahtari, aktarilanKimlikler);
    }

    // Kaynak veri, tüm kayıtlar sunucuya başarıyla ulaştıktan sonra temizlenir.
    localStorage.removeItem(ESKI_ANAHTAR);
    localStorage.removeItem(aktarimAnahtari);
    return { eklenen, hata: null };
  } catch (err) {
    return { eklenen, hata: err instanceof Error ? err : new Error('Aktarım başarısız oldu.') };
  }
}

function eskiGorevleriOku(): EskiGorev[] {
  try {
    const ham = JSON.parse(localStorage.getItem(ESKI_ANAHTAR) ?? '[]') as unknown;
    if (!Array.isArray(ham)) return [];

    return ham.flatMap((deger) => {
      if (!deger || typeof deger !== 'object') return [];
      const gorev = deger as Record<string, unknown>;
      if (typeof gorev.metin !== 'string' || !gorev.metin.trim()) return [];
      const tarih = eskiTarihNormalize(gorev.tarih);
      return [{
        id: typeof gorev.id === 'string' && gorev.id.trim() ? gorev.id.trim() : undefined,
        metin: gorev.metin.trim(),
        tamamlandi: gorev.tamamlandi === true,
        onemli: gorev.onemli === true,
        tarih,
        tarihBitis: tarih ? eskiTarihNormalize(gorev.tarihBitis) : null,
      }];
    });
  } catch {
    return [];
  }
}

function eskiAktarimAnahtari(kullaniciId: string) {
  return `${ESKI_ANAHTAR}-aktarim-v1:${encodeURIComponent(kullaniciId)}`;
}

function aktarilanKimlikleriOku(anahtar: string): Set<string> {
  try {
    const ham = JSON.parse(localStorage.getItem(anahtar) ?? '[]') as unknown;
    return new Set(Array.isArray(ham) ? ham.filter((kimlik): kimlik is string => typeof kimlik === 'string') : []);
  } catch {
    return new Set();
  }
}

function aktarilanKimlikleriKaydet(anahtar: string, kimlikler: Set<string>) {
  localStorage.setItem(anahtar, JSON.stringify([...kimlikler]));
}

function eskiGorevKimligi(gorev: EskiGorev, sira: number) {
  return gorev.id ? `id:${gorev.id}` : `satir:${sira}:${gorev.metin}:${gorev.tarih ?? ''}:${gorev.tarihBitis ?? ''}`;
}

function eskiTarihNormalize(deger: unknown): string | null {
  if (typeof deger !== 'string') return null;
  const eslesme = /^(\d{4}-\d{2}-\d{2})/.exec(deger.trim());
  return eslesme ? eslesme[1] : null;
}
