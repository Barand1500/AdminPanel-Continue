import { FormEvent, useState } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { publicFormGonder } from '@/features/site/formApi';

function BultenForm({
  cfg,
  widget,
  email,
  setEmail,
  gonder,
  gonderiliyor,
  hata,
  basari,
  yatay = false,
  inputSinif = '',
  butonSinif = '',
}: {
  cfg: WidgetConfig;
  widget: Widget;
  email: string;
  setEmail: (v: string) => void;
  gonder: (e: FormEvent) => void;
  gonderiliyor: boolean;
  hata: string;
  basari: boolean;
  yatay?: boolean;
  inputSinif?: string;
  butonSinif?: string;
}) {
  return (
    <>
      <form
        onSubmit={gonder}
        className={`mt-8 flex flex-col gap-3 ${yatay ? 'sm:flex-row' : ''}`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={cfg.bultenPlaceholder ?? 'E-posta adresiniz'}
          className={`bulten-kayit-input flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${inputSinif}`}
        />
        <button
          type="submit"
          disabled={gonderiliyor}
          className={`rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 ${butonSinif}`}
        >
          {widget.butonMetni || 'Abone Ol'}
        </button>
      </form>
      {cfg.bultenKvkk && <p className="mt-3 text-center text-xs opacity-70">{cfg.bultenKvkk}</p>}
      {hata && <p className="mt-3 text-center text-sm text-red-600">{hata}</p>}
      {basari && (
        <p className="mt-3 text-center text-sm font-medium text-emerald-600">
          Teşekkürler! Bültenimize kaydoldunuz.
        </p>
      )}
    </>
  );
}

function MetinBolumu({
  widget,
  cfg,
  altSinif = 'text-primary',
  baslikSinif = 'text-slate-900',
  aciklamaSinif = 'text-slate-600',
}: {
  widget: Widget;
  cfg: WidgetConfig;
  altSinif?: string;
  baslikSinif?: string;
  aciklamaSinif?: string;
}) {
  return (
    <>
      {widget.altBaslik && (
        <p className={`text-sm font-semibold uppercase tracking-wide ${altSinif}`}>{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold ${baslikSinif}`}>{widget.baslik}</h2>
      )}
      {widget.aciklama && <p className={`mt-3 ${aciklamaSinif}`}>{widget.aciklama}</p>}
    </>
  );
}

export function BultenKayitWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const [email, setEmail] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hata, setHata] = useState('');
  const gt = widgetGorunumTipiAl(widget);

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata('');
    try {
      await publicFormGonder(cfg.formSlug ?? 'bulten', { email });
      setBasari(true);
      setEmail('');
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setGonderiliyor(false);
    }
  }

  const formProps = { cfg, widget, email, setEmail, gonder, gonderiliyor, hata, basari };

  if (gt === 'tam-banner-mavi') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bulten-kayit-banner -mx-[var(--container-pad,1rem)] w-[calc(100%+2*var(--container-pad,1rem))] rounded-none border-y border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-10 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <MetinBolumu
              widget={widget}
              cfg={cfg}
              altSinif="text-white/80"
              baslikSinif="text-white"
              aciklamaSinif="text-white/90"
            />
            <BultenForm {...formProps} yatay />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'kart-golge') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bulten-kayit-kart mx-auto grid max-w-3xl gap-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:grid-cols-2 md:items-center md:p-8">
          <div>
            <MetinBolumu widget={widget} cfg={cfg} />
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <BultenForm {...formProps} />
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'koyu-cam') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bulten-kayit-kart mx-auto max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-white backdrop-blur-md">
          <div className="text-center">
            <MetinBolumu
              widget={widget}
              cfg={cfg}
              altSinif="text-white/70"
              baslikSinif="text-white"
              aciklamaSinif="text-slate-300"
            />
          </div>
          <BultenForm {...formProps} butonSinif="w-full" />
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'turuncu-serit') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bulten-kayit-banner -mx-[var(--container-pad,1rem)] w-[calc(100%+2*var(--container-pad,1rem))] rounded-none border-y border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <MetinBolumu
                widget={widget}
                cfg={cfg}
                altSinif="text-white/80"
                baslikSinif="text-white"
                aciklamaSinif="text-white/90"
              />
            </div>
            <div className="w-full shrink-0 md:max-w-sm">
              <BultenForm {...formProps} yatay />
            </div>
          </div>
        </div>
      </WidgetKabuk>
    );
  }

  if (gt === 'yesil-minimal') {
    return (
      <WidgetKabuk widget={widget}>
        <div className="bulten-kayit-kart mx-auto max-w-lg rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-8">
          <div className="text-center">
            <MetinBolumu
              widget={widget}
              cfg={cfg}
              altSinif="text-emerald-700"
              baslikSinif="text-emerald-950"
              aciklamaSinif="text-emerald-800"
            />
          </div>
          <BultenForm {...formProps} yatay inputSinif="border-emerald-300 bg-white" />
        </div>
      </WidgetKabuk>
    );
  }

  return (
    <WidgetKabuk widget={widget}>
      <div className="bulten-kayit-kart mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <MetinBolumu widget={widget} cfg={cfg} />
        </div>
        <BultenForm {...formProps} yatay />
      </div>
    </WidgetKabuk>
  );
}
