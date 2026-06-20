import { FormEvent, useState } from 'react';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { publicFormGonder } from '@/features/site/formApi';

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

  const kartSinif =
    gt === 'tam-banner-mavi'
      ? 'bulten-kayit-banner w-full rounded-none border-y border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-10 text-white'
      : gt === 'kart-golge'
        ? 'bulten-kayit-kart mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg'
        : gt === 'koyu-cam'
          ? 'bulten-kayit-kart mx-auto max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-white backdrop-blur-md'
          : gt === 'turuncu-serit'
            ? 'bulten-kayit-banner w-full rounded-none border-y border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 text-white'
            : gt === 'yesil-minimal'
              ? 'bulten-kayit-kart mx-auto max-w-lg rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-8'
              : 'bulten-kayit-kart mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm sm:p-10';

  return (
    <WidgetKabuk widget={widget}>
      <div className={kartSinif}>
        <div className={gt === 'tam-banner-mavi' || gt === 'turuncu-serit' ? 'mx-auto max-w-3xl text-center' : 'text-center'}>
          {widget.altBaslik && (
            <p
              className={`text-sm font-semibold uppercase tracking-wide ${
                gt === 'tam-banner-mavi' || gt === 'turuncu-serit' || gt === 'koyu-cam'
                  ? 'text-white/80'
                  : gt === 'yesil-minimal'
                    ? 'text-emerald-700'
                    : 'text-primary'
              }`}
            >
              {widget.altBaslik}
            </p>
          )}
          {widget.baslik && (
            <h2
              className={`${baslikSinifi(cfg)} mt-2 font-bold ${
                gt === 'tam-banner-mavi' || gt === 'turuncu-serit' || gt === 'koyu-cam'
                  ? 'text-white'
                  : gt === 'yesil-minimal'
                    ? 'text-emerald-950'
                    : 'text-slate-900'
              }`}
            >
              {widget.baslik}
            </h2>
          )}
          {widget.aciklama && (
            <p
              className={`mt-3 ${
                gt === 'tam-banner-mavi' || gt === 'turuncu-serit'
                  ? 'text-white/90'
                  : gt === 'koyu-cam'
                    ? 'text-slate-300'
                    : gt === 'yesil-minimal'
                      ? 'text-emerald-800'
                      : 'text-slate-600'
              }`}
            >
              {widget.aciklama}
            </p>
          )}
        </div>
        <form
          onSubmit={gonder}
          className={`mt-8 flex flex-col gap-3 ${
            gt === 'tam-banner-mavi' || gt === 'turuncu-serit' ? 'mx-auto max-w-xl sm:flex-row' : 'sm:flex-row'
          }`}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={cfg.bultenPlaceholder ?? 'E-posta adresiniz'}
            className="bulten-kayit-input flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={gonderiliyor}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {widget.butonMetni || 'Abone Ol'}
          </button>
        </form>
        {cfg.bultenKvkk && <p className="mt-3 text-center text-xs text-slate-500">{cfg.bultenKvkk}</p>}
        {hata && <p className="mt-3 text-center text-sm text-red-600">{hata}</p>}
        {basari && <p className="mt-3 text-center text-sm font-medium text-emerald-600">Teşekkürler! Bültenimize kaydoldunuz.</p>}
      </div>
    </WidgetKabuk>
  );
}
