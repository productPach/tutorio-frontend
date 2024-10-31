"use client";
import styles from "../layout.module.css";
import locationsStyles from "../locations.module.css";
import generalStyles from "../../general.module.css";
import inputStyles from "../input.module.css";
import clsx from "clsx";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect } from "react";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import Orders from "@/components/Tutor/Orders/Orders";
import SideBar from "@/components/Tutor/SideBar/SideBar";

const TutorOrders: React.FC = () => {
  const tutor = useAppSelector((state) => state.tutor.tutor);
  useEffect(() => {
    localStorage.removeItem("confirm-code");
    localStorage.removeItem("current-user");
    localStorage.removeItem("origin-phone");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("_cr-tripData");
  }, []);

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar />

        <div className={styles.content}>
          <div className={clsx(styles.content_block, styles.info_block)}>
            <h3>Как работать с заказами</h3>
            <p className={styles.content_block_p}>
              Здесь отображаются новые заказы учеников с условиями, которые
              указаны у вас в анкете. Откликайтесь на заказ, чтобы ученик
              получил уведомление. Ученик свяжется с вами, если ваше предложение
              заинтересует его.
            </p>
            <button className={styles.buttonBlc} type="button">
              Всё понятно
            </button>
          </div>

          <Orders />
        </div>

        <SideBar />
      </section>
    </>
  );
};

export default TutorOrders;
