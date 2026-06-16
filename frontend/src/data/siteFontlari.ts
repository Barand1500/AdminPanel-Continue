export interface SiteFont {
  ad: string;
  aile: string;
  google: string;
}

export const SITE_FONTLARI: SiteFont[] = [
  { ad: 'Inter', aile: 'Inter', google: 'Inter' },
  { ad: 'Roboto', aile: 'Roboto', google: 'Roboto' },
  { ad: 'Open Sans', aile: 'Open Sans', google: 'Open+Sans' },
  { ad: 'Lato', aile: 'Lato', google: 'Lato' },
  { ad: 'Poppins', aile: 'Poppins', google: 'Poppins' },
  { ad: 'Montserrat', aile: 'Montserrat', google: 'Montserrat' },
  { ad: 'Nunito', aile: 'Nunito', google: 'Nunito' },
  { ad: 'Raleway', aile: 'Raleway', google: 'Raleway' },
  { ad: 'Playfair Display', aile: 'Playfair Display', google: 'Playfair+Display' },
  { ad: 'DM Sans', aile: 'DM Sans', google: 'DM+Sans' },
];

export function fontGoogleUrl(font: SiteFont) {
  return `https://fonts.googleapis.com/css2?family=${font.google}:wght@400;600;700&display=swap`;
}
