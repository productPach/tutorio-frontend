"use client";
import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import SideBar from "@/components/Tutor/SideBar/SideBar";
import { Responses } from "@/components/Tutor/Responses/Responses";

const ResponsesPage: React.FC = () => {
  const page = "Responses";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Responses />
        </div>
      </section>
    </>
  );
};

export default ResponsesPage;
