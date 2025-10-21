import styles from "./Header.module.css";
import { HeaderMenu } from "../HeaderMenu/HeaderMenu";
import { SelectCityModal } from "../SelectCity/SelectCityModal";
import clsx from "clsx";
import { RegionalLink } from "../RegionalLink/RegionalLink";

export const Header = () => {
  return (
    <header>
      <div className={clsx(styles.header, styles.center)}>
        <RegionalLink href="/">
          <div className={styles.header__logo}>
            tutorio
            <span className={styles.header__underLogo}>
              Онлайн-сервис подбора репетиторов
            </span>
            <span className={styles.header__underLogoMob}>
              Подбор репетиторов
            </span>
          </div>
        </RegionalLink>
        <SelectCityModal />
        <HeaderMenu />
      </div>
    </header>
  );
};
