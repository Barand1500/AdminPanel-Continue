import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { AdminMedya } from '@/features/admin/medyaApi';
import { medyaTamUrl } from '@/features/admin/medyaApi';
import { MEDYA_MAX_DOSYA_MB } from '@/constants/medya';
import { AdminAramaKutusu, AdminBosDurum, AdminFormBolumu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { AdminFlatIkon } from '@/components/admin/ortak/AdminFlatIkon';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { adminIslemBildirimi } from '@/utils/adminBildirimOlaylari';

function boyutYazi(n?: number | null) {
  if (!n || n <= 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function tarihYazi(iso?: string) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(iso));
  } catch {
    return '';
  }
}

async function urlKopyala(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    adminIslemBildirimi('Adres kopyalandı', 'basari');
  } catch {
    adminIslemBildirimi('Kopyalanamadı', 'hata');
  }
}

export function MedyaGrid({
  medyalar,
  seciliIds,
  arama,
  onArama,
  onSecToggle,
  onHepsiniSec,
  onSecimiTemizle,
  onOnizle,
}: {
  medyalar: AdminMedya[];
  seciliIds: string[];
  arama: string;
  onArama: (v: string) => void;
  onSecToggle: (id: string) => void;
  onHepsiniSec?: () => void;
  onSecimiTemizle?: () => void;
  onOnizle: (medya: AdminMedya) => void;
}) {
  const seciliSet = new Set(seciliIds);
  const hepsiSecili = medyalar.length > 0 && seciliIds.length === medyalar.length;

  return (
    <div className="ap-medya-galeri">
      <div className="ap-medya-ust">
        <AdminAramaKutusu deger={arama} onChange={onArama} placeholder="Ada göre ara..." />
        <div className="ap-medya-ust-sag">
          {medyalar.length > 0 && (
            <button
              type="button"
              className="ap-medya-metin-btn"
              onClick={hepsiSecili ? onSecimiTemizle : onHepsiniSec}
            >
              {hepsiSecili ? 'Seçimi kaldır' : 'Tümünü seç'}
            </button>
          )}
          <span className="ap-medya-sayac">
            {seciliIds.length > 0 ? `${seciliIds.length} seçili · ` : ''}
            {medyalar.length} görsel
          </span>
        </div>
      </div>

      {medyalar.length === 0 ? (
        <AdminBosDurum
          ikon={<AdminFlatIkon ad="galeri" boyut={28} />}
          baslik={arama ? 'Sonuç yok' : 'Henüz görsel yok'}
          aciklama={arama ? 'Farklı bir arama deneyin' : 'Yukarıdan dosya bırakın veya seçin'}
        />
      ) : (
        <div className="ap-medya-grid">
          {medyalar.map((m) => {
            const secili = seciliSet.has(m.id);
            const tamUrl = medyaTamUrl(m.url);
            const meta = [boyutYazi(m.boyut), tarihYazi(m.olusturma)].filter(Boolean).join(' · ');
            return (
              <article
                key={m.id}
                className={`ap-medya-kart${secili ? ' ap-medya-kart--secili' : ''}`}
              >
                <button
                  type="button"
                  className="ap-medya-kart-gorsel"
                  onClick={() => onSecToggle(m.id)}
                >
                  <img src={tamUrl} alt={m.ad} />
                  <span className={`ap-medya-kart-check${secili ? ' ap-medya-kart-check--on' : ''}`}>
                    {secili ? '✓' : ''}
                  </span>
                </button>
                <div className="ap-medya-kart-hover">
                  <button type="button" onClick={() => onOnizle(m)} title="Büyüt">
                    Büyüt
                  </button>
                  <button type="button" onClick={() => void urlKopyala(tamUrl)} title="Adresi kopyala">
                    Kopyala
                  </button>
                </div>
                <div className="ap-medya-kart-bilgi">
                  <p className="ap-medya-kart-ad" title={m.ad}>
                    {m.ad}
                  </p>
                  {meta && <p className="ap-medya-kart-meta">{meta}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function dosyalariAyikla(liste: FileList | File[]): File[] {
  return Array.from(liste).filter((d) => d.type.startsWith('image/'));
}

export function MedyaYukleyici({
  urlForm,
  yukleniyor,
  yuklemeIlerleme,
  kompakt,
  dosyaInputRef,
  onUrlFormChange,
  onUrlEkle,
  onDosyalarSec,
}: {
  urlForm: { ad: string; url: string };
  yukleniyor: boolean;
  yuklemeIlerleme?: { tamamlanan: number; toplam: number } | null;
  kompakt?: boolean;
  dosyaInputRef?: RefObject<HTMLInputElement | null>;
  onUrlFormChange: (form: { ad: string; url: string }) => void;
  onUrlEkle: () => void;
  onDosyalarSec: (dosyalar: File[]) => void;
}) {
  const icRef = useRef<HTMLInputElement>(null);
  const inputRef = dosyaInputRef ?? icRef;
  const [surukleniyor, setSurukleniyor] = useState(false);

  const dosyaGonder = useCallback(
    (liste: FileList | File[]) => {
      const dosyalar = dosyalariAyikla(liste);
      if (dosyalar.length === 0) return;
      onDosyalarSec(dosyalar);
    },
    [onDosyalarSec]
  );

  function surukleBirak(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSurukleniyor(false);
    if (yukleniyor) return;
    dosyaGonder(e.dataTransfer.files);
  }

  return (
    <div className="ap-medya-yukle">
      <div
        className={`ap-medya-toplu-alan${kompakt ? ' ap-medya-toplu-alan--kompakt' : ''}${
          surukleniyor ? ' ap-medya-toplu-alan-surukle' : ''
        }${yukleniyor ? ' ap-medya-toplu-alan-pasif' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!yukleniyor) setSurukleniyor(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!yukleniyor) setSurukleniyor(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) setSurukleniyor(false);
        }}
        onDrop={surukleBirak}
      >
        <span className="ap-medya-toplu-ikon" aria-hidden><AdminFlatIkon ad="medya" boyut={25} /></span>
        <div className="ap-medya-toplu-metin">
          <p className="ap-medya-toplu-baslik">
            {surukleniyor ? 'Dosyaları buraya bırakın' : kompakt ? 'Görsel ekle' : 'Görselleri buraya bırakın'}
          </p>
          <p className="ap-medya-toplu-aciklama">
            PNG, JPG, WEBP — dosya başına en fazla {MEDYA_MAX_DOSYA_MB} MB
          </p>
        </div>
        <button
          type="button"
          className="ap-medya-toplu-dugme"
          disabled={yukleniyor}
          onClick={() => inputRef.current?.click()}
        >
          {yukleniyor ? 'Yükleniyor...' : 'Dosya seç'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={yukleniyor}
          onChange={(e) => {
            if (e.target.files?.length) dosyaGonder(e.target.files);
            e.target.value = '';
          }}
        />
        {yuklemeIlerleme && yuklemeIlerleme.toplam > 0 && (
          <div className="ap-medya-toplu-ilerleme">
            <div className="ap-medya-toplu-ilerleme-cubuk">
              <div
                className="ap-medya-toplu-ilerleme-dolgu"
                style={{ width: `${(yuklemeIlerleme.tamamlanan / yuklemeIlerleme.toplam) * 100}%` }}
              />
            </div>
            <p className="ap-medya-toplu-ilerleme-metin">
              {yuklemeIlerleme.tamamlanan} / {yuklemeIlerleme.toplam} yüklendi
            </p>
          </div>
        )}
      </div>

      <AdminFormBolumu
        baslik="URL ile ekle"
        aciklama="Harici bir görsel adresi kullanmak istiyorsanız."
        akordeon
        varsayilanAcik={false}
      >
        <div className="ap-medya-url-form">
          <FormAlani etiket="Ad">
            <input
              className={formInputSinifi}
              placeholder="Örn. Logo"
              value={urlForm.ad}
              onChange={(e) => onUrlFormChange({ ...urlForm, ad: e.target.value })}
            />
          </FormAlani>
          <FormAlani etiket="Adres">
            <input
              className={formInputSinifi}
              placeholder="https://..."
              value={urlForm.url}
              onChange={(e) => onUrlFormChange({ ...urlForm, url: e.target.value })}
            />
          </FormAlani>
          <button
            type="button"
            className="ap-medya-toplu-dugme"
            disabled={yukleniyor || !urlForm.ad.trim() || !urlForm.url.trim()}
            onClick={onUrlEkle}
          >
            URL ekle
          </button>
        </div>
      </AdminFormBolumu>
    </div>
  );
}

export function MedyaOnizlemeModal({
  medya,
  onKapat,
}: {
  medya: AdminMedya | null;
  onKapat: () => void;
}) {
  useEffect(() => {
    if (!medya) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') onKapat();
    }
    document.addEventListener('keydown', tus);
    return () => document.removeEventListener('keydown', tus);
  }, [medya, onKapat]);

  if (!medya) return null;
  const tamUrl = medyaTamUrl(medya.url);

  return (
    <div className="ap-medya-oniz-overlay" onClick={onKapat} role="dialog" aria-modal="true">
      <div className="ap-medya-oniz" onClick={(e) => e.stopPropagation()}>
        <div className="ap-medya-oniz-ust">
          <div>
            <p className="ap-medya-oniz-ad">{medya.ad}</p>
            <p className="ap-medya-oniz-url">{tamUrl}</p>
          </div>
          <div className="ap-medya-oniz-tuslar">
            <button type="button" className="ap-medya-metin-btn" onClick={() => void urlKopyala(tamUrl)}>
              Kopyala
            </button>
            <button type="button" className="ap-medya-metin-btn" onClick={onKapat}>
              Kapat
            </button>
          </div>
        </div>
        <img src={tamUrl} alt={medya.ad} className="ap-medya-oniz-gorsel" />
      </div>
    </div>
  );
}
