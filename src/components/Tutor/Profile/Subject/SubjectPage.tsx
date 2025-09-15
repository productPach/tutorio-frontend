"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Subject } from "@/components/Tutor/Profile/Subject/Subject";
import { Modal } from "@/components/Modal/Modal";
import { SubjectModal } from "@/components/Tutor/Modal/Profil/Subject/SubjectModal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import { setIsSheetEditSubjectPrices } from "@/store/features/modalSlice";

const SubjectsPage: React.FC = () => {
  const page = "Main";
  const dispatch = useAppDispatch();
  const isModalEditSubjectPrices = useAppSelector(
    (state) => state.modal.isModalEditSubjectPrices
  );
  const isSheetEditSubjectPrices = useAppSelector(
    (state) => state.modal.isSheetEditSubjectPrices
  );
  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.content}>
          <Subject />
        </div>
      </section>
      <Modal
        titleModal={"Редактор предмета:"}
        contentModal={<SubjectModal />}
        isModal={isModalEditSubjectPrices}
        modalId={"editSubjectPrices"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetEditSubjectPrices}
        onClose={() => dispatch(setIsSheetEditSubjectPrices(false))}
      >
        <SubjectModal />
      </BottomSheet>
    </>
  );
};

export default SubjectsPage;
