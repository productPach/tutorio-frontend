"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../tutor/layout.module.css";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setLogout, setRegionUser, setToken } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  getCurrentTutor,
  getTutorIncompletePrices,
  getTutorSubjectsWithGoals,
  setSelectedValuesArea,
  setSelectedValuesCity,
  syncSubjectsWithGoalsState,
  updateTutor,
} from "@/store/features/tutorSlice";
import Image from "next/image";
import { getAllLocations } from "@/store/features/locationSlice";
import { usePathname } from "next/navigation"; // Правильный импорт для использования пути
import { getChatsByUserId } from "@/store/features/chatSlice";
import Link from "next/link";
import { getBackendUrl } from "@/api/server/configApi";
import { District, Metro, RegionalCity, Role } from "@/types/types";
import MenuMobile from "@/components/Tutor/MenuMobile/MenuMobile";
import BottomMenuMobile from "@/components/Tutor/BottomMenuMobile/BottomMenuMobile";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/api/server/auth";
import { WarningNotification } from "@/components/Tutor/WarningNotification/WarningNotification";
import { useTutorWarningsNotification } from "@/hooks/tutor/useTutorWarningsNotification";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isLoadedPage, setIsLoadedPage] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const token = useAppSelector((state) => state.auth.token);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  const chat = useAppSelector((state) => state.chat.chat);
  // Определяем активный пункт меню на основе pathname
  const isActive = (path: string) => pathname.startsWith(path);

  useEffect(() => {
    const initAuth = () => {
      const token = getAccessToken(); // берём из localStorage
      if (!token) {
        console.log("Токена нет");
        router.push("/"); // токена нет → редирект
        return;
      }

      try {
        const payload: any = jwtDecode(token); // Используйте any для отладки
        // console.log("Полный payload токена:", payload);
        // console.log("activeRole из токена:", payload.activeRole);
        // console.log("Все свойства токена:", Object.keys(payload));

        if (payload.activeRole !== "tutor") {
          console.log("Не та роль. Роль пользователя:", payload.activeRole);
          console.log("Ожидаемая роль: tutor");
          dispatch(setLogout());
          router.push("/");
          return;
        }

        dispatch(setToken(token));
        dispatch(getCurrentTutor())
          .unwrap()
          // Разворачиваем Promise для обработки отклонённого случая
          .catch(() => {
            console.log("Ошибка");
            // Если запрос завершился ошибкой (например, 500), разлогиниваем пользователя
            dispatch(setLogout());

            router.push("/");
          });

        setIsLoadedPage(true);
      } catch (error) {
        // Некорректный токен → разлогиниваем
        console.log("Некорректный токен");
        dispatch(setLogout());
        router.push("/");
      }
    };

    initAuth();
  }, [dispatch, router]);

  // Устанавилваем регион
  useEffect(() => {
    const regionUserJson = localStorage.getItem("region-user");
    const regionUser = regionUserJson ? JSON.parse(regionUserJson) : "";

    if (regionUser) {
      dispatch(setRegionUser(regionUser));
    } else {
      const userRegionObj = locations.find(
        (item) => item.title === tutor?.region
      );
      if (userRegionObj) {
        // Обновляем регион в объекте юзера
        const userRegion = {
          city: userRegionObj.title,
          area: userRegionObj.area,
        };
        console.log(userRegionObj);

        dispatch(setRegionUser(userRegion));
        localStorage.setItem("region-user", JSON.stringify(userRegion));
      }
    }
  }, [tutor, locations, dispatch]);

  // Устанавилваем локации города
  useEffect(() => {
    const initialTutorTripCity = tutor?.tutorTripCity || [];
    if (!locations.length || !initialTutorTripCity.length) return; // Если данных нет, не выполняем

    // Преобразуем ID в объекты District и Metro
    const transformedCityData = initialTutorTripCity.flatMap((id) => {
      return locations.flatMap((city) => {
        const selectedItems: (District | Metro)[] = []; // Типизируем массив как (District | Metro)

        // Ищем в districts для совпадения с id
        const district = city.districts.find((d) => d.id === id);
        if (district) {
          let displayType;
          // Если нашли district, добавляем его с типами District
          if (district.type === "District") {
            displayType = "округ";
          }
          if (district.type === "Area") displayType = "район";
          if (district.type === "Microarea") displayType = "микрорайон";

          selectedItems.push({
            id: district.id,
            title: district.title,
            displayType: displayType,
          } as District);
        }

        // Ищем метро напрямую у города
        const metro = city.metros.find((m) => m.id === id);
        if (metro) {
          selectedItems.push({
            id: metro.id,
            title: metro.title,
            displayType: "метро",
          } as Metro);
        }

        return selectedItems;
      });
    });

    // Отправляем преобразованные данные в редуктор
    dispatch(setSelectedValuesCity(transformedCityData));
  }, [locations, dispatch, tutor]);

  // Устанавилваем локации региона
  useEffect(() => {
    const initialtutorTripArea = tutor?.tutorTripArea || [];
    if (!locations.length || !initialtutorTripArea.length) return; // Если данных нет, не выполняем

    // Преобразуем ID в объекты RegionalCity
    const transformedAreaData = initialtutorTripArea.flatMap((areaId) => {
      return locations.flatMap((city) => {
        const selectedItems: RegionalCity[] = []; // Типизируем массив как RegionalCity

        // Ищем в regionalCities для совпадения с areaId
        const regionalCity = city.regionalCities.find(
          (region) => region.id === areaId
        );
        if (regionalCity) {
          // Если нашли RegionalCity, добавляем его
          selectedItems.push({
            id: regionalCity.id,
            title: regionalCity.title,
          });
        }

        return selectedItems; // Возвращаем массив с найденными RegionalCity
      });
    });

    // Отправляем преобразованные данные в редуктор
    dispatch(setSelectedValuesArea(transformedAreaData));
  }, [locations, dispatch, tutor]); // Зависимости для useEffect

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const lastOnlineTime = tutor?.lastOnline
      ? new Date(tutor.lastOnline).getTime()
      : null;

    const token = getTokenFromCookie();

    // Если lastOnline существует, проверяем, прошло ли больше 5 минут
    if (lastOnlineTime && currentTime - lastOnlineTime > 5 * 60 * 1000) {
      if (token && tutor) {
        // Отправляем данные на сервер, если прошло больше 5 минут
        dispatch(
          updateTutor({
            id: tutor.id,
            lastOnline: new Date(), // Обновляем дату последнего посещения
          })
        );
      }
    } else if (!lastOnlineTime) {
      // Если lastOnline нет, считаем, что это первый вход
      if (token && tutor) {
        dispatch(
          updateTutor({
            id: tutor.id,
            lastOnline: new Date(), // Устанавливаем время первого входа
          })
        );
      }
    } else {
      // Если lastOnline есть и прошло менее 5 минут, обновление не требуется
    }

    // Сохраняем текущее время в localStorage
    localStorage.setItem("lastOnline", new Date().toISOString());
  }, [pathname, dispatch, tutor]); // Используем pathname для отслеживания изменений

  // Получаем чаты репетитора
  useEffect(() => {
    tutor &&
      token &&
      dispatch(getChatsByUserId({ userId: tutor?.userId, role: "tutor" }));
  }, [tutor?.userId, token]);

  const avatarSrc = tutor?.avatarUrl
    ? `${getBackendUrl()}${tutor.avatarUrl}`
    : "/img/tutor/avatarBasic.png";

  const [showHeader, setShowHeader] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 768);
    };

    // Инициализация
    handleResize();

    // Подписка на изменение размера
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // По идее можно убрать
  useEffect(() => {
    if (tutor?.id) {
      dispatch(getTutorSubjectsWithGoals({ tutorId: tutor.id }));
      dispatch(getTutorIncompletePrices({ id: tutor.id }));
    }
  }, [dispatch, tutor?.id]);

  useEffect(() => {
    if (tutor?.id) {
      // Синхронизируем subjectsWithGoals при изменении tutor.subject
      dispatch(syncSubjectsWithGoalsState());
    }
  }, [tutor?.subject?.join(","), dispatch]);

  const warning = useTutorWarningsNotification();

  return (
    <>
      {!isLoadedPage ? (
        <div className={styles.container__spinner}>
          <div className={styles.spinner}>
            <Spinner />
          </div>
        </div>
      ) : (
        <>
          {((isActive("/tutor/responses") && !chat) ||
            (isActive("/tutor/responses") && chat && showHeader) ||
            !isActive("/tutor/responses")) && (
            <header>
              {warning && !isActive("/tutor/responses") && (
                <WarningNotification
                  message={warning.message}
                  href={warning.href}
                />
              )}
              <div className={clsx(styles.header, styles.center)}>
                <div className={styles.headerM}>
                  <MenuMobile />
                  <Link href="/tutor/orders">
                    <div className={styles.header__logo}>
                      tutorio
                      <span className={styles.header__underLogo}>
                        Онлайн-сервис подбора репетиторов
                      </span>
                    </div>
                  </Link>
                </div>
                <Link href="/tutor/orders" className={styles.header_menu}>
                  {tutor && (
                    <>
                      <div className={styles.titleWrap}>
                        <span className={styles.ellipsis}>{tutor.name}</span>
                      </div>

                      <Image
                        className={styles.header__menu_avatar}
                        src={avatarSrc}
                        alt={`${tutor?.name}`}
                        width={42}
                        height={42}
                        priority
                      />
                    </>
                  )}
                </Link>
              </div>
            </header>
          )}

          {tutor && <main className={styles.main}>{children}</main>}
          <footer className={clsx(styles.center)}>
            {/* Добавьте здесь другие элементы подвала */}
          </footer>
          <BottomMenuMobile />
        </>
      )}
    </>
  );
};

export default Layout;
