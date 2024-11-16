"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import React from "react";

const HowWorkWithOrders = () => {
  return (
    <div className={clsx(styles.content_block, styles.info_block)}>
      <h3>Как работать с заказами 📦</h3>
      <p className={styles.content_block_p}>
        Здесь отображаются новые заказы учеников с условиями, которые указаны у
        вас в анкете. Откликайтесь на заказ, чтобы ученик получил уведомление.
        Ученик свяжется с вами, если ваше предложение заинтересует его.
      </p>
      <button className={styles.buttonBlc} type="button">
        Всё понятно
      </button>
    </div>
  );
};

export default HowWorkWithOrders;
