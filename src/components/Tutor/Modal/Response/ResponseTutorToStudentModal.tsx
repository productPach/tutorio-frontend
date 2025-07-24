"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/ProfileInfo/ProfileInfo.module.css";
import stylesStudent from "../../../Student/Student.module.css";
import generalStyles from "../../../../app/student/layout.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  setIsModalResponseTutorToStudent,
  setLoadingPage,
} from "@/store/features/modalSlice";
import {
  createChat,
  getChatsByUserId,
  sendMessage,
  setChat,
} from "@/store/features/chatSlice";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { Spinner } from "@/components/Spinner/Spinner";
import { getAllSubjects } from "@/store/features/subjectSlice";

export const ResponseTutorToStudentModal = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const order = useAppSelector((state) => state.orders.orderByIdDefault);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const { sendMessage: sendMessageContext, newChat } = useChat();
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
  // Состояние для валидации
  const [valid, setValid] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  const subjectForRequest = subjects.find(
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
                newChat(chat.id); // отправляет сокет создания нового чата и вызывает обновление у студента
              }
              route.push(`/tutor/responses?chatUpdateData=true`);
            } catch (error) {
              console.error("Ошибка при загрузке чатов:", error);
            }
          }, 0);
        }
        dispatch(setIsModalResponseTutorToStudent(false));
        dispatch(setLoadingPage(true));
      } catch (error: any) {
        const errorMessage = error?.message;
        if (error?.status === 403 && errorMessage?.includes("откликнуться")) {
          setValid(true);
          dispatch(setLoadingPage(false));
          setIsLoading(false);
        } else {
          console.error(
            "Ошибка при создании чата или отправке сообщения:",
            error
          );
        }
      }
    }
  };

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(true);

  const toggleSwitch = () => {
    setIsChecked((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  return (
    <>
      <div className={styles.description}>
        Ученик получит уведомление и сможет откликнуться, если предложение его
        заинтересует 📩
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

      <div
        className={clsx(stylesStudent.containerEntityShowEnd, styles.mrTp10)}
      >
        <div className={stylesStudent.containerEntityTitleDescription}>
          <div className={generalStyles.textBlc}>
            Отправить номер телефона ученику
          </div>
          <span className={generalStyles.textGr}>
            Ученик получит ваш номер и сможет связаться с&nbsp;вами
            напрямую&nbsp;☎️
          </span>
        </div>
        <div className={stylesStudent.inputContainer}>
          <label className={stylesStudent.iosSwitch}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={toggleSwitch}
            />
            <span className={stylesStudent.slider}></span>
          </label>
        </div>
      </div>
      {valid && (
        <p className={styles.error}>
          📫 Отклик не доставлен! Ученик уже закрыл заказ или временно
          приостановил приём откликов
          {/* . <br />
          Но это не конец — возможно, это просто знак, что ваш заказ ещё
          впереди! 🧭✨ */}
        </p>
      )}

      <div className={styles.button}>
        <button
          disabled={isLoading || valid || inputValue.length < 1}
          onClick={update}
          type="button"
        >
          Отправить
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
