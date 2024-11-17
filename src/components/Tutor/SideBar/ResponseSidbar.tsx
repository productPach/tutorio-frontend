"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./ResponseSidbar.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import {
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { SpinnerSingleOrange } from "@/components/Spinner/SpinnerSingleOrange";

export const ResponseSidbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля sidebarResponse
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );
  const [isSafari, setIsSafari] = useState(false);

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  const { orderById, loading } = useSelector(
    (state: RootState) => state.orders
  );

  return (
    <>
      {!loading && (
        <div
          className={generalStyles.sidebarResponse}
          style={
            isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }
          }
        >
          {orderById?.autoContactsOnResponse ? (
            /* Отклик на заказ с получением контактов */
            <div className={generalStyles.sidebar_filter}>
              <div>
                <h3>Отклик на заказ</h3>
                <span>
                  После отклика вы получите контакты ученика и сможете с ним
                  связаться <br />
                  <br />
                  Больше комиссий не будет, но не каждый отклик приводит к
                  заказу
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
                    <span className={styles.textButton}>Получить контакты</span>
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
          ) : (
            /* Отклик на заказ без контактов */
            <div className={generalStyles.sidebar_filter}>
              <div>
                <h3>Отклик на заказ</h3>
                <span>
                  После отклика ученик получает ваши контакты и может отправить
                  вам свои <br />
                  <br />
                  Больше комиссий не будет, но не каждый отклик приводит к
                  заказу
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
          )}

          {/* Предложение заказа от ученика */}
          {/* <div className={generalStyles.sidebar_filter}>
        <div>
          <h3>Ученик предложил вам заказ</h3>
          <span>
            Ваша анкета заинтересовала ученика
            <br />
            <br />
            Примите заказ, чтобы обсудить детали занятий и обменяться
            контактами
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
              <span className={styles.textButton}>Принять заказ</span>
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
      </div> */}
        </div>
      )}
    </>
  );
};
