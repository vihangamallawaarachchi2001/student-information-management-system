"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  Search,
} from "lucide-react";

type DataRow = {
  id: string | number;
  sheetId: number;
  boltonId: string;
  data: Record<string, unknown>;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalRows: number;
  totalPages: number;
};

type SheetDetails = {
  id: number;
  name: string;
  originalFilename: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

const SheetPage = () => {
  const params = useParams();
  const sheetId = params.sheetId as string;

  const [rows, setRows] = useState<DataRow[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [sheetName, setSheetName] = useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch sheet data
        const dataResponse = await axios.get(
          `/api/sheets/${sheetId}`,
          {
            params: {
              page,
              limit,
              search,
            },
          }
        );

        setRows(dataResponse.data.rows);
        setPagination(dataResponse.data.pagination);

        // Fetch sheet details
        const detailsResponse = await axios.get(
          `/api/sheets/${sheetId}/details`
        );

        setSheetName(
          detailsResponse.data.sheetDetails.name
        );
      } catch (error: any) {
        console.error(
          "Failed to load sheet:",
          error
        );

        setError(
          error.response?.data?.error ||
            "Failed to load sheet data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (sheetId) {
      fetchSheetData();
    }
  }, [sheetId, page, search]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (pagination && page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (
      pagination &&
      page < pagination.totalPages
    ) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const columns =
    rows.length > 0
      ? Object.keys(rows[0].data)
      : [];

  return (
    <div className="mx-auto max-w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Database className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {sheetName || `Sheet ${sheetId}`}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {pagination
                ? `${pagination.totalRows} rows`
                : "Loading sheet data..."}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Bolton ID..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sheet data...
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-medium text-red-800">
              Failed to load sheet
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        rows.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white">
            <Database className="mb-3 h-8 w-8 text-slate-300" />

            <p className="text-sm font-medium text-slate-900">
              {search
                ? "No matching students found"
                : "No data found"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? `No rows match Bolton ID "${search}".`
                : "This sheet does not contain any rows."}
            </p>
          </div>
        )}

      {/* Table */}
      {!loading &&
        !error &&
        rows.length > 0 && (
          <>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={String(row.id)}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        {columns.map((column) => (
                          <td
                            key={`${row.id}-${column}`}
                            className="whitespace-nowrap px-5 py-3 text-sm text-slate-700"
                          >
                            {row.data[column] === null ||
                            row.data[column] ===
                              undefined
                              ? "—"
                              : String(
                                  row.data[column]
                                )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination &&
              pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-sm text-slate-500">
                    Page{" "}
                    <span className="font-medium text-slate-700">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {pagination.totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={
                        page === 1 || loading
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={
                        page ===
                          pagination.totalPages ||
                        loading
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
          </>
        )}
    </div>
  );
};

export default SheetPage;