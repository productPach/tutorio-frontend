/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./HeaderMenu.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { Student, Tutor } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentTutor, setTutorLogout } from "@/store/features/tutorSlice";
import {
  getCurrentStudent,
  setStudentLogout,
} from "@/store/features/studentSlice";
import { tryRestoreSession } from "@/utils/session/tryRestoreSession";
import httpClient from "@/api/server/httpClient";
import { setLogout } from "@/store/features/authSlice";
import { getAccessToken } from "@/api/server/auth";

export const HeaderMenu = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const token = getAccessToken();

      if (!token) {
        console.log(
          "Access token отсутствует, пропускаем восстановление сессии, очищаем редакс"
        );
        dispatch(setTutorLogout());
        dispatch(setStudentLogout());
        dispatch(setLogout());
        return;
      }

      // Проверка, истёк ли access token
      let tokenExpired = false;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) tokenExpired = true;
      } catch {
        tokenExpired = true; // Если токен невалидный — считаем его протухшим
      }

      if (!tokenExpired) {
        console.log(
          "Access token действителен, восстановление сессии не требуется"
        );
        return;
      }

      // === Access token протух, пробуем восстановить сессию через refresh token ===
      const ok = await tryRestoreSession();

      if (!ok) {
        console.log(
          "Не удалось восстановить сессию, очищаем состояние и localStorage"
        );
        dispatch(setTutorLogout());
        dispatch(setStudentLogout());
        dispatch(setLogout());
        return;
      }

      // === Сессия восстановлена, получаем активную роль и данные пользователя ===
      try {
        const res = await httpClient.get("sessions", { withCredentials: true });
        const { sessions } = res.data;

        const activeSession = sessions?.[0];
        const role = activeSession?.activeRole;

        if (!role) {
          console.warn("Роль не найдена в сессии");
          return;
        }

        if (role === "tutor") {
          dispatch(getCurrentTutor());
        } else if (role === "student") {
          dispatch(getCurrentStudent());
        } else {
          console.warn("Неизвестная роль:", role);
        }
      } catch (err) {
        console.error("Ошибка восстановления профиля:", err);
      }
    })();
  }, []);

  // Получаем студента из Redux
  const student: Student | null = useAppSelector(
    (state) => state.student.student
  );
  const tutor: Tutor | null = useAppSelector((state) => state.tutor.tutor);
  let nextPage = "";
  let name = "";
  if (tutor) {
    tutor.name ? (name = tutor.name) : "Личный кабинет";
  }
  if (student) {
    name = "Личный кабинет";
  }

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
  if (
    tutor?.status === "Pending" ||
    tutor?.status === "Active" ||
    tutor?.status === "Canceled delete" ||
    tutor?.status === "Deleted" // Сделать в ЛК какое то уведомление-плашку с датой удаления и возможностью отмены
  ) {
    nextPage = "/tutor/orders";
  }
  if (
    student?.status === "Pending" ||
    student?.status === "Active" ||
    student?.status === "Canceled delete" ||
    student?.status === "Deleted" // Сделать в ЛК какое то уведомление-плашку с датой удаления и возможностью отмены
  ) {
    nextPage = "/student/orders";
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.header__menu}>
      {tutor || student ? (
        <>
          <div className={styles.dContainerProfil}>
            <Link href={nextPage} prefetch>
              <Image
                className={styles.imgProfil}
                src="/img/icon/profil.svg"
                width={17}
                height={17}
                alt="Профиль"
              />
              {name}
            </Link>
          </div>
          <div className={styles.mContainerProfil}>
            <Link href={nextPage} prefetch>
              <Image
                src="/img/icon/profil.svg"
                width={17}
                height={17}
                alt="Профиль"
              />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className={styles.dContainerAuth}>
            <Link href={"/sign-in-tutor/phone"} prefetch>
              Репетиторам
            </Link>

            <Link href={"/sign-in-student/phone"} prefetch>
              Ученикам
            </Link>
          </div>
          <div className={styles.mContainerAuth}>
            <Image
              src="/img/icon/burgerMenu.svg"
              width={17}
              height={17}
              alt="Меню"
              onClick={toggleMenu}
            />
          </div>
          {isMenuOpen && (
            <div className={styles.fullscreenMenu}>
              <div className={styles.containerMenu}>
                <div className={styles.closeMenu}>
                  <Image
                    src="/img/icon/close.svg"
                    width={17}
                    height={17}
                    alt="Закрыть меню"
                    onClick={toggleMenu}
                    className={styles.closeImg}
                  />
                </div>
                <div className={styles.linksMenu}>
                  <Link
                    href={"/sign-in-tutor/phone"}
                    prefetch
                    onClick={toggleMenu}
                  >
                    Репетиторам 👨‍🏫👩‍🏫
                  </Link>
                  <Link
                    href={"/sign-in-student/phone"}
                    prefetch
                    onClick={toggleMenu}
                  >
                    Ученикам 👩‍🎓👨‍🎓
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
