import type { WidgetConfig } from '@/types/widget';
import type { Widget } from '@/types/site';
import {
  varsayilanWidgetGorunumTipi,
  widgetGorunumSinifi,
  widgetGorunumTipiNormalize,
} from '@/data/widgetGorunumTipleri';

function configOku(widget: Widget): WidgetConfig {
  const raw = widget.configJson;
  if (raw && typeof raw === 'object') return raw as WidgetConfig;
  return {};
}

export function widgetGorunumTipiAl(widget: Widget): string {
  const cfg = configOku(widget);
  return widgetGorunumTipiNormalize(widget.tip, cfg.gorunum?.gorunumTipi);
}

export function widgetGorunumSinifAl(widget: Widget): string {
  return widgetGorunumSinifi(widget.tip, widgetGorunumTipiAl(widget));
}

export function configGorunumTipiNormalize(cfg: WidgetConfig, widgetTip: string): WidgetConfig {
  const gorunumTipi = widgetGorunumTipiNormalize(widgetTip, cfg.gorunum?.gorunumTipi);
  if (cfg.gorunum?.gorunumTipi === gorunumTipi) return cfg;
  return {
    ...cfg,
    gorunum: { ...cfg.gorunum, gorunumTipi },
  };
}

export function gorunumTipiVarsayilan(widgetTip: string): string {
  return varsayilanWidgetGorunumTipi(widgetTip);
}
