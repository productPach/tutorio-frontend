"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "../tutor/layout.module.css";
import clsx from "clsx";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setToken } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { Spinner } from "@/components/Spinner/Spinner";
import { getCurrentTutor } from "@/store/features/tutorSlice";
import Image from "next/image";
import { host, port } from "@/api/server/configApi";
import { getAllLocations } from "@/store/features/locationSlice";
import { getCurrentStudent } from "@/store/features/studentSlice";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";

type LayoutComponent = {
  children: ReactNode;
};

const Layout: React.FC<LayoutComponent> = ({ children }) => {
  const [isLoadedPage, setIsLoadedPage] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const student = useAppSelector((state) => state.student.student);
  const token = useAppSelector((state) => state.auth.token);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
      dispatch(getCurrentStudent(token));
    } else {
      router.push("/");
      return;
    }
    setIsLoadedPage(true);
  }, [dispatch, router]);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  const { socket } = useSocket();

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.emit("myEvent", { foo: "bar" });

  //   socket.on("something", (data) => {
  //     console.log("Получено:", data);
  //   });

  //   return () => {
  //     socket.off("something");
  //   };
  // }, [socket]);

  return (
    <>
      {!isLoadedPage ? (
        <div className={styles.container__spinner}>
          <div className={styles.spinner}>
            <Spinner />
          </div>
        </div>
      ) : (
        <>
          <Head>
            <title>Tutorio — вход для репетиторов</title>
            <meta
              name="description"
              content="Бесплатно подберём репетитора под ваш запрос и бюджет. Проверенные репетиторы."
            />
          </Head>
          <header>
            <div className={clsx(styles.header, styles.center)}>
              <Link href="/student/orders">
                <div className={styles.header__logo}>
                  tutorio
                  <span className={styles.header__underLogo}>
                    Онлайн-сервис подбора репетиторов
                  </span>
                </div>
              </Link>
              <div className={styles.header__menu}>
                {student && (
                  <>
                    <span>{student.name}</span>
                    <Image
                      className={styles.header__menu_avatar}
                      src={
                        student?.avatarUrl
                          ? `${student?.avatarUrl}`
                          : `/img/icon/student/avatar/animal7.svg`
                      }
                      alt={`${student?.name}`}
                      width={42}
                      height={42}
                      priority
                    />
                  </>
                )}
              </div>
            </div>
          </header>
          {student && <main>{children}</main>}
          <footer className={clsx(styles.center)}>
            <p></p>
          </footer>
        </>
      )}
    </>
  );
};

export default Layout;
