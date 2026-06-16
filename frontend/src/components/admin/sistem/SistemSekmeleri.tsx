import { useCallback, useRef, useState } from 'react';
import { FormAlani, formInputSinifi, formSelectSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { DurumAnahtari } from './SistemSekmeCubugu';
import type { SistemAyarlariForm } from '@/types/sistemAyarlari';
import { PANEL_DILLERI } from '@/types/sistemAyarlari';
import { panelJsonIceAktar, PANEL_VARSAYILAN_DILLER } from '@/i18n/panelSozluk';

interface PanelDilEditorProps {
  form: SistemAyarlariForm;
  onChange: (form: SistemAyarlariForm) => void;
}

export function PanelDilSekme({ form, onChange }: PanelDilEditorProps) {
  const [modalAcik, setModalAcik] = useState(false);
  const [jsonMetin, setJsonMetin] = useState('');
  const [jsonHata, setJsonHata] = useState('');
  const dosyaRef = useRef<HTMLInputElement>(null);

  const seciliDilAd = PANEL_DILLERI.find((d) => d.kod === form.panelDili)?.ad ?? form.panelDili;

  const modalAc = useCallback(() => {
    const ozel = form.panelCeviriler[form.panelDili] ?? {};
    const varsayilan = PANEL_VARSAYILAN_DILLER[form.panelDili] ?? {};
    const birlesik: Record<string, string> = { ...varsayilan, ...ozel };
    const sirali = Object.keys(birlesik)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = birlesik[k];
        return acc;
      }, {});
    setJsonMetin(JSON.stringify(sirali, null, 2));
    setJsonHata('');
    setModalAcik(true);
  }, [form.panelDili, form.panelCeviriler]);

  const jsonKaydet = () => {
    try {
      const veri = panelJsonIceAktar(jsonMetin);
      onChange({
        ...form,
        panelCeviriler: {
          ...form.panelCeviriler,
          [form.panelDili]: veri,
        },
      });
      setModalAcik(false);
    } catch (err) {
      setJsonHata(err instanceof Error ? err.message : 'JSON geçersiz');
    }
  };

  const jsonIndir = () => {
    const blob = new Blob([jsonMetin], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panel-ceviri-${form.panelDili}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const okuyucu = new FileReader();
    okuyucu.onload = () => {
      setJsonMetin(String(okuyucu.result ?? ''));
      setJsonHata('');
    };
    okuyucu.readAsText(dosya);
    e.target.value = '';
  };

  const ingilizceSablonYukle = () => {
    const en = PANEL_VARSAYILAN_DILLER.en ?? {};
    setJsonMetin(JSON.stringify(en, null, 2));
    setJsonHata('');
  };

  return (
    <>
      <div className="space-y-6">
        <AdminPanelKarti baslik="Panel Dili" altBaslik="Admin arayüzünün görüntüleme dili">
          <div className="ap-sistem-dil-satir">
            <FormAlani etiket="Aktif Dil" aciklama="Panel menüleri ve butonlar bu dilde gösterilir">
              <div className="flex gap-2">
                <select
                  className={`${formSelectSinifi} flex-1`}
                  value={form.panelDili}
                  onChange={(e) => onChange({ ...form, panelDili: e.target.value })}
                >
                  {PANEL_DILLERI.map((d) => (
                    <option key={d.kod} value={d.kod}>
                      {d.ad} ({d.kod})
                    </option>
                  ))}
                </select>
                <button type="button" onClick={modalAc} className="ap-sistem-cark-btn" title="Çeviri ayarları">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </button>
              </div>
            </FormAlani>
          </div>

          <div className="ap-sistem-dil-bilgi">
            <p className="text-sm font-medium text-[var(--ap-heading)]">
              Seçili dil: <span className="text-[var(--ap-accent)]">{seciliDilAd}</span>
            </p>
            <p className="ap-muted mt-1 text-xs leading-relaxed">
              Çark simgesine tıklayarak tüm panel metinlerini JSON olarak görüntüleyebilir, düzenleyebilir veya
              İngilizce/özel dil çevirisi yükleyebilirsiniz. Her anahtar bir arayüz metnini temsil eder.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="ap-sistem-etiket">
                {Object.keys(form.panelCeviriler[form.panelDili] ?? {}).length} özel çeviri
              </span>
              <span className="ap-sistem-etiket ap-sistem-etiket-vurgu">
                {Object.keys(PANEL_VARSAYILAN_DILLER[form.panelDili] ?? PANEL_VARSAYILAN_DILLER.tr ?? {}).length}+ anahtar
              </span>
            </div>
          </div>
        </AdminPanelKarti>

        <AdminPanelKarti baslik="Hızlı İpuçları" altBaslik="Çeviri iş akışı">
          <ul className="ap-sistem-ipucu-liste">
            <li>JSON dosyasını indirip çeviri aracında düzenleyin, sonra tekrar yükleyin.</li>
            <li>Anahtarları değiştirmeyin — sadece değerleri çevirin (ör. <code>modul.dashboard</code>).</li>
            <li>İngilizce için &quot;İngilizce şablon yükle&quot; butonunu kullanabilirsiniz.</li>
            <li>Özel dil kodu seçip tamamen kendi çevirinizi oluşturabilirsiniz.</li>
          </ul>
        </AdminPanelKarti>
      </div>

      {modalAcik && (
        <div className="ap-sistem-modal-arka">
          <div className="ap-sistem-modal">
            <div className="ap-sistem-modal-baslik">
              <div>
                <h3 className="ap-heading text-base font-bold">Çeviri Ayarları — {seciliDilAd}</h3>
                <p className="ap-muted text-xs">Tüm panel metinleri JSON formatında</p>
              </div>
              <button type="button" onClick={() => setModalAcik(false)} className="ap-sistem-modal-kapat">
                ✕
              </button>
            </div>

            <div className="ap-sistem-modal-aksiyonlar">
              <button type="button" onClick={jsonIndir} className="ap-sistem-modal-btn">
                📥 JSON İndir
              </button>
              <button type="button" onClick={() => dosyaRef.current?.click()} className="ap-sistem-modal-btn">
                📤 JSON Yükle
              </button>
              <button type="button" onClick={ingilizceSablonYukle} className="ap-sistem-modal-btn">
                🇬🇧 İngilizce Şablon
              </button>
              <button
                type="button"
                onClick={() => {
                  const { [form.panelDili]: _, ...kalan } = form.panelCeviriler;
                  onChange({ ...form, panelCeviriler: kalan });
                  const varsayilan = PANEL_VARSAYILAN_DILLER[form.panelDili] ?? PANEL_VARSAYILAN_DILLER.tr ?? {};
                  setJsonMetin(JSON.stringify(varsayilan, null, 2));
                  setJsonHata('');
                }}
                className="ap-sistem-modal-btn ap-sistem-modal-btn-tehlike"
              >
                ↺ Sıfırla
              </button>
              <input ref={dosyaRef} type="file" accept=".json,application/json" className="hidden" onChange={jsonYukle} />
            </div>

            <textarea
              className="ap-sistem-json-editor"
              value={jsonMetin}
              onChange={(e) => {
                setJsonMetin(e.target.value);
                setJsonHata('');
              }}
              spellCheck={false}
            />

            {jsonHata && <p className="mt-2 text-xs text-red-400">{jsonHata}</p>}

            <div className="ap-sistem-modal-alt">
              <button type="button" onClick={() => setModalAcik(false)} className="ap-sistem-modal-btn">
                İptal
              </button>
              <button type="button" onClick={jsonKaydet} className="ap-sistem-modal-btn ap-sistem-modal-btn-birincil">
                Çevirileri Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SistemGenelSekme({
  form,
  onChange,
}: {
  form: SistemAyarlariForm;
  onChange: (f: SistemAyarlariForm) => void;
}) {
  return (
    <div className="space-y-4">
      <DurumAnahtari
        etiket="Site Aktif"
        aciklama="Kapalıyken ziyaretçiler siteye erişemez. Admin paneli etkilenmez."
        acik={form.siteAktif}
        onChange={(v) => onChange({ ...form, siteAktif: v })}
        ikon="🌐"
      />
      <FormAlani etiket="Özel Domain" aciklama="Canlı yayında kullanılacak alan adı">
        <input
          className={formInputSinifi}
          placeholder="www.ornek.com"
          value={form.domain}
          onChange={(e) => onChange({ ...form, domain: e.target.value })}
        />
      </FormAlani>
      <FormAlani etiket="Log Saklama Süresi" aciklama="Etkinlik logları kaç gün tutulsun (7–365)">
        <input
          type="number"
          min={7}
          max={365}
          className={formInputSinifi}
          value={form.logSaklamaGun}
          onChange={(e) => onChange({ ...form, logSaklamaGun: Number(e.target.value) || 90 })}
        />
      </FormAlani>
    </div>
  );
}

export function SistemBakimSekme({
  form,
  onChange,
}: {
  form: SistemAyarlariForm;
  onChange: (f: SistemAyarlariForm) => void;
}) {
  return (
    <div className="space-y-5">
      <DurumAnahtari
        etiket="Bakım Modu"
        aciklama="Açıkken ziyaretçilere özel bakım ekranı gösterilir"
        acik={form.bakimModu}
        onChange={(v) => onChange({ ...form, bakimModu: v })}
        renk="turuncu"
        ikon="🔧"
      />

      {form.bakimModu && (
        <div className="ap-sistem-bakim-detay">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <FormAlani etiket="Bakım Başlığı">
                <input
                  className={formInputSinifi}
                  value={form.bakimBaslik}
                  onChange={(e) => onChange({ ...form, bakimBaslik: e.target.value })}
                />
              </FormAlani>
              <FormAlani etiket="Bakım Mesajı">
                <textarea
                  className={formInputSinifi}
                  rows={4}
                  value={form.bakimMesaji}
                  onChange={(e) => onChange({ ...form, bakimMesaji: e.target.value })}
                />
              </FormAlani>
              <FormAlani etiket="Tahmini Süre" aciklama="Örn. 2 saat, yarın 10:00">
                <input
                  className={formInputSinifi}
                  placeholder="Yaklaşık 1 saat"
                  value={form.bakimTahminiSure}
                  onChange={(e) => onChange({ ...form, bakimTahminiSure: e.target.value })}
                />
              </FormAlani>
            </div>
            <div>
              <GorselAlan
                etiket="Bakım Görseli"
                aciklama="Logo veya illüstrasyon — bakım ekranında gösterilir"
                deger={form.bakimGorselUrl}
                onChange={(url) => onChange({ ...form, bakimGorselUrl: url })}
                onizlemeSinifi="h-32 w-full max-w-xs rounded-xl object-contain bg-[var(--ap-input-bg)] border border-[var(--ap-border)] p-4"
              />
              <div className="ap-sistem-bakim-onizleme mt-4">
                <p className="ap-muted mb-2 text-[10px] uppercase tracking-wide">Önizleme</p>
                <div className="ap-sistem-bakim-onizleme-kart">
                  {form.bakimGorselUrl && (
                    <img src={form.bakimGorselUrl} alt="" className="mx-auto mb-3 h-16 object-contain" />
                  )}
                  <h4 className="text-center text-sm font-bold text-slate-800">{form.bakimBaslik}</h4>
                  <p className="mt-1 text-center text-xs text-slate-500">{form.bakimMesaji}</p>
                  {form.bakimTahminiSure && (
                    <p className="mt-2 text-center text-[10px] text-orange-600">⏱ {form.bakimTahminiSure}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
