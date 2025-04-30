"use client";
import styles from "./loadingModal.module.css";
import { Spinner } from "@/components/Spinner/Spinner";

export const LoadingPageModal = () => {
  return (
    <>
      <div>
        <div className={styles.buttonYlSpinner}>
          <Spinner />
        </div>
      </div>
    </>
  );
};
