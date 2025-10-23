"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import Image from "next/image";
import { Modal } from "../Modal/Modal";
import { SelectCity } from "./SelectCity";
import { setModalSelectCity } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UserRegion } from "@/types/types";
import { useEffect, useState } from "react";
import { getAllLocations } from "@/store/features/locationSlice";
import { useDetectRegion } from "@/hooks/detectRegion/useDetectRegion";
import { getLocalStorage } from "@/utils/localStorage/localStorage";

export const SelectCityModal = () => {
  const dispatch = useAppDispatch();

  const regionFromLS = getLocalStorage("region-user");
  const regionUser = useAppSelector((state) => state.auth.regionUser);
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );

  const {
    city,
    cityAtSlug,
    isRegionTooltip,
    saveRegion,
    confirmRegion,
    rejectRegion,
  } = useDetectRegion();

  const [localRegion, setLocalRegion] = useState<UserRegion | null>(null);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  return (
    <>
      <div className={styles.header__geoContainer}>
        <div
          onClick={() => dispatch(setModalSelectCity(true))}
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
                Ваш регион {cityAtSlug.title}?
              </p>
              <div className={styles.regionTooltip__buttons}>
                <button
                  onClick={() => confirmRegion(cityAtSlug)}
                  className={styles.regionTooltip__buttonConfirm}
                >
                  Да
                </button>
                <button
                  onClick={() => dispatch(setModalSelectCity(true))}
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
    </>
  );
};
