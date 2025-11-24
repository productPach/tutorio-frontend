"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/ProfileInfo/ProfileInfo.module.css";
import stylesStudent from "../../../Student/Student.module.css";
import generalStyles from "../../../../app/student/layout.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  setIsModalResponseTutorToStudentWithContakt,
  setIsSheetResponseTutorToStudentWithContakt,
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
import { fetchStudentPhoneById } from "@/api/server/studentApi";

export const ResponseTutorToStudentWithContaktModal = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // Получаем значение tutor из Redux
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

    if (tutor?.id && order?.studentId && order?.id && messageResponse) {
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
            })
          ).unwrap();

          // Получаем телефон ученика
          const phoneStudent = await fetchStudentPhoneById(order.studentId);

          await dispatch(
            sendMessage({
              chatId: chat.id,
              senderId: tutor.id,
              orderId: order.id,
              themeOrder: themeOrder,
              text: `Телефон ученика: <a href="tel:+7${phoneStudent}">+7${phoneStudent}</a>\n\n\
Постарайтесь связаться с\u00A0учеником как можно скорее и\u00A0обязательно скажите, что\u00A0нашли его через сервис Tutorio.\n\n\
Чем раньше вы выйдете на\u00A0связь, тем выше шанс, что\u00A0именно вы станете его репетитором!\u00A0🌟\n\n\
Удачи в общении с учеником!\u00A0🚀`,
              type: "service",
              recipientRole: "tutor",
            })
          ).unwrap();

          // Даем рендеру отработать — и только потом пуш и сет
          setTimeout(async () => {
            try {
              //sendMessageContext(chat.id, messageResponse);
              const data = await dispatch(
                getChatsByUserId({ userId: tutor.userId, role: "tutor" })
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
        dispatch(setIsModalResponseTutorToStudentWithContakt(false));
        dispatch(setIsSheetResponseTutorToStudentWithContakt(false));
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

      <br></br>
      <div className={stylesStudent.containerEntityTitleDescription}>
        <div className={generalStyles.textGry14}>К оплате</div>
      </div>

      <div className={generalStyles.textTitle}>{order?.responseCost} ₽</div>

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
