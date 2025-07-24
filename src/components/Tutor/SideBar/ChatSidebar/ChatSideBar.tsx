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
import { setChat } from "@/store/features/chatSlice";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

type ResponseSidbarProps = {
  chats: Chat[];
  loading?: boolean;
  visibleEmoji?: boolean;
  setVisibleEmoji?: Dispatch<SetStateAction<boolean>>;
  isChecked?: boolean;
  setIsChecked?: Dispatch<SetStateAction<boolean>>;
  tutor?: Tutor | null; // добавляем tutorId как пропс
  page?: string;
};

export const ChatSidbar = ({
  chats,
  loading,
  visibleEmoji,
  setVisibleEmoji,
  isChecked,
  setIsChecked,
  tutor, // принимаем tutorId
  page,
}: ResponseSidbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const selectChat = useAppSelector((state) => state.chat.chat);
  const student = useAppSelector((state) => state.student.student);
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );
  const [isSafari, setIsSafari] = useState(false);
  const route = useRouter();
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<"Active" | "Closed">("Active");

  useEffect(() => {
    if (selectChat?.status === "Closed") setActiveTab("Closed");
  }, [selectChat]);

  // Функция для замены ссылок на <a> теги
  const formatTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const htmlText = text
      .split(urlRegex)
      .map((part, index) => {
        if (part.match(urlRegex)) {
          return `<a key=${index} style="color: blue; text-decoration: underline;" href="${part}" target="_blank" rel="noopener noreferrer">${part}</a>`;
        }
        return part;
      })
      .join("");

    // Очищаем потенциально опасный HTML
    return DOMPurify.sanitize(htmlText, {
      ALLOWED_TAGS: ["a"],
      ALLOWED_ATTR: ["href", "target", "rel", "style"],
    });
  };

  const sortedChats = useMemo(() => {
    const filtered = chats.filter((chat) => {
      if (activeTab === "Active") {
        return chat.status !== "Closed" && chat.status !== "Rejected";
      }
      if (activeTab === "Closed") {
        return chat.status === "Closed";
      }
      return false;
    });

    return filtered
      .sort((a, b) => {
        const lastA = a.messages
          .filter((m) => m.createdAt)
          .sort(
            (x, y) =>
              new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
          )[0];
        const lastB = b.messages
          .filter((m) => m.createdAt)
          .sort(
            (x, y) =>
              new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
          )[0];

        return (
          new Date(lastB?.createdAt || 0).getTime() -
          new Date(lastA?.createdAt || 0).getTime()
        );
      })
      .filter((chats) => chats.status !== "Rejected");
  }, [chats, activeTab]);

  //console.log(sortedChats);

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
            <>
              <div className={styles.sidebar_chatType}>
                <div className={styles.toggleWrapper}>
                  <div
                    className={`${styles.toggleOption} ${activeTab === "Active" ? styles.active : ""}`}
                    onClick={() => setActiveTab("Active")}
                  >
                    Активные
                  </div>
                  <div
                    className={`${styles.toggleOption} ${activeTab === "Closed" ? styles.active : ""}`}
                    onClick={() => setActiveTab("Closed")}
                  >
                    Завершённые
                  </div>
                </div>

                {/* <div>
                  <input
                    className={styles.inputSearchChats}
                    id="subjectInput"
                    placeholder="Поиск по чатам"
                    autoComplete="off"
                    type="text"
                    value=""
                  ></input>
                </div> */}
              </div>
              <div className={styles.sidebar_scrollWrapper}>
                <div className={clsx(styles.sidebar_filterForChat)}>
                  <div
                    className={clsx(
                      styles.studentChatWrap,
                      activeTab === "Closed" && styles.closedChat
                    )}
                  >
                    {sortedChats.map((chat, index, array) => {
                      const lastMessage = [...chat.messages].sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )[0];

                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;

                      const noReadMessagesFromOther =
                        tutor &&
                        chat.messages.filter(
                          (message) =>
                            !message.isRead && message.senderId !== tutor.id
                        );

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
                              [styles.firstChat]: isFirst,
                              [styles.lastChat]: isLast,
                              [styles.isNotReadTutorsMessageContainerBg]:
                                lastMessage?.senderId !== tutor?.id &&
                                !lastMessage?.isRead,
                              [styles.selectStudentChatContainerImgAndMessage]:
                                chat.id === selectChat?.id,
                            }
                          )}
                          key={chat.id}
                        >
                          <Image
                            className={styles.studentChatImg}
                            src={
                              chat.student.avatarUrl
                                ? `${chat.student.avatarUrl}`
                                : `/img/tutor/avatarBasic.png`
                            }
                            width={45}
                            height={45}
                            alt=""
                          />
                          <div className={styles.studentChatMessage}>
                            <div className={styles.studentChatMessageFio}>
                              <span
                                className={styles.studentChatMessageFioText}
                              >
                                {chat.student.name + " "}
                              </span>
                              <span className={styles.textThemeOrder}>
                                {chat.themeOrder}
                              </span>
                            </div>

                            <div className={styles.studentChatMessageFlx}>
                              {chat.tutorHasAccess ? (
                                <div
                                  className={styles.studentChatMessageText}
                                  dangerouslySetInnerHTML={{
                                    __html: formatTextWithLinks(
                                      lastMessage?.text
                                    ),
                                  }}
                                />
                              ) : (
                                <div className={styles.studentChatMessageText}>
                                  Ученик заинтересовался вашим профилем и
                                  отправил предложение на занятия
                                </div>
                              )}

                              {lastMessage?.senderId === tutor?.id ? (
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
                              ) : (
                                !lastMessage?.isRead && (
                                  <div
                                    className={
                                      styles.isNotReadTutorsMessageCount
                                    }
                                  >
                                    {
                                      chat.messages.filter(
                                        (msg) =>
                                          !msg.isRead &&
                                          msg.senderId !== tutor?.id
                                      ).length
                                    }
                                  </div>
                                )
                              )}
                            </div>

                            <div className={styles.studentChatMessageDate}>
                              {lastMessage &&
                                formatTimeAgo(lastMessage?.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
