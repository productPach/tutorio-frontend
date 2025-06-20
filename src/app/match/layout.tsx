"use client";
import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { SelectCityModal } from "@/components/SelectCity/SelectCityModal";
import { useAppSelector } from "@/store/store";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  return (
    <>
      <Head>
        <title>Tutorio — подбор репетитора</title>
        <meta
          name="description"
          content="Бесплатно подберём репетитора под ваш запрос и бюджет. Проверенные репетиторы."
        />
      </Head>
      <header>
        <div className={clsx(styles.header, styles.center)}>
          <SelectCityModal />
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

      <main
        className={!cookiesAccepted ? styles.main_with_cookies : styles.main}
      >
        {children}
      </main>

      {/* <footer className={clsx(styles.center)}>
        <p></p>
      </footer> */}
    </>
  );
};

export default Layout;
