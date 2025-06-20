"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import { useEffect } from "react";
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
import { setLoadingPage, setScrollY } from "@/store/features/modalSlice";
import { ResponseTutorToStudentWithContaktModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentWithContaktModal";

const OrdersPage: React.FC = () => {
  const page = "Orders";
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const isModalResponseTutorToStudent = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudent
  );
  const isModalResponseTutorToStudentWithContakt = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudentWithContakt
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

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={clsx(styles.content)}>
          <WelcomeScreen page={page} />
          <Orders />
        </div>
        <SideBar />
      </section>
      <Modal
        titleModal={"Пополните баланс, чтобы откликнуться"}
        contentModal={<BalanceBoost />}
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

export default OrdersPage;
