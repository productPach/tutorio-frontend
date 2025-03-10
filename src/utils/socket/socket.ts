import { host, port } from "@/api/server/configApi";
import { io } from "socket.io-client";
import "dotenv/config";

// Используем переменные окружения для конфигурации URL
const socket = io(
  `"http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}"`
);
console.log("Socket URL:", `${host}${port}`); // Выведем URL в консоль

export default socket;
