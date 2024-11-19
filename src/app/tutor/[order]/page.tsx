"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { useParams } from "next/navigation";
import { Order } from "@/components/Tutor/Order/Order";
import { ResponseSidbar } from "@/components/Tutor/SideBar/ResponseSidbar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { useAppSelector } from "@/store/store";
import { WelcomeScreen } from "@/components/Tutor/WelcomeScreen/WelcomeScreen";

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
          <WelcomeScreen page={page} />
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
