import styles from "../SelectCity/SelectCity.module.css";
import Image from "next/image";
import { Modal } from "../Modal/Modal";

interface SelectCityProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
}

export const SelectCity: React.FC<SelectCityProps> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  return (
    <>
      <div
        onClick={() => {
          setIsOpenModal(true);
        }}
        className={styles.header__geo}
      >
        <Image
          src="/img/icon/location.svg"
          width={15}
          height={18}
          alt="Выбор города"
          className={styles.header__geoImage}
        />
        Москва
      </div>

      <Modal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        titleModal={"Выберите город"}
      ></Modal>
    </>
  );
};
