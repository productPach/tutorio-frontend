import { fetchDetectUserRegion, fetchGetCityById, fetchGetCityBySlug } from "@/api/server/locationApi";
import { setRegionUser } from "@/store/features/authSlice";
import { setIsRegionTooltip } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { City, UserRegion } from "@/types/types";
import { getCookie, setCookie } from "@/utils/cookies/cookies";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage/localStorage";
import { handleRegionRedirect } from "@/utils/region/regionRedirectUtils";
import { getRegionFromUrl } from "@/utils/region/urlParser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useDetectRegion() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [city, setCity] = useState<City>();
  const [cityAtSlug, setCityAtSlug] = useState<City>();
  const isRegionTooltip = useAppSelector((state) => state.modal.isRegionTooltip);

  // Определяем текущий slug региона из URL
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
//   const parts = pathname.split("/").filter(Boolean);
//   const cities = ['msk', 'spb', 'ekb', 'kazan', 'kaliningrad'];
//   const currentSlug = parts.length > 0 && cities.includes(parts[0]) ? parts[0] : "msk";
//   const isCitySlug = parts.length === 0 || (parts.length > 0 && cities.includes(parts[0]));

// В компоненте:
const { slug: currentSlug, isRegional: isCitySlug } = getRegionFromUrl(pathname);

// console.log('🔍 URL Analysis:');
// console.log('pathname:', pathname);
// console.log('currentSlug:', currentSlug);
// console.log('isCitySlug:', isCitySlug);
  
  
  
  useEffect(() => {
    const cookieRegion = getCookie("region-id");
    const regionFromLS = getLocalStorage("region-user");

    // ✅ Случай: есть кука и есть localStorage → восстанавливаем Redux
    if (cookieRegion && regionFromLS) {
        try {
            const userRegion: UserRegion = JSON.parse(regionFromLS);
            // console.log("📦 Восстанавливаем регион из localStorage:", userRegion);
            dispatch(setRegionUser(userRegion));
            return;
        } catch (err) {
            console.warn("Ошибка парсинга localStorage region-user", err);
        }
    }

    // ✅ Выполняем код только если это slug города
    if (!isCitySlug) {
        console.log("Текущий URL не содержит слаг города, пропускаем определение региона. Подставляем в редакс данные региона из LS");
        if (regionFromLS) {
            const userRegion: UserRegion = JSON.parse(regionFromLS);
            dispatch(setRegionUser(userRegion));
        }
        return;
    }

     console.log("куки нет, дергаем запрос");
    // console.log("Текущий слаг города = " + currentSlug);
    
    fetchDetectUserRegion(currentSlug)
        .then((res) => {
            const detectedCity = res.city;
            setCity(detectedCity);
            const askUserConfirmation = res.askUserConfirmation;

            if (askUserConfirmation) {
                // Обновляем регион на основе currentSlug
                updateRegionFromSlug(currentSlug);
                dispatch(setIsRegionTooltip(true));
            } else {
                saveRegion(detectedCity);
            }
        })
        .catch(console.error);
  }, [dispatch, currentSlug, isCitySlug]); // ✅ Добавляем isCitySlug в зависимости

  /**
   * Обновляет регион на основе slug из URL (только для городов)
   */
  const updateRegionFromSlug = async (slug: string) => {
    // ✅ Дополнительная проверка на случай вызова извне
    // if (!cities.includes(slug)) {
    //     // console.log("❌ Slug не является городом, пропускаем обновление:", slug);
    //     return;
    // }

    try {
        const res = await fetchGetCityBySlug(slug);

        setCityAtSlug(res);

        const currentCity: UserRegion = {
            city: res.title,
            area: res.area,
            slug: res.slug,
        };
        setLocalStorage("region-user", JSON.stringify(currentCity));
        dispatch(setRegionUser(currentCity));
        console.log("✅ Регион обновлен по slug:", currentCity);
    } catch (error) {
        console.error("Error updating region from slug:", error);
    }
  };

  /**
   * Сохраняем регион в куку, Redux, localStorage и state
   */
  const saveRegion = (city: City) => {
    const userRegion: UserRegion = {
        city: city.title,
        area: city.area || "",
        slug: city.slug,
    };  

    console.log("Сохраняем город:", userRegion);
    
    setCookie("region-id", city.id, 365);
    setLocalStorage("region-user", JSON.stringify(userRegion));
    dispatch(setRegionUser(userRegion));
    dispatch(setIsRegionTooltip(false));
  };

  /**
   * Пользователь подтвердил регион через попап ("Да")
   */
  const confirmRegion = (currentCity: City) => {
    if (!currentCity) return;
    saveRegion(currentCity);
    // ДЕЛАЕМ РЕДИРЕКТ ЧЕРЕЗ NEXT.JS ROUTER
    //handleRegionRedirect(city, router);
  };

  /**
   * Пользователь отклонил регион через попап ("Нет")
   */
  const rejectRegion = (currentCity: City) => {
    if (!currentCity) return;
    saveRegion(currentCity);
  };

  return { city, cityAtSlug, isRegionTooltip, saveRegion, confirmRegion, rejectRegion, currentSlug, isCitySlug };
}