"use client";
import styles from "../../../../app/tutor/layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { SubjectsSettings } from "@/components/Tutor/Profile/Subject/SubjectsSettings";
import { Modal } from "@/components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { SubjectModal } from "../../Modal/Profil/Subject/SubjectModal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsSheetEditSubject,
  setIsSheetEditSubjectGoal,
  setIsSheetEditSubjectPrices,
} from "@/store/features/modalSlice";
import { SubjectPriceModal } from "../../Modal/Profil/Subject/SubjectPriceModal";
import { GoalModal } from "../../Modal/Profil/Subject/GoalModal";

const SubjectsSettingsPage: React.FC = () => {
  const page = "Main";
  const dispatch = useAppDispatch();

  const isModalEditSubject = useAppSelector(
    (state) => state.modal.isModalEditSubject
  );
  const isSheetEditSubject = useAppSelector(
    (state) => state.modal.isSheetEditSubject
  );

  const isModalEditSubjectPrices = useAppSelector(
    (state) => state.modal.isModalEditSubjectPrices
  );
  const isSheetEditSubjectPrices = useAppSelector(
    (state) => state.modal.isSheetEditSubjectPrices
  );

  const isModalEditSubjectGoal = useAppSelector(
    (state) => state.modal.isModalEditSubjectGoal
  );
  const isSheetEditSubjectGoal = useAppSelector(
    (state) => state.modal.isSheetEditSubjectGoal
  );

  return (
    <>
      <section
        className={clsx(styles.container, styles.center, styles.paddingBottM)}
      >
        <LeftBar page={page} />
        <div className={styles.content}>
          <SubjectsSettings />
        </div>
      </section>
      <Modal
        titleModal={""}
        contentModal={<SubjectModal />}
        isModal={isModalEditSubject}
        modalId={"editSubject"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetEditSubject}
        onClose={() => dispatch(setIsSheetEditSubject(false))}
      >
        <SubjectModal />
      </BottomSheet>

      <Modal
        titleModal={"Редактор предмета:"}
        contentModal={<SubjectPriceModal />}
        isModal={isModalEditSubjectPrices}
        modalId={"editSubjectPrices"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetEditSubjectPrices}
        onClose={() => dispatch(setIsSheetEditSubjectPrices(false))}
      >
        <SubjectPriceModal />
      </BottomSheet>

      <Modal
        titleModal={""}
        contentModal={<GoalModal />}
        isModal={isModalEditSubjectGoal}
        modalId={"editSubjectGoal"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetEditSubjectGoal}
        onClose={() => dispatch(setIsSheetEditSubjectGoal(false))}
      >
        <GoalModal />
      </BottomSheet>
    </>
  );
};

export default SubjectsSettingsPage;
