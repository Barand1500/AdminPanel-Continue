import type { WidgetFormDegeri } from '@/types/admin';

export interface WidgetPanelProps {
  form: WidgetFormDegeri;
  onChange: (form: WidgetFormDegeri) => void;
}

export interface WidgetGorunumPanelProps extends WidgetPanelProps {}
