"use client";
import styles from "../../app/sign-in-student/layout.module.css";
import Link from "next/link";
import { SelectCityModal } from "../SelectCity/SelectCityModal";
import clsx from "clsx";

export const HeaderSignInStudent = () => {
  return (
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
  );
};
