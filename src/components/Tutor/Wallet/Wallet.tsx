"use client";
import { useEffect } from "react";
import styles from "../../../app/tutor/layout.module.css";
import componentStyle from "./Wallet.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getUserBalance,
  loadBalanceHistory,
} from "@/store/features/paymentSlice";
import { Modal } from "@/components/Modal/Modal";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import {
  setIsModalBalanceBoost,
  setIsModalPaymentData,
  setIsModalPaymentDetails,
  setIsSheetBalanceBoost,
  setIsSheetBalanceBoostNotEmail,
  setIsSheetDepositBalanceYookassa,
  setIsSheetPaymentDetails,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { DepositBalanceYookassa } from "../Modal/DepositBalanceYookassa/DepositBalanceYookassa";
import clsx from "clsx";
import { BalanceBoost } from "../Modal/BalanceBoost/BalanceBoost";
import { Clock, Hourglass } from "lucide-react";
import { PaymentDetails } from "../Modal/PaymentDetails/PaymentDetails";
import { BalanceBoostNotEmail } from "../Modal/BalanceBoost/BalanceBoostNotEmail";

// Маппинг статусов на русский язык
const statusMapping = {
  pending: "В обработке",
  success: "Успешно",
  canceled: "Операция отклонена",
} as const;

// Маппинг типов операций
const operationTypeMapping = {
  deposit: "Пополнение баланса",
  withdrawal: "Списание средств",
  referral: "Зачисление по реферальной программе",
  service_purchase: "Оплата отклика на заказ",
} as const;

// Иконки для разных типов операций
const OperationIcon = ({ type }: { type: string }) => {
  const isIncome = type === "deposit" || type === "referral";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
    >
      {isIncome ? (
        <path
          d="M15.4447 15.0051C15.4421 15.2812 15.2162 15.503 14.9401 15.5004L10.4403 15.4583C10.1641 15.4557 9.94239 15.2297 9.94497 14.9536C9.94756 14.6775 10.1735 14.4557 10.4496 14.4583L13.7424 14.4891L8.69882 9.35023C8.50539 9.15315 8.50835 8.83658 8.70544 8.64315C8.90252 8.44973 9.21909 8.45269 9.41251 8.64977L14.4561 13.7887L14.4869 10.4959C14.4895 10.2198 14.7154 9.99805 14.9916 10.0006C15.2677 10.0032 15.4895 10.2292 15.4869 10.5053L15.4447 15.0051Z"
          fill="#2A2A2A"
        />
      ) : (
        <path
          d="M15.4447 8.99532C15.4421 8.71919 15.2162 8.49744 14.9401 8.50002L10.4403 8.54216C10.1641 8.54474 9.94239 8.77069 9.94497 9.04682C9.94756 9.32295 10.1735 9.5447 10.4496 9.54211L13.7424 9.51128L8.69882 14.6502C8.50539 14.8473 8.50835 15.1638 8.70544 15.3573C8.90252 15.5507 9.21909 15.5477 9.41251 15.3506L14.4561 10.2117L14.4869 13.5045C14.4895 13.7806 14.7154 14.0024 14.9916 13.9998C15.2677 13.9972 15.4895 13.7713 15.4869 13.4951L15.4447 8.99532Z"
          fill="#2A2A2A"
        />
      )}
    </svg>
  );
};

// Компонент для отображения статуса
const StatusBadge = ({ status }: { status: keyof typeof statusMapping }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return componentStyle.status_success;
      case "pending":
        return componentStyle.status_pending;
      case "failed":
        return componentStyle.status_failed;
      default:
        return componentStyle.status_pending;
    }
  };

  return (
    <span
      className={`${componentStyle.status_badge} ${getStatusColor(status)}`}
    >
      {statusMapping[status]}
    </span>
  );
};

// Функция для группировки транзакций по датам
const groupTransactionsByDate = (transactions: any[]) => {
  const groups: { [key: string]: any[] } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;

    if (date.toDateString() === today.toDateString()) {
      dateKey = "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Вчера";
    } else {
      dateKey = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(transaction);
  });

  return groups;
};

// Функция для форматирования времени
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Wallet = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.payment.transactions);
  const balance = useAppSelector((state) => state.payment.balance);

  useEffect(() => {
    dispatch(getUserBalance());
  }, [dispatch]);

  const isModalDepositBalanceYookassa = useAppSelector(
    (state) => state.modal.isModalDepositBalanceYookassa
  );
  const isSheetDepositBalanceYookassa = useAppSelector(
    (state) => state.modal.isSheetDepositBalanceYookassa
  );

  const isModalBalanceBoost = useAppSelector(
    (state) => state.modal.isModalBalanceBoost
  );
  const isSheetBalanceBoost = useAppSelector(
    (state) => state.modal.isSheetBalanceBoost
  );
  const descriptionForModalBalanceBoost =
    "Пополните баланс, чтобы не упускать подходящие заказы и откликаться на них без задержек";

  const isModalPaymentDetails = useAppSelector(
    (state) => state.modal.isModalPaymentDetails
  );
  const isSheetPaymentDetails = useAppSelector(
    (state) => state.modal.isSheetPaymentDetails
  );

  const isModalBalanceBoostNotEmail = useAppSelector(
    (state) => state.modal.isModalBalanceBoostNotEmail
  );
  const isSheetBalanceBoostNotEmail = useAppSelector(
    (state) => state.modal.isSheetBalanceBoostNotEmail
  );

  useEffect(() => {
    dispatch(loadBalanceHistory());
  }, [dispatch]);

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <>
      {/* Блок баланса */}
      <div className={`${styles.content_block} ${componentStyle.order_block}`}>
        <h3>Баланс</h3>
      </div>

      <div
        className={clsx(
          styles.content_block,
          componentStyle.order_block,
          componentStyle.blcFlxRwDsktp
        )}
      >
        <div className={componentStyle.blcFlxClmn}>
          <span>Текущий баланс</span>
          <h2 className={componentStyle.order_block_ordr_itm_text}>
            {balance / 100} ₽
          </h2>
        </div>
        <div className={componentStyle.blcFlxClmnMob}>
          <button
            className={componentStyle.button}
            type="button"
            // disabled={errorInput}
            onClick={(e) => {
              e.preventDefault();
              if (window.innerWidth < 769) {
                dispatch(setIsSheetBalanceBoost(true));
              } else {
                dispatch(setIsModalBalanceBoost(true));
              }
              dispatch(setValueModalBalanceBoost("100"));
            }}
          >
            Пополнить баланс
          </button>
        </div>
      </div>

      {/* Блок истории транзакций */}
      <div className={`${styles.content_block} ${componentStyle.order_block}`}>
        <div className={componentStyle.mrgn_bt_10}>
          <h3>История платежей</h3>
        </div>
        <div className={componentStyle.order_block_inf}>
          {transactions.length === 0 ? (
            <div className={componentStyle.order_block_ordr_itm}>
              <p className={componentStyle.order_block_ordr_itm_text}>
                У вас пока не было ни одной транзакции
              </p>
            </div>
          ) : (
            <>
              {/* Группированные транзакции */}
              {Object.entries(groupedTransactions).map(
                ([date, dateTransactions]) => (
                  <div key={date}>
                    {/* Заголовок даты */}
                    <div className={componentStyle.date_section}>
                      <span className={componentStyle.date_header}>{date}</span>
                    </div>

                    {/* Транзакции за дату */}
                    {dateTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={componentStyle.transaction_row}
                      >
                        <div className={componentStyle.transaction_info}>
                          <div className={componentStyle.transaction_main}>
                            <OperationIcon type={transaction.type} />

                            <div>
                              <div
                                className={componentStyle.transaction_details}
                              >
                                <span
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (window.innerWidth < 769) {
                                      dispatch(setIsSheetPaymentDetails(true));
                                    } else {
                                      dispatch(setIsModalPaymentDetails(true));
                                    }
                                    dispatch(
                                      setIsModalPaymentData(transaction)
                                    );
                                  }}
                                  className={componentStyle.transaction_title}
                                >
                                  {operationTypeMapping[
                                    transaction.type as keyof typeof operationTypeMapping
                                  ] || transaction.type}
                                  {transaction.orderId &&
                                    ` № ${transaction.orderId}`}
                                </span>
                                {transaction.status === "pending" && (
                                  <div
                                    className={componentStyle.dsplCntnt}
                                    title="Операция в обработке"
                                  >
                                    <Clock
                                      size={18}
                                      color={"#555"}
                                      strokeWidth={1.5}
                                      // fill={component === 1 ? "#e1e1e1" : "none"}
                                    />
                                  </div>
                                )}
                              </div>
                              <span className={componentStyle.transaction_time}>
                                {formatTime(transaction.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* <div className={componentStyle.transaction_status}>
                          <StatusBadge status={transaction.status} />
                        </div> */}

                        <div className={componentStyle.transaction_amount}>
                          <span
                            className={
                              transaction.status === "canceled"
                                ? componentStyle.negative_amount
                                : transaction.status === "pending"
                                  ? componentStyle.pending_amount
                                  : componentStyle.positive_amount
                            }
                          >
                            {transaction.type === "deposit" ||
                            transaction.type === "referral"
                              ? "+"
                              : "-"}
                            {(transaction.amount / 100).toFixed(0)} ₽
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        titleModal={""}
        contentModal={<DepositBalanceYookassa />}
        isModal={isModalDepositBalanceYookassa}
        modalId={"depositBalanceYookassa"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetDepositBalanceYookassa}
        onClose={() => dispatch(setIsSheetDepositBalanceYookassa(false))}
      >
        <DepositBalanceYookassa />
      </BottomSheet>

      <Modal
        titleModal={"Пополнить баланс"}
        contentModal={
          <BalanceBoost description={descriptionForModalBalanceBoost} />
        }
        isModal={isModalBalanceBoost}
        modalId={"balanceBoost"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetBalanceBoost}
        onClose={() => dispatch(setIsSheetBalanceBoost(false))}
      >
        <BalanceBoost description={descriptionForModalBalanceBoost} />
      </BottomSheet>

      <Modal
        titleModal={"Детали платежа"}
        contentModal={<PaymentDetails />}
        isModal={isModalPaymentDetails}
        modalId={"paymentDetails"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetPaymentDetails}
        onClose={() => dispatch(setIsSheetPaymentDetails(false))}
      >
        <PaymentDetails />
      </BottomSheet>

      <Modal
        titleModal={"Не сможем выслать чек"}
        contentModal={<BalanceBoostNotEmail />}
        isModal={isModalBalanceBoostNotEmail}
        modalId={"balanceBoostNotEmail"}
      ></Modal>
      <BottomSheet
        isOpen={isSheetBalanceBoostNotEmail}
        onClose={() => dispatch(setIsSheetBalanceBoostNotEmail(false))}
      >
        <BalanceBoostNotEmail />
      </BottomSheet>
    </>
  );
};
