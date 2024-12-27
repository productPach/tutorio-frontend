"use client";
import styles from "../../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Location } from "@/components/Tutor/Profile/Location/Location";

const LocationsPage: React.FC = () => {
  const page = "Main";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Location />
        </div>
      </section>
    </>
  );
};

export default LocationsPage;
