"use client";
import Link from "next/link";
import componentStyles from "./WarningNotification.module.css";
import clsx from "clsx";

interface WarningNotificationProps {
  message: string;
  href: string;
}

export const WarningNotification = ({
  message,
  href,
}: WarningNotificationProps) => {
  return (
    <div className={clsx(componentStyles.containerWN)}>
      <Link href={href}>
        <div>{message}</div>
      </Link>
    </div>
  );
};
