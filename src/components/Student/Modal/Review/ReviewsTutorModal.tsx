"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalCreateContractByStudent,
  setIsModalHiddenOrder,
  setIsSheetCreateContractByStudent,
  setIsSheetHiddenOrder,
  setIsSheetOpen,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { createContract } from "@/store/features/contractSlice";
import { sendMessage, updateChatForContract } from "@/store/features/chatSlice";
import { getOrderById, updateOrder } from "@/store/features/orderSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";
import { fetchStudentPhoneById } from "@/api/server/studentApi";
import { Spinner } from "@/components/Spinner/Spinner";

export const ReviewsTutorModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  // Стейт для предметов
  const subjects = useAppSelector((state) => state.subject.subjects);
  const orderById = useAppSelector((state) => state.orders.orderById);
  const { loadChats } = useChat();
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<"initial" | "success">("initial");
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");

  const handleCreateContract = async () => {
    try {
      if (!token || !chat?.orderId || !chat?.tutorId) return;
      setIsLoading(true);
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

        // Получаем телефон ученика
        const phoneStudent = await fetchStudentPhoneById(
          token,
          orderById.studentId
        );

        const actionResult = await dispatch(
          sendMessage({
            chatId: chat.id,
            senderId: chat.studentId,
            orderId: orderById.id,
            themeOrder: `${orderById.goal} по ${subjectForRequest}`,
            text: orderById.autoContactsOnResponse
              ? `Победа! Ученик выбрал вас\u00A0—\u00A0теперь вы в\u00A0одной команде!
Желаем классных уроков и\u00A0крутых достижений\u00A0🎯`
              : `Победа! Ученик выбрал вас\u00A0—\u00A0теперь вы в\u00A0одной команде!
            Телефон ученика: <a href="tel:+7${phoneStudent}">+7${phoneStudent}</a>\n\n\
Желаем классных уроков и\u00A0крутых достижений\u00A0🎯`,
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
      handleClose();
      setIsLoading(false);
      if (window.innerWidth < 769) {
        dispatch(setIsSheetHiddenOrder(true));
      } else {
        // Логика для больших экранов
        dispatch(setIsModalHiddenOrder(true)); // Открываем шторку
      }
    } catch (err) {
      console.error("Ошибка при создании контракта:", err);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setIsModalCreateContractByStudent(false));
    dispatch(setIsSheetCreateContractByStudent(false));
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
            ✅ Выбирайте репетитора, <strong>только если</strong>{" "}
            вы&nbsp;уже&nbsp; назначили дату занятия или&nbsp;договорились
            о&nbsp;выполнении задачи.
            <br />
            <br />
            <ul className={styles.customList}>
              <li>Это помогает нам делать сервис честным и&nbsp;полезным</li>
              <li>Вы сможете оставить отзыв о&nbsp;занятиях</li>
              <li>
                Выбор влияет на&nbsp;рейтинг репетитора и&nbsp;его доверие
                на&nbsp;платформе
              </li>
            </ul>
          </div>

          <div className={componentStyles.containerFlxRw}>
            <button
              disabled={isLoading}
              className={buttonStyles.buttonYlw}
              onClick={handleCreateContract}
              type="button"
            >
              Выбрать
              {isLoading && (
                <div className={styles.buttonYlSpinner}>
                  <Spinner />
                </div>
              )}
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
