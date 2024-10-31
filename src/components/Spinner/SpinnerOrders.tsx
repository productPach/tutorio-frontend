import React from "react";
import style from "./Spinner.module.css";

export const SpinnerOrders: React.FC = () => {
  return (
    <>
      <div className={style.loaderContainer}>
        <div className={style.loader}></div>
        <span>Загружаем заказы ...</span>
      </div>
    </>
  );
};
