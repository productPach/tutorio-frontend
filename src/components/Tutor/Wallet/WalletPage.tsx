"use client";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Wallet } from "@/components/Tutor/Wallet/Wallet";
import { useEffect, useState } from "react";
import { WalletSidbar } from "../SideBar/WalletSidbar";

const WalletPage: React.FC = () => {
  const page = "Wallet";

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 1280);
    };

    // Инициализация
    handleResize();

    // Подписка на изменение размера
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.content}>
          <Wallet />
        </div>
        {showSidebar && <WalletSidbar />}
      </section>
    </>
  );
};

export default WalletPage;
