import { useState } from 'react';
import type { UrunYonetimiSekmeId } from '@/types/urunYonetimi';
import { AdminSiteOnizleLink } from '@/components/admin/AdminHeader';
import { ModulBaslik } from '@/components/admin/ortak/AdminBilesenleri';
import { UrunSekmeCubugu } from '@/components/admin/urun/UrunSekmeCubugu';
import { KategoriYonetimiSekmesi } from '@/components/admin/urun/KategoriYonetimiSekmesi';
import { MarkaYonetimiSekmesi } from '@/components/admin/urun/MarkaYonetimiSekmesi';
import { RozetYonetimiSekmesi } from '@/components/admin/urun/RozetYonetimiSekmesi';
import { OzellikYonetimiSekmesi } from '@/components/admin/urun/OzellikYonetimiSekmesi';
import { FirsatYonetimiSekmesi } from '@/components/admin/urun/FirsatYonetimiSekmesi';
import { UrunListesiSekmesi } from '@/components/admin/urun/UrunListesiSekmesi';
import { TopluGorselSekmesi } from '@/components/admin/urun/TopluGorselSekmesi';
import { YorumYonetimiSekmesi } from '@/components/admin/urun/YorumYonetimiSekmesi';

export function UrunYonetimiSayfasi() {
  const [sekme, setSekme] = useState<UrunYonetimiSekmeId>('kategoriler');

  return (
    <div className="ap-urun-yonetimi space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ModulBaslik
          baslik="Ürün Yönetimi"
          aciklama="Kategoriler, markalar, rozetler, özellik şablonları, fırsatlar, ürün listesi, toplu görsel yükleme ve yorum onayını buradan yönetin. Kaydet, Güncelle, Yeni Ekle ve Sil işlemleri alt aksiyon çubuğundan yapılır."
        />
        {sekme === 'urun-listesi' && <AdminSiteOnizleLink />}
      </div>

      <UrunSekmeCubugu aktif={sekme} onDegistir={setSekme} />

      {sekme === 'kategoriler' && <KategoriYonetimiSekmesi />}
      {sekme === 'markalar' && <MarkaYonetimiSekmesi />}
      {sekme === 'rozetler' && <RozetYonetimiSekmesi />}
      {sekme === 'ozellikler' && <OzellikYonetimiSekmesi />}
      {sekme === 'firsatlar' && <FirsatYonetimiSekmesi />}
      {sekme === 'urun-listesi' && <UrunListesiSekmesi />}
      {sekme === 'toplu-gorsel' && <TopluGorselSekmesi />}
      {sekme === 'yorumlar' && <YorumYonetimiSekmesi />}
    </div>
  );
}
