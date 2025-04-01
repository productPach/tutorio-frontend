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
  locations,
}: OrderProps) => {
  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Массив для хранения слайдов каждого репетитора отдельно
  const slidesPerTutor: SlideImage[][] = tutorsForOrder.map((tutor) =>
    tutor.educations.flatMap((diplom) =>
      diplom.isShowDiplom
        ? diplom.educationDiplomUrl.map((imgDiplom) => ({
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
      {tutorsForOrder.map((tutor, tutorIndex) => {
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
                <Image
                  className={styles.tutorImg}
                  src={tutorAvatar}
                  width={120}
                  height={120}
                  alt=""
                />
              </div>
              <div className={styles.flex4}>
                <div
                  className={clsx(styles.containerFlxRw, styles.jtfCntSpBtwn)}
                >
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
                    src="../../img/icon/location.svg"
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
                    {tutor.tutorPlace.includes("3") && (
                      <>Выезд к ученику&nbsp;📍</>
                    )}
                  </div>
                )}
                <div className={clsx(styles.containerIsOnline, styles.mt6px)}>
                  <div className={styles.passportControl}>
                    ✅&nbsp;Паспорт проверен
                  </div>
                </div>
              </div>
            </div>

            {tutor.profileInfo && (
              <div className={styles.containerOrderInfo}>
                <span className={styles.titleTutorInfo}>О себе</span>
                <div className={styles.profileInfoText}>
                  {tutor.profileInfo}
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

            {slidesPerTutor[tutorIndex].length > 0 && (
              <div className={styles.containerOrderInfo}>
                <span className={styles.titleTutorInfo}>
                  Диплом, сертификаты и другие документы
                </span>

                <div className={clsx(styles.containerFlxRw, styles.gap10)}>
                  {slidesPerTutor[tutorIndex].map((slide, index) => (
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

            <div className={styles.containerOrderInfo}>
              <span className={styles.titleTutorInfo}>Стоимость занятий</span>

              <div>
                <span className={styles.priceInt}>3&nbsp;000 ₽</span> / 60 мин
                (дистанционно)
              </div>
            </div>

            <button
              className={clsx(
                generalStyles.content_block_button,
                generalStyles.buttonYlw
              )}
            >
              Предложить заказ
            </button>
          </div>
        );
      })}

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
