import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export  async function GET(req: Request){
    try {
        const sheets = await prisma.sheet.findMany();
        return NextResponse.json(
            {
                message: "sheets fetched successfully",
                sheets: sheets,
                sheetCount: sheets.length
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Error Fetching sheets");
        return NextResponse.json(
            {
                error: "failed to fetch sheets"
            },
            {
                status: 500
            }
        )
    }
}