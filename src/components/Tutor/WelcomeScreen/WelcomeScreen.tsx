"use client";
import { AppDispatch, useAppSelector } from "@/store/store";
import styles from "../../../app/tutor/layout.module.css";
import stylesOnboardScreen from "./WelcomeScreen.module.css";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getWelcomeScreens,
  addHiddenScreen,
  showWelcomeScreen,
} from "@/store/features/tutorSlice";
import Link from "next/link";
import { getAccessToken } from "@/api/server/auth";

interface WelcomeScreenProps {
  page: string; // Ожидаем, что в пропс придет строка
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ page }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const token = useAppSelector((state) => state.auth.token);
  const token = getAccessToken(); // берём из localStorage
  const welcomeScreens = useAppSelector((state) => state.tutor.welcomeScreens);
  const hiddenScreens = useAppSelector((state) => state.tutor.hiddenScreens);

  useEffect(() => {
    if (token) {
      dispatch(getWelcomeScreens()); // Загружаем велком скрины
    }
  }, [dispatch, token]);

  const handleHideScreen = (id: string) => {
    // Обновляем состояние скрытого экрана в Redux
    dispatch(addHiddenScreen(id));
    token && dispatch(showWelcomeScreen({ id }));
  };

  // Фильтруем экраны, чтобы скрыть те, которые уже были скрыты
  const filteredWelcomeScreens = welcomeScreens
    ?.filter((item) => item.page === page)
    .filter((item) => !hiddenScreens.includes(item.id));

  return (
    <>
      {filteredWelcomeScreens?.map((item) => (
        <div
          key={item.id}
          className={clsx(styles.content_block, styles.info_block)}
        >
          <h3>{item.title}</h3>
          <p className={styles.content_block_p}>{item.content}</p>
          <button
            onClick={() => handleHideScreen(item.id)}
            className={clsx(styles.content_block_button, styles.buttonBlc)}
            type="button"
          >
            Всё понятно
          </button>
          {item.link && (
            <Link className={stylesOnboardScreen.link} href={item.link}>
              Подробнее
            </Link>
          )}
        </div>
      ))}
    </>
  );
};
