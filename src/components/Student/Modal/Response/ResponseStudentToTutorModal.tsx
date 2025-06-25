"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../../../Tutor/Modal/Profil/ProfileInfo/ProfileInfo.module.css";
import stylesStudent from "../../Student.module.css";
import generalStyles from "../../../../app/student/layout.module.css";
import { ChangeEvent, useState } from "react";
import {
  setIsModalResponseStudentToTutor,
  setIsSheetOpen,
  setLoadingPage,
  setScrollY,
} from "@/store/features/modalSlice";
import {
  createChat,
  getChatsByOrderId,
  getChatsByUserId,
  sendMessage,
  setChat,
} from "@/store/features/chatSlice";
import { useChat } from "@/context/ChatContext";
import { useRouter } from "next/navigation";
import { data } from "@/utils/listSubjects";
import { Spinner } from "@/components/Spinner/Spinner";
import { getOrderById } from "@/store/features/orderSlice";

export const ResponseStudentToTutorModal = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const { newChat } = useChat();
  const student = useAppSelector((state) => state.student.student);
  const tutorId = useAppSelector(
    (state) => state.modal.tutorIdForResponseStudentToTutor
  );
  const { orderById } = useAppSelector((state) => state.orders);
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

  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);

  const subjectForRequest = data.find(
    (item) => item.id_p === orderById?.subject
  )?.for_request;

  const update = async () => {
    setIsLoading(true);
    const messageResponse = inputValue;

    if (tutorId && student && orderById && token && messageResponse) {
      try {
        const themeOrder = `${orderById.goal} по ${subjectForRequest}`;
        const chat = await dispatch(
          createChat({
            tutorId: tutorId,
            studentId: student.id,
            orderId: orderById.id,
            initiatorRole: "student",
            themeOrder: themeOrder,
            status: "Pending",
            token,
          })
        ).unwrap(); // Получаем результат из createChat

        if (chat?.id) {
          await dispatch(
            sendMessage({
              chatId: chat.id,
              senderId: student.id,
              orderId: orderById.id,
              themeOrder: themeOrder,
              text: messageResponse,
              token,
            })
          ).unwrap();

          // Даем рендеру отработать — и только потом пуш и сет
          setTimeout(async () => {
            try {
              dispatch(getOrderById({ token, id: orderById?.id }));
              newChat(chat.id);
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
    dispatch(setIsModalResponseStudentToTutor(false));
    dispatch(setScrollY(0));
    dispatch(setIsSheetOpen(false));
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
        Репетитор получит уведомление и&nbsp;сможет откликнуться, если
        предложение его&nbsp;заинтересует&nbsp;📩
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
        className={clsx(
          stylesStudent.containerEntityShowEnd,
          styles.mrTp15,
          stylesStudent.containerEntityShowEndAlgnCntr
        )}
      >
        <div className={stylesStudent.containerEntityTitleDescription}>
          <div className={generalStyles.textBlc}>
            Отправить телефон репетитору
          </div>
          <span className={clsx(generalStyles.textGr, generalStyles.text14)}>
            Репетитор получит ваш номер и&nbsp;сможет связаться с&nbsp;вами
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
        <button disabled={isLoading} onClick={update} type="button">
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
