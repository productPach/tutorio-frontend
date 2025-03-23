"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store/store";
import { setSupportMenu } from "@/store/features/tutorSlice";
import { useRouter } from "next/navigation";

const LeftBar: React.FC<{ page: string; pageName?: string }> = ({
  page,
  pageName,
}) => {
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
    if (pageName === "ThemesByTopic") {
      router.push("../wiki");
    } else {
      router.back(); // Возврат на предыдущую страницу
    }
  };

  return (
    <div
      className={styles.leftbar}
      style={isSafari ? undefined : { top: `${scrollYForLeftBar}px` }}
    >
      {page === "Order" ||
        (page === "Main" && (
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
        ))}
      <button className={clsx(styles.content_block_button, styles.buttonBlc)}>
        Новый заказ
      </button>
      <div className={styles.left_menu}>
        <ul>
          <Link href={"/student/orders"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/orders.svg"
                alt="Заказы"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Orders",
                })}
              >
                Заказы
              </span>
            </li>
          </Link>
          <Link href={"/student/settings"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/settings.svg"
                alt="Настройки"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Settings",
                })}
              >
                Настройки
              </span>
            </li>
          </Link>
          <Link href={"/student/wiki"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/base.svg"
                alt="Настройки"
                width={27}
                height={27}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Wiki",
                })}
              >
                База знаний
              </span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default LeftBar;
