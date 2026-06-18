import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useSiteYonetimiAksiyonlari } from '@/hooks/useSiteYonetimiAksiyonlari';
import { FormAlani, formInputSinifi } from '@/components/form/FormAlani';
import { GorselAlan } from '@/components/form/GorselAlan';
import { LogoBoyutSecici } from '@/components/admin/site/LogoBoyutSecici';
import { logoBoyutuNormalize } from '@/types/logo';
import { IkonSecici } from '@/components/admin/header/IkonSecici';
import { ParaBirimiYonetimi } from '@/components/admin/header/ParaBirimiYonetimi';
import { AramaStilSecici } from '@/components/admin/header/AramaStilSecici';
import { SiteOnizlemePaneli } from './SiteOnizlemePaneli';
import type { HeaderAyarlari } from '@/types/header';
import { HeaderDilYonetimi } from '@/components/admin/header/HeaderDilYonetimi';
import {
  AdminPanelKarti,
  BildirimKutusu,
  HataDurumu,
  ModulBaslik,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';

const SEKMELER = [
  { id: 'ust-bant', ad: 'Üst Bant' },
  { id: 'dil', ad: 'Dil' },
  { id: 'logo-gorunum', ad: 'Logo Görünümü' },
  { id: 'para', ad: 'Para Birimi' },
  { id: 'ikonlar', ad: 'İkonlar' },
  { id: 'kategori-arama', ad: 'Kategori & Arama' },
] as const;

type SekmeId = (typeof SEKMELER)[number]['id'];

function ToggleSatir({
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  etiket: string;
  aciklama?: string;
  acik: boolean;
  onDegistir: (v: boolean) => void;
}) {
  return (
    <label className={`ap-toggle-kart ${acik ? 'ap-toggle-aktif ap-toggle-yesil' : ''}`}>
      <div>
        <p className="ap-heading text-sm font-semibold">{etiket}</p>
        {aciklama && <p className="ap-muted text-xs">{aciklama}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        onClick={() => onDegistir(!acik)}
        className={`ap-toggle ${acik ? 'ap-toggle-on' : ''}`}
      >
        <span className="ap-toggle-thumb" />
      </button>
    </label>
  );
}

export function HeaderYonetimiFormu() {
  const {
    ayarlar,
    headerAyarlari,
    yukleniyor,
    hata,
    kaydediliyor,
    siteAd,
    headerGuncelle,
  } = useSiteAyarlariYonetimi();
  useSiteYonetimiAksiyonlari();
  const [sekme, setSekme] = useState<SekmeId>('ust-bant');

  const headerGuncelleParcali = (parcalar: Partial<HeaderAyarlari>) => {
    headerGuncelle({ ...headerAyarlari, ...parcalar });
  };

  if (yukleniyor) return <YukleniyorDurumu mesaj="Header ayarları yükleniyor..." />;
  if (!ayarlar) return <HataDurumu mesaj={hata ?? 'Ayarlar yüklenemedi'} />;

  const ustBant = headerAyarlari.ustBant!;
  const ikonlar = headerAyarlari.ikonlar!;
  const kategori = headerAyarlari.kategori!;
  const arama = headerAyarlari.arama!;
  const dilDestegi = headerAyarlari.dilDestegi!;

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <ModulBaslik
          baslik="Header Yönetimi"
          aciklama="Üst bant, header logosu, kurlar, ikonlar, kategori menüsü ve arama alanını yönetin."
          onizleGoster
        />

        {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
        {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

        <div className="flex flex-wrap gap-2 border-b border-[var(--ap-border)] pb-2">
          {SEKMELER.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSekme(s.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                sekme === s.id
                  ? 'bg-[var(--ap-accent)] text-white'
                  : 'text-[var(--ap-muted)] hover:bg-[var(--ap-hover)]'
              }`}
            >
              {s.ad}
            </button>
          ))}
        </div>

        {sekme === 'ust-bant' && (
          <AdminPanelKarti baslik="Üst Bant" altBaslik="Header marka metni ve kur görünürlüğü">
            <div className="space-y-4">
              <FormAlani
                etiket="Header Marka Metni"
                aciklama="Navbar'da logo yanında görünen yazı. Boş bırakırsanız marka metni gösterilmez."
              >
                <input
                  type="text"
                  value={headerAyarlari.markaMetni ?? ''}
                  onChange={(e) =>
                    headerGuncelleParcali({ markaMetni: e.target.value || null })
                  }
                  className={formInputSinifi}
                  placeholder="Örn. Güzel Teknoloji"
                />
              </FormAlani>
              <FormAlani etiket="Slogan" aciklama="Üst banttaki kısa metin">
                <input
                  className={formInputSinifi}
                  value={headerAyarlari.slogan ?? ''}
                  onChange={(e) => headerGuncelleParcali({ slogan: e.target.value || null })}
                  placeholder="Teknolojinin en güzel hali..."
                />
              </FormAlani>
              <p className="ap-muted text-xs leading-relaxed">
                Telefon, e-posta ve sosyal medya Site Ayarları&apos;ndaki iletişim bilgilerinden gelir.
              </p>
              <ToggleSatir
                etiket="Telefonu göster"
                acik={ustBant.telefonGoster}
                onDegistir={(telefonGoster) =>
                  headerGuncelleParcali({ ustBant: { ...ustBant, telefonGoster } })
                }
              />
              <ToggleSatir
                etiket="E-postayı göster"
                acik={ustBant.emailGoster}
                onDegistir={(emailGoster) =>
                  headerGuncelleParcali({ ustBant: { ...ustBant, emailGoster } })
                }
              />
              <ToggleSatir
                etiket="Sosyal medya ikonları"
                acik={ustBant.sosyalGoster}
                onDegistir={(sosyalGoster) =>
                  headerGuncelleParcali({ ustBant: { ...ustBant, sosyalGoster } })
                }
              />
              <ToggleSatir
                etiket="Kurları göster"
                acik={ustBant.kurlarGoster}
                onDegistir={(kurlarGoster) =>
                  headerGuncelleParcali({ ustBant: { ...ustBant, kurlarGoster } })
                }
              />
            </div>
          </AdminPanelKarti>
        )}

        {sekme === 'dil' && (
          <HeaderDilYonetimi
            dilDestegi={dilDestegi}
            onGuncelle={headerGuncelleParcali}
          />
        )}

        {sekme === 'logo-gorunum' && (
          <AdminPanelKarti baslik="Logo Görünümü" altBaslik="Header logosu ve boyutu">
            <div className="space-y-4">
              <GorselAlan
                etiket="Header Logosu"
                aciklama="Yalnızca header'da görünür"
                deger={headerAyarlari.logoUrl ?? ''}
                onChange={(v) => headerGuncelleParcali({ logoUrl: v || null })}
                onizlemeSinifi="h-14 max-w-[180px] rounded-lg object-contain bg-[var(--ap-input-bg)] border border-[var(--ap-border)] p-1"
              />
              <LogoBoyutSecici
                etiket="Header logo boyutu"
                deger={logoBoyutuNormalize(headerAyarlari.logoBoyutu)}
                onChange={(logoBoyutu) => headerGuncelleParcali({ logoBoyutu })}
              />
            </div>
          </AdminPanelKarti>
        )}

        {sekme === 'para' && (
          <AdminPanelKarti baslik="Para Birimi" altBaslik="TCMB veya manuel kur listesi">
            <ParaBirimiYonetimi
              kurlar={headerAyarlari.kurlar ?? []}
              sonKurGuncelleme={headerAyarlari.sonKurGuncelleme}
              onChange={(kurlar, sonKurGuncelleme) =>
                headerGuncelleParcali({ kurlar, sonKurGuncelleme })
              }
            />
          </AdminPanelKarti>
        )}

        {sekme === 'ikonlar' && (
          <AdminPanelKarti baslik="İkonlar" altBaslik="Tema ve hesap ikonları">
            <div className="space-y-4">
              <IkonSecici
                etiket="Gündüz ikonu"
                aciklama="Koyu modda görünür — tıklanınca gündüz moduna geçer"
                grup="gunduz"
                deger={ikonlar.tema.gunduz}
                onChange={(gunduz) =>
                  headerGuncelleParcali({ ikonlar: { ...ikonlar, tema: { ...ikonlar.tema, gunduz } } })
                }
              />
              <IkonSecici
                etiket="Gece ikonu"
                aciklama="Açık modda görünür — tıklanınca gece moduna geçer"
                grup="gece"
                deger={ikonlar.tema.gece}
                onChange={(gece) =>
                  headerGuncelleParcali({ ikonlar: { ...ikonlar, tema: { ...ikonlar.tema, gece } } })
                }
              />
              <IkonSecici
                etiket="Hesap"
                grup="hesap"
                deger={ikonlar.hesap}
                onChange={(hesap) => headerGuncelleParcali({ ikonlar: { ...ikonlar, hesap } })}
              />
            </div>
          </AdminPanelKarti>
        )}

        {sekme === 'kategori-arama' && (
          <AdminPanelKarti baslik="Kategori & Arama" altBaslik="Kategori menüsü ve arama alanı">
            <div className="space-y-5">
              <div className="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-surface-elevated)] p-4">
                <p className="ap-heading text-sm font-semibold">Kategori listesi</p>
                <p className="ap-muted mt-1 text-xs leading-relaxed">
                  Menüde görünen kategoriler (ana → alt → alt-alt) Kategori Yönetimi modülünden düzenlenir.
                  Buradan yalnızca başlık metni ve açılış modunu ayarlarsınız.
                </p>
                <Link
                  to="/gt-admin/kategoriler"
                  className="mt-3 inline-flex text-sm font-semibold text-[var(--ap-accent)] hover:underline"
                >
                  Kategori Yönetimi&apos;ne git →
                </Link>
              </div>
              <FormAlani etiket="Kategori başlığı">
                <input
                  className={formInputSinifi}
                  value={kategori.baslikMetni}
                  onChange={(e) =>
                    headerGuncelleParcali({ kategori: { ...kategori, baslikMetni: e.target.value } })
                  }
                />
              </FormAlani>
              <FormAlani etiket="Açılış modu" aciklama="Kategori menüsünün nasıl açılacağını seçin">
                <select
                  className={formInputSinifi}
                  value={kategori.acilisModu}
                  onChange={(e) =>
                    headerGuncelleParcali({
                      kategori: {
                        ...kategori,
                        acilisModu: e.target.value as typeof kategori.acilisModu,
                      },
                    })
                  }
                >
                  <option value="dropdown">Dropdown (mega menü)</option>
                  <option value="sidebar">Yan panel (sidebar)</option>
                  <option value="liste">Liste (kompakt)</option>
                </select>
              </FormAlani>
              <AramaStilSecici
                arama={arama}
                onChange={(yeniArama) => headerGuncelleParcali({ arama: yeniArama })}
              />
            </div>
          </AdminPanelKarti>
        )}
      </div>

      <SiteOnizlemePaneli
        tip="header"
        siteAd={siteAd}
        headerAyarlari={headerAyarlari}
        iletisim={{ telefon: ayarlar.telefon, email: ayarlar.email }}
      />
    </div>
  );
}
