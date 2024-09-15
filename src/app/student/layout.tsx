"use client";
import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../student/layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setLogout, setToken } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isLoadedPage, setIsLoadedPage] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Функция выхода
  const logout = () => {
    dispatch(setLogout());
    router.push("/");
  };

  // Получаем токен из куки
  // Если токен в куки есть, тогда добавляем токен в Redux
  // Если токена в куках нет, тогда делаем редирект на главную
  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
    } else {
      router.push("/");
      return;
    }
    setIsLoadedPage(true);
  }, [dispatch, router]);

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
              <div className={styles.header__geo}>
                <Image
                  src="/img/icon/location.svg"
                  width={15}
                  height={18}
                  alt="Выбор города"
                  className={styles.header__geoImage}
                />
                Москва
              </div>
              <Link href="/">
                <div className={styles.header__logo}>
                  tutorio
                  <span className={styles.header__underLogo}>
                    Cервис подбора репетиторов
                  </span>
                </div>
              </Link>
            </div>
          </header>
          <button onClick={logout}>Выйти</button>
          <main>{children}</main>

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
