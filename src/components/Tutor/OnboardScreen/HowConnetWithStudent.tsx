"use client";
import styles from "../../../app/tutor/layout.module.css";
import stylesOnboardScreen from "./OnboardScreen.module.css";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const HowConnetWithStudent = () => {
  return (
    <div className={clsx(styles.content_block, styles.info_block)}>
      <h3>Как связаться с учеником 📨</h3>
      <p className={styles.content_block_p}>
        Ознакомьтесь с информацией по заказу ниже. Если заказ вам интересен,
        оставьте свой отклик — ученик получит уведомление и ответит вам в чате,
        если ваше предложение заинтересует его.
      </p>
      <div>
        <button className={styles.buttonBlc} type="button">
          Всё понятно
        </button>
        <Link className={stylesOnboardScreen.link} href={"/tutor/wiki"}>
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default HowConnetWithStudent;
