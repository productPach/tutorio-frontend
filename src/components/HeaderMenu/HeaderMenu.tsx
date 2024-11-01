"use client";
import { useRouter } from "next/navigation";
import styles from "./HeaderMenu.module.css";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { Tutor } from "@/types/types";
import Link from "next/link";

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

  return (
    <div className={styles.header__menu}>
      {tutor ? (
        <>
          <Link href={nextPage} prefetch>
            <Image
              src="/img/icon/profil.svg"
              width={17}
              height={17}
              alt="Профиль"
            />
            {tutor.name ? tutor.name : "Личный кабинет"}
          </Link>
        </>
      ) : (
        <>
          <Link href={"/sign-in-tutor/phone"} prefetch>
            Репетиторам
          </Link>

          <Link href={"/sign-in-tutor"} prefetch>
            Ученикам
          </Link>
        </>
      )}
    </div>
  );
};
