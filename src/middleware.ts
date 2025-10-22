import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/"], // только главная
};

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Получаем куку
  const regionCookie = request.cookies.get("region-id");

  // Принудительный редирект на /spb если кука = id Питера
  const SPB_ID = "68590ba2d7197f4bb273d216"; // <-- подставь настоящий id из куки

  if (pathname === "/" && regionCookie?.value === SPB_ID) {
    return NextResponse.redirect(`${origin}/spb`);
  }

  return NextResponse.next();
}
