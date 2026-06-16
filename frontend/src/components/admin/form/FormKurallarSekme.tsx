import type { FormFormDegeri } from '@/features/admin/formApi';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';

interface FormKurallarSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
}

export function FormKurallarSekme({ form, onChange }: FormKurallarSekmeProps) {
  const ayar = form.ayarlarJson;

  function ayarGuncelle(parcalar: Partial<typeof ayar>) {
    onChange({ ...form, ayarlarJson: { ...ayar, ...parcalar } });
  }

  return (
    <div className="space-y-5">
      <div className="ap-form-bolum">
        <div className="ap-form-bolum-baslik">
          <p className="ap-heading text-sm font-semibold">Zorunlu Alan Kuralları</p>
          <p className="ap-muted text-xs">Form gönderimi için hangi bilgiler zorunlu olsun?</p>
        </div>
        <div className="ap-form-bolum-icerik space-y-2">
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">E-posta zorunlu</p>
              <p className="ap-muted text-xs">Formda e-posta alanı yoksa otomatik eklenir</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.epostaZorunlu}
              onChange={(e) => ayarGuncelle({ epostaZorunlu: e.target.checked })}
            />
          </label>
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">Telefon zorunlu</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.telefonZorunlu}
              onChange={(e) => ayarGuncelle({ telefonZorunlu: e.target.checked })}
            />
          </label>
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">Ad soyad zorunlu</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.adSoyadZorunlu}
              onChange={(e) => ayarGuncelle({ adSoyadZorunlu: e.target.checked })}
            />
          </label>
        </div>
      </div>

      <div className="ap-form-bolum">
        <div className="ap-form-bolum-baslik">
          <p className="ap-heading text-sm font-semibold">KVKK & Güvenlik</p>
        </div>
        <div className="ap-form-bolum-icerik space-y-3">
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">KVKK onayı zorunlu</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.kvkkOnayZorunlu}
              onChange={(e) => ayarGuncelle({ kvkkOnayZorunlu: e.target.checked })}
            />
          </label>
          {ayar.kvkkOnayZorunlu && (
            <FormAlani etiket="KVKK Metni">
              <textarea
                className={formInputSinifi}
                rows={2}
                value={ayar.kvkkMetni}
                onChange={(e) => ayarGuncelle({ kvkkMetni: e.target.value })}
              />
            </FormAlani>
          )}
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">Captcha (bot koruması)</p>
              <p className="ap-muted text-xs">Yakında aktif olacak</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.captchaAktif}
              onChange={(e) => ayarGuncelle({ captchaAktif: e.target.checked })}
            />
          </label>
        </div>
      </div>

      <FormAlani etiket="Tekrar Gönderim Limiti" aciklama="Aynı kullanıcının spam göndermesini engeller">
        <select
          className={formInputSinifi}
          value={ayar.tekGonderimLimiti}
          onChange={(e) =>
            ayarGuncelle({ tekGonderimLimiti: e.target.value as typeof ayar.tekGonderimLimiti })
          }
        >
          <option value="yok">Limit yok</option>
          <option value="saat">Saatte 1 kez</option>
          <option value="gun">Günde 1 kez</option>
        </select>
      </FormAlani>

      <FormAlani etiket="Başarı Mesajı">
        <textarea
          className={formInputSinifi}
          rows={2}
          value={ayar.basariMesaji}
          onChange={(e) => ayarGuncelle({ basariMesaji: e.target.value })}
        />
      </FormAlani>
      <FormAlani etiket="Yönlendirme URL (opsiyonel)" aciklama="Gönderim sonrası bu adrese yönlendir">
        <input
          className={formInputSinifi}
          placeholder="https://..."
          value={ayar.yonlendirmeUrl}
          onChange={(e) => ayarGuncelle({ yonlendirmeUrl: e.target.value })}
        />
      </FormAlani>
    </div>
  );
}
