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

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
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
                            {lastMessage?.text}
                          </div>

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
                          ) : (
                            !lastMessage.isRead && (
                              <div
                                className={styles.isNotReadTutorsMessageCount}
                              >
                                {
                                  chat.messages.filter(
                                    (msg) =>
                                      !msg.isRead &&
                                      msg.senderId !== student?.id
                                  ).length
                                }
                              </div>
                            )
                          )}
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
