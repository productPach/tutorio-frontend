"use client";
import generalStyles from "../../../app/student/layout.module.css";
import styles from "../Order/Order.module.css";
import { SpinnerOrders } from "@/components/Spinner/SpinnerOrders";
import clsx from "clsx";
import { Student } from "@/types/types";
import Link from "next/link";
import { useEffect } from "react";

type OrderProps = {
  loading: boolean;
  student: Student | null;
  error: string | null;
};

export const WikiForOrderComponent = ({
  loading,
  student,
  error,
}: OrderProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  if (loading && !student?.name)
    return (
      <div className={generalStyles.container__spinner}>
        <div className={generalStyles.spinner}>
          <SpinnerOrders />
        </div>
      </div>
    );

  if (error) return <div>Видимо, что-то сломалось. Попробуйте зайти позже</div>;

  return (
    <>
      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3>Оглавление</h3>
          </div>
          <div className={styles.linkList}>
            <Link href={"#Как выбрать репетитора2"}>
              Как выбрать репетитора?
            </Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
            <Link href={""}>Как выбрать репетитора?</Link>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>

      <div
        className={clsx(
          generalStyles.content_block,
          generalStyles.order_block,
          generalStyles.crsr_pntr,
          styles.order_gap
        )}
      >
        <div className={styles.containerOrderInfo}>
          <div className={styles.subjectName}>
            <h3 id="Как выбрать репетитора2">Как выбрать репетитора</h3>
          </div>
          <div className={styles.goal}>
            Сейчас нет репетиторов, которые подходят под ваш запрос.
            <br></br>
            <br></br>
            Попробуйте изменить параметры заказа — например, добавить
            возможность онлайн-занятий, если это удобно. Так найти подходящего
            репетитора будет проще! 🎯
          </div>
        </div>
      </div>
    </>
  );
};
