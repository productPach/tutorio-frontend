import { baseUrl } from "./configApi";

type CreateContractPayload = {
  orderId: string;
  tutorId: string;
  selectedBy: "student" | "tutor";
};

export const fetchCreateContract = async (
  token: string,
  payload: CreateContractPayload
) => {
  try {
    const response = await fetch(`${baseUrl}contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании контракта:", error);
    throw error;
  }
};

export const fetchCancelContract = async (
  token: string,
  contractId: string
) => {
  try {
    const response = await fetch(`${baseUrl}contract/${contractId}/cancel`, {
      method: "POST", // или "PATCH", если ты так решил в контроллере
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при отмене контракта:", error);
    throw error;
  }
};
