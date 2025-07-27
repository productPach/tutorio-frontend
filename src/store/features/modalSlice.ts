import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalStateType = {
  isModalSelectCity: boolean;
  isModalBalanceBoost: boolean;
  valueModalBalanceBoost: string;
  scrollY: number;
  isModalFio: boolean;
  isModalProfileInfo: boolean;
  isModalExperience: boolean;
  isModalEducation: boolean;
  isModalEducationItem: boolean;
  isModalEditEducation: boolean;
  isModalEditSubjectPrices: boolean;
  subjectForEditInModal: string | null; // ID предмета или объект предмета
  isModalPhone: boolean,
  isModalEmail: boolean,
  isModalTelegram: boolean;
  isModalSkype: boolean;
  isModalExit: boolean;
  isModalDelete: boolean;
  isModalResponseStudentToTutor: boolean;
  tutorIdForResponseStudentToTutor: string | null;
  isModalResponseTutorToStudent: boolean;
  isModalResponseTutorToStudentWithContakt: boolean;
  loadingPage: boolean;
  isModalRejectResponse: boolean;
  isModalAcceptResponse: boolean;
  isSheetOpen: boolean;
  isModalCreateContractByTutor: boolean;
  isModalCreateContractByStudent: boolean;
  isSheetCreateContractByStudent: boolean;
  isModalHiddenOrder: boolean;
  isSheetHiddenOrder: boolean;
};

const initialState: ModalStateType = {
  isModalSelectCity: false,
  isModalBalanceBoost: false,
  valueModalBalanceBoost: "",
  scrollY: 0,
  isModalFio: false,
  isModalProfileInfo: false,
  isModalExperience: false,
  isModalEducation: false,
  isModalEducationItem: false,
  isModalEditEducation: false,
  isModalEditSubjectPrices: false,
  subjectForEditInModal: null,
  isModalPhone: false,
  isModalEmail: false,
  isModalTelegram: false,
  isModalSkype: false,
  isModalExit: false,
  isModalDelete: false,
  isModalResponseStudentToTutor: false,
  tutorIdForResponseStudentToTutor: null,
  isModalResponseTutorToStudent: false,
  isModalResponseTutorToStudentWithContakt: false,
  loadingPage: false,
  isModalRejectResponse: false,
  isModalAcceptResponse: false,
  isSheetOpen: false,
  isModalCreateContractByTutor: false,
  isModalCreateContractByStudent: false,
  isSheetCreateContractByStudent: false,
  isModalHiddenOrder: false,
  isSheetHiddenOrder: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalSelectCity: (state, action: PayloadAction<boolean>) => {
      state.isModalSelectCity = action.payload;
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
    setIsModalProfileInfo: (state, action: PayloadAction<boolean>) => {
      state.isModalProfileInfo = action.payload;
    },
    setIsModalExperience: (state, action: PayloadAction<boolean>) => {
      state.isModalExperience = action.payload;
    },
    setIsModalEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEducation = action.payload;
    },
    setIsModalEducationItem: (state, action: PayloadAction<boolean>) => {
      state.isModalEducationItem = action.payload;
    },
    setIsModalEditEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEditEducation = action.payload;
    },
    setIsModalEditSubjectPrices: (state, action: PayloadAction<boolean>) => {
      state.isModalEditSubjectPrices = action.payload;
    },
    setSubjectForEditInModal(state, action: PayloadAction<string | null>) {
      state.subjectForEditInModal = action.payload;
    },
    setIsModalPhone: (state, action: PayloadAction<boolean>) => {
      state.isModalPhone = action.payload;
    },
    setIsModalEmail: (state, action: PayloadAction<boolean>) => {
      state.isModalEmail = action.payload;
    },
    setIsModalTelegram: (state, action: PayloadAction<boolean>) => {
      state.isModalTelegram = action.payload;
    },
    setIsModalSkype: (state, action: PayloadAction<boolean>) => {
      state.isModalSkype = action.payload;
    },
    setIsModalExit: (state, action: PayloadAction<boolean>) => {
      state.isModalExit = action.payload;
    },
    setIsModalDelete: (state, action: PayloadAction<boolean>) => {
      state.isModalDelete = action.payload;
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
    setIsModalResponseTutorToStudentWithContakt(state, action: PayloadAction<boolean>) {
      state.isModalResponseTutorToStudentWithContakt = action.payload;
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
    setIsSheetOpen(state, action: PayloadAction<boolean>) {
      state.isSheetOpen = action.payload;
    },
    setIsModalCreateContractByTutor(state, action: PayloadAction<boolean>) {
      state.isModalCreateContractByTutor = action.payload;
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
  },
});

export const {
  setModalSelectCity,
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
  setScrollY,
  setIsModalFio,
  setIsModalProfileInfo,
  setIsModalExperience,
  setIsModalEducation,
  setIsModalEducationItem,
  setIsModalEditEducation,
  setIsModalEditSubjectPrices,
  setSubjectForEditInModal,
  setIsModalExit,
  setIsModalPhone,
  setIsModalEmail,
  setIsModalTelegram,
  setIsModalSkype,
  setIsModalDelete,
  setIsModalResponseStudentToTutor,
  setTutorIdForResponseStudentToTutor,
  setIsModalResponseTutorToStudent,
  setIsModalResponseTutorToStudentWithContakt,
  setLoadingPage,
  setIsModalRejectResponse,
  setIsModalAcceptResponse,
  setIsSheetOpen,
  setIsModalCreateContractByTutor,
  setIsModalCreateContractByStudent,
  setIsSheetCreateContractByStudent,
  setIsModalHiddenOrder,
  setIsSheetHiddenOrder,
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
