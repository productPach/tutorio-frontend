"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "./ResponseSidbar.module.css";

import stylesStudent from "../Student.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import {
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { SpinnerSingleOrange } from "@/components/Spinner/SpinnerSingleOrange";
import Image from "next/image";
import Player from "lottie-react";
import Notification from "../../../../public/lottie/Notification.json"; // JSON-анимация
import Chat from "../../../../public/lottie/Chat.json"; // JSON-анимация
import { updateOrder } from "@/store/features/orderSlice";

export const ResponseSidbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.auth.token);
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля sidebarResponse
  const scrollYForSidebarResponse = useAppSelector(
    (state) => state.modal.scrollY
  );
  const [isSafari, setIsSafari] = useState(false);

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  const { orderById, loading } = useSelector(
    (state: RootState) => state.orders
  );

  // Состояние для свитча
  const [isChecked, setIsChecked] = useState(orderById?.status === "Active");

  useEffect(() => {
    setIsChecked(orderById?.status === "Active");
  }, [orderById]);

  const toggleSwitch = () => {
    setIsChecked((prev) => {
      const newState = !prev;
      update(newState); // Передаем новое значение
      return newState;
    });
  };

  const update = (newState: boolean) => {
    if (orderById && token) {
      const id = orderById.id;
      let status = newState ? "Active" : "Hidden";
      dispatch(
        updateOrder({
          id,
          token,
          status,
        })
      ).unwrap();
    }
  };

  return (
    <>
      {!loading && (
        <div
          className={generalStyles.sidebarResponse}
          style={
            isSafari ? undefined : { top: `${scrollYForSidebarResponse}px` }
          }
        >
          {(orderById?.status === "Pending" ||
            orderById?.status === "Sending") && (
            <div className={generalStyles.sidebar_filter}>
              <div className={generalStyles.studentSidebarOrderNoResponse}>
                {/* <Image
                  className={styles.studentResponseImg}
                  src={"/img/icon/student/icons8-alarm.gif"}
                  width={30}
                  height={30}
                  alt=""
                /> */}
                <Player
                  autoplay
                  loop
                  animationData={Notification}
                  style={{ height: "30px", width: "30px" }}
                />
                <div>
                  Рассылаем ваш заказ подходящим репетиторам! 🎯 <br></br>
                  <br></br>
                  Скоро тут появятся отклики ..
                </div>
              </div>
            </div>
          )}

          {orderById?.status === "Active" && (
            <div className={generalStyles.sidebar_filter}>
              <div className={generalStyles.studentSidebarOrderNoResponse}>
                <Player
                  autoplay
                  loop
                  animationData={Chat}
                  style={{ height: "30px", width: "30px" }}
                />
                <div>
                  Ждем отклики репетиторов!&nbsp;⏳ <br></br>
                  <br></br>
                  Как только появится первый отклик, вы сразу увидите его
                  здесь&nbsp;📬
                </div>
              </div>
            </div>
          )}

          {/* ДОБАВИТЬ ПРОВЕРКУ НА КОЛИЧЕСТВО ОТКЛИКОВ!! ПОКАЗЫВАТЬ, ЕСЛИ ОТКЛИКОВ НЕТ */}
          {orderById?.status === "Hidden" && (
            <div className={generalStyles.sidebar_filter}>
              <div className={generalStyles.studentSidebarOrderNoResponse}>
                <div>
                  Отклики на заказ отключены!&nbsp;🚫<br></br>
                  <br></br>К сожалению, на данный момент нет ни одного
                  отклика&nbsp;😔
                </div>
              </div>
            </div>
          )}

          {(orderById?.status === "Active" ||
            orderById?.status === "Hidden") && (
            <div className={generalStyles.sidebar_filter}>
              <div className={stylesStudent.containerEntityShowEnd}>
                <div className={stylesStudent.containerEntityTitleDescription}>
                  <div>Получать новые отклики</div>
                </div>
                <div className={stylesStudent.inputContainer}>
                  <label className={stylesStudent.iosSwitch}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={toggleSwitch}
                    />
                    <span className={stylesStudent.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
