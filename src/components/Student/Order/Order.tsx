"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./Order.module.css";
import locationsStyles from "../../../app/tutor/locations.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { getYearWord } from "@/utils/words/getYearWord";
import { formatTimeAgo } from "@/utils/date/date";
import { findLocTitlesByIds } from "@/utils/locations/getTitleLocationById";
import { City, Order, Student } from "@/types/types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllSubjects } from "@/store/features/subjectSlice";
import Image from "next/image";
import Link from "next/link";
import { getBackendUrl } from "@/api/server/configApi";

type OrderProps = {
  loading: boolean;
  student: Student | null;
  orderById: Order | null;
  error: string | null;
  locations: City[];
};

export const OrderComponent = ({
  loading,
  student,
  orderById,
  error,
  locations,
}: OrderProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  // Стейт для предметов
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  const subjectArr = subjects.find(
    (subject) => subject.id_p === orderById?.subject
  );
  const subjectName = subjectArr?.title;

  let tutorType;
  if (orderById?.tutorType === "1") {
    tutorType = "Начинающий: до\u00A01000\u00A0₽";
  }
  if (orderById?.tutorType === "2") {
    tutorType = "Репетитор со средним опытом: до\u00A01500\u00A0₽";
  }
  if (orderById?.tutorType === "3") {
    tutorType = "Опытный репетитор: до\u00A02500\u00A0₽";
  }

  return (
    <>
      {orderById?.selectedTutors && orderById?.selectedTutors.length > 0 && (
        <div
          className={clsx(
            generalStyles.content_block,
            generalStyles.order_block,
            generalStyles.crsr_pntr,
            styles.order_gap
          )}
        >
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Выбранные репетиторы</span>
            <div className={styles.listContractTutor}>
              {orderById.selectedTutors.map((tutor) => (
                <div key={tutor.id}>
                  <div className={styles.tutorImgFioContainerTP}>
                    <div className={clsx(styles.flex1, styles.pstnRltv)}>
                      <Link
                        href={`./${orderById.id}/tutor/${tutor.id}`}
                        target="_blank"
                      >
                        <Image
                          className={clsx(
                            styles.tutorImgMini,
                            styles.tutorImgMMini
                          )}
                          src={
                            `${getBackendUrl()}${tutor.avatarUrl}` ||
                            "/img/avatar-default.jpg"
                          }
                          width={66}
                          height={66}
                          alt={tutor.name}
                        />
                      </Link>
                    </div>

                    <div
                      className={clsx(
                        styles.flex4,
                        styles.tutorFioBagesContainer
                      )}
                    >
                      <div
                        className={clsx(
                          styles.containerFlxRw,
                          styles.jtfCntSpBtwn,
                          styles.gap6
                        )}
                      >
                        <Link
                          href={`./${orderById.id}/tutor/${tutor.id}`}
                          target="_blank"
                        >
                          <h3>{tutor.name}</h3>
                        </Link>
                      </div>

                      <div
                        className={clsx(
                          styles.containerIsOnline,
                          styles.mt6px,
                          styles.tutorPlaces,
                          styles.lnHgt18
                        )}
                      >
                        <div>
                          &nbsp;{tutor.publicRating?.toFixed(1) || "—"}
                          &nbsp;рейтинг
                        </div>
                        <div>&nbsp;{tutor.reviewsCount || 0}&nbsp;отзыва</div>
                      </div>
                    </div>

                    <button
                      className={styles.buttonContract}
                      onClick={(e) => {
                        e.preventDefault();
                        // dispatch(setIsModalCreateContractByTutor(true));
                      }}
                      type="button"
                    >
                      <span className={styles.textButton}>
                        Оставить отзыв
                        {/* Подтвердить договоренность */}
                      </span>
                    </button>
                  </div>
                  <button
                    className={styles.buttonContractM}
                    onClick={(e) => {
                      e.preventDefault();
                      // dispatch(setIsModalCreateContractByTutor(true));
                    }}
                    type="button"
                  >
                    <span className={styles.textButton}>
                      Оставить отзыв
                      {/* Подтвердить договоренность */}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <h3>{subjectName}</h3>
          </div>
          <div className={styles.goal}>{orderById?.goal}</div>
        </div>

        {orderById?.studentType && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Кто будет заниматься</span>
            <span>{orderById?.studentType}</span>
          </div>
        )}

        {orderById?.studentClass && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>В каком классе ученик</span>
            <span>{orderById?.studentClass}</span>
          </div>
        )}

        {orderById?.studentYears && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Возраст ученика</span>
            <span>
              {orderById?.studentYears +
                " " +
                getYearWord(Number(orderById?.studentYears))}
            </span>
          </div>
        )}

        {orderById?.studentCourse && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>На каком курсе ученик</span>
            <span>{orderById?.studentCourse}</span>
          </div>
        )}

        {orderById?.studentUniversity && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>В каком вузе экзамен</span>
            <span>{orderById?.studentUniversity}</span>
          </div>
        )}

        {orderById?.studentExam && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Экзамен</span>
            <span>{orderById?.studentExam}</span>
          </div>
        )}

        {orderById?.studyMethod && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Методика подготовки</span>
            <span>{orderById?.studyMethod}</span>
          </div>
        )}

        {orderById?.studyProgramm && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Программа обучения</span>
            <span>{orderById?.studyProgramm}</span>
          </div>
        )}

        {orderById?.deadline && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Осталось до экзамена</span>
            <span>{orderById?.deadline}</span>
          </div>
        )}

        {orderById?.studentLevel && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Уровень ученика</span>
            <span>{orderById?.studentLevel}</span>
          </div>
        )}

        {orderById?.tutorGender && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Предпочтения по полу</span>
            <span>{orderById?.tutorGender}</span>
          </div>
        )}

        {orderById?.studentSchedule && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>
              Предпочтения по расписанию
            </span>
            <span>{orderById?.studentSchedule}</span>
          </div>
        )}

        {orderById?.region && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Местонахождение</span>
            <span>{orderById?.region}</span>
          </div>
        )}

        {orderById?.studentPlace && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Место занятий</span>
            <div>
              {orderById?.studentPlace.map((place, index) => {
                if (place === "У меня дома") {
                  place = "У ученика";
                }
                const countPlace = orderById?.studentPlace?.length;
                if (countPlace) {
                  if (index !== countPlace - 1) {
                    place = place + ", ";
                  }
                }
                return <span key={index}>{`${place}`}</span>;
              })}
            </div>
          </div>
        )}

        {orderById?.studentAdress && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Адрес ученика</span>
            <span>{orderById?.studentAdress}</span>
          </div>
        )}

        {orderById?.studentHomeLoc && orderById?.studentHomeLoc?.length > 0 && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>
              Ближайшие локации к ученику
            </span>
            <span>
              {findLocTitlesByIds(orderById?.studentHomeLoc, locations).map(
                (location, index) => (
                  <div key={index}>
                    {typeof location !== "string" && location.lineNumber && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles[
                                `crcl_mtr_msk_${location.lineNumber}`
                              ]
                            )}
                          ></div>
                          {/* <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles.crcl_mtr_msk_7
                            )}
                          ></div> */}
                        </div>
                      </div>
                    )}
                    {typeof location === "string" && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr_none
                            )}
                          ></div>
                          {/* <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles.crcl_mtr_msk_7
                            )}
                          ></div> */}
                        </div>
                      </div>
                    )}
                    {typeof location === "string" ? location : location.title}
                  </div>
                )
              )}
            </span>
          </div>
        )}

        {orderById?.studentTrip && orderById?.studentTrip.length > 0 && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Ученик готов приехать</span>
            <span>
              {findLocTitlesByIds(orderById?.studentTrip, locations).map(
                (location, index) => (
                  <div key={index}>
                    {typeof location !== "string" && location.lineNumber && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles[
                                `crcl_mtr_msk_${location.lineNumber}`
                              ]
                            )}
                          ></div>
                          {/* <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles.crcl_mtr_msk_7
                            )}
                          ></div> */}
                        </div>
                      </div>
                    )}
                    {typeof location === "string" && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr_none
                            )}
                          ></div>
                          {/* <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles.crcl_mtr_msk_7
                            )}
                          ></div> */}
                        </div>
                      </div>
                    )}
                    {typeof location === "string" ? location : location.title}
                  </div>
                )
              )}
            </span>
          </div>
        )}

        {orderById?.tutorType && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>
              Предпочтения по стоимости занятий
            </span>
            <span>{tutorType}</span>
          </div>
        )}

        {orderById?.studentWishes && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>
              Дополнительные пожелания
            </span>
            <span>{orderById?.studentWishes}</span>
          </div>
        )}
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        {student && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Ученик</span>
            <span>{student?.name}</span>
          </div>
        )}

        {orderById?.createdAt && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Заказ добавлен</span>
            <span>{formatTimeAgo(orderById?.createdAt)}</span>
          </div>
        )}
      </div>
    </>
  );
};
