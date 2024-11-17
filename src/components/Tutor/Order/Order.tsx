"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./Order.module.css";
import locationsStyles from "../../../app/tutor/locations.module.css";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { getOrderById } from "@/store/features/orderSlice";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { getYearWord } from "@/utils/words/getYearWord";
import { formatTimeAgo } from "@/utils/date/date";
import { findLocTitlesByIds } from "@/utils/locations/getTitleLocationById";
import { fetchStudentById } from "@/api/server/studentApi";
import { Student } from "@/types/types";

export const Order = () => {
  const page = "Order";
  const dispatch = useDispatch<AppDispatch>();
  const { order } = useParams();
  const token = useAppSelector((state) => state.auth.token);

  const [student, setStudent] = useState<Student | null>(null);

  const { orderById, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (token && typeof order === "string") {
      dispatch(getOrderById({ token, id: order }));
    }
  }, [dispatch, token, order]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (orderById?.studentId) {
        try {
          if (token) {
            const data = await fetchStudentById(token, orderById.studentId);
            setStudent(data);
          }
        } catch (error) {
          console.error("Ошибка при загрузке данных студента:", error);
        }
      }
    };

    fetchStudent();
  }, [orderById, token]);

  //console.log(process.env.NODE_ENV);

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  const subjectArr = data.find(
    (subject) => subject.id_p === orderById?.subject
  );
  const subjectName = subjectArr?.title;

  return (
    <>
      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr
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
              {findLocTitlesByIds(orderById?.studentHomeLoc).map(
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
              {findLocTitlesByIds(orderById?.studentTrip).map(
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
            <span>{orderById?.tutorType}</span>
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
          generalStyles.crsr_pntr
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
