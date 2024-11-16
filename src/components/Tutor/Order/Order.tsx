"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "./Order.module.css";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { getOrderById } from "@/store/features/orderSlice";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { getYearWord } from "@/utils/words/getYearWord";

export const Order = () => {
  const page = "Order";
  const dispatch = useDispatch<AppDispatch>();
  const { order } = useParams();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const { orderById, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (token && typeof order === "string") {
      dispatch(getOrderById({ token, id: order }));
    }
  }, [dispatch, token, order]);

  if (loading)
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
      {/* <div>ID: {order}</div> */}

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
      </div>
    </>
  );
};
