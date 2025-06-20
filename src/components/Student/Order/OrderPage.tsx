"use client";
import styles from "../../../app/student/layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Student } from "@/types/types";
import { useSelector } from "react-redux";
import { clearOrderById, getOrderById } from "@/store/features/orderSlice";
import { fetchStudentById } from "@/api/server/studentApi";
import { OrderComponent } from "@/components/Student/Order/Order";
import { ResponseSidbar } from "@/components/Student/SideBar/ResponseSidbar";
import LeftBarOrder from "@/components/Student/LeftBar/LeftBarOrder";
import { TutorsComponent } from "@/components/Student/Tutors/Tutors";
import { getAllTutors } from "@/store/features/tutorSlice";
import { ResponseStudentToTutorModal } from "@/components/Student/Modal/Response/ResponseStudentToTutorModal";
import { WikiForOrderComponent } from "@/components/Student/Wiki/WikiForOrderComponent";
import { ChatComponent } from "@/components/Student/Chat/Chat";
import { host, port } from "@/api/server/configApi";
import { io } from "socket.io-client";
import { getChatsByOrderId } from "@/store/features/chatSlice";
import { SpinnerSingleOrange } from "@/components/Spinner/SpinnerSingleOrange";
import { useChat } from "@/context/ChatContext";
import { getThemesByTopic } from "@/store/features/wikiSlice";
import { ResponseSidbarMobile } from "../ResponseMobile/ResponseMobile";
import OrderMenuMobile from "../OrderMenuMobile/OrderMenuMobile";

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
  const { chats, setChatsState, clearChats } = useChat();

  const { orderById, loading, error } = useAppSelector((state) => state.orders);

  // Получаем всех репетиторов (фильтровать будем на клиенте)
  const tutorsForOrderNotFilter = useAppSelector((state) => state.tutor.tutors);
  const placeMapping: Record<string, string> = {
    Дистанционно: "1",
    "У репетитора": "2",
    "У меня дома": "3",
  };

  useEffect(() => {
    return () => {
      dispatch(clearOrderById());
    };
  }, []);

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
    if (token) {
      dispatch(getAllTutors(token));
      dispatch(
        getThemesByTopic({ topicId: "67d090b401144e8d6f4eba88", token })
      );
    }
  }, [dispatch, token]);

  const [isDataLoaded, setIsDataLoaded] = useState(false); // флаг для загрузки данны

  // Нужно только для свитча, нужно переделать
  useEffect(() => {
    const fetchStudent = async () => {
      if (orderById?.studentId && !isDataLoaded) {
        // Проверяем, был ли уже выполнен запрос
        try {
          if (token) {
            const data = await fetchStudentById(token, orderById.studentId);
            setStudent(data);
            setIsDataLoaded(true); // После успешной загрузки данных ставим флаг в true
          }
        } catch (error) {
          console.error("Ошибка при загрузке данных студента:", error);
        }
      }
    };

    if (orderById && token && !isDataLoaded) {
      fetchStudent();
      dispatch(getChatsByOrderId({ orderId: orderById?.id, token: token }));
      setIsChecked(orderById.status === "Active");
    }
  }, [orderById, token, dispatch, isDataLoaded]);

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(orderById?.status === "Active");

  const themes = useAppSelector((state) => state.wiki.themes)
    .filter((theme) => theme.visibleToRoles.includes("student"))
    .filter((theme) => theme.topicId === "67d090b401144e8d6f4eba88");

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
              themes={themes}
              topicTitle={"📢 Отклики и заказы"}
            />
          )}
          {component === 5 || component === 6 ? (
            <ChatComponent
              chats={chats}
              setChatsState={setChatsState}
              orderById={orderById}
              visibleEmoji={visibleEmoji}
              setVisibleEmoji={setVisibleEmoji}
            />
          ) : null}
          {component === 7 || component === 8 ? (
            <ResponseSidbarMobile
              chats={chats}
              clearChats={clearChats}
              visibleEmoji={visibleEmoji}
              setVisibleEmoji={setVisibleEmoji}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              orderById={orderById}
              loading={loading}
            />
          ) : null}
        </div>
        <ResponseSidbar
          chats={chats}
          clearChats={clearChats}
          visibleEmoji={visibleEmoji}
          setVisibleEmoji={setVisibleEmoji}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          orderById={orderById}
          loading={loading}
        />
      </section>
      {component !== 5 && component !== 6 ? <OrderMenuMobile /> : null}
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
