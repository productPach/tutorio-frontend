"use client";
import styles from "../../../app/student/layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ResponseSidbar } from "@/components/Student/SideBar/ResponseSidbar";
import LeftBarOrder from "@/components/Student/LeftBar/LeftBarOrder";
import { getTutorById } from "@/store/features/tutorSlice";
import { ResponseStudentToTutorModal } from "@/components/Student/Modal/Response/ResponseStudentToTutorModal";
import { TutorComponent } from "@/components/Student/Tutor/Tutor";
import {
  checkHasChatWithTutor,
  getOrderById,
} from "@/store/features/orderSlice";
import { useChat } from "@/context/ChatContext";
import OrderMenuMobile from "../OrderMenuMobile/OrderMenuMobile";

const TutorPage: React.FC = () => {
  const page = "Tutor";
  const { tutor } = useParams<{ tutor: string }>(); // Явно указываем тип
  const { order } = useParams<{ order: string }>(); // Явно указываем тип

  const isModalResponseStudentToTutor = useAppSelector(
    (state) => state.modal.isModalResponseStudentToTutor
  );

  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  const { chats, clearChats } = useChat();
  const { orderById } = useSelector((state: RootState) => state.orders);

  // Получаем список регионов
  const citiesAndRegions = useAppSelector((state) => state.locations.city);

  const hasChatWithTutor = useAppSelector(
    (state) => state.orders.hasChatWithTutor
  );
  useEffect(() => {
    if (typeof tutor === "string") {
      dispatch(getTutorById({ id: tutor }));
    }
  }, [dispatch, tutor, token]);

  const {
    tutorById: tutorData,
    loading,
    error,
  } = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    dispatch({ type: "orders/resetHasChatWithTutor" });

    if (typeof order === "string") {
      dispatch(getOrderById({ id: order }))
        .unwrap()
        .then(() => {
          // Только после загрузки заказа проверяем наличие чата
          if (tutor) {
            dispatch(checkHasChatWithTutor(tutor));
          }
        });
    }
  }, [dispatch, token, order, tutor]);

  useEffect(() => {
    orderById &&
      setIsChecked(
        orderById.status === "Active" ||
          orderById.status === "Pending" ||
          orderById.status === "Sending"
      );
  }, [orderById]);

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(orderById?.status === "Active");

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBarOrder page={page} />
        <div className={styles.content}>
          <TutorComponent
            chats={chats}
            citiesAndRegions={citiesAndRegions}
            loading={loading}
            orderById={orderById}
            error={error}
            locations={locations}
            tutor={tutorData}
          />
        </div>
        <ResponseSidbar
          chats={chats}
          clearChats={clearChats}
          tutor={tutorData}
          page={page}
          orderById={orderById}
          loading={loading}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          isChatWithTutor={hasChatWithTutor}
        />
      </section>
      <OrderMenuMobile page={page} />
      <Modal
        titleModal={"Предложить заказ репетитору"}
        contentModal={<ResponseStudentToTutorModal />}
        isModal={isModalResponseStudentToTutor}
        modalId={"responseStudentToTutorModal"}
      ></Modal>
    </>
  );
};

export default TutorPage;
