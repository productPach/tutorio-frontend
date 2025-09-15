"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { GeneralInfo } from "@/components/Tutor/Profile/GeneralInfo/GeneralInfo";
import { Modal } from "@/components/Modal/Modal";
import { Fio } from "@/components/Tutor/Modal/Profil/Fio/Fio";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ProfileInfo } from "@/components/Tutor/Modal/Profil/ProfileInfo/ProfileInfo";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsSheetFio,
  setIsSheetProfileInfo,
} from "@/store/features/modalSlice";

const GeneralPage: React.FC = () => {
  const page = "Main";
  const dispatch = useAppDispatch();
  const isModalFio = useAppSelector((state) => state.modal.isModalFio);
  const isModalProfileInfo = useAppSelector(
    (state) => state.modal.isModalProfileInfo
  );
  const isSheetFio = useAppSelector((state) => state.modal.isSheetFio);
  const isSheetProfileInfo = useAppSelector(
    (state) => state.modal.isSheetProfileInfo
  );

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.content}>
          <GeneralInfo />
        </div>
      </section>
      <Modal
        titleModal={"ФИО"}
        contentModal={<Fio />}
        isModal={isModalFio}
        modalId={"fio"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetFio}
        onClose={() => dispatch(setIsSheetFio(false))}
      >
        <Fio />
      </BottomSheet>
      <Modal
        titleModal={"О себе"}
        contentModal={<ProfileInfo />}
        isModal={isModalProfileInfo}
        modalId={"profileInfo"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetProfileInfo}
        onClose={() => dispatch(setIsSheetProfileInfo(false))}
      >
        <ProfileInfo />
      </BottomSheet>
    </>
  );
};

export default GeneralPage;
