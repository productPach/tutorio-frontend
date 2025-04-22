import { useEffect, useRef } from "react";

/**
 * Хук для проверки, смонтирован ли компонент.
 * Возвращает ref с флагом true/false.
 */
export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
