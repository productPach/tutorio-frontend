"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import Image from "next/image";
import { Modal } from "../Modal/Modal";
import { SelectCity } from "./SelectCity";
import { setModalSelectCity } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const SelectCityModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.match.regionUser);
  return (
    <>
      <div
        onClick={() => {
          dispatch(setModalSelectCity(true));
        }}
        className={styles.header__geo}
      >
        <Image
          src="/img/icon/location.svg"
          width={15}
          height={18}
          alt="Выбор местоположения"
          className={styles.header__geoImage}
        />
        {regionUser.city}
      </div>

      <Modal
        titleModal={"Укажите местоположение"}
        contentModal={<SelectCity />}
      ></Modal>
    </>
  );
};
