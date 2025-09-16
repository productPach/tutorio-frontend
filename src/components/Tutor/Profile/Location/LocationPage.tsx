"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Location } from "@/components/Tutor/Profile/Location/Location";
import { Modal } from "@/components/Modal/Modal";
import { SelectCity } from "@/components/SelectCity/SelectCity";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import { setIsSheetSelectCity } from "@/store/features/modalSlice";

const LocationsPage: React.FC = () => {
  const page = "Main";
  const dispatch = useAppDispatch();
  // Получаем значение isModalSelectCity из Redux
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );
  const isSheetSelectCity = useAppSelector(
    (state) => state.modal.isSheetSelectCity
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
      <BottomSheet
        isOpen={isSheetSelectCity}
        onClose={() => dispatch(setIsSheetSelectCity(false))}
      >
        <SelectCity />
      </BottomSheet>
    </>
  );
};

export default LocationsPage;
