import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sheetId: string }> }
) {
  try {
    const paramsObj = await params;
    const id = Number(paramsObj.sheetId);

    // Validate sheet ID
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "Invalid Sheet ID",
        },
        {
          status: 400,
        }
      );
    }

    // Find sheet
    const sheetDetails = await prisma.sheet.findUnique({
      where: {
        id,
      },
    });

    // Sheet doesn't exist
    if (!sheetDetails) {
      return NextResponse.json(
        {
          error: "Sheet not found",
        },
        {
          status: 404,
        }
      );
    }

    // Return sheet details
    return NextResponse.json(
      {
        sheetDetails,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch sheet details:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch sheet details",
      },
      {
        status: 500,
      }
    );
  }
}