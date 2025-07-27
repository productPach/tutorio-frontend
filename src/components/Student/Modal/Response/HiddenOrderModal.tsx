"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalHiddenOrder,
  setIsSheetHiddenOrder,
  setScrollY,
} from "@/store/features/modalSlice";
import { updateOrder } from "@/store/features/orderSlice";
import { useState } from "react";
import { Spinner } from "@/components/Spinner/Spinner";
import clsx from "clsx";

export const HiddenOrderModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const orderById = useAppSelector((state) => state.orders.orderById);
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenOrder = async () => {
    try {
      if (!orderById || !token) return;
      setIsLoading(true);
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
      setIsLoading(false);
      dispatch(setIsModalHiddenOrder(false));
      dispatch(setIsSheetHiddenOrder(false));
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
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalHiddenOrder(false));
            dispatch(setIsSheetHiddenOrder(false));
            dispatch(setScrollY(0));
          }}
          type="button"
        >
          Хорошо
        </button>
        <button
          disabled={isLoading}
          className={clsx(buttonStyles.buttonYlw, buttonStyles.pdng36)}
          onClick={handleOpenOrder}
          type="button"
        >
          Нужны ещё отклики
          {isLoading && (
            <div className={styles.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
