export interface SayfaIkonKategori {
  id: string;
  ad: string;
  ikonlar: string[];
}

export const SAYFA_IKON_KATEGORILERI: SayfaIkonKategori[] = [
  {
    id: 'kurumsal',
    ad: 'Kurumsal',
    ikonlar: ['🏢', '🧑‍💼', '👥', '🤝', '📋', '📊', '🎯', '💼', '🏛️', '🧭', '📈', '✅'],
  },
  {
    id: 'iletisim',
    ad: 'İletişim',
    ikonlar: ['📞', '✉️', '📧', '📍', '💬', '📱', '🗺️', '🕐', '📅', '🔔', '📣', '💁'],
  },
  {
    id: 'urun',
    ad: 'Ürün & Hizmet',
    ikonlar: ['🛠️', '⚙️', '🖥️', '💻', '📱', '🌐', '☁️', '🔧', '🧩', '🚀', '📦', '🛒'],
  },
  {
    id: 'icerik',
    ad: 'İçerik',
    ikonlar: ['📄', '📰', '📝', '📚', '🎓', '💡', '🔍', '📌', '🗂️', '📎', '🖼️', '🎬'],
  },
  {
    id: 'guven',
    ad: 'Güven & Destek',
    ikonlar: ['🔒', '🛡️', '✓', '⭐', '🏆', '💎', '🤲', '🆘', '❤️', '🙋', '👨‍💻', '🧑‍🔧'],
  },
  {
    id: 'diger',
    ad: 'Diğer',
    ikonlar: ['🏠', '🌍', '⚡', '🔥', '✨', '🎨', '🎁', '🏷️', '🧪', '🔬', '🏥', '⚖️'],
  },
];

export const SAYFA_IKON_TUMU = SAYFA_IKON_KATEGORILERI.flatMap((k) => k.ikonlar);
