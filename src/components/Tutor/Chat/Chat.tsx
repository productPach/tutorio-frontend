"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import chatStyles from "./Chat.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { Chat, City, Message, Student } from "@/types/types";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setComponentMenu,
  updateChatInOrder,
} from "@/store/features/orderSlice";
import Image from "next/image";
import Link from "next/link";
import { host, port } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import {
  addMessageToChat,
  sendMessage,
  setChat,
  setChats,
} from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmojiPicker } from "@/components/Student/Chat/EmojiPicker";
import GroupedMessages from "./GroupedMessages";
import { useSocket } from "@/context/SocketContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChat } from "@/context/ChatContext";
import { sortMessages } from "@/utils/chat/sortMessages";
import { orderBy } from "lodash";

type TempMessage = Message & { pending?: boolean; error?: boolean };

type OrderProps = {
  visibleEmoji: boolean;
  setVisibleEmoji: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
  student?: Student | null;
  error?: string | null;
  locations?: City[];
};

export const ChatComponent = React.memo(
  ({
    visibleEmoji,
    setVisibleEmoji,
    loading,
    error,
    locations,
  }: OrderProps) => {
    useEffect(() => {
      window.scrollTo({
        top: 0,
      });
    }, []);

    const dispatch = useAppDispatch();
    const { socket } = useSocket();
    const token = useAppSelector((state) => state.auth.token);
    const tutor = useAppSelector((state) => state.tutor.tutor);
    // Получаем чат из редакса
    const chat = useAppSelector((state) => state.chat.chat);

    const { chats, setChatsState } = useChat();

    //console.log(chat);

    // Стейт для текста сообщения
    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Подписка на чат для получения новых сообщений через useChatSocket
    const { messages, unreadCount, sendMessageSocket, markAsRead } =
      useChatSocket(chat?.id ? chat.id : "");

    // Обработчик ввода текста в textarea
    const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // предотвращаем обычный перенос строки
        if (inputValue.trim() !== "") {
          handleSendMessageComp();
        }
      }
    };

    useEffect(() => {
      if (textareaRef.current && wrapperRef.current) {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(scrollHeight, 150);
        textareaRef.current.style.height = `${newHeight}px`;
        wrapperRef.current.style.height = `${newHeight}px`;

        // Добавляем паддинг в wrapper, если scrollHeight > 100
        if (scrollHeight > 150) {
          wrapperRef.current.style.padding = "0px 0px 10px 0px";
        } else {
          wrapperRef.current.style.padding = "0"; // сбрасываем
        }
      }
    }, [inputValue, chat]);

    useEffect(() => {
      dispatch(setComponentMenu(5));
      textareaRef.current?.focus();
      setInputValue("");
    }, [dispatch, chat?.id]);

    if (loading && !tutor?.name)
      return (
        <div className={generalStyles.container__spinner}>
          <div className={generalStyles.spinner}>
            <SpinnerOrders />
          </div>
        </div>
      );

    if (error)
      return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

    // const subjectArr = data.find(
    //   (subject) => subject.id_p === orderById?.subject
    // );
    // const subjectName = subjectArr?.title;

    // Получаем текущее время
    const currentTime = new Date();

    // Проверяем, был ли репетитор онлайн в последние 5 минут
    const lastOnlineTime = chat?.student?.lastOnline
      ? new Date(chat.student.lastOnline)
      : null;

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

    const handleSendMessageComp = async () => {
      const messageResponse = inputValue.trim();

      if (chat && tutor?.id && chat?.studentId && token && messageResponse) {
        const tempId = "temp-" + Date.now();

        const tempMessage: TempMessage = {
          id: tempId,
          chatId: chat.id,
          senderId: tutor?.id,
          text: messageResponse,
          createdAt: new Date().toISOString(),
          isRead: false,
          pending: true, // Это помечаем как дополнительное поле
        };

        // Закрываем блок с эмодзи
        setVisibleEmoji(false);

        // Показываем сообщение сразу в UI
        const updatedMessages = [...chat.messages, tempMessage];

        // Обновляем чаты в контексте
        const updatedChats = chats.map((existingChat) =>
          existingChat.id === chat.id
            ? { ...existingChat, messages: updatedMessages }
            : existingChat
        );

        // Обновляем состояние с новыми чатами в контексте
        setChatsState(updatedChats);

        // Обновляем чат в Redux
        dispatch(
          setChat({
            ...chat,
            messages: updatedMessages,
          })
        );

        // Обновляем чат в заказе
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
              senderId: chat.tutorId,
              orderId: "какой-то айди",
              themeOrder: "какая-то тема",
              text: messageResponse,
              token,
            })
          );

          const newMessage = unwrapResult(actionResult);

          // После успешного сохранения отправляем реальное сообщение через сокет
          sendMessageSocket(newMessage); // передаем реальное сообщение с id

          // Заменяем временное сообщение на настоящее
          const finalMessages = sortMessages(
            updatedMessages.map((msg) => (msg.id === tempId ? newMessage : msg))
          );

          // Обновляем чаты в контексте
          const updatedChatsWithFinal = chats.map((existingChat) =>
            existingChat.id === chat.id
              ? { ...existingChat, messages: finalMessages }
              : existingChat
          );

          // Обновляем состояние с новыми чатами в контексте
          setChatsState(updatedChatsWithFinal);

          // Обновляем чаты в Redux
          dispatch(
            setChat({
              ...chat,
              messages: finalMessages,
            })
          );

          // Обновляем чаты в заказе
          dispatch(
            updateChatInOrder({
              chatId: chat.id,
              updatedChat: {
                ...chat,
                messages: finalMessages,
              },
            })
          );

          // Теперь обновляем чаты в Redux
          dispatch(
            setChats(
              chats.map((existingChat) =>
                existingChat.id === newMessage.chatId
                  ? { ...existingChat, messages: finalMessages }
                  : existingChat
              )
            )
          );
        } catch (error) {
          console.error("Ошибка при отправке сообщения:", error);

          // Обновим временное сообщение как неудачное (например, для отображения красного текста)
          const failedMessages = sortMessages(
            updatedMessages.map((msg) =>
              msg.id === tempId ? { ...msg, error: true } : msg
            )
          );

          // Обновляем чаты в контексте с ошибкой
          const updatedChatsWithError = chats.map((existingChat) =>
            existingChat.id === chat.id
              ? { ...existingChat, messages: failedMessages }
              : existingChat
          );

          // Обновляем состояние с новыми чатами с ошибкой в контексте
          setChatsState(updatedChatsWithError);

          // Обновляем чаты в Redux с ошибкой
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
        {chat ? (
          <>
            <div
              className={clsx(
                generalStyles.content_block,
                generalStyles.order_block,
                generalStyles.crsr_pntr,
                chatStyles.order_gap
              )}
            >
              <div
                className={clsx(
                  chatStyles.tutorImgFioContainer,
                  chatStyles.alnItmCntr,
                  chatStyles.gap14
                )}
              >
                <div className={chatStyles.tutorImgContainer}>
                  <Image
                    className={chatStyles.tutorImg}
                    src={
                      chat && chat.student.avatarUrl
                        ? chat.student.avatarUrl
                        : "/img/tutor/avatarBasic.png"
                    }
                    width={34}
                    height={34}
                    alt=""
                  />
                </div>
                <div className={chatStyles.flex4}>
                  <div
                    className={clsx(
                      chatStyles.containerFlxRw,
                      chatStyles.jtfCntSpBtwn
                    )}
                  >
                    <div className={chatStyles.containerIsOnline}>
                      <span>{chat && chat.student.name}</span>
                      {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
                        <div className={chatStyles.containerIsOnline}>
                          <div className={chatStyles.isOnline}></div>
                          {/* <span>{onlineStatus}</span> */}
                        </div>
                      )}
                    </div>
                    <Link href={`/tutor/${chat.orderId}`}>Детали заказа</Link>
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
              {/* <div className={chatStyles.chat__date}>Четверг, 7 марта</div> */}
              {/* Сортировка сообщений по времени (по возрастанию) */}
              {chat && (
                <GroupedMessages
                  chatId={chat?.id}
                  messages={chat?.messages || []}
                  tutorId={chat?.tutorId || ""}
                />
              )}

              <div className={clsx(chatStyles.inputMessageBlock)}>
                {/* Родительский блок с границами */}
                <div ref={wrapperRef} className={chatStyles.wrapperRef}>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Начните вводить сообщение"
                    rows={1}
                    className={chatStyles.textarea}
                  />
                </div>
                <EmojiPicker
                  onSelect={(emoji) => setInputValue((prev) => prev + emoji)}
                  textareaRef={textareaRef}
                  visibleEmoji={visibleEmoji}
                  setVisibleEmoji={setVisibleEmoji}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={clsx(
                generalStyles.content_block,
                generalStyles.order_block,
                generalStyles.crsr_pntr,
                chatStyles.order_gap,
                chatStyles.defaultChatBlock
              )}
            >
              <div className={chatStyles.defaultChatText}>
                📬 Выберите чат, чтобы продолжить диалог с учеником
              </div>
            </div>
          </>
        )}
      </>
    );
  }
);
ChatComponent.displayName = "ChatComponent";
