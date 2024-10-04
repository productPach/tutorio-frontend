import Cropper, { CroppedAreaPixels } from "react-easy-crop"; // Импортируем Cropper и CroppedAreaPixels

export const getCroppedImg = async (imageSrc: string, crop: CroppedAreaPixels) => {
  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  canvas.width = crop.width;
  canvas.height = crop.height;

  if (!ctx) {
    throw new Error("Не удалось получить контекст рисования для canvas.");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      } else {
        resolve("");
      }
    }, "image/jpeg");
  });
};
