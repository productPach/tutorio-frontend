import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalStateType = {
  isModalSelectCity: boolean;
  isSheetSelectCity: boolean;
  isModalBalanceBoost: boolean;
  valueModalBalanceBoost: string;
  scrollY: number;
  isModalFio: boolean;
  isSheetFio: boolean;
  isModalProfileInfo: boolean;
  isSheetProfileInfo: boolean;
  isModalExperience: boolean;
  isSheetExperience: boolean;
  isModalEducation: boolean;
  isSheetEducation: boolean;
  isModalEducationItem: boolean;
  isSheetDeleteEducationItem: boolean;
  isModalEditEducation: boolean;
  isSheetEditEducation: boolean;
  isModalEditSubjectPrices: boolean;
  isSheetEditSubjectPrices: boolean,
  subjectForEditInModal: string | null; // ID предмета или объект предмета
  isModalPhone: boolean;
  isSheetPhone: boolean;
  isModalEmail: boolean;
  isSheetEmail: boolean;
  isModalTelegram: boolean;
  isSheetTelegram: boolean;
  isModalSkype: boolean;
  isModalExit: boolean;
  isSheetExit: boolean;
  isModalDelete: boolean;
  isSheetDelete: boolean;
  isModalResponseStudentToTutor: boolean;
  tutorIdForResponseStudentToTutor: string | null;
  isModalResponseTutorToStudent: boolean;
  isSheetResponseTutorToStudent: boolean;
  isModalResponseTutorToStudentWithContakt: boolean;
  isSheetResponseTutorToStudentWithContakt: boolean;
  loadingPage: boolean;
  isModalRejectResponse: boolean;
  isModalAcceptResponse: boolean;
  isSheetRejectResponse: boolean;
  isSheetAcceptResponse: boolean;
  isSheetOpen: boolean;
  isModalCreateContractByTutor: boolean;
  isSheetCreateContractByTutor: boolean;
  isModalCreateContractByStudent: boolean;
  isSheetCreateContractByStudent: boolean;
  isModalHiddenOrder: boolean;
  isSheetHiddenOrder: boolean;
  isModalCreateReviewByStudent: boolean;
  isSheetCreateReviewByStudent: boolean;
  isModalUpdateReviewByStudent: boolean;
  isSheetUpdateReviewByStudent: boolean;
  isModalCreateReviewByTutor: boolean;
  isSheetCreateReviewByTutor: boolean;
  isValueCreateReview: string | null;
  isReviewIdCreateReview: string | null;
  isSheetFiltersOrdersForTutor: boolean;
};

const initialState: ModalStateType = {
  isModalSelectCity: false,
  isSheetSelectCity: false,
  isModalBalanceBoost: false,
  valueModalBalanceBoost: "",
  scrollY: 0,
  isModalFio: false,
  isSheetFio: false,
  isModalProfileInfo: false,
  isSheetProfileInfo: false,
  isModalExperience: false,
  isSheetExperience: false,
  isModalEducation: false,
  isSheetEducation: false,
  isModalEducationItem: false,
  isSheetDeleteEducationItem: false,
  isModalEditEducation: false,
  isSheetEditEducation: false,
  isModalEditSubjectPrices: false,
  isSheetEditSubjectPrices: false,
  subjectForEditInModal: null,
  isModalPhone: false,
  isSheetPhone: false,
  isModalEmail: false,
  isSheetEmail: false,
  isModalTelegram: false,
  isSheetTelegram: false,
  isModalSkype: false,
  isModalExit: false,
  isSheetExit: false,
  isModalDelete: false,
  isSheetDelete: false,
  isModalResponseStudentToTutor: false,
  tutorIdForResponseStudentToTutor: null,
  isModalResponseTutorToStudent: false,
  isSheetResponseTutorToStudent: false,
  isModalResponseTutorToStudentWithContakt: false,
  isSheetResponseTutorToStudentWithContakt: false,
  loadingPage: false,
  isModalRejectResponse: false,
  isModalAcceptResponse: false,
  isSheetRejectResponse: false,
  isSheetAcceptResponse: false,
  isSheetOpen: false,
  isModalCreateContractByTutor: false,
  isSheetCreateContractByTutor: false,
  isModalCreateContractByStudent: false,
  isSheetCreateContractByStudent: false,
  isModalHiddenOrder: false,
  isSheetHiddenOrder: false,
  isModalCreateReviewByStudent: false,
  isSheetCreateReviewByStudent: false,
  isModalUpdateReviewByStudent: false,
  isSheetUpdateReviewByStudent: false,
  isModalCreateReviewByTutor: false,
  isSheetCreateReviewByTutor: false,
  isValueCreateReview: null,
  isReviewIdCreateReview: null,
  isSheetFiltersOrdersForTutor: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalSelectCity: (state, action: PayloadAction<boolean>) => {
      state.isModalSelectCity = action.payload;
    },
    setIsSheetSelectCity: (state, action: PayloadAction<boolean>) => {
      state.isSheetSelectCity = action.payload;
    },
    setIsModalBalanceBoost: (state, action: PayloadAction<boolean>) => {
      state.isModalBalanceBoost = action.payload;
    },
    setValueModalBalanceBoost: (state, action: PayloadAction<string>) => {
      state.valueModalBalanceBoost = action.payload;
    },
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
    },
    setIsModalFio: (state, action: PayloadAction<boolean>) => {
      state.isModalFio = action.payload;
    },
    setIsSheetFio: (state, action: PayloadAction<boolean>) => {
      state.isSheetFio = action.payload;
    },
    setIsModalProfileInfo: (state, action: PayloadAction<boolean>) => {
      state.isModalProfileInfo = action.payload;
    },
    setIsSheetProfileInfo: (state, action: PayloadAction<boolean>) => {
      state.isSheetProfileInfo = action.payload;
    },
    setIsModalExperience: (state, action: PayloadAction<boolean>) => {
      state.isModalExperience = action.payload;
    },
    setIsSheetExperience: (state, action: PayloadAction<boolean>) => {
      state.isSheetExperience = action.payload;
    },
    setIsModalEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEducation = action.payload;
    },
    setIsSheetEducation: (state, action: PayloadAction<boolean>) => {
      state.isSheetEducation = action.payload;
    },
    setIsModalEducationItem: (state, action: PayloadAction<boolean>) => {
      state.isModalEducationItem = action.payload;
    },
    setIsSheetDeleteEducationItem: (state, action: PayloadAction<boolean>) => {
      state.isSheetDeleteEducationItem = action.payload;
    },
    setIsModalEditEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEditEducation = action.payload;
    },
    setIsSheetEditEducation: (state, action: PayloadAction<boolean>) => {
      state.isSheetEditEducation = action.payload;
    },
    setIsModalEditSubjectPrices: (state, action: PayloadAction<boolean>) => {
      state.isModalEditSubjectPrices = action.payload;
    },
    setIsSheetEditSubjectPrices: (state, action: PayloadAction<boolean>) => {
      state.isSheetEditSubjectPrices = action.payload;
    },
    setSubjectForEditInModal(state, action: PayloadAction<string | null>) {
      state.subjectForEditInModal = action.payload;
    },
    setIsModalPhone: (state, action: PayloadAction<boolean>) => {
      state.isModalPhone = action.payload;
    },
    setIsSheetPhone: (state, action: PayloadAction<boolean>) => {
      state.isSheetPhone = action.payload;
    },
    setIsModalEmail: (state, action: PayloadAction<boolean>) => {
      state.isModalEmail = action.payload;
    },
    setIsSheetEmail: (state, action: PayloadAction<boolean>) => {
      state.isSheetEmail = action.payload;
    },
    setIsModalTelegram: (state, action: PayloadAction<boolean>) => {
      state.isModalTelegram = action.payload;
    },
    setIsSheetTelegram: (state, action: PayloadAction<boolean>) => {
      state.isSheetTelegram = action.payload;
    },
    setIsModalSkype: (state, action: PayloadAction<boolean>) => {
      state.isModalSkype = action.payload;
    },
    setIsModalExit: (state, action: PayloadAction<boolean>) => {
      state.isModalExit = action.payload;
    },
    setIsSheetExit: (state, action: PayloadAction<boolean>) => {
      state.isSheetExit = action.payload;
    },
    setIsModalDelete: (state, action: PayloadAction<boolean>) => {
      state.isModalDelete = action.payload;
    },
    setIsSheetDelete: (state, action: PayloadAction<boolean>) => {
      state.isSheetDelete = action.payload;
    },
    setIsModalResponseStudentToTutor: (state, action: PayloadAction<boolean>) => {
      state.isModalResponseStudentToTutor = action.payload;
    },
    setTutorIdForResponseStudentToTutor(state, action: PayloadAction<string | null>) {
      state.tutorIdForResponseStudentToTutor = action.payload;
    },
    setIsModalResponseTutorToStudent(state, action: PayloadAction<boolean>) {
      state.isModalResponseTutorToStudent = action.payload;
    },
    setIsSheetResponseTutorToStudent(state, action: PayloadAction<boolean>) {
      state.isSheetResponseTutorToStudent = action.payload;
    },
    setIsModalResponseTutorToStudentWithContakt(state, action: PayloadAction<boolean>) {
      state.isModalResponseTutorToStudentWithContakt = action.payload;
    },
    setIsSheetResponseTutorToStudentWithContakt(state, action: PayloadAction<boolean>) {
      state.isSheetResponseTutorToStudentWithContakt = action.payload;
    },
    setLoadingPage: (state, action: PayloadAction<boolean>) => {
      state.loadingPage = action.payload;
    },
    setIsModalRejectResponse(state, action: PayloadAction<boolean>) {
      state.isModalRejectResponse = action.payload;
    },
    setIsModalAcceptResponse(state, action: PayloadAction<boolean>) {
      state.isModalAcceptResponse = action.payload;
    },
    setIsSheetRejectResponse(state, action: PayloadAction<boolean>) {
      state.isSheetRejectResponse = action.payload;
    },
    setIsSheetAcceptResponse(state, action: PayloadAction<boolean>) {
      state.isSheetAcceptResponse = action.payload;
    },
    setIsSheetOpen(state, action: PayloadAction<boolean>) {
      state.isSheetOpen = action.payload;
    },
    setIsModalCreateContractByTutor(state, action: PayloadAction<boolean>) {
      state.isModalCreateContractByTutor = action.payload;
    },
    setIsSheetCreateContractByTutor(state, action: PayloadAction<boolean>) {
      state.isSheetCreateContractByTutor = action.payload;
    },
    setIsModalCreateContractByStudent(state, action: PayloadAction<boolean>) {
      state.isModalCreateContractByStudent = action.payload;
    },
    setIsSheetCreateContractByStudent(state, action: PayloadAction<boolean>) {
      state.isSheetCreateContractByStudent = action.payload;
    },
    setIsModalHiddenOrder(state, action: PayloadAction<boolean>) {
      state.isModalHiddenOrder = action.payload;
    },
    setIsSheetHiddenOrder(state, action: PayloadAction<boolean>) {
      state.isSheetHiddenOrder = action.payload;
    },
    setIsModalCreateReviewByStudent(state, action: PayloadAction<boolean>) {
      state.isModalCreateReviewByStudent = action.payload;
    },
    setIsSheetCreateReviewByStudent(state, action: PayloadAction<boolean>) {
      state.isSheetCreateReviewByStudent = action.payload;
    },
    setIsModalUpdateReviewByStudent(state, action: PayloadAction<boolean>) {
      state.isModalUpdateReviewByStudent = action.payload;
    },
    setIsSheetUpdateReviewByStudent(state, action: PayloadAction<boolean>) {
      state.isSheetUpdateReviewByStudent = action.payload;
    },
    setIsModalCreateReviewByTutor(state, action: PayloadAction<boolean>) {
      state.isModalCreateReviewByTutor = action.payload;
    },
    setIsSheetCreateReviewByTutor(state, action: PayloadAction<boolean>) {
      state.isSheetCreateReviewByTutor = action.payload;
    },
    setIsValueCreateReview(state, action: PayloadAction<string>) {
      state.isValueCreateReview = action.payload;
    },
    setIsReviewIdCreateReview(state, action: PayloadAction<string>) {
      state.isReviewIdCreateReview = action.payload;
    },
    setIsSheetFiltersOrdersForTutor(state, action: PayloadAction<boolean>) {
      state.isSheetFiltersOrdersForTutor = action.payload;
    },
  },
});

export const {
  setModalSelectCity,
  setIsSheetSelectCity,
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
  setScrollY,
  setIsModalFio,
  setIsSheetFio,
  setIsModalProfileInfo,
  setIsSheetProfileInfo,
  setIsModalExperience,
  setIsSheetExperience,
  setIsModalEducation,
  setIsSheetEducation,
  setIsModalEducationItem,
  setIsSheetDeleteEducationItem,
  setIsModalEditEducation,
  setIsSheetEditEducation,
  setIsModalEditSubjectPrices,
  setIsSheetEditSubjectPrices,
  setSubjectForEditInModal,
  setIsModalExit,
  setIsSheetExit,
  setIsModalPhone,
  setIsSheetPhone,
  setIsModalEmail,
  setIsSheetEmail,
  setIsModalTelegram,
  setIsSheetTelegram,
  setIsModalSkype,
  setIsModalDelete,
  setIsSheetDelete,
  setIsModalResponseStudentToTutor,
  setTutorIdForResponseStudentToTutor,
  setIsModalResponseTutorToStudent,
  setIsSheetResponseTutorToStudent,
  setIsModalResponseTutorToStudentWithContakt,
  setIsSheetResponseTutorToStudentWithContakt,
  setLoadingPage,
  setIsModalRejectResponse,
  setIsModalAcceptResponse,
  setIsSheetRejectResponse,
  setIsSheetAcceptResponse,
  setIsSheetOpen,
  setIsModalCreateContractByTutor,
  setIsSheetCreateContractByTutor,
  setIsModalCreateContractByStudent,
  setIsSheetCreateContractByStudent,
  setIsModalHiddenOrder,
  setIsSheetHiddenOrder,
  setIsModalCreateReviewByStudent,
  setIsSheetCreateReviewByStudent,
  setIsModalUpdateReviewByStudent,
  setIsSheetUpdateReviewByStudent,
  setIsModalCreateReviewByTutor,
  setIsSheetCreateReviewByTutor,
  setIsValueCreateReview,
  setIsReviewIdCreateReview,
  setIsSheetFiltersOrdersForTutor,
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
