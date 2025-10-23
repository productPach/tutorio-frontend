export const validSlug = [
  "msk",                  // Москва и МО
  "spb",                  // Санкт-Петербург и ЛО
  "ekb",                  // Екатеринбург и Свердловская область
  "abakan",
  "anadyr",
  "arkhangelsk",
  "astrakhan",
  "barnaul",
  "belgorod",
  "birobidzhan",
  "blagoveshchensk",
  "bryansk",
  "velikiy-novgorod",
  "vladivostok",
  "vladikavkaz",
  "vladimir",
  "volgograd",
  "vologda",
  "voronezh",
  "gorno-altaysk",
  "grozny",
  "ivanovo",
  "izhevsk",
  "irkutsk",
  "yoshkar-ola",
  "kazan",
  "kaliningrad",
  "kaluga",
  "kemerovo",
  "kirov",
  "kostroma",
  "krasnodar",
  "krasnoyarsk",
  "kurgan",
  "kursk",
  "kyzyl",
  "lipetsk",
  "magadan",
  "maykop",
  "makhachkala",
  "murmansk",
  "nazran",
  "nalchik",
  "naryan-mar",
  "nn",                   // Нижний Новгород и область
  "novosibirsk",
  "omsk",
  "orel",
  "orenburg",
  "penza",
  "perm",
  "petrozavodsk",
  "petropavlovsk-kamchatskiy",
  "pskov",
  "rostov-na-donu",
  "ryazan",
  "salekhard",
  "samara",
  "saransk",
  "saratov",
  "sevastopol",
  "simferopol",
  "smolensk",
  "stavropol",
  "syktyvkar",
  "tambov",
  "tver",
  "tomsk",
  "tula",
  "tyumen",
  "ulan-ude",
  "ulyanovsk",
  "ufa",
  "khabarovsk",
  "khanty-mansiysk",
  "cheboksary",
  "chelyabinsk",
  "cherkessk",
  "chita",
  "elista",
  "yuzhno-sakhalinsk",
  "yakutsk",
  "yaroslavl",
];


export type ValidSlugType = typeof validSlug[number];

export function getCitySlug(city: string | undefined): ValidSlugType | null {
  // Если city undefined - это корневой маршрут (Москва по умолчанию)
  if (city === undefined) return 'msk';
  
  // Если city есть в списке валидных
  if (validSlug.includes(city as ValidSlugType)) {
    return city as ValidSlugType;
  }
  
  // Невалидный slug
  return null;
}

export function isValidSlug(city: string | undefined): boolean {
  return getCitySlug(city) !== null;
}