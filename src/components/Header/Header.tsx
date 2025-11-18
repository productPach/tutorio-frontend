"use client";
import styles from "./Header.module.css";
import { HeaderMenu } from "../HeaderMenu/HeaderMenu";
import { SelectCityModal } from "../SelectCity/SelectCityModal";
import clsx from "clsx";
import { RegionalLink } from "../RegionalLink/RegionalLink";
import { useDetectRegion } from "@/hooks/detectRegion/useDetectRegion";
import {
  setIsSheetSelectCity,
  setModalSelectCity,
} from "@/store/features/modalSlice";
import { useAppDispatch } from "@/store/store";

interface HeaderProps {
  city?: string; // передаём из страницы SSR
}

export const Header = ({ city }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { cityAtSlug, isRegionTooltip, confirmRegion } = useDetectRegion();
  return (
    <header>
      <div className={clsx(styles.header, styles.center)}>
        <RegionalLink href="/" citySlug={city}>
          <div className={styles.header__logo}>
            tutorio
            <span className={styles.header__underLogo}>
              Платформа подбора репетиторов
            </span>
            <span className={styles.header__underLogoMob}>
              Подбор репетиторов
            </span>
          </div>
        </RegionalLink>

        <SelectCityModal />
        <HeaderMenu />
      </div>
      {isRegionTooltip && cityAtSlug && (
        <div className={styles.regionTooltip}>
          <div className={styles.regionTooltip__content}>
            <p className={styles.regionTooltip__text}>
              Ваш регион {cityAtSlug.shortTitle}?
            </p>
            <div className={styles.regionTooltip__buttons}>
              <button
                onClick={() => confirmRegion(cityAtSlug)}
                className={styles.regionTooltip__buttonConfirm}
              >
                Да
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth < 769) {
                    dispatch(setIsSheetSelectCity(true)); // Открываем шторку
                  } else {
                    dispatch(setModalSelectCity(true));
                  }
                }}
                className={styles.regionTooltip__buttonReject}
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
