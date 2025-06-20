"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/ProfileInfo/ProfileInfo.module.css";
import { ChangeEvent, useState } from "react";
import {
  setIsModalResponseTutorToStudentWithContakt,
  setLoadingPage,
} from "@/store/features/modalSlice";
import {
  createChat,
  getChatsByUserId,
  sendMessage,
  setChat,
} from "@/store/features/chatSlice";
import { data } from "@/utils/listSubjects";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { Spinner } from "@/components/Spinner/Spinner";

export const ResponseTutorToStudentWithContaktModal = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const order = useAppSelector((state) => state.orders.orderByIdDefault);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const { newChat } = useChat();
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // Убираем все не буквенные символы
    setInputValue(value);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const subjectForRequest = data.find(
    (item) => item.id_p === order?.subject
  )?.for_request;

  const update = async () => {
    setIsLoading(true);
    const messageResponse = inputValue;

    if (
      tutor?.id &&
      order?.studentId &&
      order?.id &&
      token &&
      messageResponse
    ) {
      try {
        const themeOrder = `${order.goal} по ${subjectForRequest}`;
        const chat = await dispatch(
          createChat({
            tutorId: tutor.id,
            studentId: order.studentId,
            orderId: order.id,
            initiatorRole: "tutor",
            themeOrder: themeOrder,
            status: "Active",
            token,
          })
        ).unwrap(); // Получаем результат из createChat

        if (chat?.id) {
          await dispatch(
            sendMessage({
              chatId: chat.id,
              senderId: tutor.id,
              orderId: order.id,
              themeOrder: themeOrder,
              text: messageResponse,
              token,
            })
          ).unwrap();

          // Даем рендеру отработать — и только потом пуш и сет
          setTimeout(async () => {
            try {
              //sendMessageContext(chat.id, messageResponse);
              const data = await dispatch(
                getChatsByUserId({ userId: tutor.userId, role: "tutor", token })
              ).unwrap(); // Ждем ответа и получаем результат

              // Найдем нужный чат
              const chatToSet = data.find((c) => c.id === chat.id); // замените условие на нужное

              if (chatToSet) {
                dispatch(setChat(chatToSet)); // Добавляем чат в store
                newChat(chat.id);
              }
              route.push(`/tutor/responses?chatUpdateData=true`);
            } catch (error) {
              console.error("Ошибка при загрузке чатов:", error);
            }
          }, 0);
        }
      } catch (error) {
        console.error(
          "Ошибка при создании чата или отправке сообщения:",
          error
        );
      }
    }
    dispatch(setIsModalResponseTutorToStudentWithContakt(false));
    dispatch(setLoadingPage(true));
  };

  return (
    <>
      <div className={styles.description}>
        После отклика ученик сразу получит уведомление, а его контакты станут
        вам доступны 📬
      </div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder={"Любая информация о заказе, кроме ссылок и контактов"}
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
      </div>

      <div className={styles.button}>
        <button disabled={isLoading} onClick={update} type="button">
          Получить контакты
          {isLoading && (
            <div className={styles.buttonYlSpinner2}>
              <Spinner />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
