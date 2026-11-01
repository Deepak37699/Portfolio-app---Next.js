import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio.json");
const SEED_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio.seed.json");

export async function POST() {
  try {
    const seedData = await fs.readFile(SEED_FILE_PATH, "utf-8");
    const parsedSeed: PortfolioData = JSON.parse(seedData);

    await fs.writeFile(DATA_FILE_PATH, seedData, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Portfolio data reset to initial baseline successfully",
      data: parsedSeed,
    });
  } catch (error) {
    console.error("Error resetting portfolio data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to reset portfolio data",
      },
      { status: 500 }
    );
  }
}

