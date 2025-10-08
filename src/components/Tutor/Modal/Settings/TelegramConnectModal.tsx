"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../Profil/Fio/Fio.module.css";
import componentStyles from "./TelegramConnectModal.module.css";
import componentSubjectStyles from "../Profil/Subject/SubjectModal.module.css";
import { FC, useState } from "react";
import { Spinner } from "@/components/Spinner/Spinner";
import { baseUrl } from "@/api/server/configApi";
import { updateTutor } from "@/store/features/tutorSlice";
import { Tutor } from "@/types/types";

type TelegramConnectModalProps = {
  tutor: Tutor | null;
  onConnected?: () => void;
};

export const TelegramConnectModal: FC<TelegramConnectModalProps> = ({
  tutor,
  onConnected,
}) => {
  const dispatch = useAppDispatch();
  //const tutor = useAppSelector((state) => state.tutor.tutor);
  const { link } = useAppSelector((state) => state.notification);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (!link || !tutor) return;

    // Открываем бота сразу при клике
    window.open(link, "_blank");

    // Дальше запускаем проверку подключения
    setLoading(true);

    (async () => {
      try {
        const response = await fetch(`${baseUrl}telegram/connectWebhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tutorId: tutor.id }),
        });

        if (response.ok) {
          setIsConnected(true);
          await dispatch(
            updateTutor({
              id: tutor.id,
              isNotificationsTelegram: true,
            })
          ).unwrap();
          onConnected?.();
        } else {
          const data = await response.json();
          console.error("Ошибка подключения:", data.error);
        }
      } catch (error) {
        console.error("Ошибка при подключении Telegram:", error);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <>
      {!isConnected ? (
        <>
          <div className={styles.description}>Инструкция по подключению:</div>
          <ul className={componentStyles.listUl}>
            <li>
              Нажмите кнопку <b>«Подключить»</b> ниже
            </li>
            <li>
              Откроется страница в&nbsp;браузере с&nbsp;ботом{" "}
              <b>«Tutorio:&nbsp;Заказы&nbsp;учеников»</b>
            </li>
            <li>
              Нажмите <b>«Start&nbsp;Bot»</b>
            </li>
            <li>
              Откроется приложение Telegram и&nbsp;появится сообщение
              «✅&nbsp;Уведомления в&nbsp;Telegram подключены!»
            </li>
          </ul>
        </>
      ) : (
        <div className={componentStyles.success}>
          ✅&nbsp;Уведомления в&nbsp;Telegram успешно подключены!
        </div>
      )}

      <div className={styles.button}>
        {!isConnected && (
          <button type="button" onClick={handleConnect} disabled={loading}>
            Подключить
            {loading && (
              <div className={componentSubjectStyles.buttonYlSpinner}>
                <Spinner />
              </div>
            )}
          </button>
        )}
      </div>
    </>
  );
};
