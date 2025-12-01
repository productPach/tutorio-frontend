import { FC, useState } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Settings.module.css";
import buttonStyle from "../SideBar/ResponseSidbar.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateTutor } from "@/store/features/tutorSlice";
import { Tutor } from "@/types/types";
import {
  setIsModalConnectTelegram,
  setIsModalDelete,
  setIsModalEmail,
  setIsModalExit,
  setIsModalPhone,
  setIsModalSkype,
  setIsModalTelegram,
  setIsSheetConnectTelegram,
  setIsSheetDelete,
  setIsSheetEmail,
  setIsSheetExit,
  setIsSheetPhone,
  setIsSheetTelegram,
} from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import Image from "next/image";
import "dotenv/config";
import clsx from "clsx";
import { getTelegramConnectLink } from "@/store/features/notificationSlice";
import { Modal } from "@/components/Modal/Modal";
import { TelegramConnectModal } from "../Modal/Settings/TelegramConnectModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";

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

  const isModalConnectTelegram = useAppSelector(
    (state) => state.modal.isModalConnectTelegram
  );
  const isSheetConnectTelegram = useAppSelector(
    (state) => state.modal.isSheetConnectTelegram
  );

  // Состояние для свитча публичной анкеты
  const [isCheckedPublic, setIsCheckedPublic] = useState(
    tutor?.isPublicProfile || false
  );
  const toggleSwitchPublic = () => {
    const newValue = !isCheckedPublic; // вычисляем новое значение
    setIsCheckedPublic(newValue); // обновляем локальное состояние
    update({ isPublicProfile: newValue }); // вызываем dispatch после setState
  };

  // Состояние для свитча получения откликов
  const [isCheckedResponse, setIsCheckedResponse] = useState(
    tutor?.isStudentResponses || false
  );
  const toggleSwitchResponse = () => {
    const newValue = !isCheckedResponse;
    setIsCheckedResponse(newValue);
    update({ isStudentResponses: newValue });
  };

  // Состояние для свитча получения уведомлений
  const [isCheckedNotifications, setIsCheckedNotifications] = useState(
    tutor?.isNotifications || false
  );
  const toggleSwitchNotifications = () => {
    const newValue = !isCheckedNotifications;
    setIsCheckedNotifications(newValue);
    update({ isNotifications: newValue });
  };

  // Состояние для свитча получения уведомлений о новых заказах
  const [isCheckedNotificationsOrders, setIsCheckedNotificationsOrders] =
    useState(tutor?.isNotificationsOrders || false);
  const toggleSwitchNotificationsOrders = () => {
    const newValue = !isCheckedNotificationsOrders;
    setIsCheckedNotificationsOrders(newValue);
    update({ isNotificationsOrders: newValue });
  };

  // Состояние для свитча получения уведомлений об откликах учеников
  const [isCheckedNotificationsResponse, setIsCheckedNotificationsResponse] =
    useState(tutor?.isNotificationsResponse || false);
  const toggleSwitchNotificationsResponse = () => {
    const newValue = !isCheckedNotificationsResponse;
    setIsCheckedNotificationsResponse(newValue);
    update({ isNotificationsResponse: newValue });
  };

  // Состояние для свитча получения уведомлений об акциях, скидках и новостях
  const [isCheckedNotificationsPromo, setIsCheckedNotificationsPromo] =
    useState(tutor?.isNotificationsPromo || false);
  const toggleSwitchNotificationsPromo = () => {
    const newValue = !isCheckedNotificationsPromo;
    setIsCheckedNotificationsPromo(newValue);
    update({ isNotificationsPromo: newValue });
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
    const newValue = !isCheckedNotificationsEmail;
    setIsCheckedNotificationsEmail(newValue);
    update({ isNotificationsEmail: newValue });
  };

  // Состояние для свитча получения уведомлений в телеграм
  const [isCheckedNotificationsTelegram, setIsCheckedNotificationsTelegram] =
    useState(tutor?.isNotificationsTelegram || false);

  const toggleSwitchNotificationsTelegram = () => {
    if (!tutor?.isNotificationsTelegram) {
      tutor && dispatch(getTelegramConnectLink(tutor.id));
      if (window.innerWidth < 769) {
        dispatch(setIsSheetConnectTelegram(true)); // открываем шторку
      } else {
        dispatch(setIsModalConnectTelegram(true)); // открываем модалку
      }
    } else {
      const newValue = !isCheckedNotificationsTelegram; // вычисляем новое значение
      setIsCheckedNotificationsTelegram(newValue); // обновляем стейт
      update({ isNotificationsTelegram: newValue }); // отдельно вызываем update
    }
  };

  const handleTelegramConnected = () => {
    setIsCheckedNotificationsTelegram(true);
    update({ isNotificationsTelegram: true });
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
      dispatch(
        updateTutor({
          id,
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
              <span
                className={
                  tutor?.isNotifications
                    ? componentStyle.containerSpan
                    : componentStyle.redText
                }
              >
                {tutor?.isNotifications
                  ? "Будем отправлять вам\u00A0уведомления на\u00A0указанные каналы связи"
                  : "⚠️\u00A0Уведомления отключены"}
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
                <span
                  className={
                    tutor?.isNotificationsOrders
                      ? componentStyle.containerSpan
                      : componentStyle.redText
                  }
                >
                  {tutor?.isNotificationsOrders
                    ? "Уведомления о\u00A0новых заказах"
                    : "⚠️\u00A0Уведомления о\u00A0новых заказах отключены"}
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
                <span
                  className={
                    tutor?.isNotificationsResponse
                      ? componentStyle.containerSpan
                      : componentStyle.redText
                  }
                >
                  {tutor?.isNotificationsResponse
                    ? "Уведомления о\u00A0новых откликах от\u00A0учеников в\u00A0заказах"
                    : "⚠️\u00A0Уведомления о\u00A0новых откликах от\u00A0учеников в\u00A0заказах отключены"}
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

            {/* <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>СМС</div>
                <span>
                  Получите уведомления о заказах, которые соответствуют вашим
                  условиям
                </span>
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
            </div> */}

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
                <span
                  className={
                    tutor?.telegramId && tutor?.isNotificationsTelegram
                      ? componentStyle.containerSpan
                      : componentStyle.redText
                  }
                >
                  {tutor?.telegramId && tutor?.isNotificationsTelegram
                    ? "Telegram привязан, уведомления подключены"
                    : tutor?.telegramId && !tutor?.isNotificationsTelegram
                      ? "⚠️\u00A0Уведомления в\u00A0Telegram отключены"
                      : !tutor?.telegramId && tutor?.isNotificationsTelegram
                        ? "Привяжите Telegram, чтобы\u00A0получать уведомления о\u00A0новых заказах и\u00A0откликах учеников"
                        : "Привяжите Telegram, чтобы\u00A0получать уведомления о\u00A0новых заказах и\u00A0откликах учеников"}
                </span>

                {/* <span className={componentStyle.containerSpan}>
                  Получайте уведомления о заказах, которые соответствуют вашим
                  условиям
                </span> */}
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

            {/* <div className={buttonStyle.button}>
              <button
                className={clsx(
                  buttonStyle.jtfCntSpBtwn,
                  buttonStyle.buttonYlw
                )}
                onClick={(e) => {
                  e.preventDefault();
                  tutor?.id && dispatch(getTelegramConnectLink(tutor?.id));
                }}
                type="button"
              >
                <span className={styles.textButton}>
                  Привязать аккаунт Telegram
                </span>
              </button>
            </div> */}

            {/* <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Вконтакте</div>
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
            </div> */}
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
                  if (window.innerWidth < 769) {
                    dispatch(setIsSheetPhone(true)); // Открываем шторку
                  } else {
                    dispatch(setIsModalPhone(true));
                  }
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

          <div id={"e-mail"} className={styles.containerEntityShowEnd}>
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
                    : `Подтвердите почту. Без этого не сможем отправлять вам уведомления о новых заказах и откликах учеников`
                  : "Не показывается в анкете. Мы будем отправлять на неё уведомления о новых заказах и откликах учеников"}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth < 769) {
                    dispatch(setIsSheetEmail(true)); // Открываем шторку
                  } else {
                    dispatch(setIsModalEmail(true));
                  }
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

          {/* <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Telegram</div>
              <span className={componentStyle.containerSpan}>
                {tutor?.telegram ? tutor?.telegram : "Не показывается в анкете"}
              </span>
            </div>
            <div className={styles.inputContainer}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth < 769) {
                    dispatch(setIsSheetTelegram(true)); // Открываем шторку
                  } else {
                    dispatch(setIsModalTelegram(true));
                  }
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
          </div> */}

          {/* <div className={styles.containerEntityShowEnd}>
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
          </div> */}
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span className={componentStyle.containerSpan}>Безопасность</span>
          <div className={componentStyle.containerEntityLink}>
            <div
              className={componentStyle.link}
              onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth < 769) {
                  dispatch(setIsSheetExit(true)); // Открываем шторку
                } else {
                  dispatch(setIsModalExit(true));
                }
              }}
            >
              Выйти из аккаунта
            </div>
            <div
              className={componentStyle.link}
              onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth < 769) {
                  dispatch(setIsSheetDelete(true)); // Открываем шторку
                } else {
                  dispatch(setIsModalDelete(true));
                }
              }}
            >
              Удалить аккаунт
            </div>
          </div>
        </div>
      </div>
      <Modal
        titleModal={"Уведомления в Telegram"}
        contentModal={
          <TelegramConnectModal
            tutor={tutor}
            onConnected={handleTelegramConnected}
          />
        }
        isModal={isModalConnectTelegram}
        modalId={"telegramConnect"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetConnectTelegram}
        onClose={() => dispatch(setIsSheetConnectTelegram(false))}
      >
        <TelegramConnectModal
          tutor={tutor}
          onConnected={handleTelegramConnected}
        />
      </BottomSheet>
    </>
  );
};
