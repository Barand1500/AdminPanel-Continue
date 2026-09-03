import { useState, type FormEvent, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IconList, IconMail, IconMessage, IconPhone, IconUser } from '@tabler/icons-react';
import { publicFormGonder } from '@/features/site/formApi';
import { CizgiIkon } from '../CizgiIkonlari';
import type { SitePublicData } from '@/types/site';

export function IletisimOverlayFormu({
  baslik,
  butonMetni,
  vurgu,
  baslikRenk,
}: {
  baslik?: string | null;
  butonMetni?: string | null;
  vurgu: string;
  baslikRenk: string;
}) {
  const { site } = useOutletContext<SitePublicData>();
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [konu, setKonu] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [gonderildi, setGonderildi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState('');

  function mailtoAc() {
    const alici = site.ayarlar?.email?.trim();
    if (!alici || typeof window === 'undefined') return;
    const konuMetni = konu.trim() || `Web sitesi iletişim formu — ${adSoyad.trim() || 'Yeni mesaj'}`;
    const govde = [
      `Ad Soyad: ${adSoyad}`,
      `E-posta: ${email}`,
      `Telefon: ${telefon || '-'}`,
      '',
      'Mesaj:',
      mesaj,
    ].join('\n');
    window.location.href = `mailto:${encodeURIComponent(alici)}?${new URLSearchParams({ subject: konuMetni, body: govde }).toString()}`;
  }

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata('');
    try {
      await publicFormGonder('iletisim', { adSoyad, email, telefon, konu, mesaj });
      mailtoAc();
      setGonderildi(true);
      setAdSoyad('');
      setEmail('');
      setTelefon('');
      setKonu('');
      setMesaj('');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Gönderim başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <div className="ib-form">
      <div className="ib-form-baslik-satir">
        <span className="ib-form-baslik-ikon" style={{ color: vurgu }}>
          <CizgiIkon deger="eposta" yedek="eposta" boyut={22} />
        </span>
        <div>
          <h2 className="ib-form-baslik" style={{ color: baslikRenk }}>
            {baslik?.trim() || 'İletişim Formu'}
          </h2>
          <span className="ib-yuzen-cizgi" style={{ backgroundColor: vurgu }} />
        </div>
      </div>

      {gonderildi ? (
        <p className="ib-form-sonuc" style={{ color: vurgu }}>
          Mesajınız alındı. En kısa sürede dönüş yapacağız.
        </p>
      ) : (
        <form className="ib-form-grid" onSubmit={gonder}>
          <div className="ib-form-sol">
            <FormSatir ikon={<IconUser size={18} stroke={1.7} />} placeholder="Adınız Soyadınız" value={adSoyad} onChange={setAdSoyad} required />
            <FormSatir ikon={<IconMail size={18} stroke={1.7} />} type="email" placeholder="Eposta Adresiniz" value={email} onChange={setEmail} required />
            <FormSatir ikon={<IconPhone size={18} stroke={1.7} />} type="tel" placeholder="Telefon Numaranız" value={telefon} onChange={setTelefon} />
            <FormSatir ikon={<IconList size={18} stroke={1.7} />} placeholder="Konu" value={konu} onChange={setKonu} />
          </div>
          <div className="ib-form-sag">
            <FormSatir
              ikon={<IconMessage size={18} stroke={1.7} />}
              placeholder="Mesajınızı buraya yazınız"
              value={mesaj}
              onChange={setMesaj}
              textarea
              required
            />
            {hata && <p className="ib-form-hata">{hata}</p>}
            <button
              type="submit"
              className="ib-form-gonder"
              style={{ backgroundColor: vurgu }}
              disabled={gonderiliyor}
            >
              {gonderiliyor ? 'Gönderiliyor...' : (butonMetni?.trim() || 'Mesajı Gönder').toLocaleUpperCase('tr-TR')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function FormSatir({
  ikon,
  placeholder,
  value,
  onChange,
  type = 'text',
  required,
  textarea,
}: {
  ikon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const ikonEl = <span className="ib-form-alan-ikon">{ikon}</span>;
  const ortak = {
    required,
    placeholder,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };

  return (
    <label className={`ib-form-alan${textarea ? ' ib-form-alan--mesaj' : ''}`}>
      {ikonEl}
      {textarea ? (
        <textarea {...ortak} rows={5} className="ib-form-input" />
      ) : (
        <input type={type} {...ortak} className="ib-form-input" />
      )}
    </label>
  );
}
