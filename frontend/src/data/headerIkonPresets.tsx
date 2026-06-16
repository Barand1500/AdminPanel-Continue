import type { IkonSecimi } from '@/types/header';

export type HeaderIkonGrubu = 'gunduz' | 'gece' | 'hesap' | 'arama';

export interface HeaderIkonPreset {
  id: string;
  ad: string;
  grup: HeaderIkonGrubu;
}

export const HEADER_IKON_PRESETS: HeaderIkonPreset[] = [
  { id: 'gunduz-gunes', ad: 'Güneş', grup: 'gunduz' },
  { id: 'gunduz-bulut', ad: 'Bulutlu', grup: 'gunduz' },
  { id: 'gunduz-parlak', ad: 'Parlak', grup: 'gunduz' },
  { id: 'gece-ay', ad: 'Ay', grup: 'gece' },
  { id: 'gece-yildiz', ad: 'Yıldızlı', grup: 'gece' },
  { id: 'gece-bulut-ay', ad: 'Bulutlu ay', grup: 'gece' },
  { id: 'hesap-varsayilan', ad: 'Varsayılan', grup: 'hesap' },
  { id: 'hesap-cerceve', ad: 'Çerçeveli', grup: 'hesap' },
  { id: 'hesap-dolu', ad: 'Dolu', grup: 'hesap' },
  { id: 'arama-varsayilan', ad: 'Varsayılan', grup: 'arama' },
  { id: 'arama-buyutec', ad: 'Büyüteç', grup: 'arama' },
  { id: 'arama-minimal', ad: 'Minimal', grup: 'arama' },
];

export function grupPresets(grup: HeaderIkonGrubu) {
  return HEADER_IKON_PRESETS.filter((p) => p.grup === grup);
}

export function ozelIkonMu(ikon: IkonSecimi): boolean {
  return ikon.tip === 'custom' && !!ikon.customUrl;
}

interface SvgProps {
  className?: string;
}

export function HeaderPresetSvg({ presetId, className = 'h-5 w-5' }: { presetId: string; className?: string }) {
  const props: SvgProps = { className };
  const pid = presetId
    .replace(/^tema-gunes$/, 'gunduz-gunes')
    .replace(/^tema-ay$/, 'gece-ay')
    .replace(/^tema-bulut$/, 'gunduz-bulut');

  switch (pid) {
    case 'gunduz-gunes':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'gunduz-bulut':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'gunduz-parlak':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88l1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
    case 'gece-ay':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    case 'gece-yildiz':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M4 4l.5 1.5L6 6l-1.5.5L4 8l-.5-1.5L2 6l1.5-.5L4 4zM19 8l.4 1.2L20.6 10l-1.2.4L19 12l-.4-1.6L17 10l1.6-.4L19 8z" />
        </svg>
      );
    case 'gece-bulut-ay':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 14a3 3 0 013-3h.5" />
        </svg>
      );
    case 'hesap-cerceve':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'hesap-dolu':
      return (
        <svg {...props} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    case 'arama-buyutec':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      );
    case 'arama-minimal':
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M16 16l5 5" />
        </svg>
      );
    case 'arama-varsayilan':
    default:
      if (pid.startsWith('arama')) {
        return (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      }
      if (pid.startsWith('hesap')) {
        return (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      }
      if (pid.startsWith('gunduz')) {
        return (
          <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      }
      return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
  }
}

export function varsayilanPresetId(grup: HeaderIkonGrubu): string {
  if (grup === 'gunduz') return 'gunduz-gunes';
  if (grup === 'gece') return 'gece-ay';
  return `${grup}-varsayilan`;
}