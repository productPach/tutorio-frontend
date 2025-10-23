import { City } from "@/types/types";
import { validSlug } from "@/utils/region/validSlug";

// Пути, которые НЕ должны редиректиться с регионами
const EXCLUDED_PATHS = [
  "sign-in-student",
  "sign-in-tutor",
  "match",
  // добавьте другие пути которые не должны иметь региональные префиксы
];

// Пути, которые ДОЛЖНЫ редиректиться с регионами
const ALLOWED_PATHS = [
  "", // главная
  "tutors",
  "subjects",
  "categories",
  "blog",
  "about",
  "contacts",
  "docs",
  // добавьте другие пути которые поддерживают регионы
];

// ✅ 6. ДЕЛАЕМ РЕДИРЕКТ ЧЕРЕЗ NEXT.JS ROUTER
const getTargetPath = (currentPath: string, newSlug: string) => {
  // Разбиваем путь на части
  const pathParts = currentPath.split("/").filter((part) => part !== "");

  // Определяем базовый путь (первая часть после slug'а региона)
  const currentSlug =
    pathParts[0] && validSlug.includes(pathParts[0]) ? pathParts[0] : null;
  const basePath = currentSlug ? pathParts[1] || "" : pathParts[0] || "";

  // Проверяем, нужно ли делать редирект для этого пути
  const shouldRedirect = () => {
    // Если это исключенный путь - НЕ редиректим
    if (EXCLUDED_PATHS.some((excluded) => basePath.startsWith(excluded))) {
      return false;
    }

    // Если это разрешенный путь или главная - редиректим
    if (ALLOWED_PATHS.includes(basePath) || basePath === "") {
      return true;
    }

    // По умолчанию - НЕ редиректим (безопаснее)
    return false;
  };

  if (!shouldRedirect()) {
    console.log("🚫 Не делаем редирект - путь исключен из редиректов");
    return null;
  }

  // Формируем новый путь
  if (newSlug === "msk") {
    // Для Москвы убираем slug из пути
    if (currentPath === "/" || (pathParts.length === 1 && currentSlug)) {
      return "/"; // Главная или региональная главная → главная
    } else {
      // Внутренняя страница → убираем регион
      const restPath = currentSlug ? pathParts.slice(1) : pathParts;
      return `/${restPath.join("/")}`;
    }
  } else {
    // Для других регионов
    if (currentPath === "/" || pathParts.length === 0) {
      // Главная → региональная главная
      return `/${newSlug}`;
    } else if (pathParts.length === 1 && currentSlug) {
      // Региональная главная → другая региональная главная
      return `/${newSlug}`;
    } else {
      // Внутренняя страница → заменяем/добавляем регион
      const restPath = currentSlug ? pathParts.slice(1) : pathParts;
      return `/${newSlug}/${restPath.join("/")}`;
    }
  }
};

// Главная функция для выполнения редиректа региона
export const handleRegionRedirect = (
  selectCity: City,
  router: any
) => {
  if (selectCity.slug) {
    const currentPath = window.location.pathname;
    const targetPath = getTargetPath(currentPath, selectCity.slug);

    if (targetPath) {
      console.log(`🔄 Редирект с ${currentPath} на: ${targetPath}`);
      router.push(targetPath);
    } else {
      console.log("🚫 Редирект не требуется");
    }
  }
};