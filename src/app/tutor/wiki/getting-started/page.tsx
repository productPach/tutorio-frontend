"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { WikiComponent } from "@/components/Tutor/Wiki/Wiki";
import { GettingStarted } from "@/components/Tutor/Wiki/GettingStarted/GettingStarted";

const GettingStartedPage: React.FC = () => {
  const page = "Wiki";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <GettingStarted />
        </div>
        {/* <SideBar /> */}
      </section>
    </>
  );
};

export default GettingStartedPage;
