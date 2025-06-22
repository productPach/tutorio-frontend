"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "../Order/Order.module.css";
import chatNoAccessStyles from "../../Tutor/Chat/ChatNoAccess.module.css";
import chatStyles from "./Chat.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { Chat, City, Message, Order, Student } from "@/types/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setComponentMenu,
  updateChatInOrder,
} from "@/store/features/orderSlice";
import Image from "next/image";
import Link from "next/link";
import { getBackendUrl } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import { sendMessage, setChat, setChats } from "@/store/features/chatSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import GroupedMessages from "./GroupedMessages";
import { EmojiPicker } from "./EmojiPicker";
import { useChatSocket } from "@/hooks/useChatSocket";
import { SendHorizontal } from "lucide-react";

type TempMessage = Message & { pending?: boolean; error?: boolean };

type OrderProps = {
  chats: Chat[];
  setChatsState: (newChats: Chat[]) => void;
  visibleEmoji: boolean;
  setVisibleEmoji: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
  student?: Student | null;
  orderById?: Order | null;
  error?: string | null;
  locations?: City[];
};

export const ChatComponent = ({
  chats,
  setChatsState,
  visibleEmoji,
  setVisibleEmoji,
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
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);

  // Стейт для текста сообщения
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Подписка на чат для получения новых сообщений через useChatSocket
  const { messages, unreadCount, sendMessageSocket, markAsRead } =
    useChatSocket(chat?.id ? chat.id : "");

  // useEffect(() => {
  //   chat && token && dispatch(getChatById({ chatId: chat?.id, token }));
  //   textareaRef.current?.focus();
  //   setInputValue("");
  // }, [chat?.id, token, dispatch]);

  // Обработчик ввода текста в textarea
  const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // предотвращаем обычный перенос строки
      preHandleSendMessage();
    }
  };

  const [isSending, setIsSending] = useState(false);

  const preHandleSendMessage = () => {
    if (inputValue.trim() !== "" && !isSending) {
      setIsSending(true); // блокируем повторное нажатие

      if (textareaRef.current) {
        textareaRef.current.blur();
      }

      setTimeout(() => {
        handleSendMessage();
        setIsSending(false); // разблокируем
      }, 200);
    }
  };

  useEffect(() => {
    // if (window.innerWidth <= 768) return; // ❌ Прерываем на мобильных
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

  // useEffect(() => {
  //   if (chat?.messages && student?.id && token) {
  //     const noReadMessagesFromOther = chat.messages.filter(
  //       (message) => !message.isRead && message.senderId !== student.id
  //     );

  //     if (noReadMessagesFromOther.length === 0) return;

  //     Promise.all(
  //       noReadMessagesFromOther.map((message) =>
  //         dispatch(
  //           updateMessage({
  //             messageId: message.id,
  //             studentId: student.id,
  //             isRead: true,
  //             token,
  //           })
  //         ).unwrap()
  //       )
  //     )
  //       .then(() => {
  //         // После успешного обновления сообщений обновляем чат в заказе
  //         const updatedMessages = chat.messages.map((message) =>
  //           noReadMessagesFromOther.some((m) => m.id === message.id)
  //             ? { ...message, isRead: true }
  //             : message
  //         );

  //         dispatch(
  //           updateChatInOrder({
  //             chatId: chat.id,
  //             updatedChat: {
  //               ...chat,
  //               messages: updatedMessages,
  //             },
  //           })
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Ошибка при обновлении сообщений:", error);
  //       });
  //   }
  // }, [chat]);

  useEffect(() => {
    dispatch(setComponentMenu(5));
    textareaRef.current?.focus();
    setInputValue("");
  }, [dispatch, chat?.id]);

  // Блокируем скролл самой страницы при открытой клавиатуре
  // useEffect(() => {
  //   const lockScroll = () => {
  //     document.body.style.position = "fixed";
  //     document.body.style.top = `-${window.scrollY}px`;
  //     document.body.style.width = "100%";
  //   };

  //   const unlockScroll = () => {
  //     const scrollY = document.body.style.top;
  //     document.body.style.position = "";
  //     document.body.style.top = "";
  //     window.scrollTo(0, parseInt(scrollY || "0") * -1);
  //   };

  //   window.addEventListener("focusin", lockScroll);
  //   window.addEventListener("focusout", unlockScroll);

  //   return () => {
  //     window.removeEventListener("focusin", lockScroll);
  //     window.removeEventListener("focusout", unlockScroll);
  //   };
  // }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollY = 0;

    const preventScroll = (e: TouchEvent) => {
      // Только если свайп не по чату
      if (!chatRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const lockScroll = () => {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    };

    const unlockScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      document.body.removeEventListener("touchmove", preventScroll);
    };

    // Если при монтировании уже активен textarea — сразу блокируем скролл
    const isTextInput =
      document.activeElement?.tagName === "TEXTAREA" ||
      document.activeElement?.tagName === "INPUT";
    if (isTextInput) {
      lockScroll();
    }

    window.addEventListener("focusin", lockScroll);
    window.addEventListener("focusout", unlockScroll);

    return () => {
      window.removeEventListener("focusin", lockScroll);
      window.removeEventListener("focusout", unlockScroll);
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

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

  const tutorAvatar = chat && `${getBackendUrl()}${chat.tutor.avatarUrl}`;

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
        pending: true, // Это временное поле
      };

      // Закрываем блок с эмодзи
      setVisibleEmoji(false);

      // Показываем сообщение сразу в UI
      const updatedMessages = [...chat.messages, tempMessage];

      // Обновляем чат в Redux (setChat)
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

      setInputValue(""); // Очищаем инпут

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
        // После успешного сохранения отправляем реальное сообщение через сокет
        sendMessageSocket(newMessage); // Передаем реальное сообщение с ID

        // Заменяем временное сообщение на настоящее
        const finalMessages = updatedMessages.map((msg) =>
          msg.id === tempId ? newMessage : msg
        );

        // Обновляем чаты в контексте
        const updatedChatsWithFinal = chats.map((existingChat) =>
          existingChat.id === chat.id
            ? { ...existingChat, messages: finalMessages }
            : existingChat
        );

        // Здесь обновление состояния чатов в контексте можно отложить с использованием setTimeout
        // setTimeout(() => {
        //   // Отложенное обновление состояния чатов в контексте
        //   // Обновляем состояние с новыми чатами в контексте
        //   setChatsState(updatedChatsWithFinal);
        // }, 0);

        // Обновляем чат в Redux с финальными сообщениями
        dispatch(
          setChat({
            ...chat,
            messages: finalMessages,
          })
        );

        // Обновляем чат в заказе с финальными сообщениями
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

        setChatsState(
          chats.map((existingChat) =>
            existingChat.id === newMessage.chatId
              ? { ...existingChat, messages: finalMessages }
              : existingChat
          )
        );
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);

        // Обновим временное сообщение как неудачное (например, для отображения красного текста)
        const failedMessages = updatedMessages.map((msg) =>
          msg.id === tempId
            ? { ...msg, error: true } // или оставить как есть
            : msg
        );

        // Обновляем чаты в контексте с ошибкой
        const updatedChatsWithError = chats.map((existingChat) =>
          existingChat.id === chat.id
            ? { ...existingChat, messages: failedMessages }
            : existingChat
        );
        // Здесь обновление состояния чатов в контексте можно отложить с использованием setTimeout
        setTimeout(() => {
          // Обновляем состояние с новыми чатами с ошибкой в контексте
          //setChatsState(updatedChatsWithError);
        }, 0);

        // Обновляем чат в Redux с ошибкой
        dispatch(
          setChat({
            ...chat,
            messages: failedMessages,
          })
        );
      }
    }
  };
  const isActiveIcon = inputValue.length > 0;

  return (
    <>
      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap,
          generalStyles.content_blockChtM
        )}
      >
        <div className={styles.contBackM}>
          <div
            onClick={() => {
              dispatch(setComponentMenu(7));
              dispatch(setChat(null));
            }}
            className={styles.backImg}
          >
            <Image
              src="/../img/icon/tutor/go-back.svg"
              alt="Назад"
              width={32}
              height={32}
            />
          </div>
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
                  dispatch(setComponentMenu(6));
                }}
              >
                <Image
                  className={styles.tutorImg}
                  src={tutorAvatar ? tutorAvatar : "/img/tutor/avatarBasic.png"}
                  width={34}
                  height={34}
                  alt=""
                />
              </Link>
            </div>
            <div className={styles.flex4}>
              <div
                className={clsx(
                  styles.containerFlxRw,
                  styles.jtfCntSpBtwn,
                  chatStyles.gap6
                )}
              >
                <Link
                  href={`./${orderById?.id}/tutor/${chat && chat.tutor.id}`}
                  onClick={() => {
                    dispatch(setComponentMenu(6));
                  }} // Сохраняем скролл при клике
                >
                  <span>{chat && chat.tutor.name}</span>
                </Link>
                {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
                  <div className={styles.containerIsOnline}>
                    <div className={styles.isOnline}></div>
                    <span className={styles.isOnlineTxt}>{onlineStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chatRef}
        className={clsx(
          chatStyles.content__chat,
          { [chatStyles.content__chat_with_cookies]: !cookiesAccepted },
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
            studentId={student?.id || ""}
          />
        )}

        {!chat?.tutorHasAccess &&
          (chat?.status !== "Rejected" ? (
            <div className={clsx(chatNoAccessStyles.inputMessageBlock)}>
              <div className={chatNoAccessStyles.notAccessTextContainer}>
                <h3 className={chatNoAccessStyles.notAccessTitle}>
                  Вы предложили заказ репетитору 📩
                </h3>{" "}
                Если ваш заказ его заинтересует, он примет его. После этого вы
                сможете обсудить детали занятий в этом чате
                <div className={chatNoAccessStyles.containerButton}></div>
              </div>
            </div>
          ) : (
            <div className={clsx(chatNoAccessStyles.inputMessageBlock)}>
              <div className={chatNoAccessStyles.notAccessTextContainer}>
                <h3 className={chatNoAccessStyles.notAccessTitle}>
                  Репетитор отклонил ваш заказ ❌
                </h3>{" "}
                К сожалению, этот заказ не подошёл репетитору. Вы можете выбрать
                другого или подождать, пока кто-то из подходящих специалистов
                откликнется
                <div className={chatNoAccessStyles.containerButton}></div>
              </div>
            </div>
          ))}

        {chat?.tutorHasAccess && (
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
                onBlur={() => {
                  // Задержка позволяет дождаться закрытия клавиатуры
                  setTimeout(() => {
                    document.activeElement?.scrollIntoView({
                      behavior: "smooth",
                      block: "end",
                    });
                  }, 100);
                }}
              />
            </div>

            <div
              onClick={() => preHandleSendMessage()}
              className={`${chatStyles.wrapperIM} ${isActiveIcon ? chatStyles.activeWrapperIM : ""}`}
            >
              <SendHorizontal
                size={24}
                className={`${chatStyles.iconIM} ${isActiveIcon ? chatStyles.activeIconIM : ""}`}
                color={isActiveIcon ? "white" : "#777777"}
                strokeWidth={isActiveIcon ? 1.5 : 1.25}
              />
            </div>
            <EmojiPicker
              onSelect={(emoji) => setInputValue((prev) => prev + emoji)}
              textareaRef={textareaRef}
              visibleEmoji={visibleEmoji}
              setVisibleEmoji={setVisibleEmoji}
            />
          </div>
        )}
      </div>
    </>
  );
};
