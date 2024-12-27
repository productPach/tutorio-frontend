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
  setIsModalFio,
  setIsModalProfileInfo,
  setModalSelectCity,
  setScrollY,
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

  const closeModal = () => {
    if (modalId === "selectCity") {
      dispatch(setModalSelectCity(false));
    }
    if (modalId === "balanceBoost") {
      dispatch(setIsModalBalanceBoost(false));
      // Обнуляем значение top в leftbar
      dispatch(setScrollY(0));
    }
    if (modalId === "fio") {
      dispatch(setIsModalFio(false));
    }
    if (modalId === "profileInfo") {
      dispatch(setIsModalProfileInfo(false));
    }
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
                  <DialogPanel className={styles.popup}>
                    <DialogTitle className={styles.title}>
                      {titleModal}
                    </DialogTitle>
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
        </>,
        document.body // Указываем container для портала
      )
    : null;
};
