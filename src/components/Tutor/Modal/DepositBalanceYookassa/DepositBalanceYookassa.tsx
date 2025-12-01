"use client";

import { useAppSelector, useAppDispatch } from "@/store/store";
import styles from "../BalanceBoost/BalanceBoost.module.css";
import { useEffect, useState } from "react";
import { createPayment } from "@/store/features/paymentSlice";

export const DepositBalanceYookassa = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.payment.loading);
  const amountFromStore = useAppSelector(
    (state) => state.modal.valueModalBalanceBoost
  );

  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetInitialized, setWidgetInitialized] = useState(false);

  // Загружаем скрипт виджета
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
    script.async = true;
    script.onload = () => setWidgetLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Инициализируем виджет когда скрипт загружен и есть сумма
  useEffect(() => {
    if (widgetLoaded && amountFromStore && !widgetInitialized) {
      initializeWidget();
    }
  }, [widgetLoaded, amountFromStore, widgetInitialized]);

  const initializeWidget = async () => {
    const amount = Number(amountFromStore);
    if (amount < 100) {
      alert("Минимальная сумма пополнения — 100 ₽");
      return;
    }

    const resultAction = await dispatch(createPayment(amount * 100)); // копейки
    if (!createPayment.fulfilled.match(resultAction)) {
      alert(resultAction.payload || "Ошибка при создании платежа");
      return;
    }

    const { confirmationToken } = resultAction.payload;

    // Создаём контейнер для виджета
    let container = document.getElementById("payment-form-modal");
    if (!container) {
      container = document.createElement("div");
      container.id = "payment-form-modal";
      document.body.appendChild(container);
    } else {
      container.innerHTML = ""; // очищаем предыдущий виджет
    }

    const checkout = new (window as any).YooMoneyCheckoutWidget({
      confirmation_token: confirmationToken,
      return_url: window.location.href,
      customization: {
        //Настройка цветовой схемы, минимум один параметр, значения цветов в HEX
        colors: {
          //Цвет акцентных элементов: кнопка Заплатить, выбранные переключатели, опции и текстовые поля
          control_primary: "#fad949", //Значение цвета в HEX
        },
      },
      error_callback: (error: any) => {
        console.error("Ошибка инициализации виджета:", error);
        alert("Ошибка при загрузке виджета оплаты");
      },
    });

    checkout.render("payment-form-modal").then(() => {
      console.log("Виджет загружен и готов к оплате");
      setWidgetInitialized(true);
    });
  };

  return (
    <div className={styles.depositContainer}>
      {/* <div className={styles.description}>
        Пополнение баланса на сумму: <strong>{amountFromStore} ₽</strong>
      </div> */}

      <div className={styles.widgetInfo}>
        {loading && "Создание платежа..."}
        {!widgetLoaded && "Загрузка платежного виджета..."}
        {widgetLoaded && !widgetInitialized && "Инициализация платежа..."}
      </div>

      {/* Контейнер для виджета в модалке */}
      <div id="payment-form-modal" className={styles.widgetContainer}></div>
    </div>
  );
};
