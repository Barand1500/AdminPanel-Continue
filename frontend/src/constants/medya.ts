/** Backend ile ayni: admin medya yukleme ust siniri */
export const MEDYA_MAX_DOSYA_BOYUTU = 15 * 1024 * 1024;

export const MEDYA_MAX_DOSYA_MB = 15;

export function medyaBoyutMesaji(): string {
  return `Dosya boyutu en fazla ${MEDYA_MAX_DOSYA_MB} MB olabilir.`;
}
