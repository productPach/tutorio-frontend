import Match from "@/components/Match/Match";
import { Metadata } from "next";

const formMetaMap: Record<string, { title: string; description: string }> = {
  main: {
    title: "Выбор предмета — Tutorio",
    description: "Выберите предмет, по которому нужно найти репетитора",
  },
  subject: {
    title: "Выбор предмета — Tutorio",
    description: "Выберите предмет, по которому нужно найти репетитора",
  },
  goal: {
    title: "Цель занятий — Tutorio",
    description:
      "Укажите, зачем вам репетитор: подтянуть знания, подготовиться к экзамену или освоить новый материал",
  },
  class: {
    title: "В каком классе ученик — Tutorio",
    description:
      "Укажите класс ученика, чтобы мы подобрали подходящего репетитора",
  },
  studentType: {
    title: "Кто будет заниматься — Tutorio",
    description:
      "Выберите, кто будет проходить обучение: дошкольник, школьник, студент или взрослый ученик",
  },
  studentCourse: {
    title: "На каком курсе ученик — Tutorio",
    description:
      "Уточните курс, если вы студент, чтобы подобрать подходящего преподавателя",
  },
  deadline: {
    title: "Срок подготовки — Tutorio",
    description:
      "Укажите, когда у вас экзамен или важная дата, чтобы репетитор мог спланировать обучение",
  },
  studentLevel: {
    title: "Уровень знаний — Tutorio",
    description: "Оцените текущий уровень знаний — от начального до высокого",
  },
  tutorGender: {
    title: "Пол репетитора — Tutorio",
    description: "Укажите, если есть предпочтения по полу репетитора",
  },
  internationalExam: {
    title: "Международный экзамен — Tutorio",
    description:
      "Укажите, к какому экзамену готовитесь (например, IELTS, SAT, DELE)",
  },
  studyMethods: {
    title: "Методика подготовки — Tutorio",
    description: "Уточните методику, по которой хотите заниматься",
  },
  studyProgramms: {
    title: "Образовательная программа — Tutorio",
    description: "Укажите, по какой программе вы учитесь",
  },
  studentYears: {
    title: "Возраст ученика — Tutorio",
    description:
      "Укажите возраст, чтобы мы подобрали наиболее подходящего репетитора",
  },
  studentUniversity: {
    title: "ВУЗ ученика — Tutorio",
    description:
      "Напишите, в каком университете вы учитесь, это важно для подготовки",
  },
  timetable: {
    title: "Удобное время занятий — Tutorio",
    description: "Укажите, в какие дни и часы вам удобно заниматься",
  },
  studyPlace: {
    title: "Место занятий — Tutorio",
    description:
      "Выберите, где вам удобно заниматься: онлайн, у вас дома или на выезде",
  },
  studentAdress: {
    title: "Адрес ученика — Tutorio",
    description: "Укажите домашний адрес, если готовы заниматься у себя дома",
  },
  studentTrip: {
    title: "Локации для занятий — Tutorio",
    description: "Укажите, куда вы готовы ездить на занятия",
  },
  tutorType: {
    title: "Уровень репетитора — Tutorio",
    description: "Выберите подходящий уровень и ценовой диапазон репетитора",
  },
  autoContacts: {
    title: "Показ контактов — Tutorio",
    description: "Разрешить репетиторам сразу видеть ваши контакты?",
  },
  info: {
    title: "Дополнительная информация по заказу — Tutorio",
    description:
      "Укажите всё, что может помочь подобрать подходящего репетитора",
  },
  fio: {
    title: "Ваше имя — Tutorio",
    description:
      "Укажите, как вас зовут — это поможет начать общение с репетитором",
  },
  phone: {
    title: "Укажите номер телефона — Tutorio",
    description:
      "Номер будет показываться только выбранным репетиторам и использоваться для связи с вами",
  },
  confirmation: {
    title: "Подтвердите номер телефона — Tutorio",
    description: "Введите код из СМС, чтобы подтвердить номер телефона",
  },
};

type Params = {
  typeForm: string;
  componentRoute: string;
};

export async function generateMetadata(context: any): Promise<Metadata> {
  // «context» — это тот объект, который Next.js сам подставляет:
  // context.params, context.searchParams и т. д.
  const params = (context as { params: Params }).params;

  const meta = formMetaMap[params.typeForm];
  return {
    title: meta?.title || "Создание заказа на подбор репетитора — Tutorio",
    description:
      meta?.description ||
      "Заполните форму заказа, чтобы мы нашли для вас подходящего репетитора с учётом ваших целей, уровня знаний и предпочтений",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function MatchPage() {
  return <Match />;
}
