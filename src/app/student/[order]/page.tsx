"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Student } from "@/types/types";
import { useSelector } from "react-redux";
import { getOrderById } from "@/store/features/orderSlice";
import { fetchStudentById } from "@/api/server/studentApi";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import { OrderComponent } from "@/components/Student/Order/Order";
import { ResponseSidbar } from "@/components/Student/SideBar/ResponseSidbar";

const OrderPage: React.FC = () => {
  const page = "Main";
  const { order } = useParams();
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );

  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

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

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <OrderComponent
            loading={loading}
            student={student}
            orderById={orderById}
            error={error}
            locations={locations}
          />
        </div>
        <ResponseSidbar />
      </section>
      <Modal
        titleModal={"Пополните баланс, чтобы откликнуться"}
        contentModal={<BalanceBoost />}
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
    </>
  );
};

export default OrderPage;
