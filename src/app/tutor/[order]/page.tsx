"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { useParams } from "next/navigation";
import { Order } from "@/components/Tutor/Order/Order";
import HowConnetWithStudent from "@/components/Tutor/OnboardScreen/HowConnetWithStudent";
import { ResponseSidbar } from "@/components/Tutor/SideBar/ResponseSidbar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { useAppSelector } from "@/store/store";

const OrderPage: React.FC = () => {
  const page = "Order";
  const { order } = useParams();
  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <HowConnetWithStudent />
          <Order />
        </div>
        <ResponseSidbar />
      </section>
      <Modal
        titleModal={"Пополните баланс, чтобы откликнуться"}
        contentModal={<BalanceBoost />}
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
    </>
  );
};

export default OrderPage;
