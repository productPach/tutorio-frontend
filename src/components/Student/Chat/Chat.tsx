"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "../Order/Order.module.css";
import chatStyles from "./Chat.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { City, Message, Order, Student } from "@/types/types";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setComponentMenu,
  setOrderById,
  updateChatInOrder,
} from "@/store/features/orderSlice";
import Image from "next/image";
import Link from "next/link";
import { host, port } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import {
  sendMessage,
  setChat,
  updateMessage,
} from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";

type TempMessage = Message & { pending?: boolean; error?: boolean };

type OrderProps = {
  loading?: boolean;
  student?: Student | null;
  orderById?: Order | null;
  error?: string | null;
  locations?: City[];
};

export const ChatComponent = ({
  loading,
  orderById,
  error,
  locations,
}: OrderProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const student = useAppSelector((state) => state.student.student);
  // Получаем чат из редакса
  const chat = useAppSelector((state) => state.chat.chat);

  // Стейт для текста сообщения
  const [inputValue, setInputValue] = useState("");

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chat?.messages && student?.id && token) {
      const noReadMessagesFromOther = chat.messages.filter(
        (message) => !message.isRead && message.senderId !== student.id
      );

      if (noReadMessagesFromOther.length === 0) return;

      Promise.all(
        noReadMessagesFromOther.map((message) =>
          dispatch(
            updateMessage({
              messageId: message.id,
              studentId: student.id,
              isRead: true,
              token,
            })
          ).unwrap()
        )
      )
        .then(() => {
          // После успешного обновления сообщений обновляем чат в заказе
          const updatedMessages = chat.messages.map((message) =>
            noReadMessagesFromOther.some((m) => m.id === message.id)
              ? { ...message, isRead: true }
              : message
          );

          dispatch(
            updateChatInOrder({
              chatId: chat.id,
              updatedChat: {
                ...chat,
                messages: updatedMessages,
              },
            })
          );
        })
        .catch((error) => {
          console.error("Ошибка при обновлении сообщений:", error);
        });
    }
  }, [chat]);

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  const subjectArr = data.find(
    (subject) => subject.id_p === orderById?.subject
  );
  const subjectName = subjectArr?.title;

  const tutorAvatar = chat && `${host}${port}${chat.tutor.avatarUrl}`;

  // Получаем текущее время
  const currentTime = new Date();

  // Проверяем, был ли репетитор онлайн в последние 5 минут
  const lastOnlineTime =
    chat && chat.tutor.lastOnline ? new Date(chat.tutor.lastOnline) : null;

  let onlineStatus = "";
  let timeDifference = 0;

  if (lastOnlineTime) {
    timeDifference = currentTime.getTime() - lastOnlineTime.getTime(); // Получаем разницу во времени в миллисекундах
    if (timeDifference <= 5 * 60 * 1000) {
      onlineStatus = "В сети";
    } else {
      onlineStatus = `был ${formatTimeAgo(lastOnlineTime)}`;
    }
  }

  const handleSendMessage = async () => {
    const messageResponse = inputValue.trim();

    if (
      chat &&
      chat.tutor?.id &&
      orderById?.studentId &&
      orderById?.id &&
      token &&
      messageResponse
    ) {
      const subjectForRequest = data.find(
        (item) => item.id_p === orderById?.subject
      )?.for_request;
      const themeOrder = `${orderById.goal} по ${subjectForRequest}`;

      const tempId = "temp-" + Date.now();

      const tempMessage: TempMessage = {
        id: tempId,
        chatId: chat.id,
        senderId: chat.studentId,
        text: messageResponse,
        createdAt: new Date().toISOString(),
        isRead: false,
        pending: true, // это ты можешь пометить как дополнительное поле
      };

      // Показываем сообщение сразу в UI
      const updatedMessages = [...chat.messages, tempMessage];
      dispatch(
        setChat({
          ...chat,
          messages: updatedMessages,
        })
      );

      // Обновляем чат в заказе тоже сразу
      dispatch(
        updateChatInOrder({
          chatId: chat.id,
          updatedChat: {
            ...chat,
            messages: updatedMessages,
          },
        })
      );

      setInputValue(""); // Очищаем инпут сразу

      try {
        const actionResult = await dispatch(
          sendMessage({
            chatId: chat.id,
            senderId: chat.studentId,
            orderId: orderById.id,
            themeOrder,
            text: messageResponse,
            token,
          })
        );

        const newMessage = unwrapResult(actionResult);

        // Заменяем временное сообщение на настоящее
        const finalMessages = updatedMessages.map((msg) =>
          msg.id === tempId ? newMessage : msg
        );

        dispatch(
          setChat({
            ...chat,
            messages: finalMessages,
          })
        );

        dispatch(
          updateChatInOrder({
            chatId: chat.id,
            updatedChat: {
              ...chat,
              messages: finalMessages,
            },
          })
        );
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);

        // Обновим временное сообщение как неудачное (например, для отображения красного текста)
        const failedMessages = updatedMessages.map((msg) =>
          msg.id === tempId
            ? { ...msg, error: true } // или можно просто оставить как есть
            : msg
        );

        dispatch(
          setChat({
            ...chat,
            messages: failedMessages,
          })
        );
      }
    }
  };

  return (
    <>
      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div
          className={clsx(
            styles.tutorImgFioContainer,
            chatStyles.alnItmCntr,
            chatStyles.gap14
          )}
        >
          <div className={chatStyles.tutorImgContainer}>
            <Link
              href={`./${chat?.orderId}/tutor/${chat?.tutor.id}`}
              onClick={() => {
                dispatch(setComponentMenu(4));
              }}
            >
              <Image
                className={styles.tutorImg}
                src={tutorAvatar ? tutorAvatar : ""}
                width={34}
                height={34}
                alt=""
              />
            </Link>
          </div>
          <div className={styles.flex4}>
            <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
              <Link
                href={`./${orderById?.id}/tutor/${chat && chat.tutor.id}`}
                onClick={() => {
                  dispatch(setComponentMenu(4));
                }} // Сохраняем скролл при клике
              >
                <span>{chat && chat.tutor.name}</span>
              </Link>
              {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
                <div className={styles.containerIsOnline}>
                  <div className={styles.isOnline}></div>
                  <span>{onlineStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          chatStyles.content__chat,
          chatStyles.flx1,
          chatStyles.flxClmn,
          chatStyles.jstContSpcBtwn
        )}
      >
        <div
          className={clsx(
            chatStyles.chat__block,
            chatStyles.flx1,
            chatStyles.padng18
          )}
        >
          {/* Сортировка сообщений по времени (по возрастанию) */}
          {chat?.messages
            .slice() // Создаем копию массива, чтобы не изменять оригинал
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ) // старые сообщения снизу
            .map((message) =>
              message.senderId === student?.id ? (
                <div
                  key={message.id}
                  className={clsx(
                    chatStyles.chat__message,
                    chatStyles.chat__message__right
                  )}
                >
                  {message.text}
                  <div
                    className={clsx(
                      chatStyles.flxRow,
                      chatStyles.jstContFlxEnd
                    )}
                  >
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>{" "}
                    {/* Отображение времени сообщения */}
                    {message.isRead ? (
                      <Image
                        className={styles.studentChatIcon}
                        src={"/../img/icon/isRead.svg"}
                        width={18}
                        height={18}
                        alt=""
                      />
                    ) : (
                      <Image
                        className={styles.studentChatIcon}
                        src={"/../img/icon/noRead.svg"}
                        width={18}
                        height={18}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className={clsx(
                    chatStyles.chat__message,
                    chatStyles.chat__message__left
                  )}
                >
                  {message.text}
                  <div
                    className={clsx(
                      chatStyles.flxRow,
                      chatStyles.jstContFlxEnd
                    )}
                  >
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>{" "}
                    {/* Отображение времени сообщения */}
                  </div>
                </div>
              )
            )}
        </div>
        <div className={clsx(chatStyles.inputMessageBlock)}>
          <input
            value={inputValue}
            onChange={handleInputValue}
            onKeyDown={handleKeyDown}
            className={clsx(
              chatStyles.inputQuestion,
              chatStyles.mrgnTp10,
              chatStyles.mrgnBt10
            )}
            type="text"
            placeholder="Начните вводить сообщение"
          />
        </div>
      </div>
    </>
  );
};
