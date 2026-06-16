import type { FormEditorSekmeId } from '@/types/formYonetimi';
import { FORM_EDITOR_SEKMELER } from '@/types/formYonetimi';

interface FormSekmeCubuguProps {
  aktif: FormEditorSekmeId;
  onDegistir: (id: FormEditorSekmeId) => void;
}

export function FormSekmeCubugu({ aktif, onDegistir }: FormSekmeCubuguProps) {
  return (
    <div className="ap-form-sekmeler">
      {FORM_EDITOR_SEKMELER.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onDegistir(s.id)}
          className={`ap-form-sekme ${aktif === s.id ? 'ap-form-sekme-aktif' : ''}`}
        >
          <span className="ap-form-sekme-ikon" aria-hidden>
            {s.ikon}
          </span>
          {s.ad}
        </button>
      ))}
    </div>
  );
}
