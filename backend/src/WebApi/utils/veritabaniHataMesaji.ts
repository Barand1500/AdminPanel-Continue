export function veritabaniHataMesaji(err: unknown): string | null {
  const mesaj = err instanceof Error ? err.message : String(err);

  if (
    mesaj.includes("reading 'count'") ||
    mesaj.includes('blogYazisi') ||
    mesaj.includes('formTanimi') ||
    mesaj.includes('formGonderim') ||
    mesaj.includes('BlogYazisi') ||
    mesaj.includes('FormTanimi') ||
    mesaj.includes('AdminLog') ||
    mesaj.includes('does not exist') ||
    mesaj.includes('P2021')
  ) {
    return (
      'Veritabani veya Prisma client guncel degil. Proje kokunde sirayla calistirin: ' +
      'npm run postpull → npm run dev ' +
      '(backend dev sunucusu kapali iken db:push calistirin).'
    );
  }

  if (mesaj.includes('DATABASE_URL') || mesaj.includes("Can't reach database")) {
    return (
      'Veritabani baglantisi kurulamadi. Localde MySQL gerekmez: backend/.env icinde DATABASE_URL="file:./dev.db" olmali, sonra npm run db:setup. ' +
      'Sunucuda ise MySQL adresi DATABASE_URL icinde tanimli olmali.'
    );
  }

  return null;
}
