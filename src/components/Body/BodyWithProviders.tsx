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
import { usePathname } from "next/navigation";

export default function BodyWithProviders({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesAccepted = useSelector(
    (state: RootState) => state.general.cookies
  );

  const pathname = usePathname();
  // Прячем баннер только на /student/order/[id]
  const hideCookieBanner = /^\/student\/order\/[^/]+$/.test(pathname);
  const shouldShowCookieBanner = !hideCookieBanner;

  return (
    <body
      className={clsx({
        [styles.bodyWithCookies]: shouldShowCookieBanner && !cookiesAccepted,
      })}
    >
      <SocketProvider>
        <ChatProvider>{children}</ChatProvider>
      </SocketProvider>
      {shouldShowCookieBanner && <CookieBanner />}
      <VerboxChat />
    </body>
  );
}
