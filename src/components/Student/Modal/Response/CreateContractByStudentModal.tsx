"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalCreateContractByStudent,
  setIsModalHiddenOrder,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { createContract } from "@/store/features/contractSlice";
import { sendMessage, updateChatForContract } from "@/store/features/chatSlice";
import { getOrderById, updateOrder } from "@/store/features/orderSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";

export const CreateContractByStudentModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  // Стейт для предметов
  const subjects = useAppSelector((state) => state.subject.subjects);
  const orderById = useAppSelector((state) => state.orders.orderById);
  const { loadChats } = useChat();

  const [step, setStep] = useState<"initial" | "success">("initial");
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");

  const handleCreateContract = async () => {
    try {
      if (!token || !chat?.orderId || !chat?.tutorId) return;

      const contract = await dispatch(
        createContract({
          token,
          payload: {
            orderId: chat.orderId,
            tutorId: chat.tutorId,
            selectedBy: "student",
          },
        })
      ).unwrap();

      // Обновляем сат у ученика, чтобы поменять состояние кнопки на Оставить отзыв
      dispatch(updateChatForContract({ tutorId: contract.tutorId }));

      if (orderById) {
        await dispatch(
          updateOrder({
            id: orderById.id,
            token,
            status: "Hidden",
          })
        ).unwrap();

        const subjectForRequest = subjects.find(
          (item) => item.id_p === orderById?.subject
        )?.for_request;

        const actionResult = await dispatch(
          sendMessage({
            chatId: chat.id,
            senderId: chat.studentId,
            orderId: orderById.id,
            themeOrder: `${orderById.goal} по ${subjectForRequest}`,
            text: "Ученик выбрал вас в качестве репетитора",
            token,
            type: "service",
            recipientRole: "tutor",
          })
        );

        const newMessage = unwrapResult(actionResult);
        // После успешного сохранения отправляем реальное сообщение через сокет
        sendMessageSocket(newMessage); // Передаем реальное сообщение с ID
        await loadChats();
        //dispatch(getOrderById({ token, id: chat.orderId }));
      }

      //setStep("success");
      dispatch(setIsModalCreateContractByStudent(false));
      dispatch(setIsModalHiddenOrder(true));
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
