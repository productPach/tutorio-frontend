"use client";
import { useRouter } from "next/navigation";
import styles from "./HeaderMenu.module.css";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { Tutor } from "@/types/types";

export const HeaderMenu = () => {
  const route = useRouter();

  // Получаем студента из Redux
  const tutor: Tutor | null = useAppSelector((state) => state.tutor.tutor);
  let nextPage = "";
  if (tutor?.status === "Rega: Fullname") {
    nextPage = "/sign-in-tutor/fio";
  }
  if (tutor?.status === "Rega: Subjects") {
    nextPage = "/sign-in-tutor/subjects";
  }
  if (tutor?.status === "Rega: Locations") {
    nextPage = "/sign-in-tutor/locations";
  }
  if (tutor?.status === "Rega: Email") {
    nextPage = "/sign-in-tutor/email";
  }
  if (tutor?.status === "Rega: Photo") {
    nextPage = "/sign-in-tutor/photo";
  }
  if (tutor?.status === "Pending" || tutor?.status === "Active") {
    nextPage = "tutor/orders";
  }

  // Функция клика по ссылкам Репетиторам, Ученикам
  const clickToSignIn = (link: string) => {
    // Очищаем предыдущие данные заявок из LS, если они есть
    localStorage.removeItem("currentMatch");
    route.push(link);
  };

  return (
    <div className={styles.header__menu}>
      {tutor ? (
        <>
          <span onClick={() => clickToSignIn(nextPage)}>
            <Image
              src="/img/icon/profil.svg"
              width={17}
              height={17}
              alt="Профиль"
            />
            {tutor.name ? tutor.name : "Личный кабинет"}
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
