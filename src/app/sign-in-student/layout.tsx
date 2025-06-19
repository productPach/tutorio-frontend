"use client";
import { HeaderSignInStudent } from "@/components/HeaderMenu/HeaderSignInStudent";
import styles from "./layout.module.css";
import { useAppSelector } from "@/store/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  return (
    <>
      <HeaderSignInStudent />
      <main
        className={!cookiesAccepted ? styles.main_with_cookies : styles.main}
      >
        {children}
      </main>
    </>
  );
}
