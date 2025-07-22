"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import { setIsModalHiddenOrder, setScrollY } from "@/store/features/modalSlice";
import { updateOrder } from "@/store/features/orderSlice";

export const HiddenOrderModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const orderById = useAppSelector((state) => state.orders.orderById);

  const handleOpenOrder = async () => {
    try {
      if (!orderById || !token) return;

      await dispatch(
        updateOrder({
          id: orderById?.id,
          token,
          status: "Active",
        })
      ).unwrap();
    } catch (err) {
      console.error("Ошибка при обновлении заказа:", err);
    } finally {
      dispatch(setIsModalHiddenOrder(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description2}>
        Мы скрыли ваш заказ от новых откликов, чтобы вы могли сосредоточиться на
        общении с выбранным специалистом.
        <br />
        <br />
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonYlw}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalHiddenOrder(false));
            dispatch(setScrollY(0));
          }}
          type="button"
        >
          Хорошо
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={handleOpenOrder}
          type="button"
        >
          Нужны ещё отклики
        </button>
      </div>
    </>
  );
};
