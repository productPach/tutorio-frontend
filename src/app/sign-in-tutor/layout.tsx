import Image from 'next/image';
import React, { ReactNode } from 'react';
import styles from "./layout.module.css";
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';

type LayoutComponent = {
  children: ReactNode
}

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Tutorio — вход для репетиторов</title>
        <meta name="description" content="Бесплатно подберём репетитора под ваш запрос и бюджет. Проверенные репетиторы." />
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
      
      <main>{children}</main>
      
      <footer className={clsx(styles.center)}>
        <p></p>
        {/* Добавьте здесь другие элементы подвала */}
      </footer>
    </>
  );
};

export default Layout;