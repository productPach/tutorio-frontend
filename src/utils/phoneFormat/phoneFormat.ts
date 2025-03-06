export const formatPhoneNumber = (
  value: string
): { formatted: string; formattedWithStars: string; original: string } => {
  // Очищаем исходный номер телефона от всех символов кроме цифр.
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  let formatted = "";
  let formattedWithStars = "";

  // Форматируем номер в зависимости от его длины.
  if (phoneNumberLength < 4) {
    formatted = phoneNumber;
    formattedWithStars = phoneNumber; // Для коротких номеров ничего не меняем.
  } else if (phoneNumberLength < 7) {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    formattedWithStars = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`; // Звездочки здесь не добавляем.
  } else if (phoneNumberLength < 9) {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    formattedWithStars = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8)}`;

    // Формат с звездочками для последних 4 цифр в виде '926 981 ** **'
    formattedWithStars = `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ** **`;
  }

  // Возвращаем отформатированный номер телефона с звездочками и исходное значение.
  return { formatted, formattedWithStars, original: phoneNumber };
};
