"use client";
import styles from "../../app/sign-in-student/layout.module.css";
import Link from "next/link";
import { SelectCityModal } from "../SelectCity/SelectCityModal";
import clsx from "clsx";
import { RegionalLink } from "../RegionalLink/RegionalLink";
import { useEffect, useState } from "react";

export const HeaderSignInStudent = () => {
  // Для решения проблемы гидрации
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
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
  );
};
