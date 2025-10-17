"use client";
import styles from "../../../app/student/layout.module.css";
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

const OrdersPage: React.FC = () => {
  const page = "Orders";
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Выполнение dispatch в useEffect, чтобы избежать выполнения в процессе рендеринга
  useEffect(() => {
    dispatch(setComponentMenu(1));
    // меняем URL, добавляем query-параметр tab
    router.push(`?tab=1`, { scroll: false });
    dispatch(updateScrollPosition({ scrollPosition: 0, scrollHeight: 0 }));
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
    localStorage.removeItem("currentMatch");
  }, []);

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

export default OrdersPage;
