"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import Orders from "@/components/Tutor/Orders/Orders";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { useAppSelector } from "@/store/store";
import { WelcomeScreen } from "@/components/Tutor/WelcomeScreen/WelcomeScreen";
import { useRouter } from "next/navigation";
import { ResponseTutorToStudentModal } from "@/components/Tutor/Modal/Response/ResponseTutorToStudentModal";

const TutorOrders: React.FC = () => {
  const page = "Orders";
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const isModalResponseTutorToStudent = useAppSelector(
    (state) => state.modal.isModalResponseTutorToStudent
  );

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
    </>
  );
};

export default TutorOrders;
