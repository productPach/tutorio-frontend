"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Settings } from "@/components/Tutor/Settings/Settings";

const SettingsPage: React.FC = () => {
  const page = "Settings";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Settings />
        </div>
      </section>
    </>
  );
};

export default SettingsPage;
