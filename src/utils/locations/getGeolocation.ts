// Функция для получения геолокации
export const getGeolocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

// Функция для получения области по координатам
export const getAreaByCoordinates = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );

  if (!response.ok) {
    throw new Error("Ошибка получения данных о местоположении");
  }

  const data = await response.json();
  const address = data.address;

  return {
    area: address.state || address.region || "",
    city: address.city || address.town || address.village || "",
  };
};
