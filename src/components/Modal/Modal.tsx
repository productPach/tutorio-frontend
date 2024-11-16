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
  setIsModalBalanceBoost,
  setModalSelectCity,
} from "@/store/features/modalSlice";

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

  const closeModal = () => {
    if (modalId === "selectCity") {
      dispatch(setModalSelectCity(false));
    }
    if (modalId === "balanceBoost") {
      dispatch(setIsModalBalanceBoost(false));
    }
  };
  useEffect(() => {
    if (isModal) {
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`; // Сохраняем текущее положение
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1); // Возвращаем прокрутку
      };
    }
  }, [isModal]);

  return (
    <>
      {/* Модальное окно с анимацией */}
      <Transition show={isModal} as={Fragment}>
        <Dialog
          as="div"
          className={styles.dialogOverlay}
          onClose={() => closeModal()}
        >
          <Transition.Child
            as={Fragment}
            enter={styles.enter}
            enterFrom={styles.enterFrom}
            enterTo={styles.enterTo}
            leave={styles.leave}
            leaveFrom={styles.leaveFrom}
            leaveTo={styles.leaveTo}
          >
            <div className={styles.bg}></div>
          </Transition.Child>

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
              <DialogPanel className={styles.popup}>
                <DialogTitle className={styles.title}>{titleModal}</DialogTitle>
                {contentModal}
                <button
                  className={styles.closeButton}
                  onClick={() => closeModal()}
                >
                  ✕
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
