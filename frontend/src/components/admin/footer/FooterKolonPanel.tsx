import { useEffect, useState } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import {
  yeniFooterId,
  type FooterAyarlari,
  type FooterKolon,
  type FooterLink,
} from '@/types/footer';
import { formInputSinifi } from '@/components/form/FormAlani';
import { FooterLinkModal, type FooterLinkFormDegeri } from './FooterLinkModal';
import { adminSayfalariGetir } from '@/features/admin/sayfaApi';

interface FooterKolonPanelProps {
  footer: FooterAyarlari;
  onDegistir: (footer: FooterAyarlari) => void;
}

function siraTasi<T extends { sira: number }>(dizi: T[], index: number, yon: -1 | 1): T[] {
  const hedef = index + yon;
  if (hedef < 0 || hedef >= dizi.length) return dizi;
  const kopya = [...dizi];
  [kopya[index], kopya[hedef]] = [kopya[hedef], kopya[index]];
  return kopya.map((o, i) => ({ ...o, sira: i }));
}

export function FooterKolonPanel({ footer, onDegistir }: FooterKolonPanelProps) {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [acikKolon, setAcikKolon] = useState<string | null>(null);
  const [linkModal, setLinkModal] = useState<{
    kolonId: string;
    link?: FooterLink | null;
  } | null>(null);

  useEffect(() => {
    adminSayfalariGetir().then(setSayfalar).catch(() => setSayfalar([]));
  }, []);

  const kolonlariGuncelle = (kolonlar: FooterKolon[]) => {
    onDegistir({ ...footer, kolonlar });
  };

  const kolonEkle = () => {
    const yeni: FooterKolon = {
      id: yeniFooterId(),
      baslik: 'Yeni Kolon',
      aktif: true,
      sira: footer.kolonlar.length,
      linkler: [],
    };
    kolonlariGuncelle([...footer.kolonlar, yeni]);
    setAcikKolon(yeni.id);
  };

  const kolonSil = (id: string) => {
    const kalan = footer.kolonlar.filter((k) => k.id !== id).map((k, i) => ({ ...k, sira: i }));
    kolonlariGuncelle(kalan);
    if (acikKolon === id) setAcikKolon(null);
  };

  const kolonGuncelle = (id: string, parca: Partial<FooterKolon>) => {
    kolonlariGuncelle(
      footer.kolonlar.map((k) => (k.id === id ? { ...k, ...parca } : k))
    );
  };

  const linkKaydet = (kolonId: string, deger: FooterLinkFormDegeri, mevcutId?: string) => {
    const kolon = footer.kolonlar.find((k) => k.id === kolonId);
    if (!kolon) return;

    let linkler: FooterLink[];
    if (mevcutId) {
      linkler = kolon.linkler.map((l) =>
        l.id === mevcutId ? { ...l, ...deger, aktif: l.aktif } : l
      );
    } else {
      linkler = [
        ...kolon.linkler,
        { id: yeniFooterId(), ...deger, aktif: true, sira: kolon.linkler.length },
      ];
    }
    kolonGuncelle(kolonId, { linkler });
  };

  const linkSil = (kolonId: string, linkId: string) => {
    const kolon = footer.kolonlar.find((k) => k.id === kolonId);
    if (!kolon) return;
    const linkler = kolon.linkler
      .filter((l) => l.id !== linkId)
      .map((l, i) => ({ ...l, sira: i }));
    kolonGuncelle(kolonId, { linkler });
  };

  const linkAktifDegistir = (kolonId: string, linkId: string, aktif: boolean) => {
    const kolon = footer.kolonlar.find((k) => k.id === kolonId);
    if (!kolon) return;
    const linkler = kolon.linkler.map((l) => (l.id === linkId ? { ...l, aktif } : l));
    kolonGuncelle(kolonId, { linkler });
  };

  const linkTasi = (kolonId: string, index: number, yon: -1 | 1) => {
    const kolon = footer.kolonlar.find((k) => k.id === kolonId);
    if (!kolon) return;
    const linkler = siraTasi(kolon.linkler, index, yon);
    kolonGuncelle(kolonId, { linkler });
  };

  const siraliKolonlar = [...footer.kolonlar].sort((a, b) => a.sira - b.sira);

  return (
    <div className="space-y-3">
      {siraliKolonlar.map((kolon, kolonIndex) => {
        const acik = acikKolon === kolon.id;
        const siraliLinkler = [...kolon.linkler].sort((a, b) => a.sira - b.sira);
        return (
          <div key={kolon.id} className="rounded-xl border border-[var(--ap-border)]">
            <button
              type="button"
              onClick={() => setAcikKolon(acik ? null : kolon.id)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="ap-heading truncate text-sm font-semibold">{kolon.baslik}</p>
                <p className="ap-muted text-xs">
                  {siraliLinkler.length} link · {kolon.aktif ? 'Aktif' : 'Kapalı'}
                </p>
              </div>
              <span className="ap-muted text-xs">{acik ? '▲' : '▼'}</span>
            </button>

            {acik && (
              <div className="space-y-3 border-t border-[var(--ap-border)] px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={kolon.baslik}
                    onChange={(e) => kolonGuncelle(kolon.id, { baslik: e.target.value })}
                    className={`${formInputSinifi} min-w-0 flex-1`}
                    placeholder="Kolon başlığı"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={kolon.aktif}
                      onChange={(e) => kolonGuncelle(kolon.id, { aktif: e.target.checked })}
                    />
                    Aktif
                  </label>
                  <button
                    type="button"
                    disabled={kolonIndex === 0}
                    onClick={() => kolonlariGuncelle(siraTasi(siraliKolonlar, kolonIndex, -1))}
                    className="rounded border border-[var(--ap-border)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={kolonIndex === siraliKolonlar.length - 1}
                    onClick={() => kolonlariGuncelle(siraTasi(siraliKolonlar, kolonIndex, 1))}
                    className="rounded border border-[var(--ap-border)] px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => kolonSil(kolon.id)}
                    className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                  >
                    Sil
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {siraliLinkler.map((link, linkIndex) => (
                    <li
                      key={link.id}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                        link.aktif ? 'bg-[var(--ap-input-bg)]' : 'bg-[var(--ap-input-bg)]/50 opacity-60'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{link.ad}</span>
                      <span className="ap-muted hidden truncate text-xs sm:inline">{link.link}</span>
                      <button
                        type="button"
                        disabled={linkIndex === 0}
                        onClick={() => linkTasi(kolon.id, linkIndex, -1)}
                        className="text-xs disabled:opacity-40"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={linkIndex === siraliLinkler.length - 1}
                        onClick={() => linkTasi(kolon.id, linkIndex, 1)}
                        className="text-xs disabled:opacity-40"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkModal({ kolonId: kolon.id, link })}
                        className="text-xs text-[var(--ap-accent)]"
                      >
                        Düzenle
                      </button>
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap" title="Aktif / Pasif">
                        <input
                          type="checkbox"
                          checked={link.aktif}
                          onChange={(e) => linkAktifDegistir(kolon.id, link.id, e.target.checked)}
                        />
                        Aktif
                      </label>
                      <button
                        type="button"
                        onClick={() => linkSil(kolon.id, link.id)}
                        className="text-xs text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setLinkModal({ kolonId: kolon.id })}
                  className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--ap-hover)]"
                >
                  + Link Ekle
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={kolonEkle}
        className="rounded-lg bg-[var(--ap-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        + Kolon Ekle
      </button>

      {linkModal && (
        <FooterLinkModal
          acik
          sayfalar={sayfalar}
          duzenlenen={linkModal.link}
          onKapat={() => setLinkModal(null)}
          onKaydet={(deger) => {
            linkKaydet(linkModal.kolonId, deger, linkModal.link?.id);
            setLinkModal(null);
          }}
        />
      )}
    </div>
  );
}
