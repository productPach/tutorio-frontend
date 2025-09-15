"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Location } from "@/components/Tutor/Profile/Location/Location";
import { Modal } from "@/components/Modal/Modal";
import { SelectCity } from "@/components/SelectCity/SelectCity";
import { useAppSelector } from "@/store/store";

const LocationsPage: React.FC = () => {
  const page = "Main";
  // Получаем значение isModalSelectCity из Redux
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.content}>
          <Location />
        </div>
      </section>
      <Modal
        titleModal={"Укажите местоположение"}
        contentModal={<SelectCity />}
        isModal={isModalSelectCity}
        modalId={"selectCity"}
      ></Modal>
    </>
  );
};

export default LocationsPage;
