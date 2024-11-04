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
import { locations } from "@/utils/locations/locations";

export const SelectCityModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение regionUser из Redux
  const regionUserFromStore: UserRegion | null = useAppSelector(
    (state) => state.auth.regionUser
  );
  let regionUser: UserRegion | null = regionUserFromStore;

  // Проверка на наличие данных о регионе
  if (!regionUser) {
    const regionUserLS = localStorage.getItem("region-user");
    if (regionUserLS) {
      try {
        const parsedRegionUser = JSON.parse(regionUserLS) as UserRegion;
        regionUser = parsedRegionUser;
        dispatch(setRegionUser(regionUser));
      } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
      }
    }
  }

  // Если данные о регионе все еще отсутствуют, получаем геолокацию
  if (!regionUser) {
    getGeolocation()
      .then(async (position) => {
        const { latitude, longitude } = position.coords;

        // Получаем область по координатам
        const locationData = await getAreaByCoordinates(latitude, longitude);

        // Проверяем, есть ли область в объекте locations
        const foundCity = locations.find(
          (city) => city.area === locationData.area
        );

        if (foundCity) {
          const userRegion = { city: foundCity.title, area: foundCity.area };
          localStorage.setItem("region-user", JSON.stringify(userRegion));
          dispatch(setRegionUser(userRegion));
        } else {
          console.error("Область не найдена в объекте locations");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении геолокации:", error);
      });
  }

  // Получаем значение isModalSelectCity из Redux
  const isModalSelectCity = useAppSelector(
    (state) => state.modal.isModalSelectCity
  );

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
        {regionUser && regionUser.city}
      </div>

      <Modal
        titleModal={"Укажите местоположение"}
        contentModal={<SelectCity />}
        isModal={isModalSelectCity}
        modalId={"selectCity"}
      ></Modal>
    </>
  );
};
