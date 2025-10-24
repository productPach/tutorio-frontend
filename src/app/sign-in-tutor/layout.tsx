"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import Link from "next/link";
import { SelectCityModal } from "@/components/SelectCity/SelectCityModal";
import { useAppSelector } from "@/store/store";
import { RegionalLink } from "@/components/RegionalLink/RegionalLink";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  // Для решения проблемы гидрации
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  return (
    <>
      <header>
        <div className={clsx(styles.header, styles.center)}>
          <SelectCityModal />
          {isClient && (
            <RegionalLink href="/">
              <div className={styles.header__logo}>
                tutorio
                <span className={styles.header__underLogo}>
                  Cервис подбора репетиторов
                </span>
              </div>
            </RegionalLink>
          )}
        </div>
      </header>

      <main
        className={!cookiesAccepted ? styles.main_with_cookies : styles.main}
      >
        {children}
      </main>

      <footer className={clsx(styles.center)}>
        <p></p>
        {/* Добавьте здесь другие элементы подвала */}
      </footer>
    </>
  );
};

export default Layout;
