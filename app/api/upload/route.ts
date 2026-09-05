import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(req: Request) {
    try {
        
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if ( !(file instanceof File)) {
            return NextResponse.json(
                { error: "No Excel file provided"},
                {status: 400}
            )
        }

        const isExcelFile = file.name.toLocaleLowerCase().endsWith(".xlsx") || file.name.toLocaleLowerCase().endsWith(".xls");

        if (!isExcelFile) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload an Excel file."},
                {status: 400}
            )
        }

        const buffer =  await file.arrayBuffer();

        const workbook = XLSX.read(buffer, { type: "array" });

        if (workbook.SheetNames.length !== 1) {
            return NextResponse.json(
                { error: "Invalid Excel file. Please upload a file with only one sheet."},
                {status: 400}
            )
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "The Excel file is empty."},
                {status: 400}
            )
        }

        const columns = Object.keys(rows[0]);

        if (!columns.includes("Bolton ID")){
            return NextResponse.json(
                { error: "Missing required column 'Bolton ID'."},
                {status: 400}
            )
        }

           const invalidRows = rows.filter(row => !row["Bolton ID"] || typeof row["Bolton ID"] !== "string" || row["Bolton ID"].trim() === "");

        if (invalidRows.length > 0) {
            return NextResponse.json(
                { error: "Invalid data in 'Bolton ID' column. All values must be non-empty strings."},
                {status: 400}
            )
        }

         const sheetName = file.name
            .replace(/\.(xlsx|xls)$/i, "")
            .replace(/[_-]+/g, " ")
            .trim();

        const sheet = await prisma.$transaction(async (tx) => {
            const createdSheet = await tx.sheet.create({
                data: {
                    name: sheetName,
                    originalFilename: file.name,
                    metadata: {
                        columns,
                        searchableColumns: ["Bolton Id"],
                        filterableColumns: [],
                        visibleColumns: columns
                    },
                }
            })

            await tx.dataRow.createMany({
                data: rows.map((row) => ({
                    sheetId: createdSheet.id,
                    boltonId: String(row["Bolton ID"]).trim(),
                    data: row as Prisma.InputJsonValue,
                }))
            });

            return createdSheet;
        })

        return NextResponse.json(
            {
                message: "Excel file upload successfully",
                sheet,
                rowCount: rows.length
            },
            {
                status: 201
            }
        );
    }
     catch (error) {
        console.error("Excel upload failed: ", error);
        return NextResponse.json(
            {
                error: "Failed to process Excel file"
            },
            {
                status: 500
            }
        )
    }
}