export const formatPhoneNumber = (value: string): { formatted: string; original: string } => {
  // Очищаем исходный номер телефона от всех символов кроме цифр.
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  let formatted = '';

  // Форматируем номер в зависимости от его длины.
  if (phoneNumberLength < 4) {
    formatted = phoneNumber;
  } else if (phoneNumberLength < 7) {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumberLength < 9) {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    formatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8)}`;
  }

  // Возвращаем отформатированный номер телефона и исходное значение.
  return { formatted, original: phoneNumber };
};