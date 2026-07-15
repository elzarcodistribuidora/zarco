"use client";

import { useCallback, useRef, useState } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  }, []);

  return { toasts, showToast };
}
