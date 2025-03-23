"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import { setSupportMenu } from "@/store/features/tutorSlice";
import { useRouter } from "next/navigation";

type LeftBarOrderProps = {
  component: number;
  setComponent: Dispatch<SetStateAction<number>>; // Верная типизация для useState
};

const LeftBarOrder = ({ component, setComponent }: LeftBarOrderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // Вытаскиваем значение сколла их redux, чтобы это значение передать в top для стиля leftbar
  const scrollYForLeftBar = useAppSelector((state) => state.modal.scrollY);
  const [isSafari, setIsSafari] = useState(false);

  // Определяем, используется ли Safari
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("safari") && !ua.includes("chrome")) {
      setIsSafari(true);
    }
  }, []);

  // Стейт для меню с ссылками помощи
  const supportMenu = useAppSelector((state) => state.tutor.supportMenu);
  const handleSupportMenu = () => {
    dispatch(setSupportMenu(!supportMenu));
  };

  const router = useRouter();

  const handleBack = () => {
    router.back(); // Возврат на предыдущую страницу
  };

  return (
    <div
      className={styles.leftbar}
      style={isSafari ? undefined : { top: `${scrollYForLeftBar}px` }}
    >
      {
        <div onClick={handleBack} className={styles.left_menu}>
          <ul>
            <li>
              <Image
                src="/../img/icon/tutor/go-back.svg"
                alt="Заказы"
                width={32}
                height={32}
              />
              <span className={styles.left_menu__list_text}>
                Вернуться назад
              </span>
            </li>
          </ul>
        </div>
      }
      <div className={styles.left_menu}>
        <ul>
          <li>
            <Image
              src="/../img/icon/tutor/orders.svg"
              alt="Заказы"
              width={32}
              height={32}
            />
            <span
              className={clsx(styles.left_menu__list_text, {})}
              onClick={() => setComponent(1)}
            >
              Условия заказа
            </span>
          </li>
          <li>
            <Image
              src="/../img/icon/tutor/settings.svg"
              alt="Настройки"
              width={32}
              height={32}
            />
            <span
              className={clsx(styles.left_menu__list_text, {})}
              onClick={() => setComponent(2)}
            >
              Репетиторы
            </span>
          </li>
          <li>
            <Image
              src="/../img/icon/tutor/base.svg"
              alt="Настройки"
              width={27}
              height={27}
            />
            <span
              className={clsx(styles.left_menu__list_text, {})}
              onClick={() => setComponent(3)}
            >
              Помощь
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftBarOrder;
