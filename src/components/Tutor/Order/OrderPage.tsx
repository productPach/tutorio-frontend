"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { useParams } from "next/navigation";
import { OrderComponent } from "@/components/Tutor/Order/Order";
import { ResponseSidbar } from "@/components/Tutor/SideBar/ResponseSidbar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { WelcomeScreen } from "@/components/Tutor/WelcomeScreen/WelcomeScreen";
import { useEffect, useState } from "react";
import { Student } from "@/types/types";
import { useSelector } from "react-redux";
import { clearOrderById, getOrderById } from "@/store/features/orderSlice";
import { fetchStudentById } from "@/api/server/studentApi";
import { setLoadingPage, setScrollY } from "@/store/features/modalSlice";
import { LoadingPageModal } from "@/components/Tutor/Modal/Loading/loadingModal";
import { ResponseTutorToStudentModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentModal";
import { ResponseTutorToStudentWithContaktModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentWithContaktModal";

const OrderPage: React.FC = () => {
  const page = "Order";
  const { order } = useParams();
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const descriptionForModalBalanceBoost =
    "Примите заказ — после этого вы сможете пообщаться с учеником и обменяться контактами";
  const isModalResponseTutorToStudent = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudent
  );
  const isModalResponseTutorToStudentWithContakt = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudentWithContakt
  );
  const isModalLoadingPage = useAppSelector((state) => state.modal.loadingPage);

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
    return () => {
      dispatch(clearOrderById());
      dispatch(setLoadingPage(false));
      dispatch(setScrollY(0));
    };
  }, []);

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
          <WelcomeScreen page={page} />
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
        contentModal={
          <BalanceBoost description={descriptionForModalBalanceBoost} />
        }
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
      <Modal
        titleModal={"Отправить отклик"}
        contentModal={<ResponseTutorToStudentModal />}
        isModal={isModalResponseTutorToStudent}
        modalId={"responseTutorToStudentModal"}
      ></Modal>
      <Modal
        titleModal={"Получить контакты"}
        contentModal={<ResponseTutorToStudentWithContaktModal />}
        isModal={isModalResponseTutorToStudentWithContakt}
        modalId={"responseTutorToStudentWithContaktModal"}
      ></Modal>
      <Modal
        titleModal={""}
        contentModal={<LoadingPageModal />}
        isModal={isModalLoadingPage}
        modalId={"loadingPageModal"}
      ></Modal>
    </>
  );
};

export default OrderPage;
