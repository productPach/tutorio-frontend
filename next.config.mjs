import "dotenv/config"; // Загружаем переменные окружения

/** @type {import('next').NextConfig} */
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
