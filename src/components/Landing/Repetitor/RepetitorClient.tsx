"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Tutor } from "@/types/types";
import { getBackendUrl } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import { findLocTitleByIdWithDistrict } from "@/utils/locations/getTitleLocationById";
import { pluralize } from "numeralize-ru";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Стили - можно создать отдельный CSS модуль или использовать существующие
import generalStyles from "../../../app/student/layout.module.css";
import styles from "../../../components/Student/Order/Order.module.css";
import tutorsStyles from "../../../components/Student/Tutors/Tutors.module.css";
import landingTutorStyles from "./Repetitor.module.css";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { ReviewItem } from "@/components/Student/Review/ReviewItem";
import { getAllSubjects } from "@/store/features/subjectSlice";
interface TutorPublicProps {
  tutor: Tutor;
}

export const RepetitorClient = ({ tutor }: TutorPublicProps) => {
  const dispatch = useAppDispatch();
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  // Получаем список регионов
  const citiesAndRegions = useAppSelector((state) => state.locations.city);

  // Стейт для предметов
  const subjectsData = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!tutor) return <div>Репетитор не найден</div>;
  if (!tutor?.subjectPrices) return <p>Данные загружаются...</p>;

  // Массив для хранения слайдов дипломов
  const slidesPerTutor: SlideImage[] = tutor.educations.flatMap((diplom) =>
    diplom.isShowDiplom
      ? diplom.educationDiplomUrl.map((imgDiplom) => ({
          src: `${getBackendUrl()}${imgDiplom}`,
        }))
      : []
  );

  const slidesPerTutorLB: SlideImage[] = tutor.educations.flatMap((diplom) =>
    diplom.isShowDiplom
      ? diplom.educationDiplomUrl.map((imgDiplom) => ({
          src: `${getBackendUrl()}${imgDiplom}`,
        }))
      : []
  );

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setOpenLightboxIndex(0);
  };

  const handleClose = () => {
    setOpenLightboxIndex(null);
  };

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  // Аватары для случая, когда у репетитора нет своей аватарки
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

  // Онлайн статус
  const currentTime = new Date();
  const lastOnlineTime = tutor.lastOnline ? new Date(tutor.lastOnline) : null;
  let onlineStatus = "";
  let timeDifference = 0;

  if (lastOnlineTime) {
    timeDifference = currentTime.getTime() - lastOnlineTime.getTime();
    if (timeDifference <= 5 * 60 * 1000) {
      onlineStatus = "В сети";
    } else {
      onlineStatus = `был ${formatTimeAgo(lastOnlineTime)}`;
    }
  }

  // Бейджи
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

  // Группировка цен по предметам
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

  const subjects = Object.keys(groupedPrices);

  // Функция для получения названия предмета по for_request
  const getSubjectTitle = (subjectId: string) => {
    const subject = subjectsData.find((item) => item.id_p === subjectId);
    return subject ? subject.for_request : subjectId; // Если предмет не найден, возвращаем subjectId
  };

  // Отзывы
  const reviews =
    tutor.reviews
      ?.filter((r) => r.status === "Active")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

  const reviewsCount = reviews.length;

  // Регион
  const regionIndex = citiesAndRegions.findIndex(
    (location) => location.title === tutor.region
  );

  return (
    <main>
      <section
        className={clsx(
          landingTutorStyles.container,
          landingTutorStyles.center
        )}
      >
        <div
          className={clsx(
            generalStyles.content_block,
            generalStyles.order_block,
            generalStyles.crsr_pntr,
            styles.order_gap,
            landingTutorStyles.grid19
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
                {tutor.userRating > 0.1 && (
                  <div>&nbsp;{tutor.userRating}&nbsp;рейтинг</div>
                )}

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
              {tutor.tutorPlace.includes("1") && (
                <div>🖥️&nbsp;Дистанционно</div>
              )}
              {tutor.tutorPlace.includes("2") && <div>🏠&nbsp;У&nbsp;себя</div>}
              {tutor.tutorPlace.includes("3") && (
                <div>📍Выезд&nbsp;к&nbsp;ученику&nbsp;</div>
              )}
              {hasPassportValid}
              {hasGoodReviews}
              {hasDocsEducation}
            </div>
          )}

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
            (tutor.tutorTripCity.length > 0 ||
              tutor.tutorTripArea.length > 0) && (
              <div className={styles.containerOrderInfo}>
                <span className={styles.titleTutorInfo}>Готов приехать</span>
                <div className={styles.profileInfoText}>
                  {(() => {
                    const getTitles = (ids: string[]) =>
                      ids
                        .map(
                          (id) =>
                            findLocTitleByIdWithDistrict(id, locations)?.title
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
                    width={85}
                    height={85}
                    className={styles.imageDiplomas}
                  />
                ))}
              </div>
            </div>
          )}

          <div
            className={clsx(
              styles.containerOrderInfo,
              styles.containerOrderInfoBG
            )}
          >
            <span className={styles.titleTutorInfo}>местоположение</span>
            <div className={styles.profileInfoText}>
              <span>{`${citiesAndRegions[regionIndex]?.title} и ${citiesAndRegions[regionIndex]?.area}`}</span>
            </div>
          </div>

          <div>
            {subjects.map((subjectId) => {
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

          {openLightboxIndex !== null && (
            <Lightbox
              open={openLightboxIndex !== null}
              close={() => handleClose()}
              slides={slidesPerTutorLB}
              index={currentImageIndex}
            />
          )}
        </div>
        <div className={clsx(landingTutorStyles.grid8)}>
          <div className={clsx(generalStyles.content_block)}>
            <h3 className={landingTutorStyles.titleActionSidebar}>
              Связаться с репетитором
            </h3>
            <span>
              Оформите заказ, чтобы открыть чат с этим репетитором <br />
              <br />
              Вы также сможете выбрать других подходящих репетиторов и обсудить
              с ними детали занятий
            </span>
            <Link href={`/match/main/subject`}>
              <button
                className={clsx(
                  generalStyles.content_block_button,
                  generalStyles.buttonYlw,
                  generalStyles.agnCntr,
                  landingTutorStyles.buttonActionSidebar
                )}
              >
                Написать репетитору
              </button>
            </Link>
          </div>
          {reviews.length > 0 && (
            <div className={clsx(generalStyles.content_block)}>
              <div id={"отзывы"} className={styles.containerOrderInfo}>
                <span className={styles.titleTutorInfo}>Отзывы учеников</span>

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
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
