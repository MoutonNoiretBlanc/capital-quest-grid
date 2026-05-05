// Map French country names → ISO 3166-1 alpha-2 country codes
const ISO: Record<string, string> = {
  "Japon": "jp",
  "Islande": "is",
  "France": "fr",
  "Égypte": "eg",
  "Maroc": "ma",
  "Kenya": "ke",
  "Sénégal": "sn",
  "Afrique du Sud": "za",
  "États-Unis": "us",
  "Canada": "ca",
  "Mexique": "mx",
  "Brésil": "br",
  "Argentine": "ar",
  "Pérou": "pe",
  "Équateur": "ec",
  "Cuba": "cu",
  "Allemagne": "de",
  "Espagne": "es",
  "Italie": "it",
  "Grèce": "gr",
  "Portugal": "pt",
  "Norvège": "no",
  "Thaïlande": "th",
  "Inde": "in",
  "Népal": "np",
  "Arabie saoudite": "sa",
  "Iran": "ir",
  "Chine": "cn",
  "Australie": "au",
  "Nouvelle-Zélande": "nz",
  "Royaume-Uni": "gb",
  "Irlande": "ie",
  "Suède": "se",
  "Finlande": "fi",
  "Danemark": "dk",
  "Pays-Bas": "nl",
  "Belgique": "be",
  "Suisse": "ch",
  "Autriche": "at",
  "Pologne": "pl",
  "République tchèque": "cz",
  "Hongrie": "hu",
  "Roumanie": "ro",
  "Bulgarie": "bg",
  "Russie": "ru",
  "Ukraine": "ua",
  "Turquie": "tr",
  "Israël": "il",
  "Liban": "lb",
  "Jordanie": "jo",
  "Syrie": "sy",
  "Irak": "iq",
  "Émirats arabes unis": "ae",
  "Qatar": "qa",
  "Pakistan": "pk",
  "Bangladesh": "bd",
  "Sri Lanka": "lk",
  "Indonésie": "id",
  "Malaisie": "my",
  "Singapour": "sg",
  "Philippines": "ph",
  "Vietnam": "vn",
  "Corée du Sud": "kr",
  "Corée du Nord": "kp",
  "Mongolie": "mn",
  "Algérie": "dz",
  "Tunisie": "tn",
  "Libye": "ly",
  "Nigeria": "ng",
  "Ghana": "gh",
  "Éthiopie": "et",
  "Tanzanie": "tz",
  "Ouganda": "ug",
  "Cameroun": "cm",
  "Côte d'Ivoire": "ci",
  "Mali": "ml",
  "Madagascar": "mg",
  "Chili": "cl",
  "Colombie": "co",
  "Venezuela": "ve",
  "Uruguay": "uy",
  "Paraguay": "py",
  "Bolivie": "bo",
};

/** ISO alpha-2 country code (lowercase) for a French country name */
export function isoFor(country?: string): string | undefined {
  if (!country) return undefined;
  return ISO[country];
}

/** Convert a 2-letter ISO code into a flag emoji (regional indicators) */
export function flagEmoji(iso?: string): string {
  if (!iso || iso.length !== 2) return "🏳️";
  const codePoints = iso
    .toUpperCase()
    .split("")
    .map((c) => c.charCodeAt(0) + 127397);
  return String.fromCodePoint(...codePoints);
}

/** Backwards-compatible: returns flag emoji for a French country name */
export function flagFor(country?: string): string {
  return flagEmoji(isoFor(country));
}

/** Returns a CDN URL for a flag image (works on all OSes, incl. Windows) */
export function flagImgSrc(country?: string, width: 20 | 40 | 80 = 20): string | undefined {
  const iso = isoFor(country);
  if (!iso) return undefined;
  return `https://flagcdn.com/w${width}/${iso}.png`;
}
