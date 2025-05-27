"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ReactNode } from "react";
import styles from "../../app/page.module.css";

import CookieBanner from "@/components/Cookie/CookieBanner";
import VerboxChat from "@/components/Vendor/Verbox/VerboxChat";
import { SocketProvider } from "@/context/SocketContext";
import { ChatProvider } from "@/context/ChatContext";
import clsx from "clsx";

export default function BodyWithProviders({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesAccepted = useSelector(
    (state: RootState) => state.general.cookies
  );

  return (
    <body className={clsx({ [styles.bodyWithCookies]: !cookiesAccepted })}>
      <SocketProvider>
        <ChatProvider>{children}</ChatProvider>
      </SocketProvider>
      <CookieBanner />
      <VerboxChat />
    </body>
  );
}
