import React from "react";
import style from "./Spinner.module.css";

export const SpinnerChats: React.FC = () => {
  return (
    <>
      <div className={style.loaderContainer}>
        <div className={style.loader}></div>
        <span>Загружаем чаты ...</span>
      </div>
    </>
  );
};
