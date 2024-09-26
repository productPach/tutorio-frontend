"use client";
import React, { ReactNode, useState } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { SelectCityModal } from "@/components/SelectCity/SelectCityModal";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
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
          <SelectCityModal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
          />
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

      <main>{children}</main>

      <footer className={clsx(styles.center)}>
        <p></p>
        {/* Добавьте здесь другие элементы подвала */}
      </footer>
    </>
  );
};

export default Layout;
