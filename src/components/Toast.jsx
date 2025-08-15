import React from "react";

export const Toast = ({ message, type = "info" }) => {
  const bg =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-gray-800";
  return <div className={`text-white px-4 py-2 rounded ${bg}`}>{message}</div>;
};

export default Toast;
