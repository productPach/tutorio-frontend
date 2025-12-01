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
import { withdrawBalance } from "@/store/features/paymentSlice";

type TempMessage = Message & { pending?: boolean; error?: boolean };

export const AcceptResponseModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const chat = useAppSelector((state) => state.chat.chat);
  const { orderById } = useAppSelector((state) => state.orders);
  const { loadChats } = useChat();

  const handleResponse = async () => {
    if (orderById) {
      try {
        await dispatch(
          withdrawBalance({
            amount: Number(orderById.responseCost) * 100, // БАЛАНС В КОПЕЙКАХ
            reason: `Оплата отклика на заказ №${orderById.orderNumber}`,
          })
        ).unwrap();

        // Вызываем update только если списание прошло успешно
        handleAccept();
      } catch (error) {
        console.error("Ошибка при списании:", error);
        // НУЖНО показать ошибку пользователю!
      }
    }
  };

  const handleAccept = async () => {
    try {
      if (!token || !chat) return;

      const updatedChat = await dispatch(
        updateChat({
          chatId: chat.id,
          status: "Active",
          tutorHasAccess: true,
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
          onClick={handleResponse}
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
