"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "./ResponseSidbar.module.css";
import stylesStudent from "../Student.module.css";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import {
  setIsModalResponseStudentToTutor,
  setTutorIdForResponseStudentToTutor,
} from "@/store/features/modalSlice";
import Image from "next/image";
import Player from "lottie-react";
import Notification from "../../../../public/lottie/Notification.json"; // JSON-анимация
import ChatAnimation from "../../../../public/lottie/Chat.json"; // JSON-анимация
import { setComponentMenu, updateOrder } from "@/store/features/orderSlice";
import { Chat, Order, Tutor } from "@/types/types";
import clsx from "clsx";
import { getBackendUrl, host, port } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import { setChat } from "@/store/features/chatSlice";
import { useRouter } from "next/navigation";
import { SpinnerChats } from "@/components/Spinner/SpinnerChats";
import { getVisibleMessagesForRole } from "@/utils/chat/getVisibleMessagesForRole";

type ResponseSidbarProps = {
  chats: Chat[];
  clearChats: () => void;
  orderById: Order | null;
  loading: boolean;
  visibleEmoji?: boolean;
  setVisibleEmoji?: Dispatch<SetStateAction<boolean>>;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  tutor?: Tutor | null; // добавляем tutorId как пропс
  page?: string;
  isChatWithTutor?: boolean | null;
};

export const ResponseSidbar = ({
  chats,
  clearChats,
  orderById,
  loading,
  visibleEmoji,
  setVisibleEmoji,
  isChecked,
  setIsChecked,
  tutor, // принимаем tutorId
  page,
  isChatWithTutor,
}: ResponseSidbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  //const chats = useAppSelector((state) => state.chat.chats);
  const selectChat = useAppSelector((state) => state.chat.chat);
  const student = useAppSelector((state) => state.student.student);
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля sidebarResponse
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );
  const [isSafari, setIsSafari] = useState(false);
  const route = useRouter();
  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearChats();
    };
  }, []);

  const toggleSwitch = () => {
    setIsChecked((prev) => {
      const newState = !prev;
      update(newState); // Передаем новое значение
      return newState;
    });
  };

  const update = (newState: boolean) => {
    if (orderById) {
      const id = orderById.id;
      let status = newState ? "Active" : "Hidden";
      dispatch(
        updateOrder({
          id,
          status,
        })
      ).unwrap();
    }
  };

  useEffect(() => {
    if (orderById) {
      setIsChecked(
        orderById.status === "Active" ||
          orderById.status === "Pending" ||
          orderById.status === "Sending"
      );
    }
  }, [orderById]);
  // Мемоизация сортировки чатов
  const sortedChats = useMemo(() => {
    const chatsWithLastMessage = chats.map((chat) => {
      const visibleMessages = getVisibleMessagesForRole(
        chat.messages,
        "student"
      );

      const sortedMessages = [...visibleMessages].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const lastVisibleMessage = sortedMessages[0];

      return { ...chat, lastVisibleMessage, visibleMessages };
    });

    return chatsWithLastMessage.sort((a, b) => {
      return (
        new Date(b.lastVisibleMessage?.createdAt || 0).getTime() -
        new Date(a.lastVisibleMessage?.createdAt || 0).getTime()
      );
    });
  }, [chats]);

  // Получаем стейт храниения компонента для отображения
  const component = useAppSelector((state) => state.orders.componentMenu);

  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setScrolledDown(scrollTop > 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={generalStyles.sidebarResponse}
        style={isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }}
      >
        {isChatWithTutor === false && component === 4 && tutor && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setIsModalResponseStudentToTutor(true));
                dispatch(setTutorIdForResponseStudentToTutor(tutor.id));
              }}
              className={clsx(
                generalStyles.content_block_button,
                generalStyles.buttonYlw
              )}
            >
              Предложить заказ репетитору
            </button>
          </>
        )}
        {orderById &&
          orderById.chats.length < 1 &&
          (orderById?.status === "Pending" ||
            orderById?.status === "Sending") && (
            <div className={styles.sidebar_filter}>
              <div className={generalStyles.studentSidebarOrderNoResponse}>
                <Player
                  autoplay
                  loop
                  animationData={Notification}
                  style={{ height: "30px", width: "30px" }}
                />
                <div>
                  Рассылаем ваш заказ подходящим репетиторам! 🎯 <br></br>
                  <br></br>
                  Скоро тут появятся отклики ..
                </div>
              </div>
            </div>
          )}

        {orderById?.status === "Active" && orderById.chats.length < 1 && (
          <div className={styles.sidebar_filter}>
            <div className={generalStyles.studentSidebarOrderNoResponse}>
              <Player
                autoplay
                loop
                animationData={ChatAnimation}
                style={{ height: "30px", width: "30px" }}
              />
              <div>
                Ждем отклики репетиторов!&nbsp;⏳ <br></br>
                <br></br>
                Как только появится первый отклик, вы сразу увидите его
                здесь&nbsp;📬
              </div>
            </div>
          </div>
        )}

        {orderById?.status === "Hidden" && orderById.chats.length < 1 && (
          <div className={generalStyles.sidebar_filter}>
            <div className={generalStyles.studentSidebarOrderNoResponse}>
              <div>
                Отклики на заказ отключены!&nbsp;🚫<br></br>
                <br></br>К сожалению, на данный момент нет ни одного
                отклика&nbsp;😔
              </div>
            </div>
          </div>
        )}

        {orderById &&
          (orderById.chats.length > 0 ||
            orderById?.status === "Active" ||
            orderById?.status === "Hidden") && (
            <div className={styles.sidebar_filter}>
              <div className={stylesStudent.containerEntityShowEnd}>
                <div className={stylesStudent.containerEntityTitleDescription}>
                  <div>Получать новые отклики</div>
                </div>
                <div className={stylesStudent.inputContainerSwitch}>
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
            </div>
          )}

        {orderById && orderById.chats.length > 0 && (
          <>
            {chats && chats.length > 0 ? (
              <div
                className={clsx(
                  styles.sidebar_scrollWrapper,
                  scrolledDown && styles.scrollShrink
                )}
              >
                <div className={styles.sidebar_filterForChat}>
                  <div className={styles.studentChatWrap}>
                    {sortedChats.map((chat, index, array) => {
                      if (!chat.tutor) return null;

                      const lastMessage = chat.lastVisibleMessage;
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;

                      const noReadMessagesFromOther =
                        student &&
                        chat.visibleMessages.filter(
                          (message) =>
                            !message.isRead && message.senderId !== student.id
                        );
                      return (
                        <div
                          onClick={() => {
                            dispatch(setComponentMenu(5));
                            dispatch(setChat(chat));
                            // Закрываем блок с эмодзи
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
                                chat.lastMessage?.senderId !== student?.id &&
                                chat.messages.some(
                                  (msg) =>
                                    !msg.isRead && msg.senderId !== student?.id
                                ),
                              [styles.selectStudentChatContainerImgAndMessage]:
                                chat.id === selectChat?.id,
                            }
                          )}
                          key={chat.id}
                        >
                          {chat.tutor && (
                            <Image
                              className={styles.studentChatImg}
                              src={`${getBackendUrl()}${chat?.tutor.avatarUrl}`}
                              width={66}
                              height={66}
                              alt=""
                            />
                          )}
                          <div className={styles.studentChatMessage}>
                            <div className={styles.studentChatMessageFio}>
                              {chat?.tutor?.name}
                            </div>
                            <div className={styles.studentChatMessageFlx}>
                              <div className={styles.studentChatMessageText}>
                                {lastMessage?.text}
                              </div>
                              {lastMessage &&
                              lastMessage.senderId === student?.id ? (
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
                                noReadMessagesFromOther &&
                                noReadMessagesFromOther?.length > 0 && (
                                  <div
                                    className={
                                      styles.isNotReadTutorsMessageCount
                                    }
                                  >
                                    {noReadMessagesFromOther?.length}
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
            ) : (
              <>
                <div className={generalStyles.container__spinner}>
                  <div className={generalStyles.spinner}>
                    <SpinnerChats />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
