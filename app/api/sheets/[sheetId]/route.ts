import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sheetId: string }> }
) {
  try {
    const paramsObj = await params;
    const id = Number(paramsObj.sheetId);

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

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1
      ),
      100
    );

    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const where = {
      sheetId: id,
      ...(search
        ? {
            boltonId: {
              contains: search,
            },
          }
        : {}),
    };

    const [sheetData, totalRows] = await Promise.all([
      prisma.dataRow.findMany({
        where,
        orderBy: {
          id: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.dataRow.count({
        where,
      }),
    ]);

    const serializedRows = sheetData.map((row) => ({
      ...row,
      id: row.id.toString(),
    }));

    const totalPages = Math.ceil(totalRows / limit);

    return NextResponse.json(
      {
        sheetId: id,
        rows: serializedRows,
        pagination: {
          page,
          limit,
          totalRows,
          totalPages,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch sheet data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch sheet data",
      },
      {
        status: 500,
      }
    );
  }
}