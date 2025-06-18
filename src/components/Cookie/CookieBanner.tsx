"use client";

import clsx from "clsx";
import styles from "../../app/page.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCookies } from "@/store/features/generalSlice";

export default function CookieBanner() {
  const dispatch = useAppDispatch();
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);

  useEffect(() => {
    const hasConsent = document.cookie.includes("cookieConsent=true");
    dispatch(setCookies(hasConsent));

    if (hasConsent) {
      loadYandexMetrika();
    }
  }, [dispatch]);

  const acceptCookies = () => {
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 год
    dispatch(setCookies(true));
    loadYandexMetrika();
  };

  const loadYandexMetrika = () => {
    if (typeof window === "undefined") return;
    if (window.ym) return;

    const script = document.createElement("script");
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (!window.ym) {
        const ymFunc: any = function (...args: any[]) {
          ymFunc.a = ymFunc.a || [];
          ymFunc.a.push(args);
        };
        window.ym = ymFunc;
      }

      window.ym!("43452", "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    };
  };

  if (cookiesAccepted) return null;

  return (
    <></>
    // <div className={styles.cookie_container}>
    //   <div className={styles.cookie_link}>
    //     Продолжая использовать данный сайт, вы соглашаетесь с использованием
    //     файлов cookie в соответствии с нашей{" "}
    //     <Link className={styles.cookie_link} href={"/docs/privacy-policy"}>
    //       Политикой конфиденциальности
    //     </Link>
    //   </div>
    //   <button
    //     onClick={acceptCookies}
    //     className={clsx(styles.content_block_button, styles.buttonYlw)}
    //   >
    //     Понятно
    //   </button>
    // </div>
  );
}
