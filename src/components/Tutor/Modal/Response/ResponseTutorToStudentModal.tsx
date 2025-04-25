"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/ProfileInfo/ProfileInfo.module.css";
import stylesStudent from "../../../Student/Student.module.css";
import generalStyles from "../../../../app/student/layout.module.css";
import { ChangeEvent, useState } from "react";
import {
  setIsModalResponseStudentToTutor,
  setIsModalResponseTutorToStudent,
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

export const ResponseTutorToStudentModal = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const student = useAppSelector((state) => state.student.student);
  const order = useAppSelector((state) => state.orders.orderByIdDefault);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const { loadChats, setChatsLoaded } = useChat();
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // Убираем все не буквенные символы
    setInputValue(value);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const subjectForRequest = data.find(
    (item) => item.id_p === order?.subject
  )?.for_request;

  const update = async () => {
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
              const data = await dispatch(
                getChatsByUserId({ userId: tutor.userId, role: "tutor", token })
              ).unwrap(); // Ждем ответа и получаем результат

              // Найдем нужный чат
              const chatToSet = data.find((c) => c.id === chat.id); // замените условие на нужное

              if (chatToSet) {
                dispatch(setChat(chatToSet)); // Добавляем чат в store
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
    dispatch(setIsModalResponseTutorToStudent(false));
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

      <div className={stylesStudent.containerEntityShowEnd}>
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

      <div className={styles.button}>
        <button onClick={update} type="button">
          Отправить
        </button>
      </div>
    </>
  );
};
