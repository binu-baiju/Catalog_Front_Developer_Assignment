import { Data } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// Function to generate random data based on the seed and number of days
const generateData = (days: number, seed: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return {
      time: i === days - 1 ? "Now" : date.toLocaleDateString(),
      price: Math.floor(60000 + (Math.sin(i * seed) + 1) * 2500),
    };
  });
};

// GET request handler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url); // Access query parameters

  const days = Number(searchParams.get("days")) || 7;
  const seed = Number(searchParams.get("seed")) || Math.random();

  const data: Data[] = generateData(days, seed);

  return NextResponse.json(data, { status: 200 });
}
