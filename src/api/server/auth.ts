// Базовые функции работы с токеном
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};