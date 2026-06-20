import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AktifEklentiPublic } from '@/types/eklenti';

const ANAHTAR = 'sp-duyuru-seridi-kapali';

interface DuyuruAyarlar {
  metin?: string;
  link?: string;
  linkMetin?: string;
}

interface DuyuruSeridiEklentiProps {
  eklenti: AktifEklentiPublic;
}

export function DuyuruSeridiEklenti({ eklenti }: DuyuruSeridiEklentiProps) {
  const ayarlar = eklenti.ayarlarJson as DuyuruAyarlar;
  const metin = ayarlar.metin?.trim() || 'Hoş geldiniz! Sitemizdeki yenilikleri keşfedin.';
  const link = ayarlar.link?.trim() || '';
  const linkMetin = ayarlar.linkMetin?.trim() || 'Detaylar';
  const [kapali, setKapali] = useState(false);

  useEffect(() => {
    setKapali(localStorage.getItem(ANAHTAR) === '1');
  }, []);

  if (kapali) return null;

  function kapat() {
    localStorage.setItem(ANAHTAR, '1');
    setKapali(true);
  }

  const linkIcerik =
    link && link.startsWith('http') ? (
      <a href={link} className="sp-eklenti-duyuru-link" target="_blank" rel="noreferrer">
        {linkMetin}
      </a>
    ) : link ? (
      <Link to={link} className="sp-eklenti-duyuru-link">
        {linkMetin}
      </Link>
    ) : null;

  return (
    <div className="sp-eklenti-duyuru" role="region" aria-label="Duyuru">
      <div className="sp-eklenti-duyuru-icerik">
        <p>{metin}</p>
        {linkIcerik}
        <button type="button" className="sp-eklenti-duyuru-kapat" onClick={kapat} aria-label="Duyuruyu kapat">
          ×
        </button>
      </div>
    </div>
  );
}
