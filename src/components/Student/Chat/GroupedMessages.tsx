import React, { useMemo } from "react";
import clsx from "clsx";
import Image from "next/image";
import chatStyles from "./Chat.module.css"; // путь к стилям поправь под себя
import styles from "../Order/Order.module.css";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  isRead?: boolean;
};

type Props = {
  messages: Message[];
  studentId: string;
};

const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const dateLocal = date.toLocaleDateString();
  const nowLocal = now.toLocaleDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayLocal = yesterday.toLocaleDateString();

  if (dateLocal === nowLocal) return "Сегодня";
  if (dateLocal === yesterdayLocal) return "Вчера";

  const weekdays = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const dayOfWeek = weekdays[date.getDay()];
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return `${dayOfWeek}, ${formattedDate}`;
};

const GroupedMessages: React.FC<Props> = ({ messages, studentId }) => {
  // Мемоизация отсортированных сообщений
  const sortedMessages = useMemo(() => {
    return messages
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [messages]);

  // Мемоизация обработки сообщений для отображения
  const groupedMessages = useMemo(() => {
    return sortedMessages.reduceRight(
      (acc: JSX.Element[], message, index, allMessages) => {
        const currentDate = new Date(message.createdAt).toDateString();
        const nextDate =
          index < allMessages.length - 1
            ? new Date(allMessages[index + 1].createdAt).toDateString()
            : null;

        const shouldShowDate = currentDate !== nextDate;

        const isFromStudent = message.senderId === studentId;

        acc.unshift(
          <div
            key={message.id}
            className={clsx(
              chatStyles.chat__message,
              isFromStudent
                ? chatStyles.chat__message__right
                : chatStyles.chat__message__left
            )}
          >
            {message.text}
            <div className={clsx(chatStyles.flxRow, chatStyles.jstContFlxEnd)}>
              <span>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {isFromStudent && (
                <Image
                  className={styles.studentChatIcon}
                  src={
                    message.isRead
                      ? "/../img/icon/isRead.svg"
                      : "/../img/icon/noRead.svg"
                  }
                  width={18}
                  height={18}
                  alt=""
                />
              )}
            </div>
          </div>
        );

        if (shouldShowDate) {
          acc.unshift(
            <div
              key={`date-${message.createdAt}`}
              className={chatStyles.chat__date}
            >
              {formatChatDate(message.createdAt)}
            </div>
          );
        }

        return acc;
      },
      []
    );
  }, [sortedMessages, studentId]);

  return <>{groupedMessages}</>;
};

export default React.memo(GroupedMessages);
