import { baseUrl } from '@/api/server/configApi';
import { validSlug } from '@/utils/region/validSlug';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Пути которые ДОЛЖНЫ иметь региональные префиксы (SEO)
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

// Пути которые НЕ должны иметь префиксы (служебные)
const nonRegionalRoutes = [
  '/sign-in-student', 
  '/student',
  '/tutor',
  '/admin',
  '/dashboard',
  '/settings',
  '/payment',
  '/api'
];

// Региональные slug (кроме Москвы)
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
    '/:region(spb|ekb|novosibirsk|kazan|nn|chelyabinsk)/:path*'
  ],
};

async function getRegionFromApi() {
  try {
    const res = await fetch(`${baseUrl}/api/detectUserRegion?set_cookie=true`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.slug || 'msk';
  } catch {
    return 'msk';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  console.log('🔧 Middleware triggered:', pathname);

  let currentRegionSlug = 'msk'; // Москва по умолчанию
  const regionCookie = request.cookies.get('region-id');

  if (regionCookie?.value) {
    try {
      const res = await fetch(`${baseUrl}/api/cities/${regionCookie.value}`);
      if (res.ok) {
        const cityData = await res.json();
        currentRegionSlug = cityData.slug || 'msk';
      }
    } catch (err) {
      console.error('Ошибка получения региона из куки:', err);
    }
  } else {
    // Если куки нет — определяем регион через бэкенд
    currentRegionSlug = await getRegionFromApi();
    console.log('📍 Определили регион через API:', currentRegionSlug);
  }

  const hasRegionalPrefix = regionalSlugs.some(
    slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  );
  const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route));
  const isNonRegional = nonRegionalRoutes.some(route => pathname.startsWith(route));

  // 🔄 Главная
  if (pathname === '/') {
    if (currentRegionSlug !== 'msk') {
      return NextResponse.redirect(`${origin}/${currentRegionSlug}`);
    }
    return NextResponse.next();
  }

  // 🔄 SEO-страницы
  if (isSeoRoute) {
    if (currentRegionSlug !== 'msk' && !hasRegionalPrefix) {
      return NextResponse.redirect(`${origin}/${currentRegionSlug}${pathname}`);
    }

    if (currentRegionSlug !== 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath && regionInPath !== currentRegionSlug) {
        const newPath = pathname.replace(`/${regionInPath}`, `/${currentRegionSlug}`);
        return NextResponse.redirect(`${origin}${newPath}`);
      }
    }

    if (currentRegionSlug === 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(
        slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
      );
      if (regionInPath) {
        const newPath = pathname.replace(`/${regionInPath}`, '') || '/';
        return NextResponse.redirect(`${origin}${newPath}`);
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
      return NextResponse.redirect(`${origin}${newPath}`);
    }
  }

  return NextResponse.next();
}
