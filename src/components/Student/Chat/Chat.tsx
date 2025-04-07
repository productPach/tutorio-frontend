"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "../Order/Order.module.css";
import chatStyles from "./Chat.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { City, Order, Student } from "@/types/types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setComponentMenu } from "@/store/features/orderSlice";
import Image from "next/image";
import Link from "next/link";
import { host, port } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";

type OrderProps = {
  loading?: boolean;
  student?: Student | null;
  orderById?: Order | null;
  error?: string | null;
  locations?: City[];
};

export const ChatComponent = ({
  loading,
  student,
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
  // Получаем чат из редакса
  const chat = useAppSelector((state) => state.chat.chat);
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
                width={40}
                height={40}
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
          {chat?.messages.map((message) =>
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
                  className={clsx(chatStyles.flxRow, chatStyles.jstContFlxEnd)}
                >
                  <span>22:34</span>
                  <img src="/media/img_static/check_read.svg" width="18" />
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
                  className={clsx(chatStyles.flxRow, chatStyles.jstContFlxEnd)}
                >
                  <span>22:34</span>
                </div>
              </div>
            )
          )}

          {/* <div className={clsx(chatStyles.chat__date)}>Запрос закрыт</div> */}

          {/* <div className={clsx(chatStyles.chat__date)}>Вчера</div> */}

          {/* <div className={clsx(chatStyles.chat__date)}>Четверг, 7 марта</div> */}

          {/* <div className={clsx(chatStyles.chat__date)}>
            Оператор Анастасия взяла ваш запрос в работу
          </div> */}

          {/* <div className={clsx(chatStyles.chat__date)}>
            Вы создали запрос #234-344 с темой "Как выглядит моя анкета для
            ученика?"
          </div> */}
          {/* <div className={clsx(chatStyles.chat__date)}>Среда, 6 марта</div> */}
        </div>
        <div className={clsx(chatStyles.inputMessageBlock)}>
          <input
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
