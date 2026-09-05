"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

type Sheet = {
  id: number;
  name: string;
};

const Sidebar = () => {
  const [listItems, setListItems] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("/api/sheets");

        if (res.status === 200) {
          setListItems(res.data.sheets);
        }
      } catch (error) {
        console.error("Failed to fetch sheets:", error);
        setListItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Student Information
          </h1>
          <p className="text-xs text-slate-500">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Navigation Section */}
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        <button
          type="button"
          className="mb-1 flex w-full items-center gap-3 rounded-lg bg-slate-100 px-3 py-2.5 text-left text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
        >
          <LayoutDashboard className="h-4 w-4 text-slate-600" />
          <span>Dashboard</span>
        </button>

        {/* Sheets Section */}
        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Sheets
        </p>

        {loading ? (
          <div className="space-y-2 px-3">
            <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : listItems.length === 0 ? (
          <div className="px-3 py-4 text-sm text-slate-500">
            No sheets uploaded yet.
          </div>
        ) : (
          <div className="space-y-1">
            {listItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-slate-600" />

                <span className="truncate">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Actions Section */}
        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Actions
        </p>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Upload className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-700" />

          <span>Upload Sheet</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-4">
        <p className="text-xs text-slate-400">
          Student Information System
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
