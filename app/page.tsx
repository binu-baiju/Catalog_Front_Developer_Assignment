"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Maximize2, Minimize2, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SkeltonUI from "@/ui/SkeltonUI";
import CustomTooltip from "@/ui/CustomTooltip";
import { fetchData, timePeriods } from "@/lib/utils";
import { Data, Period } from "@/lib/types";

export default function CryptoChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1w");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<Data[] | null>(null);
  const [seed, setSeed] = useState<string | null>(null);

  const generateSeed = useCallback(() => {
    return Math.random().toString();
  }, []);

  useEffect(() => {
    if (!seed) {
      setSeed(generateSeed());
    }
  }, [seed, generateSeed]);

  const { data, isLoading, isError, refetch } = useQuery<Data[]>({
    queryKey: ["cryptoData", selectedPeriod, seed],
    queryFn: () => fetchData(selectedPeriod, seed || generateSeed()),
    enabled: !!seed,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (seed) {
      refetch();
    }
  }, [selectedPeriod, seed, refetch]);

  const handlePeriodChange = useCallback(
    (period: Period) => {
      setSelectedPeriod(period);
      if (isComparing && seed) {
        fetchData(period, (Number(seed) + 1).toString()).then(
          setComparisonData
        );
      }
    },
    [isComparing, seed]
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleCompare = () => {
    setIsComparing(!isComparing);
    if (!isComparing && seed) {
      fetchData(selectedPeriod, (Number(seed) + 1).toString()).then(
        setComparisonData
      );
    } else {
      setComparisonData(null);
    }
  };

  if (isLoading || !data) {
    return (
      <div
        className={`bg-white p-6 font-sans ${
          isFullscreen ? "fixed inset-0 z-50" : "max-w-4xl mx-auto"
        }`}
      >
        <SkeltonUI />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error fetching data. Please try again.
      </div>
    );
  }

  const currentPrice = data[data.length - 1].price.toFixed(2);
  const previousPrice = data[0].price;
  const priceDifference = (Number(currentPrice) - previousPrice).toFixed(2);
  const percentageChange = (
    (Number(priceDifference) / previousPrice) *
    100
  ).toFixed(2);

  return (
    <div
      className={`bg-white p-2 md:p-6 font-sans ${
        isFullscreen ? "fixed inset-0 z-50" : "max-w-4xl mx-auto"
      }`}
    >
      <div className="mb-6">
        <h1 className="text-5xl md:text-6xl  font-bold text-gray-900">
          {currentPrice}
          <span className="text-2xl font-normal ml-2 text-gray-500">USD</span>
        </h1>
        <p
          className={`text-lg md:text-xl mt-2 ${
            Number(percentageChange) >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {Number(priceDifference) > 0 ? "+" : ""}
          {priceDifference} ({percentageChange}%)
        </p>
      </div>

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

      <div className="flex md:justify-between md:items-center mb-4 flex-col gap-2 md:flex-row  ">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="flex items-center px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 mr-2" />
            ) : (
              <Maximize2 className="h-4 w-4 mr-2" />
            )}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            onClick={toggleCompare}
            className="flex items-center px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
          >
            {isComparing ? (
              <X className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isComparing ? "Remove Comparison" : "Compare"}
          </button>
        </div>
        <div className="flex space-x-2">
          {(Object.keys(timePeriods) as Array<keyof typeof timePeriods>).map(
            (period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 rounded ${
                  period === selectedPeriod
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period}
              </button>
            )
          )}
        </div>
      </div>

      <div className="h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              vertical={true}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#818CF8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {isComparing && comparisonData && (
              <Area
                type="monotone"
                dataKey="price"
                data={comparisonData}
                stroke="#F87171"
                fillOpacity={1}
                fill="url(#colorComparison)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-7 h-24">
          <div className="w-full h-full flex items-end">
            {data.map((entry, index) => {
              const maxPrice = Math.max(...data.map((d) => d.price));
              const minPrice = Math.min(...data.map((d) => d.price));
              const normalizedHeight =
                ((entry.price - minPrice) / (maxPrice - minPrice)) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 bg-gray-200"
                  style={{ height: `${normalizedHeight}%` }}
                />
              );
            })}
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded text-xs">
          {(Math.max(...data.map((d) => d.price)) + 1000).toFixed(2)}
        </div>
        <div className="absolute bottom-28 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          {currentPrice}
        </div>
      </div>
    </div>
  );
}
