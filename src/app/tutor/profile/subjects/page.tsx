"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";

const SubjectsPage: React.FC = () => {
  const page = "Main";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}></div>
      </section>
    </>
  );
};

export default SubjectsPage;
