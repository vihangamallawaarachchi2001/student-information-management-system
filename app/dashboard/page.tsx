"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Database,
  FileSpreadsheet,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Analytics = {
  totalStudents: number;
  totalSheets: number;
  totalRecords: number;
  studentsWithMultipleSheets: number;
};

const DashboardPage = () => {
  const router = useRouter();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [boltonId, setBoltonId] = useState("");

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/api/aggregate");

        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error("Failed to load dashboard analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = boltonId.trim();

    if (!value) {
      return;
    }

    setSearching(true);

    router.push(`/search?boltonId=${encodeURIComponent(value)}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {getGreeting()}, Supuni 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's an overview of your student information system.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Search for a student
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search using the student's Bolton ID.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex max-w-2xl gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={boltonId}
              onChange={(event) => setBoltonId(event.target.value)}
              placeholder="Enter Bolton ID..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={!boltonId.trim() || searching}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search className="h-4 w-4" />

            {searching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Analytics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">Total Students</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "—" : analytics?.totalStudents.toLocaleString()}
          </p>
        </div>

        {/* Sheets */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <FileSpreadsheet className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">Uploaded Sheets</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "—" : analytics?.totalSheets.toLocaleString()}
          </p>
        </div>

        {/* Records */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Database className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">Total Data Records</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "—" : analytics?.totalRecords.toLocaleString()}
          </p>
        </div>

        {/* Multi-sheet students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <GraduationCap className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">Students Across Sheets</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading
              ? "—"
              : analytics?.studentsWithMultipleSheets.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Upload your Excel spreadsheets from the sidebar. Each spreadsheet is
          stored independently, while student information is connected using the
          Bolton ID. Search for a student to view their information across all
          available spreadsheets.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
