"use client";

import { ConfirmInputForm } from "@/components/SignIn/SignInStudent/ConfirmInputForms/ConfirmInputForm";
import { PhoneInputForms } from "@/components/SignIn/SignInStudent/PhoneInputForms/PhoneInputForms";
import { setToken } from "@/store/features/authSlice";
import { setStudent } from "@/store/features/studentSlice";
import { useAppDispatch } from "@/store/store";
import { Student } from "@/types/types";
import { getTokenFromCookie } from "@/utils/cookies/cookies";
import { getStudentFromLocalStorage } from "@/utils/localStorage/localStorage";
import { listQuestionsForStudentSignIn } from "@/utils/signIn/signInStudent/listQuestionsForStudentSignIn";
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

const SignInStudentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();

  useEffect(() => {
    // Получаем токен из куки
    // Если токен в куки есть, тогда добавляем токен в Redux
    const token = getTokenFromCookie();
    if (token) {
      dispatch(setToken(token));
    }

    const student: Student = getStudentFromLocalStorage();
    if (student) {
      dispatch(setStudent(student));
      if (student.status === "Pending" || student.status === "Active") {
        // Редиректим сразу в кабинет
        setTimeout(() => route.push("/student/order"));
      }
    }
  }, [dispatch]);

  const { typeForm } = useParams<{
    typeForm: string;
  }>();

  const ComponentsList: ComponentsList = {
    phone: PhoneInputForms,
    confirmation: ConfirmInputForm,
  };

  const ComponentRender = ComponentsList[typeForm];

  // Находим объект в массиве форм для регистрации репетитора
  const questionObject = listQuestionsForStudentSignIn.find(
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

export default SignInStudentPage;
