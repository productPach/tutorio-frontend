"use client";
import styles from "../../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { SubjectsSettings } from "@/components/Tutor/Profile/Subject/SubjectsSettings";

const SubjectsSettingsPage: React.FC = () => {
  const page = "Main";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <SubjectsSettings />
        </div>
      </section>
    </>
  );
};

export default SubjectsSettingsPage;
