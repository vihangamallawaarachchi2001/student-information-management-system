"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  Database,
  FileSpreadsheet,
  Loader2,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type SheetData = {
  sheetId: number;
  sheetName: string;
  data: Record<string, unknown>;
};

type SearchResponse = {
  boltonId: string;
  sheets: SheetData[];
};

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const boltonId =
    searchParams.get("boltonId")?.trim() || "";

  const [student, setStudent] =
    useState<SearchResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!boltonId) {
        setError("No Bolton ID was provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "/api/search",
          {
            params: {
              boltonId,
            },
          }
        );

        setStudent(response.data);
      } catch (error: any) {
        console.error(
          "Failed to fetch student:",
          error
        );

        setError(
          error.response?.data?.error ||
            "Failed to load student information."
        );

        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [boltonId]);

  /*
   * No Bolton ID
   */
  if (!boltonId) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white">
          <Search className="mb-4 h-10 w-10 text-slate-300" />

          <h1 className="text-lg font-semibold text-slate-900">
            Search for a student
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            No Bolton ID was provided.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading student information...
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-medium text-red-800">
                Student not found
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Back */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Student Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Database className="h-6 w-6 text-slate-600" />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Student Information
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {student?.boltonId}
            </h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Information collected across{" "}
          <span className="font-medium text-slate-700">
            {student?.sheets.length}
          </span>{" "}
          uploaded sheet
          {student?.sheets.length === 1 ? "" : "s"}.
        </p>
      </div>

      {/* Sheet Sections */}
      <div className="space-y-6">
        {student?.sheets.map((sheet) => {
          const entries = Object.entries(
            sheet.data
          );

          return (
            <section
              key={sheet.sheetId}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Sheet Header */}
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                  <FileSpreadsheet className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {sheet.sheetName}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {entries.length} field
                    {entries.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              {/* Sheet Data */}
              {entries.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {entries.map(
                    ([column, value]) => (
                      <div
                        key={column}
                        className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-6"
                      >
                        <div className="text-sm font-medium text-slate-500">
                          {column}
                        </div>

                        <div className="sm:col-span-2 text-sm text-slate-900">
                          {value === null ||
                          value === undefined ||
                          value === "" ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            String(value)
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-sm text-slate-500">
                  No additional information available.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;