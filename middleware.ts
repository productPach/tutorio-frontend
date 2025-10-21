import { baseUrl } from '@/api/server/configApi';
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
  '/docs'
];

// ✅ Пути которые НЕ должны иметь префиксы (служебные)
const nonRegionalRoutes = [
  '/sign-in-tutor',
  '/sign-in-student', 
  '/student',
  '/tutor',
  '/admin',
  '/dashboard',
  '/settings',
  '/payment',
  '/api'
];

export const config = {
  matcher: [
    // ✅ Все SEO-маршруты
    '/tutors/:path*',
    '/subjects/:path*', 
    '/about/:path*',
    '/reviews/:path*',
    '/pricing/:path*',
    '/blog/:path*',
    '/docs/:path*',
    
    // ✅ Все служебные маршруты
    '/sign-in-tutor/:path*',
    '/sign-in-student/:path*', 
    '/student/:path*',
    '/tutor/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/payment/:path*',
    
    // ✅ Региональные префиксы
    '/:region(spb|ekb|novosibirsk|kazan|nn|chelyabinsk)/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('🔧 MIDDLEWARE TRIGGERED for:', request.nextUrl.pathname);

  
  // ✅ Получаем текущий регион из куки
  const regionCookie = request.cookies.get('region-id');
  let currentRegionSlug = 'msk'; // По умолчанию Москва
  
  if (regionCookie?.value) {
    try {
      const response = await fetch(
        `${baseUrl}/api/cities/${regionCookie.value}`
      );
      if (response.ok) {
        const cityData = await response.json();
        currentRegionSlug = cityData.slug || 'msk';
      }
    } catch (error) {
      console.error('Ошибка получения slug:', error);
    }
  }
  
  // ✅ Получаем все slugs КРОМЕ Москвы (только региональные)
  const regionalSlugs = ['spb', 'ekb', 'novosibirsk', 'kazan', 'nn', 'chelyabinsk'];
  const hasRegionalPrefix = regionalSlugs.some(slug => 
    pathname.startsWith(`/${slug}/`) || pathname === `/${slug}`
  );
  
  // ✅ Проверяем относится ли путь к SEO-маршрутам
  const isSeoRoute = seoRoutes.some(route => pathname.startsWith(route));
  const isNonRegional = nonRegionalRoutes.some(route => pathname.startsWith(route));
  
  // 🔄 ЛОГИКА ДЛЯ SEO-МАРШРУТОВ
  if (isSeoRoute) {
    // ✅ Если регион НЕ Москва и путь еще не имеет регионального префикса - добавляем
    if (currentRegionSlug !== 'msk' && !hasRegionalPrefix) {
      const newUrl = new URL(`/${currentRegionSlug}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }
    
    // ✅ Если регион Москва, но URL имеет региональный префикс - убираем
    if (currentRegionSlug === 'msk' && hasRegionalPrefix) {
      const regionInPath = regionalSlugs.find(slug => 
        pathname.startsWith(`/${slug}/`) || pathname === `/${slug}`
      );
      if (regionInPath) {
        const newPathname = pathname.replace(`/${regionInPath}`, '') || '/';
        const newUrl = new URL(newPathname, request.url);
        return NextResponse.redirect(newUrl);
      }
    }
  }
  
  // 🔄 ЛОГИКА ДЛЯ СЛУЖЕБНЫХ МАРШРУТОВ
  if (isNonRegional && hasRegionalPrefix) {
    // ✅ Убираем региональный префикс со служебных маршрутов
    const regionInPath = regionalSlugs.find(slug => 
      pathname.startsWith(`/${slug}/`) || pathname === `/${slug}`
    );
    if (regionInPath) {
      const newPathname = pathname.replace(`/${regionInPath}`, '') || '/';
      const newUrl = new URL(newPathname, request.url);
      return NextResponse.redirect(newUrl);
    }
  }
  
  return NextResponse.next();
}