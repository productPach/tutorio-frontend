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

const LeftBar: React.FC<{ page: string }> = ({ page }) => {
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
      <div className={styles.left_menu}>
        <ul>
          <Link href={"/tutor/orders"} prefetch={true}>
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
          <Link href={"/tutor/responses"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/response.svg"
                alt="Отклики"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Responses",
                })}
              >
                Отклики
              </span>
              <span className={styles.count_block}>9</span>
            </li>
          </Link>
          <Link href={"/tutor/profile"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/profile.svg"
                alt="Анкета"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Profile",
                })}
              >
                Анкета
              </span>
            </li>
          </Link>
          <Link href={"/tutor/wallet"} prefetch={true}>
            <li>
              <Image
                src="/../img/icon/tutor/balance.svg"
                alt="Баланс"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, {
                  [styles.undrln]: page === "Wallet",
                })}
              >
                Баланс
              </span>
            </li>
          </Link>
          <Link href={"/tutor/settings"} prefetch={true}>
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
          <li onClick={() => handleSupportMenu()}>
            <Image
              src="/../img/icon/tutor/support.svg"
              alt="Помощь"
              width={32}
              height={32}
            />
            <span className={clsx(styles.left_menu__list_text)}>Помощь</span>
            <span className={styles.count_block}>3</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15.5359 10.4082L12.3539 13.5902C12.1586 13.7855 11.842 13.7855 11.6468 13.5902L8.46481 10.4082C8.26954 10.213 8.26954 9.8964 8.46481 9.70113C8.66007 9.50587 8.97665 9.50587 9.17191 9.70113L11.972 12.5012C11.9814 12.5007 11.9908 12.5004 12.0003 12.5004C12.0027 12.5004 12.0051 12.5004 12.0075 12.5005C12.0146 12.5006 12.0216 12.5008 12.0287 12.5012L14.8288 9.70113C15.024 9.50587 15.3406 9.50587 15.5359 9.70113C15.7311 9.8964 15.7311 10.213 15.5359 10.4082Z"
                fill="#2A2A2A"
              />
            </svg>
          </li>

          <ul
            className={clsx(styles.accrd_content, {
              [styles.open]: supportMenu,
            })}
          >
            <Link href={"/tutor/wiki"} prefetch={true}>
              <li style={{ padding: "12px 0 12px 40px" }}>
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.undrln]: page === "Wiki",
                  })}
                >
                  База знаний
                </span>
              </li>
            </Link>
            <Link href={"/tutor/new-ticket"} prefetch={true}>
              <li style={{ padding: "0 0 12px 40px" }}>
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.undrln]: page === "NewTicket",
                  })}
                >
                  Создать запрос
                </span>
              </li>
            </Link>
            <Link href={"/tutor/tickets"} prefetch={true}>
              <li style={{ padding: "0 0 12px 40px" }}>
                <span
                  className={clsx(styles.left_menu__list_text, {
                    [styles.undrln]: page === "Tickets",
                  })}
                >
                  Мои запросы
                </span>
                <span className={styles.count_block}>3</span>
              </li>
            </Link>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default LeftBar;
