import { useState } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Settings.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateTutor } from "@/store/features/tutorSlice";

export const Settings = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

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
          <span>Деятельность</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Публичная анкета</div>
              <span>
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
              <span>
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
          <span>Уведомления</span>

          <div className={styles.containerEntityShowEnd}>
            <div className={styles.containerEntityTitleDescription}>
              <div>Получать уведомления</div>
              <span>
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
            <span>Типы уведомлений</span>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>Новые заказы</div>
                <span>
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
                <span>Уведомления о новых откликах от учеников в заказах</span>
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
                <span>Информируем вас о скидках, акциях и важных новостях</span>
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
            <span>Куда отправлять уведомления</span>

            <div className={styles.containerEntityShowEnd}>
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
            </div>

            <div className={styles.containerEntityShowEnd}>
              <div className={styles.containerEntityTitleDescription}>
                <div>E-mail</div>
                <span>Уведомления о новых откликах от учеников в заказах</span>
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
                <span>Информируем вас о скидках, акциях и важных новостях</span>
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
                <span>Информируем вас о скидках, акциях и важных новостях</span>
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
          <span>Данные</span>
        </div>
      </div>

      <div className={styles.content_block}>
        <div className={componentStyle.container}>
          <span>Безопасность</span>
        </div>
      </div>
    </>
  );
};
