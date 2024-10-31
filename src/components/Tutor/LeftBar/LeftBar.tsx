"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import React, { useState } from "react";
import Image from "next/image";

const LeftBar = () => {
  // Стейт для меню с ссылками помощи
  const [supportMenu, setSupportMenu] = useState(false);

  const handleSupportMenu = () => {
    setSupportMenu((state) => !state);
  };
  return (
    <div className={styles.leftbar}>
      <div className={styles.left_menu}>
        <ul>
          <a href="orders.html">
            <li>
              <Image
                src="../img/icon/tutor/orders.svg"
                alt="Заказы"
                width={32}
                height={32}
              />
              <span
                className={clsx(styles.left_menu__list_text, styles.undrln)}
              >
                Заказы
              </span>
            </li>
          </a>
          <a href="response.html">
            <li>
              <Image
                src="../img/icon/tutor/response.svg"
                alt="Отклики"
                width={32}
                height={32}
              />
              <span className={clsx(styles.left_menu__list_text)}>Отклики</span>
              <span className={styles.count_block}>9</span>
            </li>
          </a>
          <a href="profile.html">
            <li>
              <Image
                src="../img/icon/tutor/profile.svg"
                alt="Анкета"
                width={32}
                height={32}
              />
              <span className={clsx(styles.left_menu__list_text)}>Анкета</span>
            </li>
          </a>
          <a href="wallet.html">
            <li>
              <Image
                src="../img/icon/tutor/balance.svg"
                alt="Баланс"
                width={32}
                height={32}
              />
              <span className={clsx(styles.left_menu__list_text)}>Баланс</span>
            </li>
          </a>
          <a href="settings.html">
            <li>
              <Image
                src="../img/icon/tutor/settings.svg"
                alt="Настройки"
                width={32}
                height={32}
              />
              <span className={clsx(styles.left_menu__list_text)}>
                Настройки
              </span>
            </li>
          </a>
          <li onClick={() => handleSupportMenu()}>
            <Image
              src="../img/icon/tutor/support.svg"
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
            <a href="wiki.html">
              <li style={{ padding: "12px 0 12px 40px" }}>
                <span className={clsx(styles.left_menu__list_text)}>
                  База знаний
                </span>
              </li>
            </a>
            <a href="ask-question.html">
              <li style={{ padding: "0 0 12px 40px" }}>
                <span className={clsx(styles.left_menu__list_text)}>
                  Создать запрос
                </span>
              </li>
            </a>
            <a href="questions.html">
              <li style={{ padding: "0 0 12px 40px" }}>
                <span className={clsx(styles.left_menu__list_text)}>
                  Мои запросы
                </span>
                <span className={styles.count_block}>3</span>
              </li>
            </a>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default LeftBar;
