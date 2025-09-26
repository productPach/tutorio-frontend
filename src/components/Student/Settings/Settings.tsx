import { FC, useState } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "../../Tutor/Settings/Settings.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Student } from "@/types/types";
import {
  setIsModalDelete,
  setIsModalEmail,
  setIsModalExit,
  setIsModalPhone,
  setIsModalTelegram,
} from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import Image from "next/image";
import "dotenv/config";
import { updateStudent } from "@/store/features/studentSlice";

type SettingsProps = {
  student: Student | null;
  logout: () => void;
};

export const Settings: FC<SettingsProps> = ({ student, logout }) => {
  const dispatch = useAppDispatch();
  // Получаем значение student из Redux
  const student2 = useAppSelector((state) => state.student.student); // Получаем tutor из Redux
  const isVerifiedEmail = student?.isVerifedEmail;

  // Состояние для свитча получения уведомлений
  const [isCheckedNotifications, setIsCheckedNotifications] = useState(
    student?.isNotifications || false
  );
  const toggleSwitchNotifications = () => {
    setIsCheckedNotifications((prev) => {
      const isNotifications = !prev;
      update({ isNotifications }); // Передаем новое значение
      return isNotifications;
    });
  };

  // Состояние для свитча получения уведомлений об откликах репетиторов
  const [isCheckedNotificationsResponse, setIsCheckedNotificationsResponse] =
    useState(student?.isNotificationsResponse || false);
  const toggleSwitchNotificationsResponse = () => {
    setIsCheckedNotificationsResponse((prev) => {
      const isNotificationsResponse = !prev;
      update({ isNotificationsResponse }); // Передаем новое значение
      return isNotificationsResponse;
    });
  };

  // Состояние для свитча получения уведомлений об акциях, скидках и новостях
  const [isCheckedNotificationsPromo, setIsCheckedNotificationsPromo] =
    useState(student?.isNotificationsPromo || false);
  const toggleSwitchNotificationsPromo = () => {
    setIsCheckedNotificationsPromo((prev) => {
      const isNotificationsPromo = !prev;
      update({ isNotificationsPromo }); // Передаем новое значение
      return isNotificationsPromo;
    });
  };

  // Состояние для свитча получения уведомлений по смс
  const [isCheckedNotificationsSms, setIsCheckedNotificationsSms] = useState(
    student?.isNotificationsSms || false
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
    useState(student?.isNotificationsEmail || false);
  const toggleSwitchNotificationsEmail = () => {
    setIsCheckedNotificationsEmail((prev) => {
      const isNotificationsEmail = !prev;
      update({ isNotificationsEmail }); // Передаем новое значение
      return isNotificationsEmail;
    });
  };

  // Состояние для свитча получения уведомлений в телеграм
  const [isCheckedNotificationsTelegram, setIsCheckedNotificationsTelegram] =
    useState(student?.isNotificationsTelegram || false);
  const toggleSwitchNotificationsTelegram = () => {
    setIsCheckedNotificationsTelegram((prev) => {
      const isNotificationsTelegram = !prev;
      update({ isNotificationsTelegram }); // Передаем новое значение
      return isNotificationsTelegram;
    });
  };

  // Состояние для свитча получения уведомлений в ВК
  const [isCheckedNotificationsVk, setIsCheckedNotificationsVk] = useState(
    student?.isNotificationsVk || false
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
      isNotifications: boolean;
      isNotificationsResponse: boolean;
      isNotificationsPromo: boolean;
      isNotificationsSms: boolean;
      isNotificationsEmail: boolean;
      isNotificationsTelegram: boolean;
      isNotificationsVk: boolean;
    }>
  ) => {
    if (student) {
      const id = student.id;
      const status = student?.status;
      dispatch(
        updateStudent({
          id,
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
          <span className={componentStyle.containerSpan}>Уведомления</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Получать уведомления</div>
              <span className={componentStyle.containerSpan}>
                Будем отправлять вам уведомления на указанные каналы связи
              </span>
            </div>
            <div className={styles.inputContainerSwitch}>
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
                <div>Отклики от репетиторов</div>
                <span className={componentStyle.containerSpan}>
                  Уведомления о новых откликах от репетиторов в заказах
                </span>
              </div>
              <div className={styles.inputContainerSwitch}>
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
              <div className={styles.inputContainerSwitch}>
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
              <div className={styles.inputContainerSwitch}>
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
              <div className={styles.inputContainerSwitch}>
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
                {student?.phone &&
                  " " + formatPhoneNumber(student.phone).formattedWithStars}
              </span>
            </div>
            <div className={styles.inputContainerSwitch}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalPhone(true));
                }}
                className={componentStyle.img}
                src={
                  student?.phone
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
                {student2?.email
                  ? isVerifiedEmail
                    ? student2?.email
                    : `Подтвердите почту`
                  : "Не показывается в анкете. Мы будем отправлять на неё уведомления о новых заказах и откликах учеников"}
              </span>
            </div>
            <div className={styles.inputContainerSwitch}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalEmail(true));
                }}
                className={componentStyle.img}
                src={
                  student?.email
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
                {student?.telegram
                  ? student?.telegram
                  : "Не показывается в анкете. Ученик получит его только при обмене контактами"}
              </span>
            </div>
            <div className={styles.inputContainerSwitch}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalTelegram(true));
                }}
                className={componentStyle.img}
                src={
                  student?.telegram
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
              <div>Skype</div>
              <span className={componentStyle.containerSpan}>
                {student?.skype
                  ? student?.skype
                  : "Не показывается в анкете. Ученик получит его только при обмене контактами"}
              </span>
            </div>
            <div className={styles.inputContainerSwitch}>
              <Image
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setIsModalSkype(true));
                }}
                className={componentStyle.img}
                src={
                  student?.skype
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
              onClick={() => dispatch(setIsModalExit(true))}
            >
              Выйти из аккаунта
            </div>
            <div
              className={componentStyle.link}
              onClick={() => dispatch(setIsModalDelete(true))}
            >
              Удалить аккаунт
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
