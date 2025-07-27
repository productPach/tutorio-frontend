import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import Image from "next/image";
import chatStyles from "./Chat.module.css"; // путь к стилям поправь под себя
import styles from "../Order/Order.module.css";
import { Message } from "@/types/types";
import DOMPurify from "dompurify";

type Props = {
  chatId: string;
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

const GroupedMessages: React.FC<Props> = ({ chatId, messages, studentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(50);
  const isInitialScrollDone = useRef(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const prevChatId = useRef<string | null>(null);

  const prevScrollHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0);

  const sortedMessages = useMemo(() => {
    return messages
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return sortedMessages.filter((message) => {
      if (message.type === "service") {
        return (
          message.recipientRole === undefined ||
          message.recipientRole === null ||
          message.recipientRole === "student"
        );
      }
      return true; // user-сообщения всегда отображаются
    });
  }, [sortedMessages]);

  const visibleMessages = useMemo(() => {
    return filteredMessages.slice(
      Math.max(0, filteredMessages.length - visibleCount)
    );
  }, [filteredMessages, visibleCount]);

  // Скроллим вниз при первой загрузке после рендера сообщений
  useEffect(() => {
    if (chatId !== prevChatId.current) {
      isInitialScrollDone.current = false;
      prevChatId.current = chatId;
    }
  }, [chatId]);

  useEffect(() => {
    if (!isInitialScrollDone.current && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
      isInitialScrollDone.current = true;
    }
  }, [visibleMessages.length]);

  const groupedMessages = useMemo(() => {
    return visibleMessages.reduce(
      (acc: JSX.Element[], message, index, allMessages) => {
        const currentDate = new Date(message.createdAt).toDateString();
        const prevDate =
          index > 0
            ? new Date(allMessages[index - 1].createdAt).toDateString()
            : null;

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

        const shouldShowDate = currentDate !== prevDate;

        const isServiceMessage = message.type === "service";
        const isServiceForStudent =
          isServiceMessage && message.recipientRole === "student";
        const isFromStudent = message.senderId === studentId;

        // Выбираем класс в зависимости от условий
        const messageClassName = clsx(
          chatStyles.chat__message,
          isServiceForStudent
            ? chatStyles.chat__message__service
            : isFromStudent
              ? chatStyles.chat__message__right
              : chatStyles.chat__message__left
        );

        if (shouldShowDate) {
          acc.push(
            <div
              key={`date-${message.createdAt}`}
              className={chatStyles.chat__date}
            >
              {formatChatDate(message.createdAt)}
            </div>
          );
        }

        acc.push(
          <div
            key={message.id}
            ref={index === allMessages.length - 1 ? lastMessageRef : null}
            className={messageClassName}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: formatTextWithLinks(message.text),
              }}
            />
            {!isServiceForStudent && (
              <div
                className={clsx(chatStyles.flxRow, chatStyles.jstContFlxEnd)}
              >
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
            )}
          </div>
        );

        return acc;
      },
      []
    );
  }, [visibleMessages, studentId]);

  // Подгрузка старых сообщений без прыжков
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 200) return;

    prevScrollHeightRef.current = container.scrollHeight;
    prevScrollTopRef.current = container.scrollTop;

    setVisibleCount((prev) => {
      if (prev >= messages.length) return prev;
      return prev + 50;
    });
  };
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeightRef.current;

    // Восстанавливаем скролл
    container.scrollTop = prevScrollTopRef.current + heightDiff;
  }, [visibleMessages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // const isUserAtBottom =
    //   container.scrollHeight - container.scrollTop - container.clientHeight <
    //   100;

    // Тут нужно добавить проверка на сообщение. Если это сообщение текущего пользователя, то скроллить вниз. Если нет, то не скроллить

    if (lastMessageRef.current) {
      //lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      lastMessageRef.current.scrollIntoView();
    }
  }, [messages.length]);

  // ВОТ ВАРИАНТ СО СКРОЛЛОМ ТОЛЬКО ОТ ТЕКУЩЕГО ПОЛЬЗАКА, НО ТУТ НУЖНО ДОБАВЛЯТЬ ХИТРУЮ ЛОГИ С ЧТЕНИЕМ СООБЩЕНИЯ, ЧТОБЫ СОКЕТ О ЧТЕНИИ УЛЕТАЛ ТОЛЬКО ЕСЛИ ПОЛЬЗАК РЕАЛЬНО ДОШЕЛ СКРОЛЛОМ ДО СООБЩЕНИЯ, А НЕ СИДЕЛ ГДЕ ТО ВЫШЕ

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   // Получаем последнее сообщение
  //   const lastMessage = messages[messages.length - 1];

  //   // Проверяем, если последнее сообщение отправлено текущим пользователем
  //   const isLastMessageFromUser = lastMessage?.senderId === studentId;

  //   if (isLastMessageFromUser && lastMessageRef.current) {
  //     lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages.length, studentId, messages]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        chatStyles.chat__block,
        chatStyles.flx1,
        chatStyles.padng18
      )}
    >
      {groupedMessages}
    </div>
  );
};

export default React.memo(GroupedMessages);
