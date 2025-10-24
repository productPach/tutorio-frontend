"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import Image from "next/image";
import { Modal } from "../Modal/Modal";
import { SelectCity } from "./SelectCity";
import {
  setIsSheetSelectCity,
  setModalSelectCity,
} from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { getAllLocations } from "@/store/features/locationSlice";
import { useDetectRegion } from "@/hooks/detectRegion/useDetectRegion";
import { getLocalStorage } from "@/utils/localStorage/localStorage";
import { BottomSheet } from "../BottomSheet/BottomSheet";

export const SelectCityModal = () => {
  const dispatch = useAppDispatch();

  const regionFromLS = getLocalStorage("region-user");
  const regionUser = useAppSelector((state) => state.auth.regionUser);
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );
  const isSheetSelectCity = useAppSelector(
    (state) => state.modal.isSheetSelectCity
  );

  const { cityAtSlug, isRegionTooltip, confirmRegion } = useDetectRegion();

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  return (
    <>
      <div className={styles.header__geoContainer}>
        <div
          onClick={(e) => {
            e.preventDefault();
            if (window.innerWidth < 769) {
              dispatch(setIsSheetSelectCity(true)); // Открываем шторку
            } else {
              dispatch(setModalSelectCity(true));
            }
          }}
          className={styles.header__geo}
        >
          <Image
            src="/img/icon/caretDown.svg"
            width={17}
            height={17}
            alt="Выбор местоположения"
            className={styles.header__geoImage}
          />
          {regionUser?.city}
          {/* {regionUser?.city || getCityFromLocalStorage()} // проблема с гидрацией */}
        </div>

        {/* Тултип подтверждения региона */}
        {isRegionTooltip && cityAtSlug && (
          <div className={styles.regionTooltip}>
            <div className={styles.regionTooltip__content}>
              <p className={styles.regionTooltip__text}>
                Ваш регион {cityAtSlug.shortTitle}?
              </p>
              <div className={styles.regionTooltip__buttons}>
                <button
                  onClick={() => confirmRegion(cityAtSlug)}
                  className={styles.regionTooltip__buttonConfirm}
                >
                  Да
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.innerWidth < 769) {
                      dispatch(setIsSheetSelectCity(true)); // Открываем шторку
                    } else {
                      dispatch(setModalSelectCity(true));
                    }
                  }}
                  className={styles.regionTooltip__buttonReject}
                >
                  Нет
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        titleModal={"Укажите местоположение"}
        contentModal={<SelectCity />}
        isModal={isModalSelectCity}
        modalId={"selectCity"}
      />

      <BottomSheet
        isOpen={isSheetSelectCity}
        onClose={() => dispatch(setIsSheetSelectCity(false))}
      >
        <SelectCity />
      </BottomSheet>
    </>
  );
};
