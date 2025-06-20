"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "../tutor/layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setToken } from "@/store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";
import { getCurrentTutor } from "@/store/features/tutorSlice";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";
import { getAllLocations } from "@/store/features/locationSlice";
import {
  getCurrentStudent,
  updateStudent,
} from "@/store/features/studentSlice";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isLoadedPage, setIsLoadedPage] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname(); // Получаем текущий путь
  const student = useAppSelector((state) => state.student.student);
  // Получаем стейт храниения компонента для отображения
  const component = useAppSelector((state) => state.orders.componentMenu);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
      dispatch(getCurrentStudent(token));
    } else {
      router.push("/");
      return;
    }
    setIsLoadedPage(true);
  }, [dispatch, router]);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  const { socket } = useSocket();

  useEffect(() => {
    const currentTime = new Date().getTime();
    const lastOnlineTime = student?.lastOnline
      ? new Date(student.lastOnline).getTime()
      : null;

    const token = getTokenFromCookie();

    // Если lastOnline существует, проверяем, прошло ли больше 5 минут
    if (lastOnlineTime && currentTime - lastOnlineTime > 5 * 60 * 1000) {
      if (token && student) {
        // Отправляем данные на сервер, если прошло больше 5 минут
        dispatch(
          updateStudent({
            id: student.id,
            token,
            status: student.status,
            lastOnline: new Date(), // Обновляем дату последнего посещения
          })
        );
      }
    } else if (!lastOnlineTime) {
      // Если lastOnline нет, считаем, что это первый вход
      if (token && student) {
        dispatch(
          updateStudent({
            id: student.id,
            token,
            status: student.status,
            lastOnline: new Date(), // Устанавливаем время первого входа
          })
        );
      }
    } else {
      // Если lastOnline есть и прошло менее 5 минут, обновление не требуется
    }

    // Сохраняем текущее время в localStorage
    localStorage.setItem("lastOnline", new Date().toISOString());
  }, [pathname, dispatch, student]); // Используем pathname для отслеживания изменений

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
          <Head>
            <title>Tutorio — вход для репетиторов</title>
            <meta
              name="description"
              content="Бесплатно подберём репетитора под ваш запрос и бюджет. Проверенные репетиторы."
            />
          </Head>
          <header className={[5, 6].includes(component) ? styles.dsplNone : ""}>
            <div className={clsx(styles.header, styles.center)}>
              <Link href="/student/orders">
                <div className={styles.header__logo}>
                  tutorio
                  <span className={styles.header__underLogo}>
                    Онлайн-сервис подбора репетиторов
                  </span>
                </div>
              </Link>
              <div className={styles.header__menu}>
                {student && (
                  <>
                    <span className={styles.name}>{student.name}</span>
                    <Image
                      className={styles.header__menu_avatar}
                      src={
                        student?.avatarUrl
                          ? `${student?.avatarUrl}`
                          : `/img/icon/student/avatar/animal7.svg`
                      }
                      alt={`${student?.name}`}
                      width={42}
                      height={42}
                      priority
                    />
                  </>
                )}
              </div>
            </div>
          </header>
          {student && (
            <main
              className={clsx(
                styles.main,
                [5, 6].includes(component) ? styles.mainChtM : ""
              )}
            >
              {children}
            </main>
          )}
          <footer className={clsx(styles.center)}>
            <p></p>
          </footer>
        </>
      )}
    </>
  );
};

export default Layout;
