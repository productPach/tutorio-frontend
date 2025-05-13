"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../Profil/Education/Education.module.css";
import {
  setIsModalRejectResponse,
  setScrollY,
} from "@/store/features/modalSlice";
import { resetChat, updateChat } from "@/store/features/chatSlice";
import { useChat } from "@/context/ChatContext";

export const RejectResponseModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const { loadChats } = useChat();

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

      loadChats();
      dispatch(resetChat());
    } catch (err) {
      console.error("Ошибка при обновлении чата:", err);
    } finally {
      dispatch(setIsModalRejectResponse(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description}>
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
