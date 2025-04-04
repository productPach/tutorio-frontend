"use client";
import styles from "../../../../layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Student } from "@/types/types";
import { useSelector } from "react-redux";
import { getOrderById } from "@/store/features/orderSlice";
import { fetchStudentById } from "@/api/server/studentApi";
import { OrderComponent } from "@/components/Student/Order/Order";
import { ResponseSidbar } from "@/components/Student/SideBar/ResponseSidbar";
import LeftBarOrder from "@/components/Student/LeftBar/LeftBarOrder";
import { TutorsComponent } from "@/components/Student/Tutors/Tutors";
import { getAllTutors, getTutorById } from "@/store/features/tutorSlice";
import { ResponseStudentToTutorModal } from "@/components/Student/Modal/Response/ResponseStudentToTutorModal";
import { WikiForOrderComponent } from "@/components/Student/Wiki/WikiForOrderComponent";
import { TutorComponent } from "@/components/Student/Tutor/Tutor";

const TutorPage: React.FC = () => {
  const page = "Tutor";
  const { tutor } = useParams<{ tutor: string }>(); // Явно указываем тип
  const isModalResponseStudentToTutor = useAppSelector(
    (state) => state.modal.isModalResponseStudentToTutor
  );

  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);

  const { orderById } = useSelector((state: RootState) => state.orders);

  // Получаем список регионов
  const citiesAndRegions = useAppSelector((state) => state.locations.city);

  useEffect(() => {
    if (token && typeof tutor === "string") {
      dispatch(getTutorById({ id: tutor, token }));
    }
  }, [dispatch, tutor]);

  const {
    tutor: tutorData,
    loading,
    error,
  } = useSelector((state: RootState) => state.tutor);

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBarOrder page={page} />
        <div className={styles.content}>
          <TutorComponent
            citiesAndRegions={citiesAndRegions}
            loading={loading}
            orderById={orderById}
            error={error}
            locations={locations}
            tutor={tutorData}
          />
        </div>
        <ResponseSidbar />
      </section>
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
