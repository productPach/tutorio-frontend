"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import styles from "../Modal/Modal.module.css";
import { useAppDispatch } from "@/store/store";
import {
  setIsModalAcceptResponse,
  setIsModalBalanceBoost,
  setIsModalBalanceBoostNotEmail,
  setIsModalConnectTelegram,
  setIsModalCreateContractByStudent,
  setIsModalCreateContractByTutor,
  setIsModalCreateReviewByStudent,
  setIsModalCreateReviewByTutor,
  setIsModalDelete,
  setIsModalDepositBalanceYookassa,
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
  setIsModalPaymentDetails,
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
    if (modalId === "depositBalanceYookassa") {
      dispatch(setIsModalDepositBalanceYookassa(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "paymentDetails") {
      dispatch(setIsModalPaymentDetails(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "balanceBoostNotEmail") {
      dispatch(setIsModalBalanceBoostNotEmail(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }

    // if (modalId === "updateReviewByTutor") {
    //   dispatch(setIsModalUpdateReviewByTutor(false));
    //   // Обнуляем значение top в leftbar
    //   dispatch(setScrollY(0));
    // }
  };

  //   useEffect(() => {
  //     if (isModal) {
  //       // Получаем текущую позицию скролла
  //       dispatch(setScrollY(window.scrollY));
  //     }
  //   }, [isModal]);

  //   return isModal
  //     ? createPortal(
  //         <Transition show={isModal} as={Fragment} appear>
  //           <Dialog
  //             as="div"
  //             className={styles.dialogOverlay}
  //             onClose={closeModal}
  //           >
  //             {/* === Фон (затемнение) === */}
  //             <Transition.Child
  //               as={Fragment}
  //               enter={styles.bgEnter}
  //               enterFrom={styles.bgEnterFrom}
  //               enterTo={styles.bgEnterTo}
  //               leave={styles.bgLeave}
  //               leaveFrom={styles.bgLeaveFrom}
  //               leaveTo={styles.bgLeaveTo}
  //             >
  //               <div className={styles.bg} />
  //             </Transition.Child>

  //             {/* === Popup === */}
  //             <div className={styles.popupWrapper}>
  //               <Transition.Child
  //                 as={Fragment}
  //                 enter={styles.popupEnter}
  //                 enterFrom={styles.popupEnterFrom}
  //                 enterTo={styles.popupEnterTo}
  //                 leave={styles.popupLeave}
  //                 leaveFrom={styles.popupLeaveFrom}
  //                 leaveTo={styles.popupLeaveTo}
  //               >
  //                 <DialogPanel
  //                   className={modalId !== "loadingPageModal" ? styles.popup : ""}
  //                 >
  //                   <DialogTitle className={styles.title}>
  //                     {titleModal}
  //                   </DialogTitle>
  //                   {contentModal}

  //                   {modalId !== "loadingPageModal" && (
  //                     <button className={styles.closeButton} onClick={closeModal}>
  //                       ✕
  //                     </button>
  //                   )}
  //                 </DialogPanel>
  //               </Transition.Child>
  //             </div>
  //           </Dialog>
  //         </Transition>,
  //         document.body
  //       )
  //     : null;
  // };

  const [show, setShow] = useState(false);
  const [animationState, setAnimationState] = useState<
    "enterFrom" | "enterTo" | "leaveFrom" | "leaveTo"
  >("enterFrom");
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (isModal) {
      scrollYRef.current = window.scrollY; // сохраняем текущий скролл
      setShow(true);
      setAnimationState("enterFrom");

      // небольшой таймаут для перехода в To
      const enterTimeout = setTimeout(() => setAnimationState("enterTo"), 20);

      // фиксируем скролл
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";

      return () => clearTimeout(enterTimeout);
    } else {
      setAnimationState("leaveFrom");
      const leaveTimeout = setTimeout(() => setAnimationState("leaveTo"), 20);

      const removeTimeout = setTimeout(() => {
        setShow(false);

        // восстанавливаем скролл
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollYRef.current);
      }, 350); // ждем окончания анимации

      return () => {
        clearTimeout(leaveTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [isModal]);

  if (!show) return null;

  return createPortal(
    <div className={styles.dialogOverlay}>
      <div
        className={`${styles.bg} ${
          animationState === "enterFrom" || animationState === "enterTo"
            ? animationState === "enterTo"
              ? styles.bgEnterTo
              : styles.bgEnterFrom
            : animationState === "leaveTo"
              ? styles.bgLeaveTo
              : styles.bgLeaveFrom
        }`}
        onClick={closeModal}
      />

      <div className={styles.popupWrapper}>
        <div
          className={`${styles.popup} ${
            animationState === "enterFrom" || animationState === "enterTo"
              ? animationState === "enterTo"
                ? styles.popupEnterTo
                : styles.popupEnterFrom
              : animationState === "leaveTo"
                ? styles.popupLeaveTo
                : styles.popupLeaveFrom
          }`}
        >
          <h2 className={styles.title}>{titleModal}</h2>
          {contentModal}
          <button className={styles.closeButton} onClick={closeModal}>
            ✕
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
