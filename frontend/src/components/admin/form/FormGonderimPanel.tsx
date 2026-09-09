import { useState, type ReactNode } from 'react';
import type { AdminForm, FormGonderim } from '@/features/admin/formApi';
import { AdminBosDurum } from '@/components/admin/ortak/AdminFormBilesenleri';
import { AdminFlatIkon } from '@/components/admin/ortak/AdminFlatIkon';
import { formSelectSinifi } from '@/components/form/FormAlani';

interface FormGonderimPanelProps {
  formlar: AdminForm[];
  gonderimler: FormGonderim[];
  seciliId: string | null;
  onFormSec: (id: string) => void;
  onOkundu: (id: string) => void;
  onSil: (id: string) => void;
  onYanitla: (id: string, payload: { alicilar: string[]; konu: string; mesaj: string }) => Promise<void>;
  ustAksiyon?: ReactNode;
}

const epostaDeseni = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function epostalariBul(veri: Record<string, unknown>) {
  const bulunan = Object.values(veri).flatMap((deger) => String(deger ?? '').match(epostaDeseni) ?? []);
  return [...new Set(bulunan.map((eposta) => eposta.toLowerCase()))];
}

function YanitEditor({
  gonderim,
  formAdi,
  onIptal,
  onGonder,
}: {
  gonderim: FormGonderim;
  formAdi: string;
  onIptal: () => void;
  onGonder: (payload: { alicilar: string[]; konu: string; mesaj: string }) => Promise<void>;
}) {
  const adaylar = epostalariBul(gonderim.veriJson);
  const [seciliAlicilar, setSeciliAlicilar] = useState<string[]>(adaylar.length === 1 ? adaylar : []);
  const [manuelAlicilar, setManuelAlicilar] = useState('');
  const [konu, setKonu] = useState(`Re: ${formAdi}`);
  const [mesaj, setMesaj] = useState('');
  const [hata, setHata] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function gonder() {
    const manuel = manuelAlicilar.match(epostaDeseni) ?? [];
    const alicilar = [...new Set([...seciliAlicilar, ...manuel.map((email) => email.toLowerCase())])];
    if (!alicilar.length) return setHata('En az bir geçerli e-posta adresi seçin veya yazın.');
    if (!konu.trim() || !mesaj.trim()) return setHata('Konu ve mesaj zorunludur.');
    setHata('');
    setGonderiliyor(true);
    try {
      await onGonder({ alicilar, konu: konu.trim(), mesaj: mesaj.trim() });
      onIptal();
    } catch {
      // Sayfa seviyesindeki bildirim teknik hatayı gösterir.
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="ap-form-yanit-editor">
      <strong>Yanıt yaz</strong>
      {adaylar.length > 0 && (
        <div className="ap-form-yanit-alicilar">
          <span>Alıcılar</span>
          {adaylar.map((eposta) => (
            <label key={eposta}>
              <input type="checkbox" checked={seciliAlicilar.includes(eposta)} onChange={(e) => setSeciliAlicilar((onceki) => e.target.checked ? [...onceki, eposta] : onceki.filter((x) => x !== eposta))} />
              {eposta}
            </label>
          ))}
          {adaylar.length > 1 && <small>Birden fazla adres bulundu; göndermek istediklerinizi seçin.</small>}
        </div>
      )}
      <label className="ap-form-yanit-alan"><span>{adaylar.length ? 'Ek alıcılar' : 'Alıcı e-posta adresi'}</span><input value={manuelAlicilar} onChange={(e) => setManuelAlicilar(e.target.value)} placeholder="ornek@firma.com, ikinci@firma.com" /></label>
      <label className="ap-form-yanit-alan"><span>Konu</span><input value={konu} onChange={(e) => setKonu(e.target.value)} maxLength={200} /></label>
      <label className="ap-form-yanit-alan"><span>Mesaj</span><textarea value={mesaj} onChange={(e) => setMesaj(e.target.value)} maxLength={10000} rows={5} /></label>
      {hata && <p className="ap-form-yanit-hata">{hata}</p>}
      <div className="ap-form-gonderim-aksiyonlar">
        <button type="button" onClick={() => void gonder()} className="ap-form-gonderim-tus" disabled={gonderiliyor}>{gonderiliyor ? 'Gönderiliyor...' : 'E-posta gönder'}</button>
        <button type="button" onClick={onIptal} className="ap-form-gonderim-tus ap-form-gonderim-tus--sil" disabled={gonderiliyor}>İptal</button>
      </div>
    </section>
  );
}

export function FormGonderimPanel({ formlar, gonderimler, seciliId, onFormSec, onOkundu, onSil, onYanitla, ustAksiyon }: FormGonderimPanelProps) {
  const [yanitlananId, setYanitlananId] = useState<string | null>(null);
  const okunmamis = gonderimler.filter((g) => !g.okundu).length;
  const seciliForm = formlar.find((f) => f.id === seciliId) ?? null;
  const ozet = seciliForm ? okunmamis > 0 ? `${okunmamis} yeni · ${gonderimler.length} kayıt` : `${gonderimler.length} kayıt` : 'Görüntülemek için form seçin';

  return (
    <div className="ap-editor-panel ap-form-gonderim-panel">
      <div className="ap-form-editor-ust">
        <div><h2 className="ap-heading text-sm font-semibold">Gönderimler</h2><p className="ap-muted text-xs">{ozet}</p></div>
        <div className="ap-form-gonderim-ust-sag">
          {okunmamis > 0 && <span className="ap-form-yeni-rozet">{okunmamis} yeni</span>}
          <select className={formSelectSinifi} value={seciliId ?? ''} onChange={(e) => onFormSec(e.target.value)}><option value="">Form seçin</option>{formlar.map((f) => <option key={f.id} value={f.id}>{f.ad}{(f._count?.gonderimler ?? 0) > 0 ? ` (${f._count?.gonderimler})` : ''}</option>)}</select>
          {ustAksiyon}
        </div>
      </div>
      <div className="ap-form-gonderim-icerik ap-scroll">
        {!seciliId ? <AdminBosDurum ikon={<AdminFlatIkon ad="gelen" boyut={28} />} baslik="Form seçilmedi" aciklama="Üstten bir form seçerek gelen başvuruları görün" />
          : gonderimler.length === 0 ? <AdminBosDurum ikon={<AdminFlatIkon ad="giden" boyut={28} />} baslik="Henüz gönderim yok" aciklama="Bu forma henüz ziyaretçi başvurusu gelmedi" />
            : gonderimler.map((g) => <article key={g.id} className={`ap-form-gonderim-kart${!g.okundu ? ' ap-form-gonderim-yeni' : ''}`}>
              <div className="flex items-center justify-between gap-2"><time className="ap-muted text-xs" dateTime={g.olusturma}>{new Date(g.olusturma).toLocaleString('tr-TR')}</time>{!g.okundu && <span className="ap-form-yeni-rozet">Yeni</span>}</div>
              <dl className="ap-form-gonderim-veri mt-3">{Object.entries(g.veriJson).map(([anahtar, deger]) => <div key={anahtar} className="ap-form-gonderim-satir"><dt>{anahtar}</dt><dd>{String(deger)}</dd></div>)}</dl>
              {g.yanitlar?.length ? <div className="ap-form-yanit-gecmisi"><strong>Gönderilen yanıtlar</strong>{g.yanitlar.map((yanit) => <div key={yanit.id}><small>{new Date(yanit.olusturma).toLocaleString('tr-TR')} · {yanit.alicilar.join(', ')}</small><b>{yanit.konu}</b><p>{yanit.mesaj}</p></div>)}</div> : null}
              {yanitlananId === g.id && <YanitEditor gonderim={g} formAdi={seciliForm?.ad ?? 'Form başvurusu'} onIptal={() => setYanitlananId(null)} onGonder={(payload) => onYanitla(g.id, payload)} />}
              <div className="ap-form-gonderim-aksiyonlar">{!g.okundu && <button type="button" onClick={() => onOkundu(g.id)} className="ap-form-gonderim-tus">Okundu</button>}<button type="button" onClick={() => setYanitlananId(yanitlananId === g.id ? null : g.id)} className="ap-form-gonderim-tus">Yanıtla</button><button type="button" onClick={() => onSil(g.id)} className="ap-form-gonderim-tus ap-form-gonderim-tus--sil">Sil</button></div>
            </article>)}
      </div>
    </div>
  );
}
