"use client";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalUpdateReviewByStudent,
  setIsSheetUpdateReviewByStudent,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { sendMessage } from "@/store/features/chatSlice";
import { updateOrder } from "@/store/features/orderSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Spinner } from "@/components/Spinner/Spinner";
import clsx from "clsx";
import { updateReview } from "@/store/features/reviewSlice";

export const UpdateReviewByStudentModal = () => {
  const dispatch = useAppDispatch();
  const reviewId = useAppSelector(
    (state) => state.modal.isReviewIdCreateReview
  );
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // Убираем все не буквенные символы
    setInputValue(value);
  };

  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const orderById = useAppSelector((state) => state.orders.orderById);
  const tutorId = useAppSelector((state) => state.modal.isValueCreateReview);
  const chat = orderById?.chats.find((chat) => chat.tutorId === tutorId);
  const { loadChats } = useChat();
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");

  const handleUpdateReview = async () => {
    try {
      if (!reviewId) return;
      setIsLoading(true);
      await dispatch(
        updateReview({
          id: reviewId,
          payload: {
            message: inputValue,
          },
        })
      ).unwrap();

      if (orderById) {
        await dispatch(
          updateOrder({
            id: orderById.id,
            status: orderById.status,
          })
        ).unwrap();
        if (!chat) return;
        const actionResult = await dispatch(
          sendMessage({
            chatId: chat.id,
            senderId: orderById.studentId,
            orderId: orderById.id,
            themeOrder: `не нужно`,
            text: `💬\u00A0Ученик оставил отзыв\n\
            Вы\u00A0получили комментарий к\u00A0оценке: \n"${inputValue}"`,
            type: "service",
            recipientRole: "tutor",
          })
        );
        const newMessage = unwrapResult(actionResult);
        // После успешного сохранения отправляем реальное сообщение через сокет
        sendMessageSocket(newMessage); // Передаем реальное сообщение с ID
        // // await loadChats();
      }

      handleClose();
      setIsLoading(false);
    } catch (err) {
      console.error("Ошибка при создании контракта:", err);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setIsModalUpdateReviewByStudent(false));
    dispatch(setIsSheetUpdateReviewByStudent(false));
    dispatch(setScrollY(0));
  };

  return (
    <>
      <div className={styles.description2}>
        {/* Нам важно знать, что&nbsp;было полезным,
        а&nbsp;что&nbsp;—&nbsp;не&nbsp;сработало.
        <br /> */}
        <br />
        Ваш отзыв поможет другим ученикам сделать осознанный выбор&nbsp;💭
        <br />
        Дополните его&nbsp;коротким комментарием&nbsp;—&nbsp;это&nbsp;особенно
        ценно для&nbsp;тех, кто&nbsp;сейчас выбирает репетитора.
      </div>

      <textarea
        placeholder={
          "Напишите, чем вам помог репетитор (или не помог) — это важно для других"
        }
        autoComplete="off"
        value={inputValue}
        onChange={handleInputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={clsx(styles.textarea, {
          [styles.focused]: isFocused,
          [styles.errorInput]: errorInput,
        })}
        maxLength={5000}
      />

      <div className={componentStyles.containerFlxRw}>
        <button
          disabled={isLoading || inputValue.length < 2}
          className={buttonStyles.buttonYlw}
          onClick={handleUpdateReview}
          type="button"
        >
          Оставить отзыв
          {isLoading && (
            <div className={styles.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
