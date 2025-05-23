"use client";

import clsx from "clsx";
import styles from "../../app/page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie.includes("cookieConsent=true");
    setConsent(hasConsent);

    if (hasConsent) {
      loadYandexMetrika();
    }
  }, []);

  const acceptCookies = () => {
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 год
    setConsent(true);
    loadYandexMetrika();
  };

  const loadYandexMetrika = () => {
    if (typeof window === "undefined") return;
    if (window.ym) return; // уже загружено

    console.log("ПОСТАВИТЬ ПРАВИЛЬНЫЙ НОМЕР СЧЕТЧИКА!!");

    const script = document.createElement("script");
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (!window.ym) {
        // Создаем функцию ym с полем .a для буфера вызовов
        const ymFunc: any = function (...args: any[]) {
          ymFunc.a = ymFunc.a || [];
          ymFunc.a.push(args);
        };
        window.ym = ymFunc;
      }

      if (window.ym) {
        //ПОСТАВИТЬ ПРАВИЛЬНЫЙ НОМЕР СЧЕТЧИКА!!
        window.ym("43452", "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      }
    };
  };

  if (consent) return null;

  return (
    <div className={styles.cookie_container}>
      <div>
        Продолжая использовать данный сайт, вы соглашаетесь с использованием
        файлов cookie в соответствии с нашей{" "}
        <Link className={styles.cookie_link} href={"/docs/privacy-policy"}>
          Политикой конфиденциальности
        </Link>
      </div>

      <button
        onClick={acceptCookies}
        className={clsx(styles.content_block_button, styles.buttonYlw)}
      >
        Понятно
      </button>
    </div>
  );
}
