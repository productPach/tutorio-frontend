"use client";
import generalStyles from "../../../../app/tutor/layout.module.css";
import styles from "./ChatSideBar.module.css";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { setComponentMenu } from "@/store/features/orderSlice";
import { Chat, Tutor } from "@/types/types";
import clsx from "clsx";
import { formatTimeAgo } from "@/utils/date/date";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext"; // Подключаем ChatContext
import { setChat } from "@/store/features/chatSlice";

type ResponseSidbarProps = {
  loading?: boolean;
  visibleEmoji?: boolean;
  setVisibleEmoji?: Dispatch<SetStateAction<boolean>>;
  isChecked?: boolean;
  setIsChecked?: Dispatch<SetStateAction<boolean>>;
  tutor?: Tutor | null; // добавляем tutorId как пропс
  page?: string;
};

export const ChatSidbar = ({
  loading,
  visibleEmoji,
  setVisibleEmoji,
  isChecked,
  setIsChecked,
  page,
}: ResponseSidbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, sendMessage, markAsRead } = useChat(); // Используем ChatContext для получения чатов
  const selectChat = useAppSelector((state) => state.chat.chat);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const [isSafari, setIsSafari] = useState(false);
  const route = useRouter();
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  // Сортировка чатов по дате последнего сообщения
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      return (
        new Date(b.lastMessage?.createdAt || 0).getTime() -
        new Date(a.lastMessage?.createdAt || 0).getTime()
      );
    });
  }, [chats]);

  return (
    <>
      {!loading && (
        <div
          className={generalStyles.sidebarResponseChat}
          style={
            isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }
          }
        >
          {chats.length > 0 && (
            <div className={styles.sidebar_filterForChat}>
              <div className={styles.studentChatWrap}>
                {sortedChats.map((chat, index, array) => {
                  const { lastMessage } = chat;

                  const isFirst = index === 0;
                  const isLast = index === array.length - 1;

                  // Подсчитываем количество непрочитанных сообщений
                  const unreadCount = chat.messages.filter(
                    (msg) => !msg.isRead && msg.senderId !== tutor?.id
                  ).length;

                  return (
                    <div
                      onClick={() => {
                        dispatch(setComponentMenu(5));
                        dispatch(setChat(chat));
                        setVisibleEmoji && setVisibleEmoji(false);
                        if (page && page === "Tutor") {
                          route.push("../");
                        }
                      }}
                      className={clsx(
                        styles.studentChatContainerImgAndMessage,
                        {
                          [styles.firstChat]: isFirst, // Дополнительный стиль для первого элемента
                          [styles.lastChat]: isLast, // Дополнительный стиль для последнего элемента
                          [styles.isNotReadTutorsMessageContainerBg]:
                            lastMessage?.senderId !== tutor?.id &&
                            unreadCount > 0,
                          [styles.selectStudentChatContainerImgAndMessage]:
                            chat.id === selectChat?.id,
                        }
                      )}
                      key={chat.id}
                    >
                      <Image
                        className={styles.studentChatImg}
                        src={`${chat.student.avatarUrl}`}
                        width={45}
                        height={45}
                        alt=""
                      />
                      <div className={styles.studentChatMessage}>
                        <div className={styles.studentChatMessageFio}>
                          {chat.student.name}
                        </div>
                        <div className={styles.studentChatMessageFlx}>
                          <div className={styles.studentChatMessageText}>
                            {/* Отображаем последнее сообщение */}
                            {lastMessage?.text}
                          </div>
                          {/* Отображаем количество непрочитанных сообщений, если оно больше 0 */}
                          {unreadCount > 0 &&
                            lastMessage.senderId !== tutor?.id && (
                              <div
                                className={styles.isNotReadTutorsMessageCount}
                              >
                                {unreadCount}
                              </div>
                            )}
                          {/* Иконка для прочтённых сообщений */}
                          {lastMessage.senderId === tutor?.id ? (
                            lastMessage.isRead ? (
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
                            )
                          ) : null}
                        </div>

                        <div className={styles.studentChatMessageDate}>
                          {formatTimeAgo(lastMessage?.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
