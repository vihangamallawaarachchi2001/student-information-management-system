import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type StudentSheetData = {
  sheetId: number;
  sheetName: string;
  data: Record<string, unknown>;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const boltonId =
      searchParams.get("boltonId")?.trim() || "";

    /*
     * ==================================================
     * DASHBOARD ANALYTICS
     * ==================================================
     */

    if (!boltonId) {
      const [
        totalStudents,
        totalSheets,
        totalRecords,
        studentsWithMultipleSheets,
      ] = await Promise.all([
        prisma.dataRow.groupBy({
          by: ["boltonId"],
        }).then((rows) => rows.length),

        prisma.sheet.count(),

        prisma.dataRow.count(),

        prisma.dataRow.groupBy({
          by: ["boltonId"],
          _count: {
            sheetId: true,
          },
        }).then((rows) =>
          rows.filter(
            (row) => row._count.sheetId > 1
          ).length
        ),
      ]);

      return NextResponse.json(
        {
          analytics: {
            totalStudents,
            totalSheets,
            totalRecords,
            studentsWithMultipleSheets,
          },
        },
        { status: 200 }
      );
    }

    /*
     * ==================================================
     * STUDENT SEARCH
     * ==================================================
     */

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
      orderBy: {
        id: "asc",
      },
    });

    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: `No student found with Bolton ID "${boltonId}".`,
        },
        { status: 404 }
      );
    }

    const sheets: StudentSheetData[] = rows.map(
      (row) => ({
        sheetId: row.sheet.id,
        sheetName: row.sheet.name,
        data: row.data as Record<
          string,
          unknown
        >,
      })
    );

    /*
     * Also create one merged representation.
     *
     * If duplicate column names exist between sheets,
     * the first non-empty value is kept.
     */

    const aggregatedData: Record<
      string,
      unknown
    > = {};

    for (const sheet of sheets) {
      for (const [column, value] of Object.entries(
        sheet.data
      )) {
        if (column === "Bolton ID") {
          continue;
        }

        if (
          aggregatedData[column] === undefined ||
          aggregatedData[column] === null ||
          aggregatedData[column] === ""
        ) {
          aggregatedData[column] = value;
        }
      }
    }

    return NextResponse.json(
      {
        boltonId,
        aggregatedData,
        sheets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Failed to fetch aggregate data:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch aggregate data",
      },
      { status: 500 }
    );
  }
}