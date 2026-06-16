import { FormEvent, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { publicFormGonder } from '@/features/site/formApi';

function TelefonInput({
  label,
  type = 'text',
  placeholder,
  required,
  value,
  onChange,
  rows,
}: {
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="phone-input-grup">
      <label className="phone-input-etiket">{label}</label>
      {rows ? (
        <textarea
          required={required}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="phone-input-alan phone-input-textarea"
        />
      ) : (
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="phone-input-alan"
        />
      )}
    </div>
  );
}

export function IletisimSayfasi() {
  const { site } = useOutletContext<SitePublicData>();
  const ayarlar = site.ayarlar;
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [gonderildi, setGonderildi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState('');

  async function formGonder(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata('');
    try {
      await publicFormGonder('iletisim', { adSoyad, email, telefon, mesaj });
      setGonderildi(true);
      setAdSoyad('');
      setEmail('');
      setTelefon('');
      setMesaj('');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Gönderim başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-title text-3xl">İletişim</h1>
          <p className="section-subtitle mt-2">Sorularınız için bize ulaşın — size en kısa sürede dönüş yapalım.</p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="w-full space-y-4">
            <h2 className="text-lg font-bold text-slate-900">İletişim Bilgileri</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {ayarlar?.adres && (
                <div className="iletisim-kart">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Adres</p>
                    <p className="mt-0.5 text-sm text-slate-700">{ayarlar.adres}</p>
                  </div>
                </div>
              )}
              {ayarlar?.telefon && (
                <div className="iletisim-kart">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Telefon</p>
                    <a href={`tel:${ayarlar.telefon.replace(/\s/g, '')}`} className="mt-0.5 block text-sm font-medium text-primary hover:underline">
                      {ayarlar.telefon}
                    </a>
                  </div>
                </div>
              )}
              {ayarlar?.email && (
                <div className="iletisim-kart">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">E-posta</p>
                    <a href={`mailto:${ayarlar.email}`} className="mt-0.5 block text-sm font-medium text-primary hover:underline">
                      {ayarlar.email}
                    </a>
                  </div>
                </div>
              )}
              {ayarlar?.whatsapp && (
                <div className="iletisim-kart">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">WhatsApp</p>
                    <a
                      href={`https://wa.me/${ayarlar.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block text-sm font-medium text-green-600 hover:underline"
                    >
                      {ayarlar.whatsapp}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="phone-cerceve flex w-full max-w-[280px] flex-col lg:mx-0 lg:justify-self-end">
            <div className="phone-cerceve-ust">
              <div className="phone-cerceve-centik" />
              <div className="flex items-center justify-between px-4 pt-9 text-[10px] text-slate-400 sm:px-5">
                <span>09:41</span>
                <span className="font-semibold text-primary">Güzel Teknoloji</span>
                <span>📶 🔋</span>
              </div>
            </div>

            <form onSubmit={formGonder} className="phone-cerceve-icerik flex flex-1 flex-col">
              <p className="mb-3 text-center text-sm font-bold text-slate-800">Mesaj Gönder</p>

              <TelefonInput
                label="Ad Soyad"
                placeholder="Adınızı yazın..."
                required
                value={adSoyad}
                onChange={setAdSoyad}
              />
              <TelefonInput
                label="E-posta"
                type="email"
                placeholder="ornek@email.com"
                required
                value={email}
                onChange={setEmail}
              />
              <TelefonInput
                label="Telefon"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={telefon}
                onChange={setTelefon}
              />
              <TelefonInput
                label="Mesajınız"
                placeholder="Mesajınızı buraya yazın..."
                required
                rows={5}
                value={mesaj}
                onChange={setMesaj}
              />

              <button type="submit" className="phone-gonder-btn" disabled={gonderiliyor}>
                {gonderiliyor ? 'Gönderiliyor...' : 'Gönder ✈️'}
              </button>

              {hata && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-700">{hata}</p>
              )}

              {gonderildi && (
                <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-center text-xs text-green-700">
                  Mesajınız alındı. En kısa sürede size dönüş yapacağız.
                </p>
              )}
            </form>

            <div className="phone-cerceve-alt">
              <div className="phone-home-bar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
