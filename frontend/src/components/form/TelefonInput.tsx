import { FormAlani } from './FormAlani';
import { UlkeKodluNumaraInput } from './UlkeKodluNumaraInput';

interface TelefonInputProps {
  etiket?: string;
  aciklama?: string;
  deger: string;
  onChange: (deger: string) => void;
  placeholder?: string;
}

export function TelefonInput({
  etiket = 'Telefon',
  aciklama,
  deger,
  onChange,
  placeholder = 'XXX XXX XX XX',
}: TelefonInputProps) {
  return (
    <FormAlani etiket={etiket} aciklama={aciklama}>
      <UlkeKodluNumaraInput
        deger={deger}
        onChange={onChange}
        placeholder={placeholder}
        otomatikDoldur="tel-national"
      />
    </FormAlani>
  );
}
