"use client";
import generalStyles from "../../../app/tutor/layout.module.css";
import styles from "../Order/Order.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { data } from "@/utils/listSubjects";
import { formatTimeAgo } from "@/utils/date/date";
import { City, Order, Student } from "@/types/types";

type OrderProps = {
  loading: boolean;
  student: Student | null;
  orderById: Order | null;
  error: string | null;
  locations: City[];
};

export const TutorsComponent = ({
  loading,
  student,
  orderById,
  error,
  locations,
}: OrderProps) => {
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
            <h3>Репетитор</h3>
          </div>
          <div className={styles.goal}>{orderById?.goal}</div>
        </div>

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
