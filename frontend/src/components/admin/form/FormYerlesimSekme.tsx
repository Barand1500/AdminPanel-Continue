import { useEffect, useState } from 'react';
import type { FormFormDegeri } from '@/features/admin/formApi';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GORUNUM_TIPLERI, SAYFA_KONUMLARI } from '@/types/formYonetimi';

interface FormYerlesimSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
}

export function FormYerlesimSekme({ form, onChange }: FormYerlesimSekmeProps) {
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const ayar = form.ayarlarJson;
  const yuzucuMod = ayar.gorunumTipi === 'yuzucu';

  useEffect(() => {
    void adminSayfalariGetir().then(setSayfalar).catch(() => setSayfalar([]));
  }, []);

  function ayarGuncelle(parcalar: Partial<typeof ayar>) {
    onChange({ ...form, ayarlarJson: { ...ayar, ...parcalar } });
  }

  function sayfaToggle(slug: string) {
    const mevcut = ayar.sayfaSluglari;
    const yeni = mevcut.includes(slug) ? mevcut.filter((s) => s !== slug) : [...mevcut, slug];
    ayarGuncelle({ sayfaSluglari: yeni, tumSayfalarda: false });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="ap-heading mb-3 text-sm font-semibold">Görünüm Modu</h3>
        <div className="ap-form-gorunum-grid ap-form-gorunum-iki">
          {GORUNUM_TIPLERI.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => ayarGuncelle({ gorunumTipi: g.id })}
              className={`ap-widget-tip-kart ${ayar.gorunumTipi === g.id ? 'ap-widget-tip-kart-secili' : ''}`}
            >
              <span className="ap-widget-tip-ad">{g.ad}</span>
              <span className="ap-widget-tip-aciklama">{g.aciklama}</span>
            </button>
          ))}
        </div>
      </div>

      {yuzucuMod ? (
        <label className={`ap-toggle-kart ${ayar.bildirimGoster ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
          <div>
            <p className="ap-heading text-sm font-semibold">Yüzen ikon bildirimi</p>
            <p className="ap-muted text-xs">Aktif form varsa ikon yanında bildirim balonu gösterilir</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ayar.bildirimGoster}
            onClick={() => ayarGuncelle({ bildirimGoster: !ayar.bildirimGoster })}
            className={`ap-toggle ${ayar.bildirimGoster ? 'ap-toggle-on' : ''}`}
          >
            <span className="ap-toggle-thumb" />
          </button>
        </label>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormAlani etiket="Sayfa Konumu" aciklama="Formun sayfa içindeki bölgesi">
              <select
                className={formInputSinifi}
                value={ayar.sayfaKonumu}
                onChange={(e) => ayarGuncelle({ sayfaKonumu: e.target.value as typeof ayar.sayfaKonumu })}
              >
                {SAYFA_KONUMLARI.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.ad}
                  </option>
                ))}
              </select>
            </FormAlani>
            <FormAlani etiket="Form Genişliği">
              <select
                className={formInputSinifi}
                value={ayar.genislik}
                onChange={(e) => ayarGuncelle({ genislik: e.target.value as typeof ayar.genislik })}
              >
                <option value="dar">Dar</option>
                <option value="orta">Orta</option>
                <option value="tam">Tam genişlik</option>
              </select>
            </FormAlani>
          </div>

          <div className="ap-form-bolum">
            <div className="ap-form-bolum-baslik">
              <p className="ap-heading text-sm font-semibold">Hangi Sayfalarda Görünsün?</p>
            </div>
            <div className="ap-form-bolum-icerik space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ayar.tumSayfalarda}
                  onChange={(e) => ayarGuncelle({ tumSayfalarda: e.target.checked, sayfaSluglari: [] })}
                />
                Tüm sayfalarda göster
              </label>
              {!ayar.tumSayfalarda && (
                <div className="ap-form-sayfa-grid">
                  {sayfalar.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 rounded-lg border border-[var(--ap-border)] px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={ayar.sayfaSluglari.includes(s.slug)}
                        onChange={() => sayfaToggle(s.slug)}
                      />
                      <span className="truncate">{s.baslik}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
