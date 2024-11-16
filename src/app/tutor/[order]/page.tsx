"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { useParams } from "next/navigation";
import { Order } from "@/components/Tutor/Order/Order";
import HowConnetWithStudent from "@/components/Tutor/OnboardScreen/HowConnetWithStudent";

const OrderPage: React.FC = () => {
  const page = "Order";
  const { order } = useParams();

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <HowConnetWithStudent />
          <Order />
        </div>
        <SideBar />
      </section>
    </>
  );
};

export default OrderPage;
