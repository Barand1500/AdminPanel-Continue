import type { FormAlani, FormFormDegeri } from '@/features/admin/formApi';
import {
  ALAN_TIPLERI,
  KOSUL_OPERATORLERI,
  yeniAlanId,
  type FormKosul,
} from '@/types/formYonetimi';
import { FormAlani as FormAlaniBilesen, formInputSinifi } from '@/components/form/FormAlani';

interface FormAlanlarSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
}

const SABLONLAR: { ad: string; alanlar: Omit<FormAlani, 'id'>[] }[] = [
  {
    ad: 'İletişim',
    alanlar: [
      { tip: 'text', etiket: 'Ad Soyad', zorunlu: true, placeholder: 'Adınız Soyadınız', genislik: 'yarim' },
      { tip: 'email', etiket: 'E-posta', zorunlu: true, placeholder: 'ornek@email.com', genislik: 'yarim' },
      { tip: 'tel', etiket: 'Telefon', zorunlu: false, placeholder: '05xx xxx xx xx', genislik: 'yarim' },
      { tip: 'textarea', etiket: 'Mesajınız', zorunlu: true, placeholder: 'Mesajınızı yazın...', genislik: 'tam' },
    ],
  },
  {
    ad: 'Teklif Talebi',
    alanlar: [
      { tip: 'text', etiket: 'Firma Adı', zorunlu: true, genislik: 'tam' },
      { tip: 'email', etiket: 'E-posta', zorunlu: true, genislik: 'yarim' },
      { tip: 'select', etiket: 'Hizmet Türü', zorunlu: true, secenekler: ['Web Sitesi', 'E-Ticaret', 'SEO', 'Diğer'], genislik: 'yarim' },
      { tip: 'textarea', etiket: 'Proje Detayı', zorunlu: false, genislik: 'tam' },
    ],
  },
];

export function FormAlanlarSekme({ form, onChange }: FormAlanlarSekmeProps) {
  function alanEkle(sablon?: (typeof SABLONLAR)[0]) {
    if (sablon) {
      onChange({
        ...form,
        alanlarJson: [
          ...form.alanlarJson,
          ...sablon.alanlar.map((a) => ({ ...a, id: yeniAlanId() })),
        ],
      });
      return;
    }
    onChange({
      ...form,
      alanlarJson: [
        ...form.alanlarJson,
        { id: yeniAlanId(), tip: 'text', etiket: 'Yeni Alan', zorunlu: false, placeholder: '', genislik: 'tam' },
      ],
    });
  }

  function alanGuncelle(index: number, alan: FormAlani) {
    const liste = [...form.alanlarJson];
    liste[index] = alan;
    onChange({ ...form, alanlarJson: liste });
  }

  function alanSil(index: number) {
    onChange({ ...form, alanlarJson: form.alanlarJson.filter((_, i) => i !== index) });
  }

  function alanTasi(index: number, yon: -1 | 1) {
    const hedef = index + yon;
    if (hedef < 0 || hedef >= form.alanlarJson.length) return;
    const liste = [...form.alanlarJson];
    [liste[index], liste[hedef]] = [liste[hedef], liste[index]];
    onChange({ ...form, alanlarJson: liste });
  }

  function kosulEkle(alanIndex: number) {
    const alan = form.alanlarJson[alanIndex];
    const digerAlanlar = form.alanlarJson.filter((_, i) => i !== alanIndex);
    const yeniKosul: FormKosul = {
      alanId: digerAlanlar[0]?.id ?? '',
      operator: 'esit',
      deger: '',
    };
    alanGuncelle(alanIndex, {
      ...alan,
      kosullar: [...(alan.kosullar ?? []), yeniKosul],
      kosulMantigi: alan.kosulMantigi ?? 've',
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="ap-muted text-sm">{form.alanlarJson.length} alan tanımlı</p>
        <div className="flex flex-wrap gap-2">
          {SABLONLAR.map((s) => (
            <button key={s.ad} type="button" onClick={() => alanEkle(s)} className="ap-form-sablon-btn">
              + {s.ad}
            </button>
          ))}
          <button type="button" onClick={() => alanEkle()} className="ap-link-btn text-sm">
            + Boş Alan
          </button>
        </div>
      </div>

      {form.alanlarJson.length === 0 ? (
        <div className="ap-form-bos-durum">
          <p className="text-3xl">📋</p>
          <p className="ap-heading mt-2 font-semibold">Henüz alan yok</p>
          <p className="ap-muted mt-1 text-sm">Şablon seçin veya boş alan ekleyin</p>
        </div>
      ) : (
        <div className="space-y-3">
          {form.alanlarJson.map((alan, index) => (
            <div key={alan.id} className="ap-form-alan-kart">
              <div className="ap-form-alan-kart-ust">
                <span className="ap-form-alan-sira">{index + 1}</span>
                <select
                  className={`${formInputSinifi} max-w-[140px]`}
                  value={alan.tip}
                  onChange={(e) =>
                    alanGuncelle(index, { ...alan, tip: e.target.value as FormAlani['tip'] })
                  }
                >
                  {ALAN_TIPLERI.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  className={`${formInputSinifi} flex-1`}
                  placeholder="Alan etiketi"
                  value={alan.etiket}
                  onChange={(e) => alanGuncelle(index, { ...alan, etiket: e.target.value })}
                />
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => alanTasi(index, -1)} disabled={index === 0} className="ap-form-ikon-btn" title="Yukarı">↑</button>
                  <button type="button" onClick={() => alanTasi(index, 1)} disabled={index === form.alanlarJson.length - 1} className="ap-form-ikon-btn" title="Aşağı">↓</button>
                  <button type="button" onClick={() => alanSil(index)} className="ap-form-ikon-btn ap-form-ikon-btn-tehlike" title="Sil">×</button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  className={formInputSinifi}
                  placeholder="Placeholder"
                  value={alan.placeholder ?? ''}
                  onChange={(e) => alanGuncelle(index, { ...alan, placeholder: e.target.value })}
                />
                <input
                  className={formInputSinifi}
                  placeholder="Yardım metni (opsiyonel)"
                  value={alan.yardimMetni ?? ''}
                  onChange={(e) => alanGuncelle(index, { ...alan, yardimMetni: e.target.value })}
                />
              </div>

              {(alan.tip === 'select' || alan.tip === 'radio') && (
                <FormAlaniBilesen etiket="Seçenekler" aciklama="Her satıra bir seçenek">
                  <textarea
                    className={formInputSinifi}
                    rows={3}
                    value={(alan.secenekler ?? []).join('\n')}
                    onChange={(e) =>
                      alanGuncelle(index, {
                        ...alan,
                        secenekler: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Seçenek 1&#10;Seçenek 2"
                  />
                </FormAlaniBilesen>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={alan.zorunlu}
                    onChange={(e) => alanGuncelle(index, { ...alan, zorunlu: e.target.checked })}
                  />
                  Zorunlu
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <span className="ap-muted text-xs">Genişlik</span>
                  <select
                    className="rounded border border-[var(--ap-border)] bg-[var(--ap-input-bg)] px-2 py-1 text-xs"
                    value={alan.genislik ?? 'tam'}
                    onChange={(e) =>
                      alanGuncelle(index, { ...alan, genislik: e.target.value as 'tam' | 'yarim' })
                    }
                  >
                    <option value="tam">Tam</option>
                    <option value="yarim">Yarım</option>
                  </select>
                </label>
              </div>

              <details className="ap-form-kosul-detay mt-3">
                <summary className="cursor-pointer text-sm font-medium text-[var(--ap-accent)]">
                  Koşullu görünürlük {(alan.kosullar?.length ?? 0) > 0 && `(${alan.kosullar!.length})`}
                </summary>
                <div className="mt-3 space-y-2 rounded-lg border border-dashed border-[var(--ap-border)] p-3">
                  <p className="ap-muted text-xs">Bu alan yalnızca aşağıdaki koşullar sağlandığında görünür.</p>
                  {(alan.kosullar ?? []).map((k, ki) => (
                    <div key={ki} className="flex flex-wrap items-center gap-2">
                      <select
                        className={formInputSinifi}
                        value={k.alanId}
                        onChange={(e) => {
                          const kosullar = [...(alan.kosullar ?? [])];
                          kosullar[ki] = { ...k, alanId: e.target.value };
                          alanGuncelle(index, { ...alan, kosullar });
                        }}
                      >
                        <option value="">Alan seçin</option>
                        {form.alanlarJson
                          .filter((a) => a.id !== alan.id)
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.etiket}
                            </option>
                          ))}
                      </select>
                      <select
                        className={formInputSinifi}
                        value={k.operator}
                        onChange={(e) => {
                          const kosullar = [...(alan.kosullar ?? [])];
                          kosullar[ki] = { ...k, operator: e.target.value as FormKosul['operator'] };
                          alanGuncelle(index, { ...alan, kosullar });
                        }}
                      >
                        {KOSUL_OPERATORLERI.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {!['dolu', 'bos'].includes(k.operator) && (
                        <input
                          className={formInputSinifi}
                          placeholder="Değer"
                          value={k.deger ?? ''}
                          onChange={(e) => {
                            const kosullar = [...(alan.kosullar ?? [])];
                            kosullar[ki] = { ...k, deger: e.target.value };
                            alanGuncelle(index, { ...alan, kosullar });
                          }}
                        />
                      )}
                      <button
                        type="button"
                        className="text-xs text-red-400"
                        onClick={() => {
                          alanGuncelle(index, {
                            ...alan,
                            kosullar: (alan.kosullar ?? []).filter((_, i) => i !== ki),
                          });
                        }}
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => kosulEkle(index)} className="ap-link-btn text-xs">
                    + Koşul ekle
                  </button>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
