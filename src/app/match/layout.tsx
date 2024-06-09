import Image from 'next/image';
import React, { ReactNode } from 'react';
import styles from "./layout.module.css";
import clsx from 'clsx';

type LayoutComponent = {
  children: ReactNode
}

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  return (
    <div>
      <header>
        <div className={clsx(styles.header, styles.center)}>
        <div className={styles.header__geo}>
            <Image
              src="../img/icon/location.svg"
              width={15}
              height={18}
              alt="Выбор города"
              className={styles.header__geoImage}
            />
            Москва
          </div>
          <a href="#">
            <div className={styles.header__logo}>
              tutorio
              <span className={styles.header__underLogo}>
                Cервис подбора репетиторов
              </span>
            </div>
          </a>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className={clsx(styles.center)}>
        <p></p>
        {/* Добавьте здесь другие элементы подвала */}
      </footer>
    </div>
  );
};

export default Layout;