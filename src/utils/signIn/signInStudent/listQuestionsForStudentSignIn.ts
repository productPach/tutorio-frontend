export const listQuestionsForStudentSignIn = [
    {
        id: 1,
        typeForm: "phone",
        question: "Номер телефона",
        description: "На указанный номер придёт проверочный код для подтверждения",
        placeholder: "Введите номер телефона",
        nextPage: "/sign-in-student/confirmation",
    },
    {
        id: 2,
        typeForm: "confirmation",
        question: "Подтверждение номера телефона",
        description: "Отправили код на номер",
        placeholder: "",
        nextPage: "/student/order",
    },
  ];
  