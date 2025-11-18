import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/",
    "/repetitors/:path*",
    "/repetitor/:path*",
    "/subjects/:path*",
    "/about/:path*",
    "/reviews/:path*",
    "/pricing/:path*",
    "/blog/:path*",
    "/docs/:path*",
    "/sitemap/:path*",
    "/:region(spb|ekb|novosibirsk|kazan|nn|chelyabinsk|abakan|anadyr|arkhangelsk|astrakhan|barnaul|belgorod|birobidzhan|blagoveshchensk|bryansk|velikiy-novgorod|vladivostok|vladikavkaz|vladimir|volgograd|vologda|voronezh|gorno-altaysk|grozny|ivanovo|izhevsk|irkutsk|yoshkar-ola|kaliningrad|kaluga|kemerovo|kirov|kostroma|krasnodar|krasnoyarsk|kurgan|kursk|kyzyl|lipetsk|magadan|maykop|makhachkala|murmansk|nazran|nalchik|naryan-mar|omsk|orel|orenburg|penza|perm|petrozavodsk|petropavlovsk-kamchatskiy|pskov|rostov-na-donu|ryazan|salekhard|samara|saransk|saratov|sevastopol|simferopol|smolensk|stavropol|syktyvkar|tambov|tver|tomsk|tula|tyumen|ulan-ude|ulyanovsk|ufa|khabarovsk|khanty-mansiysk|cheboksary|cherkessk|chita|elista|yuzhno-sakhalinsk|yakutsk|yaroslavl)/:path*",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const regionCookie = request.cookies.get("region-id");
  const regionId = regionCookie?.value;

  // === 🗺️ Карта ID регионов и SEO-slug’ов (прод)
  // const regionMap: Record<string, string | null> = {
  //   "68590b9fd7197f4bb273d1ed": null, // Москва и Московская область
  //   "68590ba2d7197f4bb273d216": "spb", // Санкт-Петербург и Ленинградская область
  //   "6868de76839216f4dc243e8f": "ekb", // Екатеринбург и Свердловская область
  //   "68ce6a1da29e19139091f076": "abakan", // Абакан и Республика Хакасия
  //   "68ce6a3ba29e19139091f077": "anadyr", // Анадырь и Чукотский АО
  //   "68ce6a43a29e19139091f078": "arkhangelsk",
  //   "68ce6a4ba29e19139091f079": "astrakhan",
  //   "68ce6a52a29e19139091f07a": "barnaul",
  //   "68ce6a5aa29e19139091f07b": "belgorod",
  //   "68ce6a60a29e19139091f07c": "birobidzhan",
  //   "68ce6a67a29e19139091f07d": "blagoveshchensk",
  //   "68ce6a6ea29e19139091f07e": "bryansk",
  //   "68ce6a75a29e19139091f07f": "velikiy-novgorod",
  //   "68ce6a7fa29e19139091f080": "vladivostok",
  //   "68ce6a8fa29e19139091f081": "vladikavkaz",
  //   "68ce6a97a29e19139091f082": "vladimir",
  //   "68ce6a9ea29e19139091f083": "volgograd",
  //   "68ce6aa6a29e19139091f084": "vologda",
  //   "68ce6ab0a29e19139091f085": "voronezh",
  //   "68ce6ab8a29e19139091f086": "gorno-altaysk",
  //   "68ce6abfa29e19139091f087": "grozny",
  //   "68ce6ac9a29e19139091f088": "ivanovo",
  //   "68ce6ad6a29e19139091f089": "izhevsk",
  //   "68ce6ae3a29e19139091f08a": "irkutsk",
  //   "68ce6ae9a29e19139091f08b": "yoshkar-ola",
  //   "68ce6aefa29e19139091f08c": "kazan",
  //   "68ce6af6a29e19139091f08d": "kaliningrad",
  //   "68ce6afca29e19139091f08e": "kaluga",
  //   "68ce6b0aa29e19139091f08f": "kemerovo",
  //   "68ce6b12a29e19139091f090": "kirov",
  //   "68ce6b19a29e19139091f091": "kostroma",
  //   "68ce6b1ea29e19139091f092": "krasnodar",
  //   "68ce6b25a29e19139091f093": "krasnoyarsk",
  //   "68ce6b2ca29e19139091f094": "kurgan",
  //   "68ce6b32a29e19139091f095": "kursk",
  //   "68ce6b38a29e19139091f096": "kyzyl",
  //   "68ce6b3ea29e19139091f097": "lipetsk",
  //   "68ce6b45a29e19139091f098": "magadan",
  //   "68ce6b4ba29e19139091f099": "maykop",
  //   "68ce6b51a29e19139091f09a": "makhachkala",
  //   "68ce6b58a29e19139091f09b": "murmansk",
  //   "68ce6b5ea29e19139091f09c": "nazran",
  //   "68ce6b64a29e19139091f09d": "nalchik",
  //   "68ce6b75a29e19139091f09e": "naryan-mar",
  //   "68ce6b87a29e19139091f09f": "nn", // Нижний Новгород и область
  //   "68ce6b90a29e19139091f0a0": "novosibirsk",
  //   "68ce6b97a29e19139091f0a1": "omsk",
  //   "68ce6b9ca29e19139091f0a2": "orel",
  //   "68ce6ba3a29e19139091f0a3": "orenburg",
  //   "68ce6ba9a29e19139091f0a4": "penza",
  //   "68ce6bb1a29e19139091f0a5": "perm",
  //   "68ce6bbba29e19139091f0a6": "petrozavodsk",
  //   "68ce6bc4a29e19139091f0a7": "petropavlovsk-kamchatskiy",
  //   "68ce6bcca29e19139091f0a8": "pskov",
  //   "68ce6bd7a29e19139091f0a9": "rostov-na-donu",
  //   "68ce6bdfa29e19139091f0aa": "ryazan",
  //   "68ce6be6a29e19139091f0ab": "salekhard",
  //   "68ce6beda29e19139091f0ac": "samara",
  //   "68ce6bf5a29e19139091f0ad": "saransk",
  //   "68ce6bfaa29e19139091f0ae": "saratov",
  //   "68ce6bffa29e19139091f0af": "sevastopol",
  //   "68ce6c07a29e19139091f0b0": "simferopol",
  //   "68ce6c17a29e19139091f0b1": "smolensk",
  //   "68ce6c21a29e19139091f0b2": "stavropol",
  //   "68ce6c26a29e19139091f0b3": "syktyvkar",
  //   "68ce6c2da29e19139091f0b4": "tambov",
  //   "68ce6c34a29e19139091f0b5": "tver",
  //   "68ce6c3aa29e19139091f0b6": "tomsk",
  //   "68ce6c40a29e19139091f0b7": "tula",
  //   "68ce6c46a29e19139091f0b8": "tyumen",
  //   "68ce6c51a29e19139091f0b9": "ulan-ude",
  //   "68ce6c57a29e19139091f0ba": "ulyanovsk",
  //   "68ce6c5da29e19139091f0bb": "ufa",
  //   "68ce6c64a29e19139091f0bc": "khabarovsk",
  //   "68ce6c6aa29e19139091f0bd": "khanty-mansiysk",
  //   "68ce6c70a29e19139091f0be": "cheboksary",
  //   "68ce6c75a29e19139091f0bf": "chelyabinsk",
  //   "68ce6c7aa29e19139091f0c0": "cherkessk",
  //   "68ce6c80a29e19139091f0c1": "chita",
  //   "68ce6c87a29e19139091f0c2": "elista",
  //   "68ce6c8da29e19139091f0c3": "yuzhno-sakhalinsk",
  //   "68ce6c95a29e19139091f0c4": "yakutsk",
  //   "68ce6c9da29e19139091f0c5": "yaroslavl",
  // };

    // === 🗺️ Карта ID регионов и SEO-slug’ов (localhost)
  const regionMap: Record<string, string | null> = {
    "68d53ee5a75f062437f4fc51": null, // Москва и Московская область // ✅
    "68d53ef4a75f062437f4fd34": "spb", // Санкт-Петербург и Ленинградская область // ✅
    "68f769e7bb3f5569b0544f36": "ekb", // Екатеринбург и Свердловская область // ✅
    "68ce6a1da29e19139091f076": "abakan", // Абакан и Республика Хакасия
    "68ce6a3ba29e19139091f077": "anadyr", // Анадырь и Чукотский АО
    "68ce6a43a29e19139091f078": "arkhangelsk",
    "68ce6a4ba29e19139091f079": "astrakhan",
    "68ce6a52a29e19139091f07a": "barnaul",
    "68ce6a5aa29e19139091f07b": "belgorod",
    "68ce6a60a29e19139091f07c": "birobidzhan",
    "68ce6a67a29e19139091f07d": "blagoveshchensk",
    "68ce6a6ea29e19139091f07e": "bryansk",
    "68ce6a75a29e19139091f07f": "velikiy-novgorod",
    "68ce6a7fa29e19139091f080": "vladivostok",
    "68ce6a8fa29e19139091f081": "vladikavkaz",
    "68ce6a97a29e19139091f082": "vladimir",
    "68ce6a9ea29e19139091f083": "volgograd",
    "68ce6aa6a29e19139091f084": "vologda",
    "68ce6ab0a29e19139091f085": "voronezh",
    "68ce6ab8a29e19139091f086": "gorno-altaysk",
    "68ce6abfa29e19139091f087": "grozny",
    "68ce6ac9a29e19139091f088": "ivanovo",
    "68ce6ad6a29e19139091f089": "izhevsk",
    "68ce6ae3a29e19139091f08a": "irkutsk",
    "68ce6ae9a29e19139091f08b": "yoshkar-ola",
    "68f769e7bb3f5569b0544f6d": "kazan", // ✅
    "68f769e7bb3f5569b0544f9e": "kaliningrad", // ✅
    "68ce6afca29e19139091f08e": "kaluga",
    "68ce6b0aa29e19139091f08f": "kemerovo",
    "68ce6b12a29e19139091f090": "kirov",
    "68ce6b19a29e19139091f091": "kostroma",
    "68ce6b1ea29e19139091f092": "krasnodar",
    "68ce6b25a29e19139091f093": "krasnoyarsk",
    "68ce6b2ca29e19139091f094": "kurgan",
    "68ce6b32a29e19139091f095": "kursk",
    "68ce6b38a29e19139091f096": "kyzyl",
    "68ce6b3ea29e19139091f097": "lipetsk",
    "68ce6b45a29e19139091f098": "magadan",
    "68ce6b4ba29e19139091f099": "maykop",
    "68ce6b51a29e19139091f09a": "makhachkala",
    "68ce6b58a29e19139091f09b": "murmansk",
    "68ce6b5ea29e19139091f09c": "nazran",
    "68ce6b64a29e19139091f09d": "nalchik",
    "68ce6b75a29e19139091f09e": "naryan-mar",
    "68ce6b87a29e19139091f09f": "nn", // Нижний Новгород и область
    "68ce6b90a29e19139091f0a0": "novosibirsk",
    "68ce6b97a29e19139091f0a1": "omsk",
    "68ce6b9ca29e19139091f0a2": "orel",
    "68ce6ba3a29e19139091f0a3": "orenburg",
    "68ce6ba9a29e19139091f0a4": "penza",
    "68ce6bb1a29e19139091f0a5": "perm",
    "68ce6bbba29e19139091f0a6": "petrozavodsk",
    "68ce6bc4a29e19139091f0a7": "petropavlovsk-kamchatskiy",
    "68ce6bcca29e19139091f0a8": "pskov",
    "68ce6bd7a29e19139091f0a9": "rostov-na-donu",
    "68ce6bdfa29e19139091f0aa": "ryazan",
    "68ce6be6a29e19139091f0ab": "salekhard",
    "68ce6beda29e19139091f0ac": "samara",
    "68ce6bf5a29e19139091f0ad": "saransk",
    "68ce6bfaa29e19139091f0ae": "saratov",
    "68ce6bffa29e19139091f0af": "sevastopol",
    "68ce6c07a29e19139091f0b0": "simferopol",
    "68ce6c17a29e19139091f0b1": "smolensk",
    "68ce6c21a29e19139091f0b2": "stavropol",
    "68ce6c26a29e19139091f0b3": "syktyvkar",
    "68ce6c2da29e19139091f0b4": "tambov",
    "68ce6c34a29e19139091f0b5": "tver",
    "68ce6c3aa29e19139091f0b6": "tomsk",
    "68ce6c40a29e19139091f0b7": "tula",
    "68ce6c46a29e19139091f0b8": "tyumen",
    "68ce6c51a29e19139091f0b9": "ulan-ude",
    "68ce6c57a29e19139091f0ba": "ulyanovsk",
    "68ce6c5da29e19139091f0bb": "ufa",
    "68ce6c64a29e19139091f0bc": "khabarovsk",
    "68ce6c6aa29e19139091f0bd": "khanty-mansiysk",
    "68ce6c70a29e19139091f0be": "cheboksary",
    "68ce6c75a29e19139091f0bf": "chelyabinsk",
    "68ce6c7aa29e19139091f0c0": "cherkessk",
    "68ce6c80a29e19139091f0c1": "chita",
    "68ce6c87a29e19139091f0c2": "elista",
    "68ce6c8da29e19139091f0c3": "yuzhno-sakhalinsk",
    "68ce6c95a29e19139091f0c4": "yakutsk",
    "68ce6c9da29e19139091f0c5": "yaroslavl",
  };

  // === Если кука не установлена — пропускаем
  if (!regionId) return NextResponse.next();

  const regionSlug = regionMap[regionId];
  if (regionSlug === undefined) return NextResponse.next();

  // // === Проверяем, есть ли уже slug региона в пути
  // const allSlugs = Object.values(regionMap)
  //   .filter((v): v is string => !!v)
  //   .join("|");

  // const slugRegex = new RegExp(`^/(${allSlugs})(/|$)`);
  // const isAlreadyRegional = slugRegex.test(pathname);

  // // === Москва (без слага)
  // if (regionSlug === null) {
  //   if (isAlreadyRegional) {
  //     const newPath = pathname.replace(slugRegex, "");
  //     return NextResponse.redirect(`${origin}/${newPath || "/"}`);
  //   }
  //   return NextResponse.next();
  // }

  // // === Остальные регионы
  // if (!isAlreadyRegional) {
  //   return NextResponse.redirect(`${origin}/${regionSlug}${pathname}`);
  // }

//   // === Москва (без слага)
// if (regionSlug === null) {
//   if (isAlreadyRegional) {
//     const newPath = pathname.replace(slugRegex, "");
//     const cleanPath = newPath?.replace(/^\/+/, "") || "";
//     const redirectUrl = cleanPath ? `${origin}/${cleanPath}` : origin;
//     return NextResponse.redirect(redirectUrl);
//   }
//   return NextResponse.next();
// }

// // === Остальные регионы
// if (!isAlreadyRegional) {
//   // Убираем возможный двойной слеш, если pathname = "/"
//   const cleanPath = pathname.replace(/^\/+/, "");
//   return NextResponse.redirect(`${origin}/${regionSlug}${cleanPath ? `/${cleanPath}` : ""}`);
// }

// === Проверяем, есть ли уже slug региона в пути
const allSlugs = Object.values(regionMap).filter((v): v is string => !!v);
const slugRegex = new RegExp(`^/(${allSlugs.join("|")})(/|$)`);
const match = pathname.match(slugRegex);
const currentSlugInPath = match?.[1] || null;
const isAlreadyRegional = !!currentSlugInPath;

// === Москва (без слага)
if (regionSlug === null) {
  if (isAlreadyRegional) {
    const newPath = pathname.replace(slugRegex, "");
    const cleanPath = newPath?.replace(/^\/+/, "") || "";
    const redirectUrl = cleanPath ? `${origin}/${cleanPath}` : origin;
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

// === Остальные регионы
if (!isAlreadyRegional) {
  // регион не указан вовсе
  const cleanPath = pathname.replace(/^\/+/, "");
  return NextResponse.redirect(`${origin}/${regionSlug}${cleanPath ? `/${cleanPath}` : ""}`);
}

// === Если регион в URL есть, но он другой — редиректим на правильный
if (currentSlugInPath && currentSlugInPath !== regionSlug) {
  const newPath = pathname.replace(slugRegex, `/${regionSlug}/`);
  const redirectUrl = `${origin}${newPath}`.replace(/\/+$/, ""); // убрать лишние /
  return NextResponse.redirect(redirectUrl);
}

  return NextResponse.next();
}
