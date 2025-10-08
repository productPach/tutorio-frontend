import { useAppSelector } from "@/store/store";

interface Warning {
  type: string;
  message: string;
  priority: number;
  href: string;
}

export const useTutorWarningsNotification = (): Warning | null => {
  const { tutor, incompletePrices } = useAppSelector(state => state.tutor);
  const subjectsWithGoals = useAppSelector((state) => state.tutor.subjectsWithGoals);
  const hasSubjectsWithoutGoals = subjectsWithGoals.some((s) => s.hasNoSelectedGoals);
  const subjectsWithGoalsLoading = useAppSelector((state) => state.tutor.subjectsWithGoalsLoading);

  const notificationsDisabled = !tutor?.isNotifications;
  const notificationsOrdersDisabled = !tutor?.isNotificationsOrders;
  const notificationsTelegramDisabled = !tutor?.isNotificationsTelegram;
  // const notificationsEmailDisabled = !tutor?.isNotificationsEmail;
  const noVerifedEmail = !tutor?.isVerifedEmail;
  const notificationsResponseDisabled = !tutor?.isNotificationsResponse;
  const connectTelegram = !tutor?.telegramId;

  // Составляем массив уведомлений с приоритетом
  const warnings: Warning[] = [];

  if (hasSubjectsWithoutGoals && !subjectsWithGoalsLoading) {
    warnings.push({
        type: "noGoals",
        priority: 1, // самый высокий приоритет
        message:
            "⚠️\u00A0У\u00A0вас есть предметы без\u00A0выбранных целей!\nПо\u00A0таким предметам уведомления о\u00A0заказах приходить не\u00A0будут. Добавьте цели, чтобы\u00A0не\u00A0упустить учеников\u00A0🙅‍♂️",
        href: "/tutor/profile/subjects",
    });
  }

  if (incompletePrices.hasIncompletePrices) {
    warnings.push({
        type: "noGoals",
        priority: 1.1, // самый высокий приоритет
        message:
            "⚠️\u00A0У\u00A0вас есть предметы без\u00A0указанной стоимости занятий!",
        href: "/tutor/profile/subjects",
    });
  }  

  if (notificationsDisabled) {
    warnings.push({
        type: "notificationsDisabled",
        priority: 2,
        message:
            "🔕\u00A0Включите уведомления, чтобы получать уведомления о заказах и откликах учеников",
        href: "/tutor/settings",
    });
  }

  if (notificationsOrdersDisabled) {
    warnings.push({
        type: "notificationsOrdersDisabled",
        priority: 2.1,
        message:
            "🔕\u00A0У\u00A0вас\u00A0отключены уведомления по\u00A0заказам. Включите их, чтобы не\u00A0пропустить заказы учеников.",
        href: "/tutor/settings",
    });
  }

  if (notificationsResponseDisabled) {
    warnings.push({
        type: "notificationsResponseDisabled",
        priority: 2.2,
        message:
            "🔕\u00A0У\u00A0вас\u00A0отключены уведомления по\u00A0откликам от учеников. Включите их, чтобы не\u00A0пропустить новые сообщения.",
        href: "/tutor/settings",
    });
  }
  
  if (notificationsTelegramDisabled) {
    warnings.push({
        type: "notificationsTelegramDisabled",
        priority: 5,
        message:
            "🔕\u00A0У\u00A0вас\u00A0отключены уведомления в\u00A0Telegram. Включите их, чтобы не\u00A0пропустить заказы и отклики учеников.",
        href: "/tutor/settings",
    });
  }

  if (connectTelegram) {
    warnings.push({
        type: "connectTelegram",
        priority: 4,
        message:
            "⚠️\u00A0Привяжите Telegram, чтобы\u00A0получать уведомления о\u00A0новых заказах и\u00A0откликах учеников.",
        href: "/tutor/settings",
    });
  }

  if (noVerifedEmail) {
    warnings.push({
        type: "noVerifedEmail",
        priority: 3,
        message:
            "🔕\u00A0Подтвердите e-mail, чтобы\u00A0получать уведомления о\u00A0новых заказах учеников, откликах и\u00A0других важных событиях.",
        href: "/tutor/settings",
    });

//   if (notificationsEmailDisabled) {
//     warnings.push({
//         type: "notificationsEmailDisabled",
//         priority: 5,
//         message:
//             "🔕\u00A0У\u00A0вас\u00A0отключены уведомления на\u00A0e-mail. Включите их, чтобы не\u00A0пропустить заказы учеников.",
//         href: "/tutor/settings",
//     });
  }

  // Сортируем по приоритету и возвращаем только одно уведомление
  return warnings.sort((a, b) => a.priority - b.priority)[0] || null;
};
