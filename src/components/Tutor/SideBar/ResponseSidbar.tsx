"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./ResponseSidbar.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import {
  setIsModalBalanceBoost,
  setIsModalResponseTutorToStudent,
  setIsModalResponseTutorToStudentWithContakt,
  setIsSheetBalanceBoost,
  setIsSheetResponseTutorToStudent,
  setIsSheetResponseTutorToStudentWithContakt,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { SpinnerSingleOrange } from "@/components/Spinner/SpinnerSingleOrange";
import { useChat } from "@/context/ChatContext";
import { setChat } from "@/store/features/chatSlice";
import { useRouter } from "next/navigation";
import { setOrderByIdDefault } from "@/store/features/orderSlice";
import clsx from "clsx";
import { Order } from "@/types/types";
import { getUserBalance } from "@/store/features/paymentSlice";

export const ResponseSidbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();
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

  const { chats, chatsLoading, setChatsLoaded } = useChat();

  const existingChat = chats.find((chat) => chat.orderId === orderById?.id);

  // Выносим логику в отдельную функцию
  const handleResponseClick = async (e: React.MouseEvent, order: Order) => {
    e.preventDefault();

    // Если чат уже существует
    if (existingChat) {
      route.push(`responses`);
      dispatch(setChat(existingChat));
      return;
    }

    // Получаем актуальный баланс
    try {
      const balanceData = await dispatch(getUserBalance()).unwrap();
      const currentBalance = balanceData.balance / 100; // если баланс в копейках

      // Проверяем достаточно ли средств
      if (currentBalance < Number(order.responseCost)) {
        // Показываем модалку пополнения баланса
        if (window.innerWidth < 769) {
          dispatch(setIsSheetBalanceBoost(true));
        } else {
          dispatch(setIsModalBalanceBoost(true));
        }
        dispatch(setValueModalBalanceBoost(order.responseCost));
        return;
      }

      // Достаточно средств - показываем соответствующую модалку
      if (order.autoContactsOnResponse) {
        if (window.innerWidth < 769) {
          dispatch(setIsSheetResponseTutorToStudentWithContakt(true));
        } else {
          dispatch(setIsModalResponseTutorToStudentWithContakt(true));
        }
      } else {
        if (window.innerWidth < 769) {
          dispatch(setIsSheetResponseTutorToStudent(true));
        } else {
          dispatch(setIsModalResponseTutorToStudent(true));
        }
      }

      dispatch(setOrderByIdDefault(order));
      setChatsLoaded(true);
    } catch (error) {
      console.error("Ошибка при получении баланса:", error);
      // Можно показать toast с ошибкой
    }
  };

  return (
    <>
      {!loading && !chatsLoading && (
        <div
          className={generalStyles.sidebarResponse}
          style={
            isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }
          }
        >
          {!existingChat ? (
            <>
              {orderById?.autoContactsOnResponse ? (
                /* Отклик на заказ с получением контактов */
                <div
                  className={clsx(
                    generalStyles.sidebar_filterBlack,
                    orderById?.status === "Closed" && generalStyles.closedFilter
                  )}
                >
                  <div>
                    <h3>Контакты сразу после отклика 🔥</h3>
                    <span>
                      После отклика вы получите контакты ученика и сможете с ним
                      связаться <br />
                      <br />
                      Больше комиссий не будет, но не каждый отклик приводит к
                      заказу
                    </span>
                    <div className={styles.button}>
                      <button
                        className={clsx(styles.jtfCntSpBtwn, styles.buttonYlw)}
                        onClick={(e) => handleResponseClick(e, orderById)}
                        type="button"
                      >
                        <span className={styles.textButton}>
                          Получить контакты
                        </span>
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
                <div
                  className={clsx(
                    generalStyles.sidebar_filterOrder,
                    orderById?.status === "Closed" && generalStyles.closedFilter
                  )}
                >
                  <div>
                    <h3>Отклик на заказ</h3>
                    <span>
                      После отклика ученик получает ваши контакты и может
                      отправить вам свои <br />
                      <br />
                      Больше комиссий не будет, но не каждый отклик приводит к
                      заказу
                    </span>
                    <div className={styles.button}>
                      <button
                        className={clsx(styles.jtfCntSpBtwn, styles.buttonYlw)}
                        onClick={(e) =>
                          orderById && handleResponseClick(e, orderById)
                        }
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
            </>
          ) : (
            <>
              {existingChat.tutorHasAccess ? (
                <>
                  <div
                    className={clsx(
                      generalStyles.sidebar_filterOrder,
                      orderById?.status === "Closed" &&
                        generalStyles.closedFilter
                    )}
                  >
                    <div>
                      <h3>Вы откликнулись на заказ</h3>
                      <span>
                        Ваш отклик по этому заказу уже отправлен
                        <br />
                        <br />
                        Перейдите в чат, чтобы обсудить детали с учеником
                      </span>
                      <div className={styles.button}>
                        <button
                          className={clsx(
                            styles.jtfCntSpBtwn,
                            styles.buttonYlw
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            route.push(`responses`);
                            dispatch(setChat(existingChat));
                          }}
                          type="button"
                        >
                          <span className={styles.textButton}>
                            Перейти в чат
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={clsx(
                      generalStyles.sidebar_filterOrder,
                      orderById?.status === "Closed" &&
                        generalStyles.closedFilter
                    )}
                  >
                    <div>
                      <h3>Ученик предложил вам заказ</h3>
                      <span>
                        Ваша анкета заинтересовала ученика
                        <br />
                        <br />
                        Примите заказ, чтобы обсудить детали занятий и
                        обменяться контактами
                      </span>
                      <div className={styles.button}>
                        <button
                          className={clsx(
                            styles.jtfCntSpBtwn,
                            styles.buttonYlw
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(setIsModalBalanceBoost(true));
                            orderById?.responseCost &&
                              dispatch(
                                setValueModalBalanceBoost(
                                  orderById?.responseCost
                                )
                              );
                          }}
                          type="button"
                        >
                          <span className={styles.textButton}>
                            Принять заказ
                          </span>
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
                        <button
                          className={clsx(
                            styles.jtfCntSpBtwn,
                            styles.buttonBlc
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            route.push(`responses`);
                            dispatch(setChat(existingChat));
                          }}
                          type="button"
                        >
                          <span className={styles.textButton}>
                            Перейти в чат
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
