"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { host, port } from "@/api/server/configApi";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { getCurrentStudent } from "@/store/features/studentSlice";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [initialized, setInitialized] = useState(false);

  const student = useAppSelector((state) => state.student.student);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialized && token && student?.id) {
      const socket = io(`${host}${port}`, {
        auth: { token },
        transports: ["websocket"], // 🧠 важно
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
        socket.emit("setUser", { studentId: student.id });
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      socket.on("emailVerified", ({ studentId }) => {
        console.log("📩 Email verified for:", studentId);
        dispatch(getCurrentStudent(token));
      });

      socketRef.current = socket;
      setInitialized(true);
    }

    // !!! Не отключаем сокет при размонтировании, если не нужно
    // Только если хочешь жёстко закрывать при выходе пользователя

    return () => {
      // socketRef.current?.disconnect(); // <- если нужно вручную отключать
    };
  }, [token, student?.id, initialized]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
