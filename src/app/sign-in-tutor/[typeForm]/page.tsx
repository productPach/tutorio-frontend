"use client";
import { ConfirmInputForm } from "@/components/SignIn/SignInTutor/ConfirmInputForms/ConfirmInputForm";
import { EmailInputForms } from "@/components/SignIn/SignInTutor/EmailInputForm/EmailInputForm";
import { FioInputForms } from "@/components/SignIn/SignInTutor/FioInputForm/FioInputForm";
import { LocationForms } from "@/components/SignIn/SignInTutor/LocationForms/LocationForms";
import { PhoneInputForms } from "@/components/SignIn/SignInTutor/PhoneInputForms/PhoneInputForms";
import { PhotoForm } from "@/components/SignIn/SignInTutor/PhotoForm/PhotoForm";
import { SubjectsForms } from "@/components/SignIn/SignInTutor/SubjectsForms/SubjectsForms";
import { setToken } from "@/store/features/authSlice";
import { setTutor } from "@/store/features/tutorSlice";
import { useAppDispatch } from "@/store/store";
import { Tutor } from "@/types/types";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { getTutorFromLocalStorage } from "@/utils/localStorage/localStorage";
import { listQuestionsForTutorSignIn } from "@/utils/signIn/signInTutor/listQuestionsForTutorSignIn";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Answer {
  id: number;
  title: string;
}

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
}

interface ComponentsList {
  [key: string]: React.ComponentType<ComponentRenderProps>;
}

const SignInTutorPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();

  useEffect(() => {
    // Получаем токен из куки
    // Если токен в куки есть, тогда добавляем токен в Redux
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
    }

    const tutor: Tutor = getTutorFromLocalStorage();
    if (tutor) {
      dispatch(setTutor(tutor));
      if (tutor.status === "Pending" || tutor.status === "Active") {
        // Редиректим сразу в кабинет
        setTimeout(() => route.push("/tutor/orders"));
      }
    }
  }, [dispatch]);

  const { typeForm } = useParams<{
    typeForm: string;
  }>();

  const ComponentsList: ComponentsList = {
    phone: PhoneInputForms,
    confirmation: ConfirmInputForm,
    fio: FioInputForms,
    subjects: SubjectsForms,
    // "price": ;
    locations: LocationForms,
    email: EmailInputForms,
    photo: PhotoForm,
  };

  const ComponentRender = ComponentsList[typeForm];

  // Находим объект в массиве форм для регистрации репетитора
  const questionObject = listQuestionsForTutorSignIn.find(
    (item) => item.typeForm === typeForm
  );
  // Идентификатор формы
  const id = questionObject?.id || 0;
  // Заголовок формы
  const question = questionObject?.question || "";
  // Описание формы
  const description = questionObject?.description || "";
  // Плейсхолдер формы для полей ввода
  const placeholder = questionObject?.placeholder || "";
  // Путь на следующий шаг
  const nextPage = questionObject?.nextPage || "";
  const answerArray = questionObject?.answers || [];

  return (
    <>
      {ComponentRender ? (
        <ComponentRender
          id={id}
          typeForm={typeForm}
          question={question}
          description={description}
          placeholder={placeholder}
          nextPage={nextPage}
        />
      ) : null}
    </>
  );
};

export default SignInTutorPage;
