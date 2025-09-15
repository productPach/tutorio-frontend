"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import {
  setIsModalCreateContractByTutor,
  setIsSheetCreateContractByTutor,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { createContract } from "@/store/features/contractSlice";
import { sendMessage } from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Spinner } from "@/components/Spinner/Spinner";
import { useState } from "react";

export const CreateContractByTutorModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const { loadChats } = useChat();
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateContract = async () => {
    try {
      if (!token || !chat || !chat.orderId || !chat.tutorId) return;
      setIsLoading(true);
      await dispatch(
        createContract({
          token,
          payload: {
            orderId: chat.orderId,
            tutorId: chat.tutorId,
            selectedBy: "tutor",
          },
        })
      ).unwrap();

      const actionResult = await dispatch(
        sendMessage({
          chatId: chat.id,
          senderId: chat.tutorId,
          orderId: "какой-то айди",
          themeOrder: "какая-то тема",
          text: `Репетитор сообщил, что\u00A0вы договорились о\u00A0занятии!\u00A0🎉
Желаем продуктивных уроков! После занятий, пожалуйста, оставьте отзыв\u00A0—\u00A0это поможет репетитору и\u00A0другим ученикам\u00A0🙌`,
          token,
          type: "service",
          recipientRole: "student",
        })
      );

      const newMessage = unwrapResult(actionResult);
      // После успешного сохранения отправляем реальное сообщение через сокет
      sendMessageSocket(newMessage); // Передаем реальное сообщение с ID

      await loadChats(); // если тебе надо обновить список чатов с актуальными контрактами
    } catch (err) {
      console.error("Ошибка при создании контракта:", err);
    } finally {
      setIsLoading(false);
      dispatch(setIsModalCreateContractByTutor(false));
      dispatch(setIsSheetCreateContractByTutor(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description2}>
        Пожалуйста, подтвердите, что вы договорились с учеником по заказу.
        <br></br>
        <br></br>✅ Отправляйте отчёт <strong>только если</strong> уже&nbsp;
        договорились о&nbsp;начале работы: назначили дату занятия
        или&nbsp;уже&nbsp;провели его, либо&nbsp;согласовали выполнение задачи
        клиента
        <br></br>
        <br></br>
        <ul className={styles.customList}>
          <li>
            Это помогает нам сделать сервис лучше для&nbsp;всех&nbsp;участников
          </li>
          <li>
            Повышает ваш рейтинг как&nbsp;надёжного и&nbsp;ответственного
            специалиста
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
          Договорились
          {isLoading && (
            <div className={styles.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalCreateContractByTutor(false));
            dispatch(setIsSheetCreateContractByTutor(false));
            dispatch(setScrollY(0));
          }}
          type="button"
        >
          Закрыть
        </button>
      </div>
    </>
  );
};
