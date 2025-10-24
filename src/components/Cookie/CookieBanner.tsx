"use client";

import clsx from "clsx";
import styles from "../../app/page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCookies } from "@/store/features/generalSlice";
import { RegionalLink } from "../RegionalLink/RegionalLink";

export default function CookieBanner() {
  const dispatch = useAppDispatch();
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    const hasConsent = document.cookie.includes("cookieConsent=true");
    dispatch(setCookies(hasConsent));

    if (hasConsent) {
      loadYandexMetrika();
    }

    setIsReady(true); // только после всех проверок
  }, [dispatch]);

  if (!isReady || cookiesAccepted) return null;

  const acceptCookies = () => {
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 год
    dispatch(setCookies(true));
    loadYandexMetrika();
  };

  if (cookiesAccepted) return null;

  return (
    <div className={styles.cookie_container}>
      <div className={styles.cookie_text}>
        Мы используем cookie. Подробнее&nbsp;—&nbsp;
        <RegionalLink href={"/docs/privacy-policy"}>
          <span className={styles.cookie_link}>политика</span>
        </RegionalLink>
      </div>
      <button
        onClick={acceptCookies}
        className={clsx(styles.cookie_button, styles.buttonYlw)}
      >
        Согласен
      </button>
    </div>
  );
}
