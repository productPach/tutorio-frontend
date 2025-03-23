"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { useEffect } from "react";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { Modal } from "@/components/Modal/Modal";
import { BalanceBoost } from "@/components/Tutor/Modal/BalanceBoost/BalanceBoost";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import Orders from "@/components/Student/Orders/Orders";

const StudentArchiveOrder: React.FC = () => {
  const page = "Orders";

  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
    localStorage.removeItem("currentMatch");
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
        <div className={clsx(styles.contentFull)}>
          <Orders />
        </div>
      </section>
    </>
  );
};

export default StudentArchiveOrder;
