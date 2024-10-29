export const listQuestionsForTutorSignIn = [
    {
        id: 1,
        typeForm: "phone",
        question: "Номер телефона",
        description: "Отправим уведомление для подтверждения входа",
        placeholder: "Введите номер телефона",
        nextPage: "/sign-in-tutor/confirmation",
    },
    {
        id: 2,
        typeForm: "confirmation",
        question: "Подтверждение номера телефона",
        description: "Отправили код на номер",
        placeholder: "",
        nextPage: "/sign-in-tutor/fio",
    },
    {
        id: 3,
        typeForm: "fio",
        question: "Как вас зовут?",
        description: "Пожалуйста, укажите ФИО как в паспорте",
        placeholder: "Иванов Иван Иванович",
        nextPage: "/sign-in-tutor/subjects",
    },
    {
        id: 4,
        typeForm: "subjects",
        question: "По каким предметам нужны ученики?",
        description: "Будем показывать вам заказы по выбранным предметам",
        placeholder: "Начните вводить предмет",
        nextPage: "/sign-in-tutor/locations",
    },
    // {
    //     id: 5,
    //     typeForm: "geo",
    //     question: "Подтверждение номера телефона",
    //     description: "Отправили код на номер",
    //     placeholder: "",
    //     nextPage: "/sign-in-tutor/locations",
    // },
    {
        id: 5,
        typeForm: "locations",
        question: "Где удобно заниматься?",
        description: "Будем показывать вам заказы учеников в зависимости от выбранных способов занятий и локаций",
        placeholder: "",
        nextPage: "/sign-in-tutor/email",
        answers: [
            {
                id: 1,
                title: "Дистанционно",
            },
            {
                id: 2,
                title: "Занимаюсь с учениками у себя",
            },
            {
                title: "Готов выезжать к ученикам",
                id: 3,
            },
        ],
    },
    {
        id: 7,
        typeForm: "email",
        question: "Введите e-mail",
        description: "На указанную электронную почту будут приходить уведомления о новых заказах от учеников. \n\nЕсли в будущем вы захотите отключить уведомления, это можно будет сделать в настройках личного кабинета.",
        placeholder: "name@email.ru",
        nextPage: "/sign-in-tutor/photo",
        
    },
    {
        id: 8,
        typeForm: "photo",
        question: "Фотография профиля",
        description: "Анкеты с фото ученики выбирают в 3 раза чаще",
        placeholder: "",
        nextPage: "/tutor/orders",
    },
  ];
  