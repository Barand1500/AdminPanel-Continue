export const ADMIN_BILDIRIM_YENILE = 'admin-bildirim-yenile';

export function adminBildirimleriYenile() {
  window.dispatchEvent(new CustomEvent(ADMIN_BILDIRIM_YENILE));
}
