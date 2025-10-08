import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

type CreateContractPayload = {
  orderId: string;
  tutorId: string;
  selectedBy: "student" | "tutor";
};

// export const fetchCreateContract = async (
//   token: string,
//   payload: CreateContractPayload
// ) => {
//   try {
//     const response = await fetch(`${baseUrl}contract`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при создании контракта:", error);
//     throw error;
//   }
// };
// Создание контракта
export const fetchCreateContract = async (payload: CreateContractPayload) => {
  try {
    const response = await httpClient.post(`contract`, payload);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании контракта:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// export const fetchCancelContract = async (
//   token: string,
//   contractId: string
// ) => {
//   try {
//     const response = await fetch(`${baseUrl}contract/${contractId}/cancel`, {
//       method: "POST", // или "PATCH", если ты так решил в контроллере
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при отмене контракта:", error);
//     throw error;
//   }
// };
// Отмена контракта
export const fetchCancelContract = async (contractId: string) => {
  try {
    const response = await httpClient.post(`contract/${contractId}/cancel`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при отмене контракта:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};
