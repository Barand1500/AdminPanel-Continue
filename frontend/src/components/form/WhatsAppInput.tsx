import { FormAlani } from './FormAlani';
import { UlkeKodluNumaraInput } from './UlkeKodluNumaraInput';

interface WhatsAppInputProps {
  deger: string;
  onChange: (deger: string) => void;
  aciklama?: string;
  placeholder?: string;
}

export function WhatsAppInput({
  deger,
  onChange,
  aciklama,
  placeholder = 'XXX XXX XX XX',
}: WhatsAppInputProps) {
  return (
    <FormAlani etiket="WhatsApp" aciklama={aciklama}>
      <UlkeKodluNumaraInput deger={deger} onChange={onChange} placeholder={placeholder} otomatikDoldur="tel-national" />
    </FormAlani>
  );
}
