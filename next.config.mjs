import "dotenv/config";
/** @type {import('next').NextConfig} */

// Для окружения Docker-compose

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: process.env.NEXT_IMAGE_HOST || "tutorio-express",
//         port: "3000",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

// Для окружения фронт локально, сервер удаленно

const nextConfig = {
  images: {
    domains: process.env.NEXT_PUBLIC_IP ? [process.env.NEXT_PUBLIC_IP] : [], // Разрешаем загрузку изображений с IP
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IP,
        port: process.env.NEXT_PUBLIC_PORT, // Указываем порт
        pathname: "/uploads/**", // Разрешаем доступ к папке с изображениями
      },
    ],
  },
};

export default nextConfig;
