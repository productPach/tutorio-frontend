"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Photo } from "@/components/Tutor/Profile/Photo/Photo";

const PhotoPage: React.FC = () => {
  const page = "Main";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Photo />
        </div>
      </section>
    </>
  );
};

export default PhotoPage;
