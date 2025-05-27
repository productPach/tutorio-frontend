import SignInTutor from "@/components/SignIn/SignInTutor/SignInTutor";
import { Metadata } from "next";

const formMetaMap: { [key: string]: { title: string; description: string } } = {
  phone: {
    title: "Для репетиторов — Tutorio",
    description:
      "Введите номер телефона, чтобы войти или зарегистрироваться в Tutorio — сервисе подбора репетиторов.",
  },
  confirmation: {
    title: "Подтвердите номер телефона — Tutorio",
    description: "Введите код из СМС, чтобы подтвердить номер телефона.",
  },
  fio: {
    title: "Введите ФИО — Tutorio",
    description:
      "Укажите ваше настоящее имя и фамилию. Это поможет ученикам понимать, с кем они будут заниматься, и повышает уровень доверия к вам как к профессионалу.",
  },
  subjects: {
    title: "Выберите предметы — Tutorio",
    description:
      "Выберите все предметы, по которым вы готовы преподавать. Чем точнее и шире вы укажете направления, тем больше учеников смогут вас найти. Это повысит шансы на получение подходящих заявок.",
  },
  locations: {
    title: "Выберите формат занятий — Tutorio",
    description:
      "Выберите формат: онлайн, у себя дома или с выездом. Укажите адрес и районы для выезда — это поможет ученикам выбрать вас.",
  },
  email: {
    title: "Введите email — Tutorio",
    description:
      "Ваш email используется для связи и уведомлений. Убедитесь, что вы указали актуальный адрес, чтобы не пропустить важную информацию от учеников и платформы.",
  },
  photo: {
    title: "Загрузите фото — Tutorio",
    description:
      "Добавьте своё фото — это помогает ученикам увидеть, с кем они будут взаимодействовать, и значительно повышает доверие. Профили с фотографией чаще выбирают для занятий.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { typeForm: string };
}): Promise<Metadata> {
  return (
    formMetaMap[params.typeForm] || {
      title: "Регистрация репетитора — Tutorio",
      description: "Создайте профиль и начните преподавать.",
    }
  );
}

export default function SignInTutorPage() {
  return <SignInTutor />;
}
