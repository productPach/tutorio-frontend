import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Wallet.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const Wallet = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  return (
    <>
      <div className={styles.content_block}>
        <h3>Баланс</h3>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}></div>
      </div>
    </>
  );
};
