import { useEffect, useState } from 'react';
import { IconEye, IconEyeOff, IconKey, IconUser, IconX } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminProfilModal({ acik, onKapat }: { acik: boolean; onKapat: () => void }) {
  const { kullanici, profilKaydet, cikisYap } = useAuth();
  const [sekme, setSekme] = useState<'bilgi' | 'sifre'>('bilgi');
  const [ad, setAd] = useState(''); const [email, setEmail] = useState('');
  const [mevcut, setMevcut] = useState(''); const [yeni, setYeni] = useState(''); const [tekrar, setTekrar] = useState(''); const [sifirlaEposta, setSifirlaEposta] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false); const [mesaj, setMesaj] = useState(''); const [hata, setHata] = useState('');
  useEffect(() => { if (!acik || !kullanici) return; setAd(kullanici.ad); setEmail(kullanici.email); setMevcut(''); setYeni(''); setTekrar(''); setMesaj(''); setHata(''); setSekme('bilgi'); }, [acik, kullanici]);
  useEffect(() => { if (!acik) return; const kapat = (e: KeyboardEvent) => { if (e.key === 'Escape') onKapat(); }; document.addEventListener('keydown', kapat); return () => document.removeEventListener('keydown', kapat); }, [acik, onKapat]);
  if (!acik || !kullanici) return null;
  const kaydet = async () => { setHata(''); setMesaj(''); if (sekme === 'sifre' && (yeni.length < 6 || yeni !== tekrar)) { setHata(yeni !== tekrar ? 'Yeni şifreler eşleşmiyor.' : 'Yeni şifre en az 6 karakter olmalı.'); return; } setYukleniyor(true); try { await profilKaydet(sekme === 'bilgi' ? { ad, email } : { ad: kullanici.ad, email: kullanici.email, mevcutSifre: mevcut, yeniSifre: yeni }); setMesaj(sekme === 'bilgi' ? 'Bilgileriniz kaydedildi.' : 'Şifreniz değiştirildi.'); setMevcut(''); setYeni(''); setTekrar(''); } catch (err) { setHata(err instanceof Error ? err.message : 'İşlem başarısız.'); } finally { setYukleniyor(false); } };
  const kodGonder = () => { setMesaj(`${sifirlaEposta || kullanici.email} adresine sıfırlama kodu gönderme talebiniz alındı.`); setHata(''); };
  return <div className="ap-profil-modal-arka" role="dialog" aria-modal="true" aria-labelledby="profil-modal-baslik" onMouseDown={(e) => { if (e.target === e.currentTarget) onKapat(); }}>
    <div className="erp-donen-cerceve erp-donen-cerceve-surekli"><span className="erp-donen-cerceve-iz" /><div className="erp-donen-cerceve-icerik"><div className="ap-profil-modal">
      <header className="ap-profil-modal-baslik"><div className="flex items-center gap-4"><IconUser size={20} className="text-[var(--ap-accent)]" /><h2 id="profil-modal-baslik">Profilim</h2></div><button type="button" onClick={onKapat} className="ap-profil-modal-kapat"><IconX size={15} /> ESC</button></header>
      <div className="ap-profil-modal-sekmeler"><button type="button" onClick={() => setSekme('bilgi')} className={sekme === 'bilgi' ? 'aktif' : ''}><IconUser size={15} /> Bilgilerim</button><button type="button" onClick={() => setSekme('sifre')} className={sekme === 'sifre' ? 'aktif' : ''}><IconKey size={15} /> Şifre</button></div>
      <main className="ap-profil-modal-icerik">
        {hata && <p className="ap-profil-modal-hata">{hata}</p>}{mesaj && <p className="ap-profil-modal-basari">{mesaj}</p>}
        {sekme === 'bilgi' ? <div className="space-y-4"><ProfilAlan etiket="Ad Soyad *" value={ad} onChange={setAd} autoComplete="name" /><ProfilAlan etiket="E-posta (isteğe bağlı)" type="email" value={email} onChange={setEmail} autoComplete="email" /></div> : <div className="space-y-4"><p className="ap-heading text-sm font-semibold">Mevcut Şifre ile Değiştir</p><ProfilAlan etiket="Mevcut Şifre" type="password" value={mevcut} onChange={setMevcut} autoComplete="current-password" sifre /><ProfilAlan etiket="Yeni Şifre" type="password" value={yeni} onChange={setYeni} autoComplete="new-password" sifre /><ProfilAlan etiket="Yeni Şifre (Tekrar)" type="password" value={tekrar} onChange={setTekrar} autoComplete="new-password" sifre /><div className="border-t border-[var(--ap-border)] pt-4"><p className="ap-heading text-sm font-semibold">E-posta ile Sıfırla</p><div className="mt-3"><ProfilAlan etiket="E-posta" type="email" value={sifirlaEposta} onChange={setSifirlaEposta} autoComplete="email" /></div><button type="button" className="ap-profil-kod-gonder" onClick={kodGonder}>Kod Gönder</button></div></div>}
      </main>
      <footer className="ap-profil-modal-alt"><button type="button" onClick={() => { cikisYap(); onKapat(); }} className="ap-profil-modal-cikis">Çıkış Yap</button><button type="button" onClick={() => void kaydet()} disabled={yukleniyor} className="ap-profil-modal-kaydet">{yukleniyor ? 'Kaydediliyor...' : sekme === 'bilgi' ? 'Kaydet' : 'Şifreyi Değiştir'}<small>ENTER</small></button></footer>
    </div></div></div>
  </div>;
}

function ProfilAlan({ etiket, value, onChange, type = 'text', disabled = false, autoComplete, sifre = false }: { etiket: string; value: string; onChange?: (value: string) => void; type?: string; disabled?: boolean; autoComplete?: string; sifre?: boolean }) { const [gorunur, setGorunur] = useState(false); return <label className="ap-profil-alan"><span>{etiket}</span><span className="ap-profil-sifre-wrap"><input type={sifre && gorunur ? 'text' : type} value={value} disabled={disabled} autoComplete={autoComplete} onChange={(e) => onChange?.(e.target.value)} />{sifre && <button type="button" className="ap-profil-sifre-goz" aria-label="Şifreyi göster" onClick={() => setGorunur((onceki) => !onceki)}>{gorunur ? <IconEyeOff size={17} /> : <IconEye size={17} />}</button>}</span></label>; }
