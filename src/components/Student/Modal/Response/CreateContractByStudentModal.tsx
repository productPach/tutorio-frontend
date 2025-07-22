"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalCreateContractByStudent,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { createContract } from "@/store/features/contractSlice";
import { updateChatForContract } from "@/store/features/chatSlice";
import { getOrderById, updateOrder } from "@/store/features/orderSlice";

export const CreateContractByStudentModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const orderById = useAppSelector((state) => state.orders.orderById);
  const { loadChats } = useChat();

  const [step, setStep] = useState<"initial" | "success">("initial");

  const handleCreateContract = async () => {
    try {
      if (!token || !chat?.orderId || !chat?.tutorId) return;

      await dispatch(
        createContract({
          token,
          payload: {
            orderId: chat.orderId,
            tutorId: chat.tutorId,
            selectedBy: "student",
          },
        })
      ).unwrap();

      dispatch(updateChatForContract());

      await loadChats();

      if (orderById) {
        await dispatch(
          updateOrder({
            id: orderById.id,
            token,
            status: "Hidden",
          })
        ).unwrap();

        dispatch(getOrderById({ token, id: chat.orderId }));
      }

      setStep("success");
    } catch (err) {
      console.error("Ошибка при создании контракта:", err);
    }
  };

  const handleClose = () => {
    dispatch(setIsModalCreateContractByStudent(false));
    dispatch(setScrollY(0));
  };

  const handleReopenOrder = async () => {
    if (!orderById || !token) return;
    try {
      await dispatch(
        updateOrder({
          id: orderById.id,
          token,
          status: "Active",
        })
      ).unwrap();
      dispatch(getOrderById({ token, id: orderById.id }));
    } catch (err) {
      console.error("Ошибка при открытии заказа:", err);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      {step === "initial" ? (
        <>
          <div className={styles.description2}>
            ✅ Выбирайте репетитора, <strong>только если</strong> вы уже
            назначили дату занятия или договорились о выполнении задачи.
            <br />
            <br />
            <ul className={styles.customList}>
              <li>Это помогает нам делать сервис честным и полезным</li>
              <li>Вы сможете оставить отзыв о занятиях</li>
              <li>
                Выбор влияет на рейтинг репетитора и его доверие на платформе
              </li>
            </ul>
          </div>

          <div className={componentStyles.containerFlxRw}>
            <button
              className={buttonStyles.buttonYlw}
              onClick={handleCreateContract}
              type="button"
            >
              Выбрать
            </button>
            <button
              className={buttonStyles.buttonBlc}
              onClick={handleClose}
              type="button"
            >
              Закрыть
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.description2}>
            Мы скрыли ваш заказ от новых откликов, чтобы вы могли
            сосредоточиться на общении с выбранным репетитором.
            <br />
            <br />
          </div>

          <div className={componentStyles.containerFlxRw}>
            <button
              className={buttonStyles.buttonBlc}
              onClick={handleClose}
              type="button"
            >
              Хорошо
            </button>
            <button
              className={buttonStyles.buttonYlw}
              onClick={handleReopenOrder}
              type="button"
            >
              Нужны ещё отклики
            </button>
          </div>
        </>
      )}
    </>
  );
};
