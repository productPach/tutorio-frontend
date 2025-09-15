"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import {
  setIsModalRejectResponse,
  setIsSheetRejectResponse,
  setScrollY,
} from "@/store/features/modalSlice";
import { resetChat, sendMessage, updateChat } from "@/store/features/chatSlice";
import { useChat } from "@/context/ChatContext";
import { Message } from "@/types/types";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";

type TempMessage = Message & { pending?: boolean; error?: boolean };

export const RejectResponseModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const chat = useAppSelector((state) => state.chat.chat);
  const { loadChats } = useChat();
  // Подписка на чат для получения новых сообщений через useChatSocket
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");

  const handleReject = async () => {
    try {
      if (!token || !chat) return;

      const updatedChat = await dispatch(
        updateChat({
          chatId: chat.id,
          status: "Rejected",
          token,
        })
      ).unwrap();

      handleSendMessageComp();
      loadChats();
      dispatch(resetChat());
    } catch (err) {
      console.error("Ошибка при обновлении чата:", err);
    } finally {
      dispatch(setIsModalRejectResponse(false));
      dispatch(setIsSheetRejectResponse(false));
      dispatch(setScrollY(0));
    }
  };

  const handleSendMessageComp = async () => {
    const messageResponse =
      "Репетитор отклонил ваш заказ (сообщение создано автоматически)";
    if (chat && tutor?.id && chat?.studentId && token && messageResponse) {
      try {
        const actionResult = await dispatch(
          sendMessage({
            chatId: chat.id,
            senderId: chat.tutorId,
            orderId: "какой-то айди",
            themeOrder: "какая-то тема",
            text: messageResponse,
            token,
          })
        );
        const newMessage = unwrapResult(actionResult);
        // После успешного сохранения отправляем реальное сообщение через сокет
        sendMessageSocket(newMessage); // передаем реальное сообщение с id
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    }
  };

  return (
    <>
      <div className={styles.description2}>
        Вы действительно хотите отклонить заказ ученика?
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonGr}
          onClick={handleReject}
          type="button"
        >
          Отклонить заказ
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalRejectResponse(false));
            dispatch(setIsSheetRejectResponse(false));
            dispatch(setScrollY(0));
          }}
          type="button"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
