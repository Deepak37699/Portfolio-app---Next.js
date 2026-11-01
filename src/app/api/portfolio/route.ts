import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio.json");

export async function GET() {
  try {
    const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const json: PortfolioData = JSON.parse(fileData);
    return NextResponse.json({ success: true, data: json });
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read portfolio data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData: PortfolioData = await request.json();

    if (!updatedData || !updatedData.personal || !Array.isArray(updatedData.projects)) {
      return NextResponse.json(
        { success: false, error: "Invalid portfolio data structure" },
        { status: 400 }
      );
    }

    // Save with clean 2-space indentation
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(updatedData, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: "Portfolio data successfully saved to portfolio.json",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save portfolio data",
      },
      { status: 500 }
    );
  }
}

