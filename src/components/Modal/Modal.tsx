import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import styles from "../Modal/Modal.module.css";

interface ModalProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  titleModal: string;
}
export const Modal: React.FC<ModalProps> = ({
  isOpenModal,
  setIsOpenModal,
  titleModal,
}) => {
  return (
    <>
      {/* Модальное окно с анимацией */}
      <Transition show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          className={styles.dialogOverlay}
          onClose={() => setIsOpenModal(false)}
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
                <div>Контент модального окна</div>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsOpenModal(false)}
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
