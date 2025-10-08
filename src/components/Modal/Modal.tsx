"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect } from "react";
import styles from "../Modal/Modal.module.css";
import { useAppDispatch } from "@/store/store";
import {
  setIsModalAcceptResponse,
  setIsModalBalanceBoost,
  setIsModalConnectTelegram,
  setIsModalCreateContractByStudent,
  setIsModalCreateContractByTutor,
  setIsModalCreateReviewByStudent,
  setIsModalCreateReviewByTutor,
  setIsModalDelete,
  setIsModalEditEducation,
  setIsModalEditSubject,
  setIsModalEditSubjectGoal,
  setIsModalEditSubjectPrices,
  setIsModalEducation,
  setIsModalEducationItem,
  setIsModalEmail,
  setIsModalExit,
  setIsModalExperience,
  setIsModalFio,
  setIsModalHiddenOrder,
  setIsModalPhone,
  setIsModalProfileInfo,
  setIsModalRejectResponse,
  setIsModalResponseStudentToTutor,
  setIsModalResponseTutorToStudent,
  setIsModalResponseTutorToStudentWithContakt,
  setIsModalSkype,
  setIsModalTelegram,
  setIsModalUpdateReviewByStudent,
  setLoadingPage,
  setModalSelectCity,
  setScrollY,
  setSubjectForEditInModal,
} from "@/store/features/modalSlice";
import { createPortal } from "react-dom";

interface ModalProps {
  titleModal: string;
  contentModal: React.ReactNode;
  isModal: boolean;
  modalId: string;
}
export const Modal: React.FC<ModalProps> = ({
  titleModal,
  contentModal,
  isModal,
  modalId,
}) => {
  const dispatch = useAppDispatch();
  if (modalId === "editSubjectPrices") {
    titleModal = "";
  }
  const closeModal = () => {
    if (modalId === "selectCity") {
      dispatch(setModalSelectCity(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "balanceBoost") {
      dispatch(setIsModalBalanceBoost(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "fio") {
      dispatch(setIsModalFio(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "profileInfo") {
      dispatch(setIsModalProfileInfo(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "education") {
      dispatch(setIsModalEducation(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "experience") {
      dispatch(setIsModalExperience(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "educationItem") {
      dispatch(setIsModalEducationItem(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "editEducation") {
      dispatch(setIsModalEditEducation(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "editSubject") {
      dispatch(setIsModalEditSubject(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "editSubjectPrices") {
      dispatch(setIsModalEditSubjectPrices(false));
      dispatch(setSubjectForEditInModal(null));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "editSubjectGoal") {
      dispatch(setIsModalEditSubjectGoal(false));
      dispatch(setSubjectForEditInModal(null));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "phone") {
      dispatch(setIsModalPhone(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "email") {
      dispatch(setIsModalEmail(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "telegram") {
      dispatch(setIsModalTelegram(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "telegramConnect") {
      dispatch(setIsModalConnectTelegram(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "skype") {
      dispatch(setIsModalSkype(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "exit") {
      dispatch(setIsModalExit(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "delete") {
      dispatch(setIsModalDelete(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "responseStudentToTutorModal") {
      dispatch(setIsModalResponseStudentToTutor(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "responseTutorToStudentModal") {
      dispatch(setIsModalResponseTutorToStudent(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "responseTutorToStudentWithContaktModal") {
      dispatch(setIsModalResponseTutorToStudentWithContakt(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "loadingPageModal") {
      dispatch(setLoadingPage(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "rejectResponse") {
      dispatch(setIsModalRejectResponse(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "acceptResponse") {
      dispatch(setIsModalAcceptResponse(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "createContractByTutor") {
      dispatch(setIsModalCreateContractByTutor(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "createContractByStudent") {
      dispatch(setIsModalCreateContractByStudent(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "hiddenOrder") {
      dispatch(setIsModalHiddenOrder(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "createReviewByStudent") {
      dispatch(setIsModalCreateReviewByStudent(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "createReviewByTutor") {
      dispatch(setIsModalCreateReviewByTutor(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "updateReviewByStudent") {
      dispatch(setIsModalUpdateReviewByStudent(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    // if (modalId === "updateReviewByTutor") {
    //   dispatch(setIsModalUpdateReviewByTutor(false));
    //   // Обнуляем значение top в leftbar
    //   dispatch(setScrollY(0));
    // }
  };

  useEffect(() => {
    if (isModal) {
      // Получаем текущую позицию скролла
      dispatch(setScrollY(window.scrollY));
    }
  }, [isModal]);

  return isModal
    ? createPortal(
        <>
          <Transition show={isModal} as={Fragment}>
            <Dialog
              as="div"
              className={styles.dialogOverlay}
              onClose={() => closeModal()}
            >
              <TransitionChild
                as={Fragment}
                enter={styles.enter}
                enterFrom={styles.enterFrom}
                enterTo={styles.enterTo}
                leave={styles.leave}
                leaveFrom={styles.leaveFrom}
                leaveTo={styles.leaveTo}
              >
                <div className={styles.bg}></div>
              </TransitionChild>

              <div className={styles.popupWrapper}>
                <TransitionChild
                  as={Fragment}
                  enter={styles.enter}
                  enterFrom={styles.enterFrom}
                  enterTo={styles.enterTo}
                  leave={styles.leave}
                  leaveFrom={styles.leaveFrom}
                  leaveTo={styles.leaveTo}
                >
                  <DialogPanel
                    className={
                      modalId !== "loadingPageModal" ? styles.popup : ""
                    }
                  >
                    <DialogTitle className={styles.title}>
                      {titleModal}
                    </DialogTitle>
                    {contentModal}
                    {modalId !== "loadingPageModal" && (
                      <button
                        className={styles.closeButton}
                        onClick={() => closeModal()}
                      >
                        ✕
                      </button>
                    )}
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>
        </>,
        document.body // Указываем container для портала
      )
    : null;
};
