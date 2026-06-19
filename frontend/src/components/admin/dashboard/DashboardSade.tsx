import { DashboardHizliErisim } from '@/components/admin/dashboard/DashboardHizliErisim';
import type { DashboardOzet } from '@/features/admin/dashboardApi';
import type { AdminModul } from '@/types/admin';

function tarihKisa(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function OzetOge({ etiket, deger, alt }: { etiket: string; deger: number; alt?: string }) {
  return (
    <div className="ap-dash-sade-ozet-oge">
      <span className="ap-dash-sade-ozet-etiket">{etiket}</span>
      <span className="ap-dash-sade-ozet-deger">{deger.toLocaleString('tr-TR')}</span>
      {alt && <span className="ap-dash-sade-ozet-alt">{alt}</span>}
    </div>
  );
}

export function DashboardSade({
  kullaniciAd,
  ozet,
  hizliModuller,
  onModulAc,
}: {
  kullaniciAd: string;
  ozet: DashboardOzet;
  hizliModuller: AdminModul[];
  onModulAc: (modulId: string) => void;
}) {
  const s = ozet.istatistikler;
  const saat = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="ap-dash-sade">
      <section className="ap-dash-sade-karsilama">
        <p className="ap-dash-sade-tarih">{saat}</p>
        <h2 className="ap-dash-sade-hosgeldin">Merhaba, {kullaniciAd}</h2>
        <p className="ap-dash-sade-aciklama">
          Sitenizin güncel özetine buradan ulaşın. Detaylı grafikler için Analitik görünüme geçebilirsiniz.
        </p>
      </section>

      <section className="ap-dash-sade-ozet" data-ap-kesif="dash-kpi">
        <OzetOge
          etiket="Yayında Sayfa"
          deger={s.yayindaSayfa}
          alt={s.sayfaSayisi > s.yayindaSayfa ? `${s.sayfaSayisi} toplam` : undefined}
        />
        <OzetOge
          etiket="Yayında Blog"
          deger={s.yayindaBlog}
          alt={s.blogSayisi > s.yayindaBlog ? `${s.blogSayisi} toplam` : undefined}
        />
        <OzetOge etiket="Form" deger={s.formSayisi} />
        <OzetOge etiket="Medya" deger={s.medyaSayisi} />
        <OzetOge
          etiket="Form Gönderimi"
          deger={s.gonderimSayisi}
          alt={s.okunmamisGonderim > 0 ? `${s.okunmamisGonderim} okunmadı` : undefined}
        />
        <OzetOge etiket="Widget" deger={s.widgetSayisi} />
      </section>

      <div className="ap-dash-sade-iki-kolon">
        <section className="ap-dash-sade-kart">
          <h3 className="ap-dash-sade-bolum-baslik">Son Blog Yazıları</h3>
          {ozet.sonBloglar.length === 0 ? (
            <p className="ap-dash-sade-bos">Henüz blog yazısı yok.</p>
          ) : (
            <ul className="ap-dash-sade-liste">
              {ozet.sonBloglar.map((blog) => (
                <li key={blog.id} className="ap-dash-sade-liste-oge">
                  <span className="ap-dash-sade-liste-baslik">{blog.baslik}</span>
                  <span className="ap-dash-sade-liste-meta">
                    {blog.yayinda ? 'Yayında' : 'Taslak'} · {tarihKisa(blog.olusturma)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ap-dash-sade-kart">
          <h3 className="ap-dash-sade-bolum-baslik">Son Form Gönderimleri</h3>
          {ozet.sonGonderimler.length === 0 ? (
            <p className="ap-dash-sade-bos">Henüz form gönderimi yok.</p>
          ) : (
            <ul className="ap-dash-sade-liste">
              {ozet.sonGonderimler.map((g) => (
                <li key={g.id} className="ap-dash-sade-liste-oge">
                  <span className="ap-dash-sade-liste-baslik">{g.formAd}</span>
                  <span className="ap-dash-sade-liste-meta">
                    {!g.okundu && <span className="ap-dash-sade-rozet">Yeni</span>}
                    {g.okundu ? 'Okundu' : 'Bekliyor'} · {tarihKisa(g.olusturma)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <DashboardHizliErisim moduller={hizliModuller} onModulAc={onModulAc} sade />
    </div>
  );
}
