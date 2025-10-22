import { baseUrl } from '@/api/server/configApi';
import { validSlug } from '@/utils/region/validSlug';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const seoRoutes = [
  '/tutors',
  '/subjects',
  '/about',
  '/reviews',
  '/pricing',
  '/blog',
  '/docs',
  '/sign-in-tutor',
];

const nonRegionalRoutes = [
  '/sign-in-student',
  '/student',
  '/tutor',
  '/admin',
  '/dashboard',
  '/settings',
  '/payment',
  '/api',
];

const regionalSlugs = validSlug;

export const config = {
  matcher: [
    '/',
    '/tutors/:path*',
    '/subjects/:path*',
    '/about/:path*',
    '/reviews/:path*',
    '/pricing/:path*',
    '/blog/:path*',
    '/docs/:path*',
    '/sign-in-tutor/:path*',
    '/sign-in-student/:path*',
    '/student/:path*',
    '/tutor/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/payment/:path*',
    '/:region(spb|ekb|novosibirsk|kazan|nn|chelyabinsk)/:path*',
  ],
};

// --- функция для определения региона ---
async function getRegionFromApi() {
  try {
    const res = await fetch(`${baseUrl}region?set_cookie=true`);
    console.log('отправляем запрос на определение региона!');
    if (!res.ok) return { slug: 'msk', cityId: null };
    const data = await res.json();
    return {
      slug: data.slug || 'msk',
      cityId: data.id || null,
    };
  } catch {
    return { slug: 'msk', cityId: null };
  }
}

// --- функция для debug-заголовков (ПОДНИМАЕМ ВВЕРХ!) ---
function setDebugHeaders(res: NextResponse, {
  debug,
  pathname,
  currentRegionSlug,
  hasRegionalPrefix,
  isSeoRoute,
  isNonRegional,
  cityId
}: any) {
  if (debug) {
    res.headers.set('x-debug-region', currentRegionSlug);
    res.headers.set('x-debug-path', pathname);
    res.headers.set('x-debug-hasPrefix', hasRegionalPrefix.toString());
    res.headers.set('x-debug-isSeo', isSeoRoute.toString());
    res.headers.set('x-debug-isNonRegional', isNonRegional.toString());
    if (cityId) res.headers.set('x-debug-cityId', cityId.toString());
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const searchParams = request.nextUrl.searchParams;

  let currentRegionSlug = 'msk';
  let cityId = null;
  const regionCookie = request.cookies.get('region-id');
  let response = NextResponse.next();

  if (regionCookie?.value) {
    try {
      const res = await fetch(`${baseUrl}cities/${regionCookie.value}`);
      if (res.ok) {
        const cityData = await res.json();
        currentRegionSlug = cityData.slug || 'msk';
        cityId = cityData.id;
      }
    } catch {
      currentRegionSlug = 'msk';
    }
  } else {
    const regionData = await getRegionFromApi();
    currentRegionSlug = regionData.slug;
    cityId = regionData.cityId;

    if (cityId) {
      const search = request.nextUrl.search || '';
      const redirectUrl =
        currentRegionSlug === 'msk'
          ? `${origin}/${search}`
          : `${origin}/${currentRegionSlug}${pathname === '/' ? '' : pathname}${search}`;

      const redirectResponse = NextResponse.redirect(redirectUrl);
      // redirectResponse.cookies.set('region-id', cityId.toString(), {
      //   maxAge: 365 * 24 * 60 * 60,
      //   httpOnly: process.env.NODE_ENV === 'production',
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'lax',
      //   path: '/',
      // });

      // redirectResponse.cookies.set('region-id', cityId.toString(), {
      //   maxAge: 365 * 24 * 60 * 60,
      //   httpOnly: false, // для отладки на localhost
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'lax',
      //   path: '/',
      // });

      console.log('🍪 Cookie set + redirect to:', redirectUrl);
      return setDebugHeaders(redirectResponse, { debug: true, pathname, currentRegionSlug, cityId });
    }
  }

  const hasRegionalPrefix = regionalSlugs.some(
    slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  );
  const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route));
  const isNonRegional = nonRegionalRoutes.some(route => pathname.startsWith(route));
  const debug = searchParams.get('debug') === '1';

  // 🔄 Главная
  if (pathname === '/') {
    if (currentRegionSlug !== 'msk') {
      const redirectResponse = NextResponse.redirect(`${origin}/${currentRegionSlug}`);
      return setDebugHeaders(redirectResponse, {
        debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId
      });
    }
    return setDebugHeaders(response, {
      debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId
    });
  }

  // 🔄 SEO-страницы
  if (isSeoRoute) {
    if (currentRegionSlug !== 'msk' && !hasRegionalPrefix) {
      const redirectResponse = NextResponse.redirect(`${origin}/${currentRegionSlug}${pathname}`);
      return setDebugHeaders(redirectResponse, { debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId });
    }

    if (currentRegionSlug !== 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath && regionInPath !== currentRegionSlug) {
        const newPath = pathname.replace(`/${regionInPath}`, `/${currentRegionSlug}`);
        const redirectResponse = NextResponse.redirect(`${origin}${newPath}`);
        return setDebugHeaders(redirectResponse, { debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId });
      }
    }

    if (currentRegionSlug === 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath) {
        const newPath = pathname.replace(`/${regionInPath}`, '') || '/';
        const redirectResponse = NextResponse.redirect(`${origin}${newPath}`);
        return setDebugHeaders(redirectResponse, { debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId });
      }
    }
  }

  // 🔄 Служебные страницы
  if (isNonRegional && hasRegionalPrefix) {
    const regionInPath = regionalSlugs.find(
      slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
    );
    if (regionInPath) {
      const newPath = pathname.replace(`/${regionInPath}`, '') || '/';
      const redirectResponse = NextResponse.redirect(`${origin}${newPath}`);
      return setDebugHeaders(redirectResponse, { debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId });
    }
  }

  return setDebugHeaders(response, { debug, pathname, currentRegionSlug, hasRegionalPrefix, isSeoRoute, isNonRegional, cityId });
}