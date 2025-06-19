"use client";
import { useRouter } from "next/navigation";
import styles from "./HeaderMenu.module.css";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { Student, Tutor } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export const HeaderMenu = () => {
  const route = useRouter();

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
    tutor?.status === "Canceled delete"
  ) {
    nextPage = "/tutor/orders";
  }
  if (
    student?.status === "Pending" ||
    student?.status === "Active" ||
    student?.status === "Canceled delete"
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
