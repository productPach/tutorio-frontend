import { CroppedAreaPixels } from "@/types/types";

export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: CroppedAreaPixels,
  canvasHeight: number,
  canvasWidth: number
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Не удалось получить контекст канваса.");
  }

  // Установка ширины и высоты канваса
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  console.log(canvas.width);
  console.log(canvas.height);

  // Вычисление смещения (может потребоваться, если croppedAreaPixels - относительные координаты)
  const offsetX = croppedAreaPixels.x;
  const offsetY = croppedAreaPixels.y;
  console.log(offsetX);
  console.log(offsetY);

  // Рисуем изображение на канвасе с учетом смещения
  ctx.drawImage(
    image,
    offsetX, // Смещение по X
    offsetY, // Смещение по Y
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // Возвращаем обрезанное изображение в виде data URL
  return new Promise((resolve) => {
    const dataUrl = canvas.toDataURL("image/png"); // Указываем тип данных
    resolve(dataUrl);
  });
};

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
  });
};

