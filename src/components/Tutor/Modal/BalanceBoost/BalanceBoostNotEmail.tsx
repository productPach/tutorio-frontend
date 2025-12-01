"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../BalanceBoost/BalanceBoost.module.css";
import {
  setIsModalBalanceBoostNotEmail,
  setIsSheetBalanceBoostNotEmail,
} from "@/store/features/modalSlice";
import { useRouter } from "next/navigation";

export const BalanceBoostNotEmail = () => {
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor); // Получаем tutor из Redux
  const router = useRouter();

  const handleCloseModal = () => {
    if (window.innerWidth < 769) {
      dispatch(setIsSheetBalanceBoostNotEmail(false));
    } else {
      dispatch(setIsModalBalanceBoostNotEmail(false));
    }
    router.push("/tutor/settings");
  };

  return (
    <>
      {/* <div className={styles.description}>Детали платежа</div> */}
      {/* <div>
        Вернем деньги за отклик, если ученик не посмотрит его в течение 5 дней
      </div> */}
      <div className={styles.containerPaymentDetails}>
        <div>
          <div>
            {/* Перед пополнением баланса необходимо подтвердить ваш e-mail. Без
            подтвержденной почты не сможем отправить вам чек :( */}
            Пожалуйста, подтвердите вашу электронную почту в настройках профиля.
            <br></br>
            <br></br>
            Без этого мы не сможем выслать вам фискальный чек после пополнения
            баланса.
          </div>
        </div>
      </div>

      <div className={styles.button}>
        <button
          className={styles.buttonBlc}
          onClick={handleCloseModal}
          type="button"
        >
          Перейти в настройки
        </button>
      </div>
    </>
  );
};
