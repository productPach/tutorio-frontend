"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Wallet } from "@/components/Tutor/Wallet/Wallet";

const WalletPage: React.FC = () => {
  const page = "Wallet";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Wallet />
        </div>
      </section>
    </>
  );
};

export default WalletPage;
