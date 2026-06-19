import { useState } from 'react';
import type { PublicFormKayit } from '@/utils/formYardimci';
import { yuzucuFormlar } from '@/utils/formYardimci';
import { ayarlariBirlestir } from '@/types/formYonetimi';
import { DinamikForm } from './DinamikForm';

interface SiteYuzucuFormlarProps {
  formlar: PublicFormKayit[];
}

export function SiteYuzucuFormlar({ formlar }: SiteYuzucuFormlarProps) {
  const yuzuculer = yuzucuFormlar(formlar);
  const [acikSlug, setAcikSlug] = useState<string | null>(null);

  if (yuzuculer.length === 0) return null;

  const acikForm = yuzuculer.find((f) => f.slug === acikSlug) ?? null;

  return (
    <>
      <div className="site-yuzucu-form-bar">
        {yuzuculer.map((form) => {
          const ayar = ayarlariBirlestir(form.ayarlarJson);
          return (
            <button
              key={form.id}
              type="button"
              className="site-yuzucu-form-btn"
              title={form.ad}
              aria-label={form.ad}
              onClick={() => setAcikSlug(form.slug)}
            >
              <span aria-hidden>📝</span>
              {ayar.bildirimGoster && <span className="site-yuzucu-form-badge" />}
            </button>
          );
        })}
      </div>

      {acikForm && (
        <div className="site-yuzucu-form-modal" role="dialog" aria-modal="true" aria-labelledby="yuzucu-form-baslik">
          <div className="site-yuzucu-form-modal-arka" onClick={() => setAcikSlug(null)} aria-hidden />
          <div className="site-yuzucu-form-modal-icerik">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="yuzucu-form-baslik" className="text-base font-semibold text-slate-800">
                {acikForm.ad}
              </h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setAcikSlug(null)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <DinamikForm
              slug={acikForm.slug}
              ad={acikForm.ad}
              aciklama={acikForm.aciklama ?? undefined}
              alanlar={acikForm.alanlarJson}
              ayarlar={acikForm.ayarlarJson}
            />
          </div>
        </div>
      )}
    </>
  );
}
