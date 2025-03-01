"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    supportAPIMethod?: any;
    Verbox?: any;
  }
}

export default function VerboxChat() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (function c(d: Document, w: Window, m: string, i?: boolean) {
        w.supportAPIMethod = m;
        const s = d.createElement("script");
        s.id = "supportScript";
        const id = "92f9b2ead15ec1bf1aa044a5a6097e65";
        s.src =
          (!i
            ? "https://admin.verbox.ru/support/support.js"
            : "https://static.site-chat.me/support/support.int.js") +
          "?h=" +
          id;
        s.onerror = i ? null : () => c(d, w, m, true); // Заменили undefined на null
        (w as any)[m] =
          (w as any)[m] ||
          function () {
            ((w as any)[m].q = (w as any)[m].q || []).push(arguments);
          };
        (d.head || d.body).appendChild(s);
      })(document, window, "Verbox");
    }
  }, []);

  return null;
}
