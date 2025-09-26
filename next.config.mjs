import "dotenv/config";
/** @type {import('next').NextConfig} */

// Для окружения Docker-compose

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_IMAGE_HOST || "tutorio-express",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
};

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

// Для окружения фронт локально, сервер удаленно

// const nextConfig = {
//   images: {
//     domains: process.env.NEXT_PUBLIC_IP ? [process.env.NEXT_PUBLIC_IP] : [], // Разрешаем загрузку изображений с IP
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: process.env.NEXT_PUBLIC_IP,
//         port: process.env.NEXT_PUBLIC_PORT, // Указываем порт
//         pathname: "/uploads/**", // Разрешаем доступ к папке с изображениями
//       },
//     ],
//   },
// };

// export default nextConfig;

// Для окружения фронт локально, сервер локально в докере
// const nextConfig = {
//   images: {
//     domains: ["localhost"], // разрешаем загрузку картинок с localhost
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000", // тот же порт, что проброшен в docker-compose
//         pathname: "/uploads/**", // доступ к картинкам в uploads
//       },
//     ],
//   },
// };

// export default nextConfig;
