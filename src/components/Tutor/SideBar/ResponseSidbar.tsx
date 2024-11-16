"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./ResponseSidbar.module.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { SpinnerSingleOrange } from "@/components/Spinner/SpinnerSingleOrange";

export const ResponseSidbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orderById, loading } = useSelector(
    (state: RootState) => state.orders
  );
  return (
    <>
      <div className={generalStyles.sidebar}>
        <div className={generalStyles.sidebar_filter}>
          <div>
            <p className={generalStyles.sidebar_title}>Место занятий</p>
            <span>
              Вы платите за предложение своих услуг ученику <br />
              <br />
              Больше комиссий нет, но не каждый отклик приводит к заказу
            </span>
            <div className={styles.button}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalBalanceBoost(true));
                  orderById?.responseCost &&
                    dispatch(
                      setValueModalBalanceBoost(orderById?.responseCost)
                    );
                }}
                type="button"
              >
                <span className={styles.textButton}>Откликнуться</span>
                <span className={styles.priceButton}>
                  {loading ? (
                    <div className={generalStyles.container__spinner}>
                      <div className={generalStyles.spinner}>
                        <SpinnerSingleOrange />
                      </div>
                    </div>
                  ) : orderById?.responseCost ? (
                    `${orderById?.responseCost} руб.`
                  ) : (
                    "Цена не доступна"
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
