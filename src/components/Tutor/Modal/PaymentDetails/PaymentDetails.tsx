"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../BalanceBoost/BalanceBoost.module.css";
import {
  setIsModalPaymentDetails,
  setIsSheetPaymentDetails,
} from "@/store/features/modalSlice";
import { formatDateTime } from "@/utils/date/date";

export const PaymentDetails = () => {
  const dispatch = useAppDispatch();
  // Вытаскиваем стоимость отклика на заказ из Redux
  const paymentData = useAppSelector((state) => state.modal.paymentData);

  const statusMap: Record<string, string> = {
    pending: "В процессе",
    success: "Успешно выполнен",
    canceled: "Отменён",
  };

  const YookassaReasonMap: Record<string, string> = {
    "3d_secure_failed": "Не пройдена аутентификация по 3-D Secure",
    call_issuer:
      "Оплата данным платежным средством отклонена по неизвестным причинам. Пожалуйста, обратитесь в организацию, выпустившую платежное средство",
    canceled_by_merchant: "Платеж отменен по API при оплате в две стадии",
    card_expired: "Истёк срок действия банковской карты",
    country_forbidden:
      "Нельзя заплатить банковской картой, выпущенной в этой стране",
    deal_expired: "Закончился срок жизни сделки",
    expired_on_capture: "Истёк срок списания оплаты у платежа",
    expired_on_confirmation: "Истёк срок оплаты",
    fraud_suspected: "Пожалуйста, обратитесь в поддержку Tutorio",
    general_decline: "Пожалуйста, обратитесь в поддержку Tutorio",
    identification_required:
      "Превышены ограничения на платежи для кошелька ЮMoney",
    insufficient_funds: "Не хватает денег для оплаты",
    internal_timeout:
      "Технические неполадки на стороне ЮKassa. Пожалуйста, повторите платеж позже",
    invalid_card_number: "Неправильно указан номер карты",
    invalid_csc: "Неправильно указан код CVV2 (CVC2, CID)",
    issuer_unavailable:
      "Организация, выпустившая платежное средство, недоступна",
    payment_method_limit_exceeded: "Пожалуйста, обратитесь в поддержку Tutorio",
    payment_method_restricted:
      "Пожалуйста, обратитесь в организацию, выпустившую платежное средство",
    permission_revoked: "Отозвано разрешение на автоплатежи",
    unsupported_mobile_operator:
      "Нельзя заплатить с номера телефона этого мобильного оператора",
  };

  const handleCloseModal = () => {
    if (window.innerWidth < 769) {
      dispatch(setIsSheetPaymentDetails(false));
    } else {
      dispatch(setIsModalPaymentDetails(false));
    }
  };

  return (
    <>
      {/* <div className={styles.description}>Детали платежа</div> */}
      {/* <div>
        Вернем деньги за отклик, если ученик не посмотрит его в течение 5 дней
      </div> */}
      <div className={styles.containerPaymentDetails}>
        <div>
          <div className={styles.textGry14}>ID платежа</div>
          <div>{paymentData?.id}</div>
        </div>

        {paymentData?.createdAt && (
          <div>
            <div className={styles.textGry14}>Дата платежа</div>
            <div>{formatDateTime(paymentData.createdAt)}</div>
          </div>
        )}

        {paymentData?.meta?.reason && (
          <div>
            <div className={styles.textGry14}>Назначение платежа</div>
            <div>{paymentData?.meta?.reason}</div>
          </div>
        )}

        <div>
          <div className={styles.textGry14}>Статус платежа</div>
          <div>
            {paymentData
              ? statusMap[paymentData.status] || paymentData.status
              : "-"}
          </div>
        </div>

        {paymentData?.status === "canceled" &&
          paymentData?.meta?.reasonYookassa && (
            <div>
              <div className={styles.textGry14}>Причина отмены</div>
              {YookassaReasonMap[paymentData.meta.reasonYookassa] ||
                paymentData.meta.reasonYookassa}
            </div>
          )}
      </div>

      <div className={styles.button}>
        <button
          className={styles.buttonBlc}
          onClick={handleCloseModal}
          type="button"
        >
          Закрыть
        </button>
      </div>
    </>
  );
};
