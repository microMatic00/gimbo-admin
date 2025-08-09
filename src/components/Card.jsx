import React from "react";

const Card = ({ title, value, icon, color = "primary", percentage, isUp }) => {
  const colorClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-amber-500 text-white",
    danger: "bg-red-500 text-white",
  };

  const percentageColorClass = isUp ? "text-green-500" : "text-red-500";
  const percentageIcon = isUp ? "↑" : "↓";

  return (
    <div className="card flex items-center">
      <div className={`${colorClasses[color]} p-3 rounded-lg mr-4`}>
        {icon && <div className="h-8 w-8">{icon}</div>}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">{value}</p>

          {percentage && (
            <span
              className={`ml-2 text-sm font-semibold ${percentageColorClass}`}
            >
              {percentageIcon} {percentage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
