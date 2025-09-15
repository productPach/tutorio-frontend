"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import {
  setIsModalAcceptResponse,
  setIsSheetAcceptResponse,
  setScrollY,
} from "@/store/features/modalSlice";
import { updateChat } from "@/store/features/chatSlice";
import { useChat } from "@/context/ChatContext";
import { Message } from "@/types/types";

type TempMessage = Message & { pending?: boolean; error?: boolean };

export const AcceptResponseModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const { orderById } = useAppSelector((state) => state.orders);
  const { loadChats } = useChat();

  const handleAccept = async () => {
    try {
      if (!token || !chat) return;

      const updatedChat = await dispatch(
        updateChat({
          chatId: chat.id,
          status: "Active",
          tutorHasAccess: true,
          token,
        })
      ).unwrap();

      loadChats();
    } catch (err) {
      console.error("Ошибка при обновлении чата:", err);
    } finally {
      dispatch(setIsModalAcceptResponse(false));
      dispatch(setIsSheetAcceptResponse(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description2}>
        Спишем с вашего баланса {orderById?.responseCost} ₽. После этого сможете
        обсудить детали и обменяться контактами с учеником&nbsp;📲
      </div>

      <div className={componentStyles.containerFlxRw}>
        <button
          className={buttonStyles.buttonYlw}
          onClick={handleAccept}
          type="button"
        >
          Принять заказ
        </button>
        <button
          className={buttonStyles.buttonBlc}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setIsModalAcceptResponse(false));
            dispatch(setIsSheetAcceptResponse(false));
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
