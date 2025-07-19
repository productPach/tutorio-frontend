"use client";
import styles from "../../../app/tutor/layout.module.css";
import locationsStyles from "../../../app/tutor/locations.module.css";
import generalStyles from "../../../app/general.module.css";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { getAllOrders, setOrderByIdDefault } from "@/store/features/orderSlice";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import { getYearWord } from "@/utils/words/getYearWord";
import {
  findLocTitleById,
  findLocTitleByIdWithDistrict,
} from "@/utils/locations/getTitleLocationById";
import { Order } from "@/types/types";
import { formatTimeAgo } from "@/utils/date/date";
import {
  setIsModalResponseTutorToStudent,
  setIsModalResponseTutorToStudentWithContakt,
} from "@/store/features/modalSlice";
import { useChat } from "@/context/ChatContext";
import { setChat } from "@/store/features/chatSlice";
import { useRouter } from "next/navigation";
import { getAllSubjects } from "@/store/features/subjectSlice";

const Orders = () => {
  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  const { orders, loading, error, filters } = useSelector(
    (state: RootState) => state.orders
  );
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const { selectedPlaceFilters, selectedGoalFilters } = filters;
  const { chats, chatsLoading, setChatsLoaded } = useChat();

  // Стейт для предметов
  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getAllOrders(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    let filteredOrders = orders
      .filter((order) => order.status === "Active")
      .filter(
        (order) =>
          tutor?.subject &&
          tutor.subject.length > 0 &&
          tutor.subject.some((subject) => order.subject === subject)
      )
      .filter(
        (order) =>
          tutor?.region === order.region ||
          (tutor?.region !== order.region &&
            order.studentPlace?.includes("Дистанционно") &&
            ((!filters.selectedPlaceFilters.includes("У репетитора") &&
              !filters.selectedPlaceFilters.includes("У меня дома")) ||
              ((filters.selectedPlaceFilters.includes("У репетитора") ||
                filters.selectedPlaceFilters.includes("У меня дома")) &&
                filters.selectedPlaceFilters.includes("Дистанционно"))))
      );

    // Применяем оба фильтра, если они заданы
    if (selectedGoalFilters.length > 0 && selectedPlaceFilters.length > 0) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.goal &&
          selectedGoalFilters.includes(order.goal) &&
          order.studentPlace &&
          order.studentPlace.some((place) =>
            selectedPlaceFilters.includes(place)
          )
      );
    } else if (selectedGoalFilters.length > 0) {
      // Применяем только фильтр цели
      filteredOrders = filteredOrders.filter(
        (order) => order.goal && selectedGoalFilters.includes(order.goal)
      );
    } else if (selectedPlaceFilters.length > 0) {
      // Применяем только фильтр места
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.studentPlace &&
          order.studentPlace.some((place) =>
            selectedPlaceFilters.includes(place)
          )
      );
    }

    setActiveOrders(
      filteredOrders.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    );
  }, [orders, selectedPlaceFilters, selectedGoalFilters]);

  if (loading || chatsLoading) {
    return (
      <div className={styles.container__spinner}>
        <div className={styles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );
  }

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  return (
    <>
      {activeOrders.length > 0
        ? activeOrders.map((order) => {
            if (
              chats.find((chat) => chat.orderId === order.id)?.status ===
              "Rejected"
            )
              return null;
            const subject = subjects.find(
              (item) => item.id_p === order.subject
            );
            const goal = order.goal ? order.goal + " // " : null;
            const deadline = order.deadline
              ? order.deadline + " до экзамена // "
              : null;
            const studentType = order.studentType
              ? order.studentType + " // "
              : null;

            const studentYears = order.studentYears
              ? "Возраст ученика — " +
                order.studentYears +
                " " +
                getYearWord(Number(order.studentYears)) +
                " // "
              : null;

            const studentClass = order.studentClass
              ? order.studentClass + " // "
              : null;

            const studentCourse = order.studentCourse
              ? order.studentCourse + " // "
              : null;

            const studentUniversity = order.studentUniversity
              ? order.studentUniversity + " // "
              : null;

            const studentExam = order.studentExam
              ? order.studentExam + " // "
              : null;

            const studyMethod = order.studyMethod
              ? order.studyMethod + " // "
              : null;

            const studyProgramm = order.studyProgramm
              ? order.studyProgramm + " // "
              : null;

            // Не выводим в списке
            const studentLevel = order.studentLevel
              ? order.studentLevel + " // "
              : null;

            // Не выводим в списке
            const tutorGender = order.tutorGender
              ? order.tutorGender + " // "
              : null;

            // Не выводим в списке
            const studentSchedule = order.studentSchedule
              ? order.studentSchedule + " // "
              : null;

            const studentRegion = order.region ? order.region : null;

            const studentPlace = order.studentPlace
              ? order.studentPlace + " // "
              : null;

            const studentAdress = order.studentAdress
              ? order.studentAdress + " // "
              : null;

            const studentHomeLoc = order.studentHomeLoc
              ? order.studentHomeLoc
              : null;

            const studentTrip = order.studentTrip ? order.studentTrip : null;

            let remoteLessons;
            let studentHomeLessons;
            let tutorHomeLessons;

            // Выводим город ученика
            if (studentPlace?.includes("Дистанционно")) {
              remoteLessons = `Дистанционно — ${studentRegion}`;
            }

            // Сделать вывод ближайших локаций к адресу ученика
            let firstLocationHome;
            let countHome;
            if (studentPlace?.includes("У меня дома") && studentHomeLoc) {
              firstLocationHome = findLocTitleByIdWithDistrict(
                studentHomeLoc[0],
                locations
              );
              countHome = studentHomeLoc.length - 1;
            }

            // Вывод локаций, куда ученик готов выезжать
            let firstLocationTrip;
            let countTrip;
            if (studentPlace?.includes("У репетитора") && studentTrip) {
              firstLocationTrip = findLocTitleByIdWithDistrict(
                studentTrip[0],
                locations
              );
              countTrip = studentTrip.length - 1;
            }

            const tutorType = order.tutorType ? order.tutorType : null;
            // Выводим цену
            let price;
            if (tutorType === "Начинающий: до 1000 рублей") {
              price = "до 1000 ₽";
            }
            if (tutorType === "Репетитор со средним опытом: до 1500 рублей") {
              price = "1000 — 1500 ₽";
            }
            if (tutorType === "Опытный репетитор: до 2500 рублей") {
              price = "1500 — 2500 ₽";
            }

            const studentWishes = order.studentWishes
              ? order.studentWishes
              : null;

            const existingChat = chats.find(
              (chat) => chat.orderId === order.id
            );

            return (
              <div
                key={order.id}
                className={clsx(
                  styles.content_block,
                  styles.order_block,
                  styles.crsr_pntr,
                  {
                    [styles.visible]: !loading,
                    [styles.hidden]: loading,
                  }
                )}
              >
                <Link href={`${order.id}`}>
                  <div className={styles.order_block_flx_rw_spbtw}>
                    <h3>{subject?.title}</h3>
                    <span className={styles.order_block_flx_rw_spbtw_price}>
                      {price}
                    </span>
                  </div>

                  <p className={styles.content_block_p}>
                    {goal} {deadline} {studentType} {studentYears}{" "}
                    {studentClass}
                    {studentCourse} {studentUniversity} {studentExam}{" "}
                    {studyProgramm} {studyMethod}
                  </p>
                  <p className={styles.content_block_p}>{studentWishes}</p>

                  {studentPlace?.includes("Дистанционно") && (
                    <div className={styles.order_block_flx_rw_flxstrt}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.5 12C13.5 13.6569 12.1569 15 10.5 15C8.84315 15 7.5 13.6569 7.5 12C7.5 10.3431 8.84315 9 10.5 9C12.1569 9 13.5 10.3431 13.5 12ZM12.5 12C12.5 13.1046 11.6046 14 10.5 14C9.39543 14 8.5 13.1046 8.5 12C8.5 10.8954 9.39543 10 10.5 10C11.6046 10 12.5 10.8954 12.5 12Z"
                          fill="#2A2A2A"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17 17V15L19.2764 16.1382C19.6088 16.3044 20 16.0627 20 15.691V8.30902C20 7.93733 19.6088 7.69558 19.2764 7.8618L17 9V7C17 5.89543 16.1046 5 15 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H15C16.1046 19 17 18.1046 17 17ZM15 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H15C15.5523 18 16 17.5523 16 17V7C16 6.44772 15.5523 6 15 6ZM19 14.882L17 13.882V10.118L19 9.11803V14.882Z"
                          fill="#2A2A2A"
                        />
                      </svg>
                      <span className={styles.order_block_flx_rw_flxstrt_text}>
                        {remoteLessons}
                      </span>
                    </div>
                  )}

                  {studentPlace?.includes("У меня дома") && (
                    <div className={styles.order_block_flx_rw_flxstrt}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17.2326 10.0951L13.2326 6.96466C12.5086 6.398 11.4914 6.398 10.7674 6.96466L6.76738 10.0951C6.28301 10.4742 6 11.055 6 11.6701V16C6 17.1046 6.89543 18 8 18H12H16C17.1046 18 18 17.1046 18 16V11.6701C18 11.055 17.717 10.4742 17.2326 10.0951Z"
                          stroke="#2A2A2A"
                        />
                        <rect
                          x="9"
                          y="15"
                          width="6"
                          height="1"
                          rx="0.5"
                          fill="#2A2A2A"
                        />
                      </svg>
                      <span className={styles.order_block_flx_rw_flxstrt_text}>
                        Занятия у ученика
                        {studentHomeLoc && studentHomeLoc?.length > 0 && (
                          <> — </>
                        )}
                        <div className={locationsStyles.crcl_mtr_wrap}>
                          {firstLocationHome?.lineNumber && (
                            <div className={locationsStyles.crcl_mtr_container}>
                              <div
                                className={clsx(
                                  styles.order_block,
                                  locationsStyles.crcl_mtr,
                                  locationsStyles[
                                    `crcl_mtr_msk_${firstLocationHome?.lineNumber}`
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
                          )}
                        </div>
                        {firstLocationHome?.title}
                        <span
                          className={clsx(
                            styles.order_block_flx_rw_subtext,
                            generalStyles.mrgnLt5
                          )}
                        >
                          {studentHomeLoc &&
                            studentHomeLoc?.length > 1 &&
                            `и ещё ${countHome}`}
                        </span>
                      </span>
                    </div>
                  )}

                  {studentPlace?.includes("У репетитора") && (
                    <div className={styles.order_block_flx_rw_flxstrt}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.5 11C17.6046 11 18.5 10.1046 18.5 9C18.5 7.89543 17.6046 7 16.5 7C15.3954 7 14.5 7.89543 14.5 9C14.5 10.1046 15.3954 11 16.5 11ZM16.5 10C17.0523 10 17.5 9.55228 17.5 9C17.5 8.44772 17.0523 8 16.5 8C15.9477 8 15.5 8.44772 15.5 9C15.5 9.55228 15.9477 10 16.5 10Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M13.8975 12.291L13.277 12.4461L11.881 14.0885C11.7021 14.2989 11.3866 14.3245 11.1762 14.1457C10.9658 13.9668 10.9402 13.6513 11.119 13.4409L12.5774 11.7251C12.6721 11.6137 12.7992 11.5348 12.941 11.4994L14.634 11.0761C15.1612 10.9443 15.578 11.5253 15.2843 11.9825L14.0247 13.9431L15.4927 14.7742C15.8062 14.9517 16 15.2842 16 15.6444V18C16 18.2761 15.7761 18.5 15.5 18.5C15.2239 18.5 15 18.2761 15 18V15.6444L13.1639 14.6049C12.864 14.4351 12.7684 14.0483 12.9547 13.7584L13.8975 12.291Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M12.8969 15.0944C13.1209 15.2559 13.1716 15.5684 13.0101 15.7924L11.4056 18.018C11.2441 18.242 10.9316 18.2927 10.7076 18.1312C10.4836 17.9697 10.4329 17.6572 10.5944 17.4332L12.1989 15.2076C12.3604 14.9836 12.6729 14.9329 12.8969 15.0944Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M16.6373 11.6897C16.3948 11.5577 16.0911 11.6474 15.9592 11.89C15.8273 12.1326 15.917 12.4362 16.1595 12.5681L17.7611 13.4392C18.0037 13.5712 18.3073 13.4815 18.4392 13.2389C18.5712 12.9963 18.4815 12.6927 18.2389 12.5608L16.6373 11.6897Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M8.5 9.5C8.22386 9.5 8 9.72386 8 10C8 10.2761 8.22386 10.5 8.5 10.5H11.29C11.5662 10.5 11.79 10.2761 11.79 10C11.79 9.72386 11.5662 9.5 11.29 9.5H8.5Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M5.5 12C5.5 11.7239 5.72386 11.5 6 11.5H8.79004C9.06618 11.5 9.29004 11.7239 9.29004 12C9.29004 12.2761 9.06618 12.5 8.79004 12.5H6C5.72386 12.5 5.5 12.2761 5.5 12Z"
                          fill="#2A2A2A"
                        />
                        <path
                          d="M7 13.5C6.72386 13.5 6.5 13.7239 6.5 14C6.5 14.2761 6.72386 14.5 7 14.5H9.79004C10.0662 14.5 10.29 14.2761 10.29 14C10.29 13.7239 10.0662 13.5 9.79004 13.5H7Z"
                          fill="#2A2A2A"
                        />
                      </svg>
                      <span className={styles.order_block_flx_rw_flxstrt_text}>
                        Готов приехать —
                        <div className={locationsStyles.crcl_mtr_wrap}>
                          {firstLocationTrip?.lineNumber && (
                            <div className={locationsStyles.crcl_mtr_container}>
                              <div
                                className={clsx(
                                  styles.order_block,
                                  locationsStyles.crcl_mtr,
                                  locationsStyles[
                                    `crcl_mtr_msk_${firstLocationTrip?.lineNumber}`
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
                          )}
                        </div>
                        {firstLocationTrip?.title}
                        <span
                          className={clsx(
                            styles.order_block_flx_rw_subtext,
                            generalStyles.mrgnLt5
                          )}
                        >
                          {studentTrip &&
                            studentTrip?.length > 1 &&
                            `и ещё ${countTrip}`}
                        </span>
                      </span>
                    </div>
                  )}

                  <div
                    className={clsx(
                      styles.order_block_flx_rw_spbtw,
                      generalStyles.mrgnTp10
                    )}
                  >
                    <div className={styles.header__menu}>
                      {chats.find((chat) => chat.orderId === order.id) &&
                        !chats.find((chat) => chat.orderId === order.id)
                          ?.tutorHasAccess && (
                          <div className={styles.blockResponseStudent}>
                            <div className={styles.fireIcon}>🎓</div>
                            <div>ученик предложил вам заказ</div>
                          </div>
                        )}

                      <button
                        className={clsx(
                          styles.content_block_button,
                          existingChat ? styles.buttonBlc : styles.buttonYlw
                        )}
                        onClick={(e) => {
                          if (existingChat) {
                            e.preventDefault();
                            // Если чат есть — редиректим на страницу чата
                            route.push(`responses`);
                            dispatch(setChat(existingChat));
                          } else {
                            e.preventDefault();
                            order.autoContactsOnResponse
                              ? dispatch(
                                  setIsModalResponseTutorToStudentWithContakt(
                                    true
                                  )
                                )
                              : dispatch(
                                  setIsModalResponseTutorToStudent(true)
                                );

                            dispatch(setOrderByIdDefault(order));
                            setChatsLoaded(true);
                          }
                        }}
                        type="button"
                      >
                        {chats.find((chat) => chat.orderId === order.id)
                          ? "Перейти в чат"
                          : order.autoContactsOnResponse
                            ? "Получить контакты"
                            : "Откликнуться"}
                      </button>

                      {order.autoContactsOnResponse && !existingChat && (
                        <div className={styles.blockAutoContakts}>
                          <div className={styles.fireIcon}>🔥</div>
                          <div>доступ к контактам после отклика</div>
                        </div>
                      )}
                    </div>

                    <span className={styles.order_block_flx_rw_subtext}>
                      {formatTimeAgo(order.createdAt)}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })
        : !loading && (
            <div
              className={clsx(styles.content_block, styles.info_block, {
                [styles.visible]: !loading,
                [styles.hidden]: loading,
              })}
            >
              <h3>Нет доступных заказов 😔</h3>
              <p className={styles.content_block_p}>
                К сожалению, сейчас нет заказов, которые подходят под ваши
                условия. Пожалуйста, упростите критерии поиска в меню фильтров
                справа.
              </p>
              <p>
                Добавьте дополнительные предметы, которые вы преподаете. Это
                поможет увеличить количество доступных заказов.
              </p>
              {/* <button className={styles.buttonBlc} type="button">
            Сбросить фильтры
          </button> */}
            </div>
          )}
    </>
  );
};

export default Orders;
