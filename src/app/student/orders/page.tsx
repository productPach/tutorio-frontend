"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import LeftBar from "@/components/Student/LeftBar/LeftBar";
import Orders from "@/components/Student/Orders/Orders";
import {
  setComponentMenu,
  updateScrollPosition,
} from "@/store/features/orderSlice";

const StudentOrder: React.FC = () => {
  const page = "Orders";
  const dispatch = useAppDispatch();
  dispatch(setComponentMenu(1));
  dispatch(updateScrollPosition({ scrollPosition: 0, scrollHeight: 0 }));

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

export default StudentOrder;
