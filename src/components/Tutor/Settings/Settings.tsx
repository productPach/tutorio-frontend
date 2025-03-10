import { FC, useEffect, useState } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Settings.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getCurrentTutor,
  setTutor,
  updateTutor,
  verifyEmail,
} from "@/store/features/tutorSlice";
import { Tutor } from "@/types/types";
import Link from "next/link";
import {
  setIsModalEmail,
  setIsModalExit,
  setIsModalPhone,
  setIsModalSkype,
  setIsModalTelegram,
} from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import Image from "next/image";
import { io } from "socket.io-client";
import "dotenv/config";
import { host, port } from "@/api/server/configApi";

type SettingsProps = {
  tutor: Tutor | null;
  logout: () => void;
};

export const Settings: FC<SettingsProps> = ({ tutor, logout }) => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);

  const tutor2 = useAppSelector((state) => state.tutor.tutor); // Получаем tutor из Redux
  const isVerifiedEmail = tutor?.isVerifedEmail;

  useEffect(() => {
    //console.log("Connecting to socket...");
    const socket = io(`${host}${port}`);

    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id);

      // Если есть tutorId (или token), отправляем его на сервер для связывания с сокетом
      if (tutor2?.id) {
        socket.emit("setUser", { tutorId: tutor2.id });
        //console.log("Sent tutorId to server:", tutor2.id);
      }
    });

    socket.on("emailVerified", ({ tutorId }) => {
      //console.log("Received emailVerified event", tutorId);
      if (token) {
        dispatch(getCurrentTutor(token));
        //console.log("Email verified, updating tutor data.");
      }
    });

    return () => {
      //console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [dispatch, token, tutor2]);

  // Состояние для свитча публичной анкеты
  const [isCheckedPublic, setIsCheckedPublic] = useState(
    tutor?.isPublicProfile || false
  );
  const toggleSwitchPublic = () => {
    setIsCheckedPublic((prev) => {
      const isPublicProfile = !prev;
      update({ isPublicProfile }); // Передаем новое значение
      return isPublicProfile;
    });
  };

  // Состояние для свитча получения откликов
  const [isCheckedResponse, setIsCheckedResponse] = useState(
    tutor?.isStudentResponses || false
  );
  const toggleSwitchResponse = () => {
    setIsCheckedResponse((prev) => {
      const isStudentResponses = !prev;
      update({ isStudentResponses }); // Передаем новое значение
      return isStudentResponses;
    });
  };

  // Состояние для свитча получения уведомлений
  const [isCheckedNotifications, setIsCheckedNotifications] = useState(
    tutor?.isNotifications || false
  );
  const toggleSwitchNotifications = () => {
    setIsCheckedNotifications((prev) => {
      const isNotifications = !prev;
      update({ isNotifications }); // Передаем новое значение
      return isNotifications;
    });
  };

  // Состояние для свитча получения уведомлений о новых заказах
  const [isCheckedNotificationsOrders, setIsCheckedNotificationsOrders] =
    useState(tutor?.isNotificationsOrders || false);
  const toggleSwitchNotificationsOrders = () => {
    setIsCheckedNotificationsOrders((prev) => {
      const isNotificationsOrders = !prev;
      update({ isNotificationsOrders }); // Передаем новое значение
      return isNotificationsOrders;
    });
  };

  // Состояние для свитча получения уведомлений об откликах учеников
  const [isCheckedNotificationsResponse, setIsCheckedNotificationsResponse] =
    useState(tutor?.isNotificationsResponse || false);
  const toggleSwitchNotificationsResponse = () => {
    setIsCheckedNotificationsResponse((prev) => {
      const isNotificationsResponse = !prev;
      update({ isNotificationsResponse }); // Передаем новое значение
      return isNotificationsResponse;
    });
  };

  // Состояние для свитча получения уведомлений об акциях, скидках и новостях
  const [isCheckedNotificationsPromo, setIsCheckedNotificationsPromo] =
    useState(tutor?.isNotificationsPromo || false);
  const toggleSwitchNotificationsPromo = () => {
    setIsCheckedNotificationsPromo((prev) => {
      const isNotificationsPromo = !prev;
      update({ isNotificationsPromo }); // Передаем новое значение
      return isNotificationsPromo;
    });
  };

  // Состояние для свитча получения уведомлений по смс
  const [isCheckedNotificationsSms, setIsCheckedNotificationsSms] = useState(
    tutor?.isNotificationsSms || false
  );
  const toggleSwitchNotificationsSms = () => {
    setIsCheckedNotificationsSms((prev) => {
      const isNotificationsSms = !prev;
      update({ isNotificationsSms }); // Передаем новое значение
      return isNotificationsSms;
    });
  };

  // Состояние для свитча получения уведомлений на e-mail
  const [isCheckedNotificationsEmail, setIsCheckedNotificationsEmail] =
    useState(tutor?.isNotificationsEmail || false);
  const toggleSwitchNotificationsEmail = () => {
    setIsCheckedNotificationsEmail((prev) => {
      const isNotificationsEmail = !prev;
      update({ isNotificationsEmail }); // Передаем новое значение
      return isNotificationsEmail;
    });
  };

  // Состояние для свитча получения уведомлений в телеграм
  const [isCheckedNotificationsTelegram, setIsCheckedNotificationsTelegram] =
    useState(tutor?.isNotificationsTelegram || false);
  const toggleSwitchNotificationsTelegram = () => {
    setIsCheckedNotificationsTelegram((prev) => {
      const isNotificationsTelegram = !prev;
      update({ isNotificationsTelegram }); // Передаем новое значение
      return isNotificationsTelegram;
    });
  };

  // Состояние для свитча получения уведомлений в ВК
  const [isCheckedNotificationsVk, setIsCheckedNotificationsVk] = useState(
    tutor?.isNotificationsVk || false
  );
  const toggleSwitchNotificationsVk = () => {
    setIsCheckedNotificationsVk((prev) => {
      const isNotificationsVk = !prev;
      update({ isNotificationsVk }); // Передаем новое значение
      return isNotificationsVk;
    });
  };

  const update = (
    updates: Partial<{
      isPublicProfile: boolean;
      isStudentResponses: boolean;
      isNotifications: boolean;
      isNotificationsOrders: boolean;
      isNotificationsResponse: boolean;
      isNotificationsPromo: boolean;
      isNotificationsSms: boolean;
      isNotificationsEmail: boolean;
      isNotificationsTelegram: boolean;
      isNotificationsVk: boolean;
    }>
  ) => {
    if (tutor && token) {
      const id = tutor.id;
      const status = tutor?.status;
      dispatch(
        updateTutor({
          id,
          token,
          status,
          ...updates, // Передаем только измененные поля
        })
      ).unwrap();
    }
  };

  return (
    <>
      <div className={styles.content_block}>
        <h3>Настройки</h3>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span className={componentStyle.containerSpan}>Деятельность</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Публичная анкета</div>
              <span className={componentStyle.containerSpan}>
                Анкета размещена в публичной части сайта, а также индексируется
                поисковиками
              </span>
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.iosSwitch}>
                <input
                  type="checkbox"
                  checked={isCheckedPublic}
                  onChange={toggleSwitchPublic}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Получать отклики от учеников</div>
              <span className={componentStyle.containerSpan}>
                Анкета будет доступна ученикам в процессе оформления заказа, они
                смогут написать вам первыми
              </span>
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.iosSwitch}>
                <input
                  type="checkbox"
                  checked={isCheckedResponse}
                  onChange={toggleSwitchResponse}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span className={componentStyle.containerSpan}>Уведомления</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Получать уведомления</div>
              <span className={componentStyle.containerSpan}>
                Будем отправлять вам уведомления на указанные каналы связи
              </span>
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.iosSwitch}>
                <input
                  type="checkbox"
                  checked={isCheckedNotifications}
                  onChange={toggleSwitchNotifications}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {isCheckedNotifications && (
        <div className={styles.content_block}>
          <div className={componentStyle.container}>
            <span className={componentStyle.containerSpan}>
              Типы уведомлений
            </span>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Новые заказы</div>
                <span className={componentStyle.containerSpan}>
                  Получите уведомления о заказах, которые соответствуют вашим
                  условиям
                </span>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsOrders}
                    onChange={toggleSwitchNotificationsOrders}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Отклики от учеников</div>
                <span className={componentStyle.containerSpan}>
                  Уведомления о новых откликах от учеников в заказах
                </span>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsResponse}
                    onChange={toggleSwitchNotificationsResponse}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Скидки, акции и новости</div>
                <span className={componentStyle.containerSpan}>
                  Информируем вас о скидках, акциях и важных новостях
                </span>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsPromo}
                    onChange={toggleSwitchNotificationsPromo}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCheckedNotifications && (
        <div className={styles.content_block}>
          <div className={componentStyle.container}>
            <span className={componentStyle.containerSpan}>
              Куда отправлять уведомления
            </span>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>СМС</div>
                {/* <span>
                  Получите уведомления о заказах, которые соответствуют вашим
                  условиям
                </span> */}
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsSms}
                    onChange={toggleSwitchNotificationsSms}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>E-mail</div>
                {/* <span>Уведомления о новых откликах от учеников в заказах</span> */}
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsEmail}
                    onChange={toggleSwitchNotificationsEmail}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Telegram</div>
                {/* <span>Информируем вас о скидках, акциях и важных новостях</span> */}
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsTelegram}
                    onChange={toggleSwitchNotificationsTelegram}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Вконтакте</div>
                {/* <span>Информируем вас о скидках, акциях и важных новостях</span> */}
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.iosSwitch}>
                  <input
                    type="checkbox"
                    checked={isCheckedNotificationsVk}
                    onChange={toggleSwitchNotificationsVk}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span className={componentStyle.containerSpan}>Данные</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Телефон</div>
              <span className={componentStyle.containerSpan}>
                +7
                {tutor?.phone &&
                  " " + formatPhoneNumber(tutor.phone).formattedWithStars}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalPhone(true));
                }}
                className={componentStyle.img}
                src={
                  tutor?.phone
                    ? "/../img/icon/tutor/pencilSimple.svg"
                    : "/../img/icon/tutor/plus.svg"
                }
                alt="Общая информация"
                width={21}
                height={21}
              />
            </div>
          </div>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>E-mail</div>
              <span
                className={
                  !isVerifiedEmail
                    ? componentStyle.redText
                    : componentStyle.containerSpan
                }
              >
                {tutor2?.email
                  ? isVerifiedEmail
                    ? tutor2?.email
                    : `Подтвердите почту`
                  : "Не показывается в анкете. Мы будем отправлять на неё уведомления о новых заказах и откликах учеников"}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalEmail(true));
                }}
                className={componentStyle.img}
                src={
                  tutor?.email
                    ? "/../img/icon/tutor/pencilSimple.svg"
                    : "/../img/icon/tutor/plus.svg"
                }
                alt="Общая информация"
                width={21}
                height={21}
              />
            </div>
          </div>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Telegram</div>
              <span className={componentStyle.containerSpan}>
                {tutor?.telegram
                  ? tutor?.telegram
                  : "Не показывается в анкете. Ученик получит его только при обмене контактами"}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalTelegram(true));
                }}
                className={componentStyle.img}
                src={
                  tutor?.telegram
                    ? "/../img/icon/tutor/pencilSimple.svg"
                    : "/../img/icon/tutor/plus.svg"
                }
                alt="Общая информация"
                width={21}
                height={21}
              />
            </div>
          </div>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Skype</div>
              <span className={componentStyle.containerSpan}>
                {tutor?.skype
                  ? tutor?.skype
                  : "Не показывается в анкете. Ученик получит его только при обмене контактами"}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalSkype(true));
                }}
                className={componentStyle.img}
                src={
                  tutor?.skype
                    ? "/../img/icon/tutor/pencilSimple.svg"
                    : "/../img/icon/tutor/plus.svg"
                }
                alt="Общая информация"
                width={21}
                height={21}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span className={componentStyle.containerSpan}>Безопасность</span>
          <div className={componentStyle.containerEntityLink}>
            <div
              className={componentStyle.link}
              onClick={() => dispatch(setIsModalExit(true))}
            >
              Выйти из аккаунта
            </div>
            <Link className={componentStyle.link} href={""}>
              Удалить аккаунт
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
