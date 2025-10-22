import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { baseUrl } from "@/api/server/configApi";
import { validSlug } from "@/utils/region/validSlug";

// --- маршруты ---
const seoRoutes = [
  "/tutors",
  "/subjects",
  "/about",
  "/reviews",
  "/pricing",
  "/blog",
  "/docs",
  "/sign-in-tutor",
];

const nonRegionalRoutes = [
  "/sign-in-student",
  "/student",
  "/tutor",
  "/admin",
  "/dashboard",
  "/settings",
  "/payment",
  "/api",
];

const regionalSlugs = validSlug;

// --- config без runtime ---
export const config = {
  matcher: [
    "/",
    "/tutors/:path*",
    "/subjects/:path*",
    "/about/:path*",
    "/reviews/:path*",
    "/pricing/:path*",
    "/blog/:path*",
    "/docs/:path*",
    "/sign-in-tutor/:path*",
    "/sign-in-student/:path*",
    "/student/:path*",
    "/tutor/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/payment/:path*",
    "/:region(spb|ekb|novosibirsk|kazan|nn|chelyabinsk)/:path*",
  ],
};

// --- безопасное определение региона ---
async function getRegionFromApiSafe() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${baseUrl}region?set_cookie=true`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (!res.ok) return { slug: "msk", cityId: null };
    const data = await res.json();
    return { slug: data.slug || "msk", cityId: data.id || null };
  } catch {
    return { slug: "msk", cityId: null };
  }
}

// --- debug helper ---
function setDebugHeaders(res: NextResponse, info: any) {
  if (info.debug) {
    Object.entries(info).forEach(([key, val]) =>
      res.headers.set(`x-debug-${key}`, String(val))
    );
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const searchParams = request.nextUrl.searchParams;
  const debug = searchParams.get("debug") === "1";

  let currentRegionSlug = "msk";
  let cityId: number | null = null;
  const regionCookie = request.cookies.get("region-id");

  // 🔹 1. определяем регион
  if (regionCookie?.value) {
    try {
      const res = await fetch(`${baseUrl}cities/${regionCookie.value}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const city = await res.json();
        currentRegionSlug = city.slug || "msk";
        cityId = city.id;
      }
    } catch {
      currentRegionSlug = "msk";
    }
  } else {
    const region = await getRegionFromApiSafe();
    currentRegionSlug = region.slug;
    cityId = region.cityId;
  }

  // 🔹 2. определяем тип пути
  const hasRegionalPrefix = regionalSlugs.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  );
  const isSeoRoute = seoRoutes.some((route) => pathname.startsWith(route));
  const isNonRegional = nonRegionalRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let res = NextResponse.next();

  // 🔹 3. Главная → редирект по региону
  if (pathname === "/") {
    if (currentRegionSlug !== "msk") {
      const redirect = NextResponse.redirect(`${origin}/${currentRegionSlug}`);
      return setDebugHeaders(redirect, {
        debug,
        pathname,
        currentRegionSlug,
        hasRegionalPrefix,
        isSeoRoute,
        isNonRegional,
        cityId,
      });
    }
    return setDebugHeaders(res, {
      debug,
      pathname,
      currentRegionSlug,
      hasRegionalPrefix,
      isSeoRoute,
      isNonRegional,
      cityId,
    });
  }

  // 🔹 4. SEO-страницы
  if (isSeoRoute) {
    // без префикса → добавляем
    if (currentRegionSlug !== "msk" && !hasRegionalPrefix) {
      const redirect = NextResponse.redirect(
        `${origin}/${currentRegionSlug}${pathname}`
      );
      return setDebugHeaders(redirect, {
        debug,
        pathname,
        currentRegionSlug,
        hasRegionalPrefix,
        isSeoRoute,
        isNonRegional,
        cityId,
      });
    }

    // неверный регион → заменяем
    if (currentRegionSlug !== "msk" && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath && regionInPath !== currentRegionSlug) {
        const newPath = pathname.replace(`/${regionInPath}`, `/${currentRegionSlug}`);
        const redirect = NextResponse.redirect(`${origin}${newPath}`);
        return setDebugHeaders(redirect, {
          debug,
          pathname,
          currentRegionSlug,
          hasRegionalPrefix,
          isSeoRoute,
          isNonRegional,
          cityId,
        });
      }
    }

    // msk с префиксом → убираем
    if (currentRegionSlug === "msk" && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath) {
        const newPath = pathname.replace(`/${regionInPath}`, "") || "/";
        const redirect = NextResponse.redirect(`${origin}${newPath}`);
        return setDebugHeaders(redirect, {
          debug,
          pathname,
          currentRegionSlug,
          hasRegionalPrefix,
          isSeoRoute,
          isNonRegional,
          cityId,
        });
      }
    }
  }

  // 🔹 5. Служебные страницы — удаляем префиксы
  if (isNonRegional && hasRegionalPrefix) {
    const regionInPath = regionalSlugs.find(
      (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
    );
    if (regionInPath) {
      const newPath = pathname.replace(`/${regionInPath}`, "") || "/";
      const redirect = NextResponse.redirect(`${origin}${newPath}`);
      return setDebugHeaders(redirect, {
        debug,
        pathname,
        currentRegionSlug,
        hasRegionalPrefix,
        isSeoRoute,
        isNonRegional,
        cityId,
      });
    }
  }

  // 🔹 6. Возврат без редиректа
  return setDebugHeaders(res, {
    debug,
    pathname,
    currentRegionSlug,
    hasRegionalPrefix,
    isSeoRoute,
    isNonRegional,
    cityId,
  });
}
