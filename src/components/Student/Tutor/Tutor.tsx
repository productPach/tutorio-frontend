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
import { useState } from "react";
import { formatTimeAgo } from "@/utils/date/date";
import { useAppDispatch } from "@/store/store";

type OrderProps = {
  citiesAndRegions: City[];
  loading: boolean;
  orderById: Order | null;
  error: string | null;
  locations: City[];
  tutor: Tutor | null; // добавляем tutorId как пропс
};

export const TutorComponent = ({
  citiesAndRegions,
  loading,
  orderById,
  error,
  locations,
  tutor, // принимаем tutorId
}: OrderProps) => {
  console.log(tutor);

  const dispatch = useAppDispatch();
  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          src: `${host}${port}${imgDiplom}`,
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
    ? `${host}${port}${tutor.avatarUrl}`
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

  // Фильтруем цены по предмету заказа
  const relevantPrices = tutor.subjectPrices.filter(
    (price) => price.subjectId === orderById?.subject
  );

  return (
    <div
      className={clsx(
        generalStyles.content_block,
        generalStyles.order_block,
        generalStyles.crsr_pntr,
        styles.order_gap
      )}
    >
      <div className={styles.tutorImgFioContainer}>
        <div className={styles.flex1}>
          <Image
            className={styles.tutorImg}
            src={tutorAvatar}
            width={120}
            height={120}
            alt=""
          />
        </div>
        <div className={styles.flex4}>
          <div className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}>
            <h3>{tutor.name}</h3>
            {onlineStatus && timeDifference <= 5 * 60 * 1000 && (
              <div className={styles.containerIsOnline}>
                <div className={styles.isOnline}></div>
                <span>{onlineStatus}</span>
              </div>
            )}
          </div>

          <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
            <Image
              src="../../../../img/icon/location.svg"
              alt="Геолокация"
              width={15}
              height={18}
              className={styles.header_geoImage}
            />
            <span>{`${citiesAndRegions[regionIndex]?.title} и ${citiesAndRegions[regionIndex]?.area}`}</span>
          </div>
          {tutor.tutorPlace.length > 0 && (
            <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
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
              {tutor.tutorPlace.includes("3") && <>Выезд к ученику&nbsp;📍</>}
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

          <div className={clsx(styles.containerFlxRw, styles.gap10)}>
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

      {relevantPrices.length > 0 && (
        <div className={styles.containerOrderInfo}>
          <span className={styles.titleTutorInfo}>Стоимость занятий</span>

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

      {openLightboxIndex !== null && (
        <Lightbox
          open={openLightboxIndex !== null}
          close={() => handleClose()}
          slides={slidesPerTutor}
          index={currentImageIndex}
        />
      )}
    </div>
  );
};
