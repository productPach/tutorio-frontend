"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import Orders from "@/components/Tutor/Orders/Orders";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { WelcomeScreen } from "@/components/Tutor/WelcomeScreen/WelcomeScreen";
import { useRouter } from "next/navigation";
import { ResponseTutorToStudentModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentModal";
import { LoadingPageModal } from "@/components/Tutor/Modal/Loading/loadingModal";
import {
  setIsSheetBalanceBoost,
  setIsSheetBalanceBoostNotEmail,
  setIsSheetDepositBalanceYookassa,
  setIsSheetResponseTutorToStudent,
  setIsSheetResponseTutorToStudentWithContakt,
  setLoadingPage,
  setScrollY,
} from "@/store/features/modalSlice";
import { ResponseTutorToStudentWithContaktModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentWithContaktModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import { DepositBalanceYookassa } from "../Modal/DepositBalanceYookassa/DepositBalanceYookassa";
import { BalanceBoostNotEmail } from "../Modal/BalanceBoost/BalanceBoostNotEmail";

const OrdersPage: React.FC = () => {
  const page = "Orders";

  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const isSheetBalanceBoost = useAppSelector(
    (state) => state.modal.isSheetBalanceBoost
  );
  const isModalDepositBalanceYookassa = useAppSelector(
    (state) => state.modal.isModalDepositBalanceYookassa
  );
  const isSheetDepositBalanceYookassa = useAppSelector(
    (state) => state.modal.isSheetDepositBalanceYookassa
  );

  const isModalBalanceBoostNotEmail = useAppSelector(
    (state) => state.modal.isModalBalanceBoostNotEmail
  );
  const isSheetBalanceBoostNotEmail = useAppSelector(
    (state) => state.modal.isSheetBalanceBoostNotEmail
  );

  const isModalResponseTutorToStudent = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudent
  );
  const isSheetResponseTutorToStudent = useAppSelector(
    (state) => state.modal.isSheetResponseTutorToStudent
  );
  const isModalResponseTutorToStudentWithContakt = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudentWithContakt
  );
  const isSheetResponseTutorToStudentWithContakt = useAppSelector(
    (state) => state.modal.isSheetResponseTutorToStudentWithContakt
  );

  const isModalLoadingPage = useAppSelector((state) => state.modal.loadingPage);

  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
  }, []);

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/orders");
    router.prefetch("/responses");
    router.prefetch("/profile");
    router.prefetch("/wallet");
    router.prefetch("/settings");
  }, [router]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setLoadingPage(false));
      dispatch(setScrollY(0));
    };
  }, []);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 1280);
    };

    // Инициализация
    handleResize();

    // Подписка на изменение размера
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={clsx(styles.content)}>
          <WelcomeScreen page={page} />
          <Orders />
        </div>

        {showSidebar && <SideBar />}
      </section>

      <Modal
        titleModal={"Пополнить баланс, чтобы откликнуться"}
        contentModal={<BalanceBoost />}
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetBalanceBoost}
        onClose={() => dispatch(setIsSheetBalanceBoost(false))}
      >
        <BalanceBoost />
      </BottomSheet>

      <Modal
        titleModal={""}
        contentModal={<DepositBalanceYookassa />}
        isModal={isModalDepositBalanceYookassa}
        modalId={"depositBalanceYookassa"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetDepositBalanceYookassa}
        onClose={() => dispatch(setIsSheetDepositBalanceYookassa(false))}
      >
        <DepositBalanceYookassa />
      </BottomSheet>

      <Modal
        titleModal={"Не сможем выслать чек"}
        contentModal={<BalanceBoostNotEmail />}
        isModal={isModalBalanceBoostNotEmail}
        modalId={"balanceBoostNotEmail"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetBalanceBoostNotEmail}
        onClose={() => dispatch(setIsSheetBalanceBoostNotEmail(false))}
      >
        <BalanceBoostNotEmail />
      </BottomSheet>

      <Modal
        titleModal={"Отправить отклик"}
        contentModal={<ResponseTutorToStudentModal />}
        isModal={isModalResponseTutorToStudent}
        modalId={"responseTutorToStudentModal"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetResponseTutorToStudent}
        onClose={() => dispatch(setIsSheetResponseTutorToStudent(false))}
      >
        <ResponseTutorToStudentModal />
      </BottomSheet>
      <Modal
        titleModal={"Получить контакты"}
        contentModal={<ResponseTutorToStudentWithContaktModal />}
        isModal={isModalResponseTutorToStudentWithContakt}
        modalId={"responseTutorToStudentWithContaktModal"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetResponseTutorToStudentWithContakt}
        onClose={() =>
          dispatch(setIsSheetResponseTutorToStudentWithContakt(false))
        }
      >
        <ResponseTutorToStudentWithContaktModal />
      </BottomSheet>
      <Modal
        titleModal={""}
        contentModal={<LoadingPageModal />}
        isModal={isModalLoadingPage}
        modalId={"loadingPageModal"}
      ></Modal>
    </>
  );
};

export default OrdersPage;
