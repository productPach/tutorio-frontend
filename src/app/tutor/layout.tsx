"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../tutor/layout.module.css";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setLogout, setToken } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";
import { getCurrentTutor, updateTutor } from "@/store/features/tutorSlice";
import Image from "next/image";
import { getAllLocations } from "@/store/features/locationSlice";
import { usePathname } from "next/navigation"; // Правильный импорт для использования пути
import { getChatsByUserId } from "@/store/features/chatSlice";
import Link from "next/link";
import { getBackendUrl } from "@/api/server/configApi";

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

  // Получаем токен из куки
  // Если токен в куки есть, тогда добавляем токен в Redux
  // Если токена в куках нет, тогда делаем редирект на главную
  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
      dispatch(getCurrentTutor(token))
        .unwrap() // Разворачиваем Promise для обработки отклонённого случая
        .catch(() => {
          // Если запрос завершился ошибкой (например, 500), разлогиниваем пользователя
          dispatch(setLogout());
          router.push("/");
        });
    } else {
      router.push("/");
      return;
    }
    setIsLoadedPage(true);
  }, [dispatch, router]);

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
            token,
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
            token,
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
      dispatch(
        getChatsByUserId({ userId: tutor?.userId, role: "tutor", token: token })
      );
  }, [tutor?.userId, token]);

  const avatarSrc = tutor?.avatarUrl
    ? `${getBackendUrl()}${tutor.avatarUrl}`
    : "/img/tutor/avatarBasic.png";

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
          <header>
            <div className={clsx(styles.header, styles.center)}>
              <Link href="/tutor/orders">
                <div className={styles.header__logo}>
                  tutorio
                  <span className={styles.header__underLogo}>
                    Онлайн-сервис подбора репетиторов
                  </span>
                </div>
              </Link>
              <Link href="/tutor/orders">
                <div className={styles.header__menu}>
                  {tutor && (
                    <>
                      <span>{tutor.name}</span>
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
                </div>
              </Link>
            </div>
          </header>
          {tutor && <main>{children}</main>}
          <footer className={clsx(styles.center)}>
            {/* Добавьте здесь другие элементы подвала */}
          </footer>
        </>
      )}
    </>
  );
};

export default Layout;
