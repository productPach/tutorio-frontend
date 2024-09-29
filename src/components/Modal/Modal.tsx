import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import styles from "../Modal/Modal.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setModalSelectCity } from "@/store/features/modalSlice";

interface ModalProps {
  titleModal: string;
  contentModal: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ titleModal, contentModal }) => {
  const dispatch = useAppDispatch();
  // Получаем значение isModalSelectCity из Redux
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );
  return (
    <>
      {/* Модальное окно с анимацией */}
      <Transition show={isModalSelectCity} as={Fragment}>
        <Dialog
          as="div"
          className={styles.dialogOverlay}
          onClose={() => dispatch(setModalSelectCity(false))}
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
                  onClick={() => dispatch(setModalSelectCity(false))}
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
