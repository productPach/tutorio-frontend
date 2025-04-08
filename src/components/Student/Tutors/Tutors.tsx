"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "../Order/Order.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { City, Order, Student, Tutor } from "@/types/types";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/utils/date/date";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setIsModalResponseStudentToTutor,
  setTutorIdForResponseStudentToTutor,
} from "@/store/features/modalSlice";
import Link from "next/link";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";
import { setChat } from "@/store/features/chatSlice";

type OrderProps = {
  tutorsForOrder: Tutor[];
  citiesAndRegions: City[];
  loading: boolean;
  student: Student | null;
  orderById: Order | null;
  error: string | null;
  locations: City[];
};

export const TutorsComponent = ({
  tutorsForOrder,
  citiesAndRegions,
  loading,
  student,
  orderById,
  error,
}: OrderProps) => {
  const dispatch = useAppDispatch();
  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Массив для хранения слайдов репетитора
  const slidesPerTutor: SlideImage[][] = tutorsForOrder.map((tutor) =>
    tutor.educations.flatMap((diplom) =>
      diplom.isShowDiplom
        ? diplom.educationDiplomUrl
            .slice(0, 6) // Ограничиваем количеством 6
            .map((imgDiplom) => ({
              src: `${host}${port}${imgDiplom}`,
            }))
        : []
    )
  );

  const handleImageClick = (tutorIndex: number, imageIndex: number) => {
    setCurrentImageIndex(imageIndex); // Устанавливаем текущий индекс изображения
    setOpenLightboxIndex(tutorIndex); // Открываем Lightbox для конкретного репетитора
  };

  const handleClose = () => {
    setOpenLightboxIndex(null); // Закрываем Lightbox
  };

  const { scrollPosition, scrollHeight } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(setComponentMenu(2));
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth", // Плавный скролл
      });
    }, 500); // Задержка для плавного скролла
  }, []);

  // Для сохранения позиции
  const saveScrollPosition = () => {
    const scrollPosition = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight; // Получаем высоту документа
    dispatch(updateScrollPosition({ scrollPosition, scrollHeight }));
  };

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  return (
    <>
      {tutorsForOrder.length > 0 ? (
        tutorsForOrder.map((tutor, tutorIndex) => {
          const avatars = [
            "/img/icon/student/avatar/animal1.svg",
            "/img/icon/student/avatar/animal2.svg",
            "/img/icon/student/avatar/animal3.svg",
            "/img/icon/student/avatar/animal4.svg",
            "/img/icon/student/avatar/animal5.svg",
            "/img/icon/student/avatar/animal6.svg",
            "/img/icon/student/avatar/animal7.svg",
          ];

          const randomAvatar =
            avatars[Math.floor(Math.random() * avatars.length)];
          const tutorAvatar = tutor.avatarUrl
            ? `${host}${port}${tutor.avatarUrl}`
            : randomAvatar;

          const regionIndex = citiesAndRegions.findIndex(
            (location) => location.title === tutor.region
          );

          // Получаем текущее время
          const currentTime = new Date();

          // Проверяем, был ли репетитор онлайн в последние 5 минут
          const lastOnlineTime = tutor.lastOnline
            ? new Date(tutor.lastOnline)
            : null;

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

          let hasPassportValid = null;
          let hasGoodReviews = null;
          let hasDocsEducation = null;
          if (tutor.badges.length > 0) {
            if (tutor.badges.includes("Паспорт проверен")) {
              hasPassportValid = (
                <div className={styles.passportControl}>
                  ✅&nbsp;Паспорт проверен
                </div>
              );
            }
            if (tutor.badges.includes("Хорошие отзывы")) {
              hasGoodReviews = (
                <div className={styles.goodReviews}>❤️&nbsp;Хорошие отзывы</div>
              );
            }
            if (tutor.badges.includes("Документы об образовании")) {
              hasDocsEducation = (
                <div className={styles.docsEducation}>🪪&nbsp;Образование</div>
              );
            }
          }

          // Фильтруем цены по предмету заказа
          const relevantPrices = tutor.subjectPrices.filter(
            (price) => price.subjectId === orderById?.subject
          );

          // Проверяем есть ли чат с этим репетитором
          const hasChatWithTutor = orderById?.chats.some(
            (chat) => chat.tutorId === tutor.id
          );
          const chat = orderById?.chats.find(
            (chat) => chat.tutorId === tutor.id
          );

          return (
            <div
              key={tutor.id}
              className={clsx(
                generalStyles.content_block,
                generalStyles.order_block,
                generalStyles.crsr_pntr,
                styles.order_gap
              )}
            >
              <div className={styles.tutorImgFioContainer}>
                <div className={styles.flex1}>
                  <Link
                    href={`./${orderById?.id}/tutor/${tutor.id}`}
                    onClick={() => {
                      saveScrollPosition();
                      dispatch(setComponentMenu(4));
                    }} // Сохраняем скролл при клике
                  >
                    <Image
                      className={styles.tutorImg}
                      src={tutorAvatar}
                      width={120}
                      height={120}
                      alt=""
                    />
                  </Link>
                </div>
                <div className={styles.flex4}>
                  <div
                    className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}
                  >
                    <Link
                      href={`./${orderById?.id}/tutor/${tutor.id}`}
                      onClick={() => {
                        saveScrollPosition();
                        dispatch(setComponentMenu(4));
                      }} // Сохраняем скролл при клике
                    >
                      <h3>{tutor.name}</h3>
                    </Link>
                    {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
                      <div className={styles.containerIsOnline}>
                        <div className={styles.isOnline}></div>
                        <span>{onlineStatus}</span>
                      </div>
                    )}
                  </div>

                  <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
                    <Image
                      src="../../img/icon/location.svg"
                      alt="Геолокация"
                      width={15}
                      height={18}
                      className={styles.header_geoImage}
                    />
                    <span>{`${citiesAndRegions[regionIndex]?.title} и ${citiesAndRegions[regionIndex]?.area}`}</span>
                  </div>
                  {tutor.tutorPlace.length > 0 && (
                    <div
                      className={clsx(styles.containerIsOnline, styles.mt6px)}
                    >
                      {tutor.tutorPlace.includes("1") && (
                        <>
                          Дистанционно&nbsp;🖥️
                          {tutor.tutorPlace.length > 1 && " // "}
                        </>
                      )}
                      {tutor.tutorPlace.includes("2") && (
                        <>
                          У себя&nbsp;🏠
                          {tutor.tutorPlace.includes("3") && " // "}
                        </>
                      )}
                      {tutor.tutorPlace.includes("3") && (
                        <>Выезд к ученику&nbsp;📍</>
                      )}
                    </div>
                  )}
                  <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
                    {hasPassportValid}
                    {hasGoodReviews}
                    {hasDocsEducation}
                  </div>
                </div>
              </div>

              {tutor.profileInfo && (
                <div className={styles.containerOrderInfo}>
                  <span className={styles.titleTutorInfo}>О себе</span>
                  <div className={styles.profileInfoText}>
                    {tutor.profileInfo.length > 450
                      ? `${tutor.profileInfo.slice(0, 450)}...`
                      : tutor.profileInfo}
                  </div>
                </div>
              )}

              {tutor.educations.length > 0 && (
                <div className={styles.containerOrderInfo}>
                  <span className={styles.titleTutorInfo}>Образование</span>

                  <ul>
                    {tutor.educations.map((education) => (
                      <li key={education.id} className={styles.listEducation}>
                        {education.educationInfo} (
                        {education.educationStartYear}-
                        {education.educationEndYear})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {slidesPerTutor[tutorIndex].length > 0 && (
                <div className={styles.containerOrderInfo}>
                  <span className={styles.titleTutorInfo}>
                    Диплом, сертификаты и другие документы
                  </span>

                  <div
                    className={clsx(
                      styles.containerFlxRw,
                      styles.flxWrp,
                      slidesPerTutor[tutorIndex].length > 5 &&
                        styles.jtfCntSpBtwn,
                      styles.gap10
                    )}
                  >
                    {slidesPerTutor[tutorIndex]
                      .slice(0, 6)
                      .map((slide, index) => (
                        <Image
                          key={index}
                          onClick={() => handleImageClick(tutorIndex, index)}
                          src={slide.src}
                          alt="Документ об образовании"
                          width={100}
                          height={100}
                          className={styles.imageDiplomas}
                        />
                      ))}
                  </div>
                </div>
              )}

              {relevantPrices.length > 0 && (
                <div className={styles.containerOrderInfo}>
                  <span className={styles.titleTutorInfo}>
                    Стоимость занятий
                  </span>

                  <table className={generalStyles.table}>
                    <tbody>
                      {relevantPrices.map((price) => (
                        <tr key={price.id} className={generalStyles.tr}>
                          <td className={generalStyles.td}>
                            {price.format === "online" && "Дистанционно"}
                            {price.format === "home" && "У себя дома"}
                            {price.format === "travel" && "Выезд к ученику"}
                            {price.format === "group" && "В группе"}
                          </td>
                          <td className={generalStyles.td}>
                            <b>{price.price} ₽</b>{" "}
                            <span className={generalStyles.text14px}>
                              за {price.duration} минут
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();

                  // Если чат с репетитором существует
                  if (hasChatWithTutor && chat) {
                    // Логика для существующего чата
                    dispatch(setComponentMenu(5));
                    dispatch(setChat(chat));
                    // Можно добавить другие действия, если чат уже существует
                  } else {
                    // Логика для нового чата (если чата нет)
                    dispatch(setIsModalResponseStudentToTutor(true));
                    dispatch(setTutorIdForResponseStudentToTutor(tutor.id));
                    // Можно добавить другие действия для нового чата
                  }
                }}
                className={clsx(
                  generalStyles.content_block_button,
                  {
                    [generalStyles.buttonBlc]: hasChatWithTutor, // Если chat с репетитором есть, добавим этот класс
                    [generalStyles.buttonYlw]: !hasChatWithTutor, // Для случая, когда нет чата с репетитором, можно оставить кнопки желтого цвета
                  },
                  generalStyles.buttonWthCnt, // Этот класс всегда применяется
                  generalStyles.agnCntr
                )}
              >
                {hasChatWithTutor ? "Перейти в чат" : "Предложить заказ"}
              </button>
            </div>
          );
        })
      ) : (
        <div
          className={clsx(
            generalStyles.content_block,
            generalStyles.order_block,
            generalStyles.crsr_pntr,
            styles.order_gap
          )}
        >
          <div className={styles.containerOrderInfo}>
            <div className={styles.subjectName}>
              <h3>Нет подходящих репетиторов 😔</h3>
            </div>
            <div className={styles.goal}>
              Сейчас нет репетиторов, которые подходят под ваш запрос.
              <br></br>
              <br></br>
              Попробуйте изменить параметры заказа — например, добавить
              возможность онлайн-занятий, если это удобно. Так найти подходящего
              репетитора будет проще! 🎯
            </div>
          </div>
        </div>
      )}

      {openLightboxIndex !== null && (
        <Lightbox
          open={openLightboxIndex !== null}
          close={handleClose}
          slides={slidesPerTutor[openLightboxIndex]}
          index={currentImageIndex}
        />
      )}
    </>
  );
};
