import Image from "next/image";
import styles from "../../../app/tutor/layout.module.css";
import clsx from "clsx";
import Link from "next/link";

export const Profile = () => {
  return (
    <>
      <Link href={"profile/main"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Общая информация</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
      <Link href={"profile/photo"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Фотография</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
      <Link href={"profile/documents"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Документы, дипломы, сертификаты</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
      <Link href={"profile/subjects"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Предметы и условия</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
      <Link href={"profile/locations"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Место занятий и локации</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
      <Link href={"profile/education"} prefetch={true}>
        <div className={styles.content_block}>
          <div className={styles.order_block_flx_rw_spbtw}>
            <h3>Образование и опыт</h3>
            <Image
              src="../img/icon/tutor/caretRight.svg"
              alt="Общая информация"
              width={21}
              height={21}
            />
          </div>
        </div>
      </Link>
    </>
  );
};
