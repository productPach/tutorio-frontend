export function getRegionFromUrl(pathname: string): { slug: string; isRegional: boolean } {
  const parts = pathname.split("/").filter(Boolean);
  const regionalCities = [
    "spb",
    "ekb",
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
    "nn",
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
    "yaroslavl"
  ];
  const seoRoutes = ['tutors', 'subjects', 'about', 'reviews', 'pricing', 'blog', 'docs', 'site-map'];
  
  // Если URL пустой или начинается с региона
  if (parts.length === 0 || regionalCities.includes(parts[0])) {
    const slug = parts.length > 0 ? parts[0] : 'msk';
    return { slug, isRegional: true };
  }
  
  // Если URL начинается с SEO-роута
  if (seoRoutes.includes(parts[0])) {
    return { slug: 'msk', isRegional: true };
  }
  
  return { slug: 'msk', isRegional: false };
}