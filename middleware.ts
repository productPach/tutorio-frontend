import { baseUrl } from '@/api/server/configApi';
import { validSlug } from '@/utils/region/validSlug';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ Пути которые ДОЛЖНЫ иметь региональные префиксы (для SEO)
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

// ✅ Пути которые НЕ должны иметь префиксы (служебные)
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

// ✅ Региональные slug (кроме Москвы)
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('🔧 MIDDLEWARE TRIGGERED for:', pathname);

  // ✅ Получаем текущий регион из куки
  const regionCookie = request.cookies.get('region-id');
  let currentRegionSlug = 'msk'; // Москва по умолчанию

  if (regionCookie?.value) {
    try {
      const res = await fetch(`${baseUrl}/api/cities/${regionCookie.value}`);
      if (res.ok) {
        const cityData = await res.json();
        currentRegionSlug = cityData.slug || 'msk';
        console.log('📍 Текущий регион из куки:', currentRegionSlug);
      }
    } catch (err) {
      console.error('Ошибка получения slug:', err);
    }
  }

  const hasRegionalPrefix = regionalSlugs.some(slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`));
  const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route));
  const isNonRegional = nonRegionalRoutes.some(route => pathname.startsWith(route));

  // 🔄 Главная страница
  if (pathname === '/') {
    if (currentRegionSlug !== 'msk') {
      console.log('🔄 Главная: редирект на региональную главную', `/${currentRegionSlug}`);
      return NextResponse.redirect(new URL(`/${currentRegionSlug}`, request.url));
    }
    console.log('🏠 Главная: Москва, остаёмся на /');
    return NextResponse.next();
  }

  // 🔄 SEO-маршруты
  if (isSeoRoute) {
    // ❗ Если регион НЕ Москва и нет префикса → добавляем
    if (currentRegionSlug !== 'msk' && !hasRegionalPrefix) {
      console.log('🔄 SEO: Добавляем региональный префикс', currentRegionSlug, 'к', pathname);
      return NextResponse.redirect(new URL(`/${currentRegionSlug}${pathname}`, request.url));
    }

    // ❗ Если регион НЕ Москва и URL имеет другой региональный префикс → исправляем на правильный
    if (currentRegionSlug !== 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`));
      if (regionInPath && regionInPath !== currentRegionSlug) {
        const newPath = pathname.replace(`/${regionInPath}`, `/${currentRegionSlug}`);
        console.log('🔄 SEO: Меняем префикс', regionInPath, '→', currentRegionSlug, 'для', pathname);
        return NextResponse.redirect(new URL(newPath, request.url));
      }
    }

    // ❗ Если регион Москва и есть префикс → убираем
    if (currentRegionSlug === 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`));
      if (regionInPath) {
        const newPath = pathname.replace(`/${regionInPath}`, '') || '/';
        console.log('🔄 SEO: Убираем префикс', regionInPath, 'с', pathname, '→', newPath);
        return NextResponse.redirect(new URL(newPath, request.url));
      }
    }
  }

  // 🔄 Служебные маршруты
  if (isNonRegional && hasRegionalPrefix) {
    const regionInPath = regionalSlugs.find(slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`));
    if (regionInPath) {
      const newPath = pathname.replace(`/${regionInPath}`, '') || '/';
      console.log('🔄 Служебные: Убираем префикс', regionInPath, 'с', pathname, '→', newPath);
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }

  console.log('➡️ Middleware пропускает запрос');
  return NextResponse.next();
}
