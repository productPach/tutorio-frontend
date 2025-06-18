import styles from "./Header.module.css";
import { HeaderMenu } from "../HeaderMenu/HeaderMenu";
import { SelectCityModal } from "../SelectCity/SelectCityModal";
import clsx from "clsx";

export const Header = () => {
  return (
    <header>
      <div className={clsx(styles.header, styles.center)}>
        <a href="#">
          <div className={styles.header__logo}>
            tutorio
            <span className={styles.header__underLogo}>
              Онлайн-сервис подбора репетиторов
            </span>
            <span className={styles.header__underLogoMob}>
              Подбор репетиторов
            </span>
          </div>
        </a>
        <SelectCityModal />
        <HeaderMenu />
      </div>
    </header>
  );
};
