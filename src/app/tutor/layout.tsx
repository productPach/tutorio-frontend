"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../tutor/layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setLogout, setToken } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";
import { getCurrentTutor, setTutorLogout } from "@/store/features/tutorSlice";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";
import { getAllLocations } from "@/store/features/locationSlice";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isLoadedPage, setIsLoadedPage] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  // Получаем токен из куки
  // Если токен в куки есть, тогда добавляем токен в Redux
  // Если токена в куках нет, тогда делаем редирект на главную
  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
      dispatch(getCurrentTutor(token));
    } else {
      router.push("/");
      return;
    }
    setIsLoadedPage(true);
  }, [dispatch, router]);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

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
          <header>
            <div className={clsx(styles.header, styles.center)}>
              <a href="#">
                <div className={styles.header__logo}>
                  tutorio
                  <span className={styles.header__underLogo}>
                    Онлайн-сервис подбора репетиторов
                  </span>
                </div>
              </a>
              <div className={styles.header__menu}>
                {tutor && (
                  <>
                    <span>{tutor.name}</span>
                    <Image
                      src={
                        tutor?.avatarUrl
                          ? `${host}${port}${tutor?.avatarUrl}`
                          : `/img/tutor/avatarBasic.png`
                      }
                      alt={`${tutor?.name}`}
                      width={42}
                      height={42}
                      priority
                    />
                  </>
                )}
              </div>
            </div>
          </header>
          {tutor && <main>{children}</main>}
          <footer className={clsx(styles.center)}>
            <p></p>
            {/* Добавьте здесь другие элементы подвала */}
          </footer>
        </>
      )}
    </>
  );
};

export default Layout;
