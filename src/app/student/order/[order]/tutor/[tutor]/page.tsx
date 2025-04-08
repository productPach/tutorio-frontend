"use client";
import styles from "../../../../layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ResponseSidbar } from "@/components/Student/SideBar/ResponseSidbar";
import LeftBarOrder from "@/components/Student/LeftBar/LeftBarOrder";
import { getTutorById } from "@/store/features/tutorSlice";
import { ResponseStudentToTutorModal } from "@/components/Student/Modal/Response/ResponseStudentToTutorModal";
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
        <ResponseSidbar tutor={tutorData} page={page} />
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
