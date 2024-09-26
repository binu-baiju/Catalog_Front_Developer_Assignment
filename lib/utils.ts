import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Data, Period } from "./types";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timePeriods = {
  "1d": 1,
  "3d": 3,
  "1w": 7,
  "1m": 30,
  "6m": 180,
  "1y": 365,
  max: 1825,
} as const;

export const fetchData = async (
  period: Period,
  currentSeed: string
): Promise<Data[]> => {
  const response = await axios.get("/api/data-generate", {
    params: { days: timePeriods[period], seed: currentSeed },
  });
  return response.data;
};
