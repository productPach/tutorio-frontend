import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import Link from "next/link";
import { SelectCityModal } from "@/components/SelectCity/SelectCityModal";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  return (
    <>
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

      <main>{children}</main>

      <footer className={clsx(styles.center)}>
        <p></p>
        {/* Добавьте здесь другие элементы подвала */}
      </footer>
    </>
  );
};

export default Layout;
