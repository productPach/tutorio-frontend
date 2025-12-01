"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./Order.module.css";
import locationsStyles from "../../../app/tutor/locations.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { getYearWord } from "@/utils/words/getYearWord";
import { formatTimeAgo } from "@/utils/date/date";
import {
  findLocTitleByIdWithDistrict,
  findLocTitlesByIds,
} from "@/utils/locations/getTitleLocationById";
import { City, Order, Student } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { getAllSubjects } from "@/store/features/subjectSlice";
import { useViewedOrders } from "@/hooks/useViewedOrders";
import { ResponseSidbar } from "../SideBar/ResponseSidbar";

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
  // Стейт для предметов
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((state) => state.subject.subjects);

  const { markAsViewed } = useViewedOrders();

  useEffect(() => {
    orderById?.id && markAsViewed(orderById?.id);
  }, [orderById?.id, markAsViewed]);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 1280);
    };

    // Инициализация
    handleResize();

    // Подписка на изменение размера
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      {!showSidebar && <ResponseSidbar />}
      {orderById?.status === "Closed" && (
        <div
          className={clsx(
            generalStyles.content_block,
            generalStyles.order_block,
            generalStyles.crsr_pntr
          )}
        >
          {" "}
          Этот заказ закрыт по инициативе ученика или по истечении срока
          {"\u00A0"}⛔️
          <br></br>
          Посмотрите другие активные заказы — возможно, там ваш будущий ученик
          {/* {"\u00A0"}👀 */}
        </div>
      )}

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          orderById?.status === "Closed" && generalStyles.closedFilter
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
              {orderById?.studentHomeLoc?.map((id, index) => {
                const location = findLocTitleByIdWithDistrict(id, locations);

                return (
                  <div key={index}>
                    {/* Отображаем кружок метро, если есть lineNumber */}
                    {location?.lineNumber && (
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
                        </div>
                      </div>
                    )}

                    {/* Если lineNumber нет (то есть это район или регион), отобразим нейтральный кружок */}
                    {!location?.lineNumber && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr_none
                            )}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Заголовок (название станции / района / города) */}
                    {location?.title || "Неизвестная локация"}
                  </div>
                );
              })}
            </span>
          </div>
        )}

        {orderById?.studentTrip && orderById?.studentTrip.length > 0 && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Ученик готов приехать</span>
            <span>
              {orderById?.studentTrip?.map((id, index) => {
                const location = findLocTitleByIdWithDistrict(id, locations);

                return (
                  <div key={index}>
                    {/* Если это метро (есть номер линии) */}
                    {location?.lineNumber && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr,
                              locationsStyles[
                                `crcl_mtr_${location.cityPrefix}_${location.lineNumber}`
                              ]
                            )}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Если это не метро (район/регион) */}
                    {!location?.lineNumber && (
                      <div className={locationsStyles.crcl_mtr_wrap}>
                        <div className={locationsStyles.crcl_mtr_container}>
                          <div
                            className={clsx(
                              styles.order_block,
                              locationsStyles.crcl_mtr_none
                            )}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Название локации */}
                    {location?.title || "Неизвестная локация"}
                  </div>
                );
              })}
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
          orderById?.status === "Closed" && generalStyles.closedFilter
        )}
      >
        {student && (
          <div className={styles.containerOrderInfo}>
            <span className={styles.titleOrderInfo}>Ученик</span>
            <span>{student?.name}</span>
          </div>
        )}

        <div className={styles.containerOrderInfo}>
          <span className={styles.titleOrderInfo}>ID заказа</span>
          <span>{orderById?.orderNumber}</span>
        </div>

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
