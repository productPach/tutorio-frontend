"use client";
import styles from "../SelectCity/SelectCityModal.module.css";
import Image from "next/image";
import { Modal } from "../Modal/Modal";
import { SelectCity } from "./SelectCity";
import { setModalSelectCity } from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UserRegion } from "@/types/types";
import { setRegionUser } from "@/store/features/authSlice";
import {
  getAreaByCoordinates,
  getGeolocation,
} from "@/utils/locations/getGeolocation";
import { useEffect, useState } from "react";
import { getAllLocations } from "@/store/features/locationSlice";

export const SelectCityModal = () => {
  const dispatch = useAppDispatch();

  const regionUser = useAppSelector((state) => state.auth.regionUser);
  const locations = useAppSelector((state) => state.locations.city);
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );

  const [localRegion, setLocalRegion] = useState<UserRegion | null>(null);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  useEffect(() => {
    if (regionUser) return;

    const detectRegion = async () => {
      try {
        const regionUserLS = localStorage.getItem("region-user");
        if (regionUserLS) {
          const parsed = JSON.parse(regionUserLS) as UserRegion;
          dispatch(setRegionUser(parsed));
          setLocalRegion(parsed);
          return;
        }

        const pos = await getGeolocation();
        const { latitude, longitude } = pos.coords;

        const locationData = await getAreaByCoordinates(latitude, longitude);
        if (!locationData || !locationData.area) {
          console.error("Ошибка: Не удалось найти область");
          return;
        }

        const foundCity = locations.find(
          (city) => city.area === locationData.area
        );

        if (foundCity) {
          const userRegion = { city: foundCity.title, area: foundCity.area };
          localStorage.setItem("region-user", JSON.stringify(userRegion));
          dispatch(setRegionUser(userRegion));
          setLocalRegion(userRegion);
        } else {
          console.error("Область не найдена в объекте locations");
        }
      } catch (error) {
        console.error("Ошибка при определении местоположения:", error);
      }
    };

    detectRegion();
  }, [dispatch, locations, regionUser]);

  return (
    <>
      <div
        onClick={() => dispatch(setModalSelectCity(true))}
        className={styles.header__geo}
      >
        <Image
          src="/img/icon/location.svg"
          width={15}
          height={18}
          alt="Выбор местоположения"
          className={styles.header__geoImage}
        />
        {(regionUser || localRegion)?.city}
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
