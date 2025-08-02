"use client";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import buttonStyles from "../../../../app/tutor/button.module.css";
import componentStyles from "../../../Tutor/Modal/Profil/Education/Education.module.css";
import {
  setIsModalCreateReviewByStudent,
  setIsSheetCreateReviewByStudent,
  setScrollY,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { updateOrder } from "@/store/features/orderSlice";
import { Spinner } from "@/components/Spinner/Spinner";
import clsx from "clsx";
import { createReview, updateReview } from "@/store/features/reviewSlice";
import { StarRating } from "@/components/StarRating/StarRating";
import { sendMessage } from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useChatSocket } from "@/hooks/useChatSocket";

export const CreateReviewByStudentModal = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const orderById = useAppSelector((state) => state.orders.orderById);
  const tutorId = useAppSelector((state) => state.modal.isValueCreateReview);
  const chat = orderById?.chats.find((chat) => chat.tutorId === tutorId);
  const { sendMessageSocket } = useChatSocket(chat?.id ? chat.id : "");
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // Убираем все не буквенные символы
    setInputValue(value);
  };
  const [createdReviewId, setCreatedReviewId] = useState<string | null>(null);
  const [ratingNumb, setRatingNumb] = useState(0);
  const [ratingChosen, setRatingChosen] = useState(false);

  const handleRatingChange = async (value: number) => {
    setRatingNumb(value);
    if (!token || !orderById?.id || !tutorId || createdReviewId) return;
    try {
      setIsLoading(true);
      const review = await dispatch(
        createReview({
          token,
          payload: {
            orderId: orderById?.id,
            studentId: orderById.studentId,
            tutorId: tutorId,
            rating: value,
            authorRole: "student",
          },
        })
      ).unwrap();
      if (orderById) {
        await dispatch(
          updateOrder({
            id: orderById.id,
            token,
            status: orderById.status,
          })
        ).unwrap();
      }

      if (!chat) return;
      let customMessage;
      if (value === 5) {
        customMessage = "Отличная работа! Ученик полностью доволен\u00A0🙌";
      }
      if (value === 4) {
        customMessage =
          "Хорошая работа\u00A0—\u00A0немного до\u00A0совершенства\u00A0⚖️";
      }
      if (value === 3) {
        customMessage = "Средне. Возможно, стоит обсудить ожидания\u00A0🤝";
      }
      if (value === 2) {
        customMessage = "У\u00A0ученика остались вопросы\u00A0🤔";
      }
      if (value === 1) {
        customMessage =
          "Что-то пошло не\u00A0так... стоит пересмотреть подход\u00A0😟";
      }
      const actionResult = await dispatch(
        sendMessage({
          chatId: chat.id,
          senderId: orderById.studentId,
          orderId: orderById.id,
          themeOrder: `не нужно`,
          text: `🌟\u00A0Ученик оценил вашу помощь\n\
            Вы\u00A0получили ${value}\u00A0из\u00A05\u00A0звёзд. ${customMessage}`,
          token,
          type: "service",
          recipientRole: "tutor",
        })
      );
      const newMessage = unwrapResult(actionResult);
      // После успешного сохранения отправляем реальное сообщение через сокет
      sendMessageSocket(newMessage); // Передаем реальное сообщение с ID
      // // await loadChats();

      setCreatedReviewId(review.id);
      setRatingChosen(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Ошибка при создании отзыва:", err);
    }
  };

  const handleUpdateReview = async () => {
    try {
      if (!token || !createdReviewId) return;
      setIsLoading(true);
      await dispatch(
        updateReview({
          token,
          id: createdReviewId,
          payload: {
            message: inputValue,
          },
        })
      ).unwrap();

      if (orderById) {
        await dispatch(
          updateOrder({
            id: orderById.id,
            token,
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
            token,
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
    dispatch(setIsModalCreateReviewByStudent(false));
    dispatch(setIsSheetCreateReviewByStudent(false));
    dispatch(setScrollY(0));
  };

  return (
    <>
      {!ratingChosen &&
        (isLoading ? (
          <div className={styles.wrapperSpinnerModalReview}>
            <div className={styles.buttonYlSpinner}>
              <Spinner />
            </div>
          </div>
        ) : (
          <div className={styles.description2}>
            <StarRating value={ratingNumb} onChange={handleRatingChange} />
          </div>
        ))}

      {ratingChosen && (
        <>
          <div className={styles.description2}>
            {/* Нам важно знать, что&nbsp;было полезным,
        а&nbsp;что&nbsp;—&nbsp;не&nbsp;сработало.
        <br /> */}
            <br />
            Ваш отзыв поможет другим ученикам сделать осознанный выбор&nbsp;💭
            <br />
            Дополните его&nbsp;коротким
            комментарием&nbsp;—&nbsp;это&nbsp;особенно ценно для&nbsp;тех,
            кто&nbsp;сейчас выбирает репетитора.
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
      )}
    </>
  );
};
