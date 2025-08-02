"use client";
import styles from "../../../app/student/layout.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Student } from "@/types/types";
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
import { getChatsByOrderId } from "@/store/features/chatSlice";
import { useChat } from "@/context/ChatContext";
import { getThemesByTopic } from "@/store/features/wikiSlice";
import { ResponseSidbarMobile } from "../ResponseMobile/ResponseMobile";
import OrderMenuMobile from "../OrderMenuMobile/OrderMenuMobile";
import { CreateContractByStudentModal } from "../Modal/Response/CreateContractByStudentModal";
import { HiddenOrderModal } from "../Modal/Response/HiddenOrderModal";
import { CreateReviewByStudentModal } from "../Modal/Review/CreateReviewByStudentModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsSheetCreateReviewByStudent,
  setIsSheetUpdateReviewByStudent,
} from "@/store/features/modalSlice";
import { UpdateReviewByStudentModal } from "../Modal/Review/UpdateReviewByStudentModal";

const OrderPage: React.FC = () => {
  const page = "Main";
  const { order } = useParams();
  const isModalResponseStudentToTutor = useAppSelector(
    (state) => state.modal.isModalResponseStudentToTutor
  );
  const isModalCreateContractByStudent = useAppSelector(
    (state) => state.modal.isModalCreateContractByStudent
  );
  const isModalHiddenOrder = useAppSelector(
    (state) => state.modal.isModalHiddenOrder
  );
  const isModalCreateReviewByStudent = useAppSelector(
    (state) => state.modal.isModalCreateReviewByStudent
  );
  const isSheetCreateReviewByStudent = useAppSelector(
    (state) => state.modal.isSheetCreateReviewByStudent
  );
  const isModalUpdateReviewByStudent = useAppSelector(
    (state) => state.modal.isModalUpdateReviewByStudent
  );
  const isSheetUpdateReviewByStudent = useAppSelector(
    (state) => state.modal.isSheetUpdateReviewByStudent
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
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); // Можно увеличить до 100-200 если нужно

    return () => clearTimeout(timeout);
  }, [component]);

  const tutorsForOrder = tutorsForOrderNotFilter
    .filter((tutor) => tutor.status === "Active")
    .filter(
      (tutor) => orderById?.subject && tutor.subject.includes(orderById.subject)
    )
    .filter((tutor) => {
      // Если не указано место занятия у ученика, показываем всех
      if (!orderById?.studentPlace || orderById.studentPlace.length === 0)
        return true;

      // Преобразуем места занятия из строки в коды
      const studentPlacesMapped = orderById.studentPlace
        .map((place) => placeMapping[place])
        .filter(Boolean);

      // Если у репетитора нет ни одного места из указанных у ученика — исключаем
      if (
        !tutor.tutorPlace.some((place) => studentPlacesMapped.includes(place))
      ) {
        return false;
      }

      // Проверяем, какие места выбраны у ученика
      const includesRemote = orderById.studentPlace.includes("Дистанционно");
      const includesAtTutor = orderById.studentPlace.includes("У репетитора");
      const includesAtStudent = orderById.studentPlace.includes("У меня дома");

      // Проверяем, какие места поддерживает репетитор
      const hasRemote = tutor.tutorPlace.includes("1");
      const hasAtTutor = tutor.tutorPlace.includes("2");
      const hasAtStudent = tutor.tutorPlace.includes("3");

      // Локации ученика
      let studentTrip = orderById.studentTrip ? [...orderById.studentTrip] : [];
      const studentHomeLoc = orderById.studentHomeLoc || [];

      // Локации репетитора
      const tutorHomeLoc = tutor.tutorHomeLoc || [];
      const tutorTripCity = tutor.tutorTripCity || [];
      const tutorTripArea = tutor.tutorTripArea || [];

      // --- ВАЖНО ---
      // Если выбрано "У репетитора", добавляем локации studentHomeLoc в studentTrip,
      // если их там нет, чтобы учитывать совпадения, когда ученик не указал эти локации в trip.
      if (includesAtTutor && studentHomeLoc.length > 0) {
        studentHomeLoc.forEach((loc) => {
          if (!studentTrip.includes(loc)) {
            studentTrip.push(loc);
          }
        });
      }

      // 1. Дистанционно: совпадение если и ученик, и репетитор поддерживают
      const matchRemote = includesRemote && hasRemote;

      // 2. У репетитора: репетитор готов принимать, ученик готов приехать,
      // и локации пересекаются (тут учитываем homeLoc, tripCity и tripArea репетитора)
      const matchAtTutor =
        includesAtTutor &&
        hasAtTutor &&
        [...tutorHomeLoc, ...tutorTripCity, ...tutorTripArea].some((loc) =>
          studentTrip.includes(loc)
        );

      // 3. У ученика: ученик хочет заниматься у себя, репетитор готов ездить,
      // и локации ученика пересекаются с локациями репетитора для выезда (город и область)
      const matchAtStudent =
        includesAtStudent &&
        hasAtStudent &&
        studentHomeLoc.some((loc) =>
          [...tutorTripCity, ...tutorTripArea].includes(loc)
        );

      // 4. Нейтральная территория: оба готовы выехать в одну и ту же локацию
      // учитываем локации tutorTripCity и tutorTripArea
      // Тут не проверяем tutorPlace, так как это нейтральная зона, все согласны
      const matchNeutralPlace =
        includesAtTutor &&
        studentTrip.some((loc) =>
          [...tutorTripCity, ...tutorTripArea].includes(loc)
        );

      // Возвращаем true если хотя бы один из кейсов совпал
      return matchRemote || matchAtTutor || matchAtStudent || matchNeutralPlace;
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
      dispatch(
        getChatsByOrderId({
          orderId: orderById?.id,
          token: token,
        })
      );
      setIsChecked(
        orderById.status === "Active" ||
          orderById.status === "Pending" ||
          orderById.status === "Sending"
      );
    }
  }, [orderById, token, dispatch, isDataLoaded]);

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState<boolean>(true); // всегда стартуем с true

  const themes = useAppSelector((state) => state.wiki.themes)
    .filter((theme) => theme.visibleToRoles.includes("student"))
    .filter((theme) => theme.topicId === "67d090b401144e8d6f4eba88");

  return (
    <>
      <section
        className={clsx(
          styles.container,
          styles.center,
          [5, 6].includes(component) ? styles.containerChM : styles.paddingBottM
        )}
      >
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
              chats={chats}
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
      <Modal
        titleModal={"Выбрать репетитора"}
        contentModal={<CreateContractByStudentModal />}
        isModal={isModalCreateContractByStudent}
        modalId={"createContractByStudent"}
      ></Modal>
      <Modal
        titleModal={"🎉 Репетитор выбран!"}
        contentModal={<HiddenOrderModal />}
        isModal={isModalHiddenOrder}
        modalId={"hiddenOrder"}
      ></Modal>
      <Modal
        titleModal={""}
        contentModal={<CreateReviewByStudentModal />}
        isModal={isModalCreateReviewByStudent}
        modalId={"createReviewByStudent"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetCreateReviewByStudent}
        onClose={() => dispatch(setIsSheetCreateReviewByStudent(false))}
      >
        <CreateReviewByStudentModal />
      </BottomSheet>
      <Modal
        titleModal={""}
        contentModal={<UpdateReviewByStudentModal />}
        isModal={isModalUpdateReviewByStudent}
        modalId={"updateReviewByStudent"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetUpdateReviewByStudent}
        onClose={() => dispatch(setIsSheetUpdateReviewByStudent(false))}
      >
        <UpdateReviewByStudentModal />
      </BottomSheet>
    </>
  );
};

export default OrderPage;
