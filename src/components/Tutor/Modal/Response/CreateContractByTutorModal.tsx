"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import {
  setIsModalCreateContractByTutor,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { createContract } from "@/store/features/contractSlice";
import { sendMessage } from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";

export const CreateContractByTutorModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const { loadChats } = useChat();
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");

  const handleCreateContract = async () => {
    try {
      if (!token || !chat || !chat.orderId || !chat.tutorId) return;

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
          senderId: chat.studentId,
          orderId: "какой-то айди",
          themeOrder: "какая-то тема",
          text: "Репетитор сообщил, что вы договорились с ним о занятии",
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
      dispatch(setIsModalCreateContractByTutor(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description2}>
        Пожалуйста, подтвердите, что вы договорились с учеником по заказу.
        <br></br>
        <br></br>✅ Отправляйте отчёт <strong>только если</strong> уже
        договорились о начале работы: назначили дату занятия или уже провели
        его, либо согласовали выполнение задачи клиента
        <br></br>
        <br></br>
        <ul className={styles.customList}>
          <li>Это помогает нам сделать сервис лучше для всех участников</li>
          <li>
            Повышает ваш рейтинг как надёжного и ответственного специалиста
          </li>
        </ul>
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonYlw}
          onClick={handleCreateContract}
          type="button"
        >
          Договорились
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalCreateContractByTutor(false));
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
