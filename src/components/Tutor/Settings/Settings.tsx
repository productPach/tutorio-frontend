import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Settings.module.css";

export const Settings = () => {
  return (
    <>
      <div className={styles.content_block}>
        <h3>Настройки</h3>
        <div className={componentStyle.containerThemesList}></div>
      </div>
    </>
  );
};
