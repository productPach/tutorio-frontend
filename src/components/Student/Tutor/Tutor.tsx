"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "../Order/Order.module.css";
import tutorsStyles from "../Tutors/Tutors.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { Chat, City, Order, Tutor } from "@/types/types";
import Image from "next/image";
import { getBackendUrl, host } from "@/api/server/configApi";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/utils/date/date";
import { findLocTitleByIdWithDistrict } from "@/utils/locations/getTitleLocationById";
import { setComponentMenu } from "@/store/features/orderSlice";
import { setChat } from "@/store/features/chatSlice";
import {
  setIsModalResponseStudentToTutor,
  setIsSheetOpen,
  setTutorIdForResponseStudentToTutor,
} from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllSubjects } from "@/store/features/subjectSlice";
import { useRouter } from "next/navigation";
import { ReviewItem } from "../Review/ReviewItem";
import { pluralize } from "numeralize-ru";
import Link from "next/link";

type OrderProps = {
  chats: Chat[];
  citiesAndRegions: City[];
  loading: boolean;
  orderById: Order | null;
  error: string | null;
  locations: City[];
  tutor: Tutor | null; // добавляем tutorId как пропс
};

export const TutorComponent = ({
  chats,
  citiesAndRegions,
  loading,
  orderById,
  error,
  locations,
  tutor, // принимаем tutorId
}: OrderProps) => {
  // useEffect(() => {
  //   //dispatch(setComponentMenu(4));
  //   window.scrollTo({
  //     top: 0,
  //   });
  // }, []);
  const page = "Tutor";
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  // Стейт для предметов
  const subjectsData = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState); // Переключаем состояние
  };

  if (loading)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  if (!tutor) return <div>Репетитор не найден</div>; // если репетитор не найден
  if (!tutor?.subjectPrices) return <p>Данные загружаются...</p>;

  // Массив для хранения слайдов каждого репетитора отдельно
  const slidesPerTutor: SlideImage[] = tutor.educations.flatMap((diplom) =>
    diplom.isShowDiplom
      ? diplom.educationDiplomUrl.map((imgDiplom) => ({
          src: `${getBackendUrl()}${imgDiplom}`, //ЛОКАЛЬНО
        }))
      : []
  );

  const slidesPerTutorLB: SlideImage[] = tutor.educations.flatMap((diplom) =>
    diplom.isShowDiplom
      ? diplom.educationDiplomUrl.map((imgDiplom) => ({
          src: `${host}${imgDiplom}`,
        }))
      : []
  );

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex); // Устанавливаем текущий индекс изображения
    setOpenLightboxIndex(0); // Открываем Lightbox для конкретного репетитора
  };

  const handleClose = () => {
    setOpenLightboxIndex(null); // Закрываем Lightbox
  };

  const avatars = [
    "/img/icon/student/avatar/animal1.svg",
    "/img/icon/student/avatar/animal2.svg",
    "/img/icon/student/avatar/animal3.svg",
    "/img/icon/student/avatar/animal4.svg",
    "/img/icon/student/avatar/animal5.svg",
    "/img/icon/student/avatar/animal6.svg",
    "/img/icon/student/avatar/animal7.svg",
  ];

  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
  const tutorAvatar = tutor.avatarUrl
    ? `${getBackendUrl()}${tutor.avatarUrl}`
    : randomAvatar;

  const regionIndex = citiesAndRegions.findIndex(
    (location) => location.title === tutor.region
  );

  // Получаем текущее время
  const currentTime = new Date();

  // Проверяем, был ли репетитор онлайн в последние 5 минут
  const lastOnlineTime = tutor.lastOnline ? new Date(tutor.lastOnline) : null;

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
        <div className={styles.passportControl}>✅&nbsp;Паспорт проверен</div>
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

  // Сгруппируем цены по предметам
  const groupedPrices = tutor.subjectPrices.reduce(
    (acc, price) => {
      if (!acc[price.subjectId]) {
        acc[price.subjectId] = [];
      }
      acc[price.subjectId].push(price);
      return acc;
    },
    {} as Record<string, typeof tutor.subjectPrices>
  );

  // Получаем список всех предметов
  const subjects = Object.keys(groupedPrices);

  // Сортируем предметы так, чтобы предмет заказа был первым
  const sortedSubjects = subjects.sort((a, b) => {
    if (a === orderById?.subject) return -1;
    if (b === orderById?.subject) return 1;
    return 0;
  });

  // Функция для получения названия предмета по for_request
  const getSubjectTitle = (subjectId: string) => {
    const subject = subjectsData.find((item) => item.id_p === subjectId);
    return subject ? subject.for_request : subjectId; // Если предмет не найден, возвращаем subjectId
  };

  // Проверяем есть ли чат с этим репетитором
  const hasChatWithTutor = orderById?.chats.some(
    (chat) => chat.tutorId === tutor.id
  );

  const chat = chats.find((chat) => chat.tutorId === tutor.id);

  const reviews = tutor.reviews?.filter((r) => r.status === "Active") || [];
  // Количество отзывов
  const reviewsCount = reviews.length;

  return (
    <div
      className={clsx(
        generalStyles.content_block,
        generalStyles.order_block,
        generalStyles.crsr_pntr,
        styles.order_gap
      )}
    >
      <div className={clsx(styles.tutorImgFioContainerTP)}>
        <div className={clsx(styles.flex1, styles.pstnRltv)}>
          <Image
            className={clsx(styles.tutorImg, styles.tutorImgM)}
            src={tutorAvatar}
            width={120}
            height={120}
            alt=""
          />
        </div>
        <div className={clsx(styles.flex4, styles.tutorFioBagesContainer)}>
          <div
            className={clsx(
              styles.containerFlxRw,
              styles.jtfCntSpBtwn,
              styles.gap6
            )}
          >
            <h3>{tutor.name}</h3>

            {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span className={tutorsStyles.onlineStatus}>
                  {onlineStatus}
                </span>
              </div>
            )}
          </div>

          <div
            className={clsx(
              styles.containerIsOnline,
              styles.mt6px,
              styles.tutorPlaces,
              styles.lnHgt18
            )}
          >
            <div>&nbsp;{tutor.publicRating}&nbsp;рейтинг</div>
            {reviewsCount > 0 && (
              <Link
                // className={componentStyle.itemThemesList}
                href={"#отзывы"}
              >
                <div>
                  {reviewsCount}&nbsp;
                  {pluralize(reviewsCount, "отзыв", "отзыва", "отзывов")}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {tutor.tutorPlace.length > 0 && (
        <div
          className={clsx(
            styles.containerIsOnline,
            styles.mt6px,
            styles.tutorPlaces,
            styles.lnHgt18
          )}
        >
          {tutor.tutorPlace.includes("1") && <div>🖥️&nbsp;Дистанционно</div>}
          {tutor.tutorPlace.includes("2") && <div>🏠&nbsp;У&nbsp;себя</div>}
          {tutor.tutorPlace.includes("3") && (
            <div>📍Выезд&nbsp;к&nbsp;ученику&nbsp;</div>
          )}
          {hasPassportValid}
          {hasGoodReviews}
          {hasDocsEducation}
        </div>
      )}

      {/* Кнопка предложения для моб версии */}
      {chat?.status !== "Rejected" && (
        <div className={clsx(styles.dsplBlcM, tutorsStyles.buttonGoChat)}>
          {chat?.status !== "Rejected" ? (
            <button
              onClick={(e) => {
                e.preventDefault();

                // Если чат с репетитором существует
                if (hasChatWithTutor && chat) {
                  // Логика для существующего чата
                  dispatch(setComponentMenu(5));
                  dispatch(setChat(chat));

                  if (page && page === "Tutor") {
                    route.push("../");
                  }
                  //saveScrollPosition();
                  // Можно добавить другие действия, если чат уже существует
                } else {
                  // Логика для нового чата (если чата нет)
                  // dispatch(setIsModalResponseStudentToTutor(true));
                  dispatch(setTutorIdForResponseStudentToTutor(tutor.id));
                  dispatch(setIsSheetOpen(true)); // Открываем шторку

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
                generalStyles.agnCntr,
                tutorsStyles.buttonGoChat
              )}
            >
              {hasChatWithTutor ? "Перейти в чат" : "Предложить заказ"}
            </button>
          ) : (
            false
            // <div>
            //   К сожалению, репетитор отклонил ваш&nbsp;заказ&nbsp;❌
            // </div>
          )}
        </div>
      )}
      {/* Окончание */}

      <div className={styles.containerOrderInfo}>
        <span className={styles.titleTutorInfo}>Предметы</span>
        <div className={styles.profileInfoText}>
          {tutor.subject.map((item, index) => {
            const subjectTitle = getSubjectTitle(item);
            return (
              <span key={index}>
                {index === 0 ? "Репетитор по " : ""}
                {subjectTitle}
                {index < tutor.subject.length - 2
                  ? ", "
                  : index === tutor.subject.length - 2
                    ? " и "
                    : ""}
              </span>
            );
          })}
        </div>
      </div>

      {tutor.tutorPlace.includes("3") &&
        (tutor.tutorTripCity.length > 0 || tutor.tutorTripArea.length > 0) && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleTutorInfo}>Готов приехать</span>
            <div className={styles.profileInfoText}>
              {(() => {
                const getTitles = (ids: string[]) =>
                  ids
                    .map(
                      (id) => findLocTitleByIdWithDistrict(id, locations)?.title
                    )
                    .filter(Boolean)
                    .join(", ");

                const cityTitles = getTitles(tutor.tutorTripCity);
                const areaTitles = getTitles(tutor.tutorTripArea);

                return [cityTitles, areaTitles]
                  .filter((str) => str.length > 0)
                  .join(", ");
              })()}
            </div>
          </div>
        )}

      {tutor.educations.length > 0 && (
        <div
          className={clsx(
            styles.containerOrderInfo,
            styles.containerOrderInfoBG
          )}
        >
          <span className={styles.titleTutorInfo}>образование</span>

          <ul>
            {tutor.educations.map((education) => (
              <li key={education.id} className={styles.listEducation}>
                {education.educationInfo} ({education.educationStartYear}-
                {education.educationEndYear})
              </li>
            ))}
          </ul>
        </div>
      )}

      {slidesPerTutor.length > 0 && (
        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>
            Диплом, сертификаты и другие документы
          </span>

          <div
            className={clsx(
              styles.scrollContainer,
              styles.gap10 // используйте gap, если он не ломает в nowrap
            )}
          >
            {slidesPerTutor.map((slide, index) => (
              <Image
                key={index}
                onClick={() => handleImageClick(index)}
                src={slide.src}
                alt="Документ об образовании"
                width={100}
                height={120}
                className={styles.imageDiplomas}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className={clsx(styles.containerOrderInfo, styles.containerOrderInfoBG)}
      >
        <span className={styles.titleTutorInfo}>местоположение</span>
        <div className={styles.profileInfoText}>
          <span>{`${citiesAndRegions[regionIndex]?.title} и ${citiesAndRegions[regionIndex]?.area}`}</span>
        </div>
      </div>

      <div>
        {sortedSubjects.map((subjectId) => {
          const relevantPrices = groupedPrices[subjectId];
          const subjectTitle = getSubjectTitle(subjectId); // Получаем название предмета

          return (
            <div
              key={subjectId}
              className={clsx(
                styles.containerOrderInfo,
                styles.containerOrderInfoBG
              )}
            >
              <span className={styles.titleTutorInfo}>
                Стоимость занятий по {subjectTitle}{" "}
                {/* Выводим название из for_request */}
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
          );
        })}
      </div>

      {tutor.profileInfo && (
        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>О себе</span>
          <div className={styles.profileInfoText}>
            {isExpanded
              ? tutor.profileInfo // Показываем весь текст, если раскрыто
              : tutor.profileInfo.length > 450
                ? `${tutor.profileInfo.slice(0, 450)}...` // Показываем обрезанный текст
                : tutor.profileInfo}
          </div>
          {tutor.profileInfo.length > 450 && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Предотвращаем переход по ссылке
                handleToggle(); // Переключаем состояние
              }}
              className={clsx(
                generalStyles.content_block_button,
                generalStyles.buttonBlc,
                generalStyles.buttonWthCnt, // Этот класс всегда применяется
                generalStyles.agnCntr,
                tutorsStyles.buttonGoChat
              )}
            >
              {isExpanded ? "Скрыть" : "Читать полностью"}
            </button>
          )}
        </div>
      )}

      {reviews.length > 0 && (
        <div id={"#отзывы"} className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Отзывы</span>

          <div
            className={clsx(
              styles.reviewWrapper // используйте gap, если он не ломает в nowrap
            )}
          >
            {reviews.map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}

      {openLightboxIndex !== null && (
        <Lightbox
          open={openLightboxIndex !== null}
          close={() => handleClose()}
          slides={slidesPerTutorLB}
          index={currentImageIndex}
        />
      )}
    </div>
  );
};
