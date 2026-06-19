export type KesifOkYonu = 'ust' | 'alt' | 'sol' | 'sag';

export interface SistemKesifAdim {
  id: string;
  /** data-ap-kesif değeri; boş = ekran ortası */
  hedef?: string;
  baslik: string;
  aciklama: string;
  okYonu?: KesifOkYonu;
  modulId?: string;
  menuAc?: boolean;
  menuKapat?: boolean;
  padding?: number;
}

export interface SistemKesifTur {
  id: string;
  baslik: string;
  aciklama: string;
  ikon: string;
  adimlar: SistemKesifAdim[];
}
