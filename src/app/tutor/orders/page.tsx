"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { useEffect } from "react";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import Orders from "@/components/Tutor/Orders/Orders";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import HowWorkWithOrders from "@/components/Tutor/OnboardScreen/HowWorkWithOrders";

const TutorOrders: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
  }, []);

  const page = "Orders";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <HowWorkWithOrders />
          <Orders />
        </div>
        <SideBar />
      </section>
    </>
  );
};

export default TutorOrders;
