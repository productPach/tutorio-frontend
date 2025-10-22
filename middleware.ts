import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/"], // только главная
  runtime: 'edge', // ← явно указываем runtime
};

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const regionCookie = request.cookies.get("region-id");
  const SPB_ID = "68590ba2d7197f4bb273d216";

   console.log(">>> MIDDLEWARE TRIGGERED");

  // Создаем базовый response
  let response = NextResponse.next();
  
  // Добавляем заголовки для отладки
  response.headers.set("x-middleware-executed", "true");
  response.headers.set("x-debug-path", pathname);
  response.headers.set("x-debug-cookie", regionCookie?.value || "not-found");
  response.headers.set("x-should-redirect", (pathname === "/" && regionCookie?.value === SPB_ID).toString());

  // Проверяем условие редиректа
  if (pathname === "/" && regionCookie?.value === SPB_ID) {
    response.headers.set("x-actual-redirect", "true");
    return NextResponse.redirect(`${origin}/spb`);
  }

  // Возвращаем response с нашими заголовками
  return response;
}