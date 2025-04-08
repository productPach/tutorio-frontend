"use client";
import styles from "../../layout.module.css";
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
import { getAllTutors } from "@/store/features/tutorSlice";
import { ResponseStudentToTutorModal } from "@/components/Student/Modal/Response/ResponseStudentToTutorModal";
import { WikiForOrderComponent } from "@/components/Student/Wiki/WikiForOrderComponent";
import { ChatComponent } from "@/components/Student/Chat/Chat";

const OrderPage: React.FC = () => {
  const page = "Main";
  const { order } = useParams();
  const isModalResponseStudentToTutor = useAppSelector(
    (state) => state.modal.isModalResponseStudentToTutor
  );

  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  // Получаем дату городов из Redux
  const locations = useAppSelector((state) => state.locations.city);
  // Получаем стейт храниения компонента для отображения
  const component = useAppSelector((state) => state.orders.componentMenu);
  // Стейт для эмодзи в чате
  const [visibleEmoji, setVisibleEmoji] = useState(false);

  const [student, setStudent] = useState<Student | null>(null);

  const { orderById, loading, error } = useSelector(
    (state: RootState) => state.orders
  );
  // Получаем всех репетиторов (фильтровать будем на клиенте)
  const tutorsForOrderNotFilter = useAppSelector((state) => state.tutor.tutors);
  const placeMapping: Record<string, string> = {
    Дистанционно: "1",
    "У репетитора": "2",
    "У меня дома": "3",
  };

  // Фильтруем репетиторов по условиям заказа
  const tutorsForOrder = tutorsForOrderNotFilter
    .filter((tutor) => tutor.status === "Active")
    .filter(
      (tutor) =>
        orderById?.subject && tutor.subject.includes(orderById?.subject)
    )
    .filter((tutor) => {
      if (!orderById?.studentPlace) return true; // Если ученик не указал место, не фильтруем

      // Преобразуем studentPlace в числа согласно маппингу
      const studentPlacesMapped = orderById.studentPlace
        .map((place) => placeMapping[place])
        .filter(Boolean); // Убираем возможные undefined

      // Оставляем только тех репетиторов, у которых есть хотя бы одно совпадение
      return tutor.tutorPlace.some((place) =>
        studentPlacesMapped.includes(place)
      );
    });
  // Получаем список регионов
  const citiesAndRegions = useAppSelector((state) => state.locations.city);

  useEffect(() => {
    if (token && typeof order === "string") {
      dispatch(getOrderById({ token, id: order }));
    }
  }, [dispatch, token, order]);

  useEffect(() => {
    token && dispatch(getAllTutors(token));
  }, [dispatch, token]);

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
        <LeftBarOrder />
        <div className={styles.content}>
          {component === 1 && (
            <OrderComponent
              loading={loading}
              student={student}
              orderById={orderById}
              error={error}
              locations={locations}
            />
          )}
          {component === 2 || component === 4 ? (
            <TutorsComponent
              tutorsForOrder={tutorsForOrder}
              citiesAndRegions={citiesAndRegions}
              loading={loading}
              student={student}
              orderById={orderById}
              error={error}
              locations={locations}
            />
          ) : null}
          {component === 3 && (
            <WikiForOrderComponent
              loading={loading}
              student={student}
              error={error}
            />
          )}
          {component === 5 || component === 6 ? (
            <ChatComponent
              orderById={orderById}
              visibleEmoji={visibleEmoji}
              setVisibleEmoji={setVisibleEmoji}
            />
          ) : null}
        </div>
        <ResponseSidbar
          visibleEmoji={visibleEmoji}
          setVisibleEmoji={setVisibleEmoji}
        />
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

export default OrderPage;
