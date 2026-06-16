import type { FormFormDegeri } from '@/features/admin/formApi';
import { EmailInput } from '@/components/form/EmailInput';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { RenkSecici } from '@/components/form/RenkSecici';

interface FormBildirimSekmeProps {
  form: FormFormDegeri;
  onChange: (form: FormFormDegeri) => void;
}

export function FormBildirimSekme({ form, onChange }: FormBildirimSekmeProps) {
  const ayar = form.ayarlarJson;

  function ayarGuncelle(parcalar: Partial<typeof ayar>) {
    onChange({ ...form, ayarlarJson: { ...ayar, ...parcalar } });
  }

  return (
    <div className="space-y-5">
      <div className="ap-form-bolum">
        <div className="ap-form-bolum-baslik">
          <p className="ap-heading text-sm font-semibold">Admin Bildirimi</p>
          <p className="ap-muted text-xs">Form gönderildiğinde size e-posta gider</p>
        </div>
        <div className="ap-form-bolum-icerik">
          <EmailInput
            etiket="Bildirim E-postası"
            aciklama="Boş bırakılırsa bildirim gönderilmez"
            deger={form.bildirimEmail}
            onChange={(v) => onChange({ ...form, bildirimEmail: v })}
          />
        </div>
      </div>

      <div className="ap-form-bolum">
        <div className="ap-form-bolum-baslik">
          <p className="ap-heading text-sm font-semibold">Kullanıcıya Otomatik Yanıt</p>
        </div>
        <div className="ap-form-bolum-icerik space-y-3">
          <label className="ap-form-toggle-satir">
            <div>
              <p className="font-medium text-sm">Otomatik yanıt e-postası gönder</p>
              <p className="ap-muted text-xs">Gönderenin e-postasına teşekkür mesajı</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--ap-accent)]"
              checked={ayar.kullaniciyaOtomatikYanit}
              onChange={(e) => ayarGuncelle({ kullaniciyaOtomatikYanit: e.target.checked })}
            />
          </label>
          {ayar.kullaniciyaOtomatikYanit && (
            <>
              <FormAlani etiket="E-posta Konusu">
                <input
                  className={formInputSinifi}
                  value={ayar.otomatikYanitKonu}
                  onChange={(e) => ayarGuncelle({ otomatikYanitKonu: e.target.value })}
                />
              </FormAlani>
              <FormAlani etiket="E-posta İçeriği">
                <textarea
                  className={formInputSinifi}
                  rows={4}
                  value={ayar.otomatikYanitMetin}
                  onChange={(e) => ayarGuncelle({ otomatikYanitMetin: e.target.value })}
                />
              </FormAlani>
            </>
          )}
        </div>
      </div>

      <div className="ap-form-bolum">
        <div className="ap-form-bolum-baslik">
          <p className="ap-heading text-sm font-semibold">Görsel Stil (opsiyonel)</p>
        </div>
        <div className="ap-form-bolum-icerik grid gap-4 sm:grid-cols-2">
          <RenkSecici
            etiket="Arka Plan Rengi"
            deger={ayar.arkaPlanRenk}
            onChange={(v) => ayarGuncelle({ arkaPlanRenk: v })}
            varsayilan="#ffffff"
          />
          <RenkSecici
            etiket="Buton Rengi"
            deger={ayar.butonRenk}
            onChange={(v) => ayarGuncelle({ butonRenk: v })}
            varsayilan="#7c3aed"
          />
        </div>
      </div>
    </div>
  );
}
