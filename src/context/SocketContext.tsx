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
import { getCurrentTutor } from "@/store/features/tutorSlice"; // Получаем экшен для репетитора

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [initialized, setInitialized] = useState(false);

  const student = useAppSelector((state) => state.student.student);
  const tutor = useAppSelector((state) => state.tutor.tutor); // Получаем данные репетитора
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialized && token && (student?.id || tutor?.id)) {
      const socket = io(`${host}${port}`, {
        auth: { token },
        transports: ["websocket"], // 🧠 важно
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);

        // Проверка на роль и настройка сокета
        if (student?.id) {
          socket.emit("setUser", { studentId: student.id });
        } else if (tutor?.id) {
          socket.emit("setUser", { tutorId: tutor.id });
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      // Логика обработки события emailVerified
      socket.on("emailVerified", ({ studentId, tutorId }) => {
        console.log("📩 Email verified:", studentId || tutorId);

        if (studentId) {
          dispatch(getCurrentStudent(token)); // Диспатчим для студента
        } else if (tutorId) {
          dispatch(getCurrentTutor(token)); // Диспатчим для репетитора
        }
      });

      socketRef.current = socket;
      setInitialized(true);
    }

    return () => {
      // socketRef.current?.disconnect(); // Если нужно вручную отключать
    };
  }, [token, student?.id, tutor?.id, initialized, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
