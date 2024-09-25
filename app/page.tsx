"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, Plus, X } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const dummyData = [
  { time: "2023-01-01", price: 45000 },
  { time: "2023-01-02", price: 45500 },
  { time: "2023-01-03", price: 47000 },
  { time: "2023-01-04", price: 46500 },
  { time: "2023-01-05", price: 49000 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload[0]?.value !== undefined) {
    return (
      <div className="bg-gray-900 text-white p-2 rounded shadow-lg">
        <p className="text-xs">{`$${payload[0].value.toFixed(2)}`}</p>
        <p className="text-xs">{label}</p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  return (
    <div
      className={`bg-white p-4 sm:p-6 font-sans ${
        isFullscreen ? "fixed inset-0 z-50" : "max-w-4xl mx-auto sm:w-full"
      }`}
    >
      {/* Header - Current Price */}
      <div className="mb-6">
        <h1 className="text-6xl font-bold text-gray-900">
          49,000
          <span className="text-2xl font-normal ml-2 text-gray-500">USD</span>
        </h1>
        <p className="text-xl mt-2 text-green-500">+2,000 (+4.26%)</p>
      </div>

      {/* Navigation */}
      <nav className="flex space-x-6 mb-6 text-gray-500">
        <a href="#" className="hover:text-gray-900">
          Summary
        </a>
        <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-2">
          Chart
        </a>
        <a href="#" className="hover:text-gray-900">
          Statistics
        </a>
        <a href="#" className="hover:text-gray-900">
          Analysis
        </a>
        <a href="#" className="hover:text-gray-900">
          Settings
        </a>
      </nav>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {/* Fullscreen Button */}
          <button
            className="flex items-center px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 mr-2" />
            ) : (
              <Maximize2 className="h-4 w-4 mr-2" />
            )}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          {/* Compare Button */}
          <button
            className="flex items-center px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
            onClick={() => setIsComparing(!isComparing)}
          >
            {isComparing ? (
              <X className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isComparing ? "Remove Comparison" : "Compare"}
          </button>
        </div>

        {/* Time Period Buttons */}
        <div className="flex space-x-2">
          {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((period) => (
            <button
              key={period}
              className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full sm:w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
              </linearGradient>
              {isComparing && (
                <linearGradient
                  id="colorComparison"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis hide={true} domain={["dataMin - 1000", "dataMax + 1000"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#818CF8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {isComparing && (
              <Area
                type="monotone"
                dataKey="price"
                stroke="#F87171"
                fillOpacity={1}
                fill="url(#colorComparison)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
