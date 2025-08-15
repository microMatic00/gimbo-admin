import React, { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id}>
          <div
            className={`text-white px-4 py-2 rounded ${
              t.type === "error"
                ? "bg-red-500"
                : t.type === "success"
                ? "bg-green-500"
                : "bg-gray-800"
            }`}
          >
            {t.message}
          </div>
        </div>
      ))}
    </div>
  );

  return { push, ToastContainer };
}
