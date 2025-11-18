"use client";

import clsx from "clsx";
import styles from "../../../app/page.module.css";
import stylesListTutor from "../../Student/Order/Order.module.css";
import generalStyles from "../../../app/student/layout.module.css";
import { Tutor } from "@/types/types";
import { getBackendUrl, host } from "@/api/server/configApi";
import { formatTimeAgo } from "@/utils/date/date";
import Image from "next/image";
import { pluralize } from "numeralize-ru";
import { useState } from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Pagination } from "@/components/Pagination/Pagination";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { RegionalLink } from "@/components/RegionalLink/RegionalLink";
import { getCitySlug } from "@/utils/region/validSlug";

interface Props {
  tutors: Tutor[];
  subject?: {
    id_p: string;
    title: string;
    for_request: string;
    nextPage?: string;
  };
  // Добавляем пропсы для пагинации
  totalPages: number;
  currentPage: number;
  handleSubject: () => void;
  city: string;
}

export const RepetitorsList = ({
  tutors,
  subject,
  totalPages,
  currentPage,
  handleSubject,
  city,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openLightboxIndex, setOpenLightboxIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Массив для хранения слайдов репетитора
  const slidesPerTutor: SlideImage[][] = tutors.map((tutor) =>
    tutor.educations.flatMap((diplom) =>
      diplom.isShowDiplom
        ? diplom.educationDiplomUrl
            .slice(0, 6) // Ограничиваем количеством 6
            .map((imgDiplom) => ({
              src: `${getBackendUrl()}${imgDiplom}`,
            }))
        : []
    )
  );

  const slidesPerTutorLb: SlideImage[][] = tutors.map((tutor) =>
    tutor.educations.flatMap((diplom) =>
      diplom.isShowDiplom
        ? diplom.educationDiplomUrl
            .slice(0, 6) // Ограничиваем количеством 6
            .map((imgDiplom) => ({
              src: `${host}${imgDiplom}`,
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

  const handlePageChange = (newPage: number) => {
    // Создаем новый URLSearchParams на основе текущих
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      // Для первой страницы удаляем параметр page
      params.delete("page");
    } else {
      // Для остальных страниц устанавливаем параметр page
      params.set("page", newPage.toString());
    }

    // Строим новый URL
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;

    // Навигация на новую страницу
    router.push(newUrl);
  };

  return (
    <>
      <div className={stylesListTutor.mContainer}>
        {tutors.length ? (
          <>
            {tutors.map((tutor, tutorIndex) => {
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
                ? `${getBackendUrl()}${tutor.avatarUrl}`
                : randomAvatar;

              // Получаем текущее время
              const currentTime = new Date();

              // Проверяем, был ли репетитор онлайн в последние 5 минут
              const lastOnlineTime = tutor.lastOnline
                ? new Date(tutor.lastOnline)
                : null;

              let onlineStatus = "";
              let timeDifference = 0;

              if (lastOnlineTime) {
                timeDifference =
                  currentTime.getTime() - lastOnlineTime.getTime();
                if (timeDifference <= 5 * 60 * 1000) {
                  onlineStatus = "В сети";
                } else {
                  onlineStatus = `был ${formatTimeAgo(lastOnlineTime)}`;
                }
              }

              let hasPassportValid = null;
              let hasGoodReviews = null;
              let hasDocsEducation = null;
              if (tutor.badges?.length > 0) {
                if (tutor.badges.includes("Паспорт проверен")) {
                  hasPassportValid = (
                    <div
                      className={clsx(
                        stylesListTutor.passportControl,
                        stylesListTutor.flxWrp
                      )}
                    >
                      ✅&nbsp;Паспорт проверен
                    </div>
                  );
                }
                if (tutor.badges.includes("Хорошие отзывы")) {
                  hasGoodReviews = (
                    <div
                      className={clsx(
                        stylesListTutor.goodReviews,
                        stylesListTutor.flxWrp
                      )}
                    >
                      ❤️&nbsp;Хорошие отзывы
                    </div>
                  );
                }
                if (tutor.badges.includes("Документы об образовании")) {
                  hasDocsEducation = (
                    <div
                      className={clsx(
                        stylesListTutor.docsEducation,
                        stylesListTutor.flxWrp
                      )}
                    >
                      🪪&nbsp;Образование
                    </div>
                  );
                }
              }

              // Фильтруем цены по предмету заказа
              const relevantPrices = tutor.subjectPrices.filter(
                (price) => price.subjectId === subject?.id_p
              );

              const reviews =
                tutor.reviews?.filter((r: any) => r.status === "Active") || [];
              const reviewsCount = reviews.length;

              return (
                <RegionalLink
                  key={tutor.id}
                  href={`/repetitor/${tutor.id}`}
                  citySlug={city}
                >
                  <div
                    className={clsx(
                      styles.content_block,
                      stylesListTutor.order_block,
                      stylesListTutor.crsr_pntr,
                      stylesListTutor.order_gap
                    )}
                  >
                    <div className={styles.wrapNameTutorAndActionButton}>
                      <div className={stylesListTutor.tutorImgFioContainerTP}>
                        <div
                          className={clsx(
                            stylesListTutor.flex1,
                            stylesListTutor.pstnRltv
                          )}
                        >
                          <Image
                            className={clsx(
                              stylesListTutor.tutorImg,
                              stylesListTutor.tutorImgM
                            )}
                            src={tutorAvatar}
                            width={120}
                            height={120}
                            alt={`Аватар ${tutor.name}`}
                          />
                        </div>

                        <div
                          className={clsx(
                            stylesListTutor.flex4,
                            stylesListTutor.tutorFioBagesContainer
                          )}
                        >
                          <div
                            className={clsx(
                              stylesListTutor.containerFlxRw,
                              stylesListTutor.jtfCntSpBtwn,
                              stylesListTutor.gap6
                            )}
                          >
                            <h3 className={styles.fioTutor}>{tutor.name}</h3>
                            {onlineStatus &&
                              timeDifference <= 5 * 60 * 1000 && (
                                <div
                                  className={stylesListTutor.containerIsOnline}
                                >
                                  <div
                                    className={stylesListTutor.isOnline}
                                  ></div>
                                  <span
                                    className={stylesListTutor.onlineStatus}
                                  >
                                    {onlineStatus}
                                  </span>
                                </div>
                              )}
                          </div>

                          <div
                            className={clsx(
                              stylesListTutor.containerIsOnline,
                              stylesListTutor.mt6px,
                              stylesListTutor.tutorPlaces,
                              stylesListTutor.lnHgt18
                            )}
                          >
                            {tutor.userRating > 0.1 && (
                              <div>
                                &nbsp;{tutor.userRating?.toFixed(1) || "—"}
                                &nbsp;рейтинг
                              </div>
                            )}
                            {reviewsCount > 0 && (
                              <div>
                                {reviewsCount}&nbsp;
                                {pluralize(
                                  reviewsCount,
                                  "отзыв",
                                  "отзыва",
                                  "отзывов"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          // Правильная проверка через приведение типов
                          const target = e.target as HTMLElement;
                          if (
                            target.tagName === "BUTTON" ||
                            target.closest("button")
                          ) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                        className={styles.tutorActionButton}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleSubject();
                          }}
                          className={clsx(
                            generalStyles.content_block_button,
                            generalStyles.buttonYlw,
                            generalStyles.buttonWthCnt,
                            generalStyles.agnCntr
                          )}
                        >
                          Написать репетитору
                        </button>
                      </div>
                    </div>

                    {tutor.tutorPlace?.length > 0 && (
                      <div
                        className={clsx(
                          stylesListTutor.containerIsOnline,
                          stylesListTutor.mt6px,
                          stylesListTutor.tutorPlaces,
                          stylesListTutor.lnHgt18
                        )}
                      >
                        {tutor.tutorPlace.includes("1") && (
                          <div>🖥️&nbsp;Дистанционно</div>
                        )}
                        {tutor.tutorPlace.includes("2") && (
                          <div>🏠&nbsp;У&nbsp;себя</div>
                        )}
                        {tutor.tutorPlace.includes("3") && (
                          <div>📍Выезд&nbsp;к&nbsp;ученику&nbsp;</div>
                        )}
                        {hasPassportValid}
                        {hasGoodReviews}
                        {hasDocsEducation}
                      </div>
                    )}

                    {tutor.educations?.length > 0 && (
                      <div
                        className={clsx(
                          stylesListTutor.containerOrderInfo,
                          stylesListTutor.containerOrderInfoBG
                        )}
                      >
                        <span className={stylesListTutor.titleTutorInfo}>
                          образование
                        </span>
                        <ul>
                          {tutor.educations.map((education: any) => (
                            <li
                              key={education._id}
                              className={stylesListTutor.listEducation}
                            >
                              {education.educationInfo} (
                              {education.educationStartYear}-
                              {education.educationEndYear})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {slidesPerTutor[tutorIndex].length > 0 && (
                      <div
                        className={clsx(
                          stylesListTutor.containerOrderInfo,
                          stylesListTutor.containerOrderDiploms
                        )}
                      >
                        <div
                          className={clsx(
                            stylesListTutor.scrollContainer,
                            stylesListTutor.gap3
                          )}
                        >
                          {slidesPerTutor[tutorIndex]
                            .slice(0, 6)
                            .map((slide, index) => (
                              <Image
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleImageClick(tutorIndex, index);
                                }}
                                src={slide.src}
                                alt="Документ об образовании"
                                width={100}
                                height={100}
                                className={stylesListTutor.imageDiplomas}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {relevantPrices.length > 0 && (
                      <div
                        className={clsx(
                          stylesListTutor.containerOrderInfo,
                          stylesListTutor.containerOrderInfoBG
                        )}
                      >
                        <span className={stylesListTutor.titleTutorInfo}>
                          стоимость занятий
                        </span>

                        <table
                          className={clsx(
                            generalStyles.table,
                            styles.tableSubjectPrices
                          )}
                        >
                          <tbody>
                            {relevantPrices.map((price) => (
                              <tr
                                key={price._id?.$oid}
                                className={generalStyles.tr}
                              >
                                <td className={generalStyles.td}>
                                  {price.format === "online" && "Дистанционно"}
                                  {price.format === "home" && "У себя дома"}
                                  {price.format === "travel" &&
                                    "Выезд к ученику"}
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

                    {tutor.profileInfo && (
                      <div
                        className={clsx(
                          stylesListTutor.containerOrderInfo,
                          stylesListTutor.containerOrderInfoBG
                        )}
                      >
                        <span className={stylesListTutor.titleTutorInfo}>
                          о себе
                        </span>
                        <div className={stylesListTutor.profileInfoText}>
                          {tutor.profileInfo.length > 250
                            ? `${tutor.profileInfo.slice(0, 250)}...`
                            : tutor.profileInfo}
                        </div>
                      </div>
                    )}
                  </div>
                </RegionalLink>
              );
            })}

            {/* --- Постраничная навигация --- */}
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div
            className={clsx(
              styles.content_block,
              stylesListTutor.order_block,
              stylesListTutor.crsr_pntr,
              stylesListTutor.order_gap
            )}
          >
            <div className={stylesListTutor.containerOrderInfo}>
              <div className={stylesListTutor.subjectName}>
                <h3>Нет подходящих репетиторов 😔</h3>
              </div>
              <div className={stylesListTutor.goal}>
                Сейчас нет репетиторов, которые подходят под ваш запрос.
                <br></br>
                <br></br>
                Попробуйте изменить параметры поиска — например, добавить
                возможность онлайн-занятий, если это удобно. Так найти
                подходящего репетитора будет проще! 🎯
              </div>
            </div>
          </div>
        )}
      </div>

      {openLightboxIndex !== null && (
        <Lightbox
          open={openLightboxIndex !== null}
          close={handleClose}
          slides={slidesPerTutorLb[openLightboxIndex]}
          index={currentImageIndex}
        />
      )}
    </>
  );
};
