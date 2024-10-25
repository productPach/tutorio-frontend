"use client";
import { useRouter } from "next/navigation";
import styles from "./HeaderMenu.module.css";
import { useAppSelector } from "@/store/store";

export const HeaderMenu = () => {
  const route = useRouter();

  // Получаем студента из Redux
  const tutor = useAppSelector((state) => state.tutor.tutor);

  // Функция клика по ссылкам Репетиторам, Ученикам
  const clickToSignIn = (link: string) => {
    // Очищаем предыдущие данные заявок из LS, если они есть
    localStorage.removeItem("currentMatch");
    route.push(link);
  };

  console.log(tutor);

  return (
    <div className={styles.header__menu}>
      {tutor ? (
        <>
          <span onClick={() => clickToSignIn("/tutor/orders")}>
            {tutor.name}
          </span>
        </>
      ) : (
        <>
          <span onClick={() => clickToSignIn("/sign-in-tutor/phone")}>
            Репетиторам
          </span>
          <span onClick={() => clickToSignIn("/sign-in-tutor")}>Ученикам</span>
        </>
      )}
    </div>
  );
};
