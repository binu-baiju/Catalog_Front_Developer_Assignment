import React from "react";
import { TooltipProps } from "recharts";

export default function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload[0]?.value !== undefined) {
    return (
      <div className="bg-gray-900 text-white p-2 rounded shadow-lg">
        <p className="text-xs">{`$${payload[0].value.toFixed(2)}`}</p>
        <p className="text-xs">{label}</p>
      </div>
    );
  }
  return null;
}
