import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const boltonId =
      searchParams.get("boltonId")?.trim() || "";

    if (!boltonId) {
      return NextResponse.json(
        {
          error: "Bolton ID is required",
        },
        { status: 400 }
      );
    }

    const rows = await prisma.dataRow.findMany({
      where: {
        boltonId,
      },
      include: {
        sheet: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          sheetId: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: `No student found with Bolton ID "${boltonId}".`,
        },
        { status: 404 }
      );
    }

    /*
     * Group rows by sheet.
     */
    const sheetsMap = new Map<
      number,
      {
        sheetId: number;
        sheetName: string;
        data: Record<string, unknown>;
      }
    >();

    for (const row of rows) {
      if (!sheetsMap.has(row.sheetId)) {
        sheetsMap.set(row.sheetId, {
          sheetId: row.sheet.id,
          sheetName: row.sheet.name,
          data: {},
        });
      }

      const sheet = sheetsMap.get(row.sheetId)!;

      const rowData = row.data as Record<
        string,
        unknown
      >;

      for (const [column, value] of Object.entries(
        rowData
      )) {
        /*
         * Bolton ID is already returned separately.
         */
        if (column === "Bolton ID") {
          continue;
        }

        sheet.data[column] = value;
      }
    }

    const sheets = Array.from(sheetsMap.values());

    return NextResponse.json(
      {
        boltonId,
        sheets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Failed to search student:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to search student",
      },
      { status: 500 }
    );
  }
}